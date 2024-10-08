import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Ratelimit } from '@upstash/ratelimit'
import OpenAI from 'openai'

import { SYSTEM_PROMPT } from './prompts'
import { validateApiKey } from '@/lib/utils'
import { runnables } from '@/lib/tools'
import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import {
  ChatCompletion,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionAssistantMessageParam,
  ChatCompletionMessageToolCall,
  ChatCompletionToolMessageParam
} from 'openai/resources'
export const runtime = 'edge'

const addToKV = async (
  json_id: string,
  messages: ChatCompletionMessage[],
  message: ChatCompletionMessageParam,
  userId: string
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
    messages: [...messages, message]
  }
  await kv.hmset(`chat:${id}`, payload)
  await kv.zadd(`user:chat:${userId}`, {
    score: createdAt,
    member: `chat:${id}`
  })

  return true
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
      return new Response(JSON.stringify({
        error: "You have reached your request limit for the day.",
        rateLimitReached: true,
        limit,
        remaining,
        reset
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString()
        }
      });
    }

    model = 'gpt-4o'
  } else {
    configuration = {
      apiKey: process.env.OPENAI_API_KEY
    }

    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(15, '1d')
    })

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_${ip}`
    )

    if (!success) {
      return new Response(JSON.stringify({
        error: "You have reached your request limit for the day.",
        rateLimitReached: true,
        limit,
        remaining,
        reset
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString()
        }
      });
    }

    model = 'gpt-4o'
  }

  const openai = new OpenAI(configuration)
  console.log(JSON.stringify(messages))

  const tool_calls: ChatCompletionMessageToolCall[] = []
  const tool_messages: ChatCompletionToolMessageParam[] = []

  const runner = openai.beta.chat.completions
    .runTools({
      stream: true,
      model,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        ...messages
      ],
      tools: runnables
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
    })
    .on('finalContent', async (contentSnapshot: string) => {
      const message: ChatCompletionAssistantMessageParam = {
        content: contentSnapshot,
        role: 'assistant'
      }

      await addToKV(json.id, messages, message, userId)
    })

  const stream = OpenAIStream(runner)
  return new StreamingTextResponse(stream)
}
