import { kv } from '@vercel/kv'
import { Message, OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { Ratelimit } from '@upstash/ratelimit'

import { Pinecone } from "@pinecone-database/pinecone";   
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { getContext } from './utils/context'
import { getCodeContext } from './utils/codeContext';

import { setPromtWithContext } from './prompts';
import { formatVercelMessages } from './utils/utils';

import { validateApiKey } from '@/lib/utils'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { getProjectContext } from './utils/projectContext';

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

  let openai
  let model

  const ip = req.headers.get('x-forwarded-for')
  
  if (validateApiKey(previewToken)) {
    const configuration = new Configuration({
      apiKey: previewToken
    })

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

    openai = new OpenAIApi(configuration)
    model = 'gpt-4-1106-preview'
  } else {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    })

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
    
    openai = new OpenAIApi(configuration)
    model = 'gpt-4-1106-preview'
  }

  const lastMessage = messages[messages.length - 1]
  const context = await getContext(lastMessage.content, '')
  const codeContext = await getCodeContext(lastMessage.content, '')
  const projectContext = await getProjectContext(lastMessage.content, '')
  const promt = setPromtWithContext(codeContext, context, projectContext)

  const res = await openai.createChatCompletion({
    model: model,
    messages: [...promt, ...messages.filter((message: Message) => message.role === 'user')],
    temperature: 0.3,
    stream: true
  })

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
  })

  return new StreamingTextResponse(stream)
}
