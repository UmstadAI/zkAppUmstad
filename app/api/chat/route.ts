import { kv } from '@vercel/kv'
import { Message, OpenAIStream, StreamingTextResponse } from 'ai'
import { Ratelimit } from '@upstash/ratelimit'
import OpenAI from 'openai'

import { Pinecone } from '@pinecone-database/pinecone'
import { getContext } from './utils/context'
import { getCodeContext } from './utils/codeContext'
import { getProjectContext } from './utils/projectContext'
import { getIssueContext } from './utils/issueContext'

import { setPromtWithContext, SYSTEM_PROMPT } from './prompts'
import { validateApiKey } from '@/lib/utils'
import { runnables } from '@/lib/tools'
import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { Run } from 'langchain/dist/callbacks/handlers/tracer'
import { Runnable } from 'langchain/dist/schema/runnable'
import { RunnableToolFunction } from 'openai/lib/RunnableFunction'
import { ChatCompletion, ChatCompletionChunk } from 'openai/resources'
import { ChatCompletionSnapshot } from 'openai/lib/ChatCompletionStream'
import { write } from 'fs'

export const runtime = 'edge'

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
      limiter: Ratelimit.slidingWindow(100, '1d')
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

    model = 'gpt-4-1106-preview'
  }
  const openai = new OpenAI(configuration)

  const transformStream = new TransformStream({})
  const writer = transformStream.writable.getWriter()
  await writer.ready
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
      tools: runnables
    })
    .on(
      'chunk',
      (chunk: ChatCompletionChunk, snapshot: ChatCompletionSnapshot) => {
        const choice = chunk.choices[0].delta
        if (choice.content) {
          console.log(choice.content)
          writer.write(choice.content)
        }
      }
    )
    .on('finalChatCompletion', (completion: ChatCompletion) => {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const message = completion.choices[0].message
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [...messages, message]
      }
      kv.hmset(`chat:${id}`, payload)
        .then(() =>
          kv.zadd(`user:chat:${userId}`, {
            score: createdAt,
            member: `chat:${id}`
          })
        )
        .then(() => {
          writer.close()
        })
    })
  runner.finalContent()
  /*
  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await kv.hmset(`chat:${id}`, payload)
      await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
  })*/
  return new StreamingTextResponse(transformStream.readable)
  // return new StreamingTextResponse(stream)
}
