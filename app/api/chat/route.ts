import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Ratelimit } from '@upstash/ratelimit'
import OpenAI from 'openai'

import { SYSTEM_PROMPT } from './prompts'
import { validateApiKey } from '@/lib/utils'
import { runnables, toolMap } from '@/lib/tools'
import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import {
  Chat,
  ChatCompletion,
  ChatCompletionAssistantMessageParam,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatCompletionToolMessageParam
} from 'openai/resources'
export const runtime = 'edge'

export const addToKV = async (
  json_id: string,
  messages: ChatCompletionMessage[],
  message: ChatCompletionMessageParam,
  userId: string,
  tool_messages: ChatCompletionToolMessageParam[] = []
) => {
  if (messages.length < 1) return
  const first_message_content = messages[0]?.content || ''
  const title =
    first_message_content.length > 100
      ? first_message_content.substring(0, 100)
      : first_message_content
  const id = json_id ?? nanoid()
  const createdAt = Date.now()
  const path = `/chat/${id}`
  const payload = {
    id,
    title,
    userId,
    createdAt,
    path,
    messages: [...messages, message, ...tool_messages]
  }
  await kv.hmset(`chat:${id}`, payload)
  await kv.zadd(`user:chat:${userId}`, {
    score: createdAt,
    member: `chat:${id}`
  })
}

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  let configuration
  let model

  const ip = req.headers.get('x-forwarded-for')

  if (validateApiKey(previewToken)) {
    configuration = {
      apiKey: previewToken
    }

    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(1500, '1d')
    })

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_${ip}`
    )

    if (!success) {
      return new Response('You have reached your request limit for the day.', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString()
        }
      })
    }

    model = 'gpt-4-1106-preview'
  } else {
    configuration = {
      apiKey: process.env.OPENAI_API_KEY
    }

    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(30, '1d')
    })

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_${ip}`
    )

    // TODO: Add Pop Up for Rate Limit
    if (!success) {
      return new Response('You have reached your request limit for the day.', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString()
        }
      })
    }

    model = 'gpt-3.5-turbo-1106'
  }

  const openai = new OpenAI(configuration)
  console.log(JSON.stringify(messages))

  const tool_calls: ChatCompletionMessageToolCall[] = []
  const tool_messages: ChatCompletionToolMessageParam[] = []
  
  const runner = openai.beta.chat.completions
    .runTools({
      stream: true,
      model,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        ...messages
      ],
      tools: runnables,
    })
    .on('functionCall', (call: ChatCompletionMessage.FunctionCall) => {
      console.log('Got function call', call.name)
      const tool_call = {
        type: 'function',
        id: '' + tool_calls.length,
        function: { ...call }
      } as ChatCompletionMessageToolCall
      tool_calls.push(tool_call)
    })
    .on('functionCallResult', content => {
      const message: ChatCompletionToolMessageParam = {
        role: 'tool',
        tool_call_id: '' + (tool_calls.length - 1),
        content
      }
      tool_messages.push(message)
    })
    .on('finalChatCompletion', (completion: ChatCompletion) => {
      const message = completion.choices[0].message
      message.tool_calls = tool_calls
      addToKV(json.id, messages, message, userId, tool_messages)
    })
  const stream = OpenAIStream(runner)
  return new StreamingTextResponse(stream)
}
