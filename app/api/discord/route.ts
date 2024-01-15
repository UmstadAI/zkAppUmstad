import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Ratelimit } from '@upstash/ratelimit'
import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import * as ed from '@noble/ed25519'
import { SYSTEM_PROMPT } from '../chat/prompts'
import { validateApiKey } from '@/lib/utils'
import { runnables } from '@/lib/tools'

export const runtime = 'edge'

export async function POST(req: Request) {
  const discordPublicKey = process.env.DISCORD_PUBLIC_KEY as string
  const signature = req.headers.get('X-Signature-Ed25519')
  const timestamp = req.headers.get('X-Signature-Timestamp')
  const body = await req.text()

  if (!signature || !timestamp) {
    return new Response('Missing required headers.', { status: 400 })
  }

  const isValidRequest = await ed.verifyAsync(
    `${timestamp}${body}`,
    signature,
    discordPublicKey
  )

  if (!isValidRequest) {
    return new Response('Invalid request signature.', { status: 401 })
  }
  const json = await req.json()
  const { message, previewToken } = json

  let configuration
  let model

  const ip = req.headers.get('x-forwarded-for')

  if (validateApiKey(previewToken)) {
    configuration = {
      apiKey: previewToken
    }

    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(1000, '1d')
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
    const openai = new OpenAI(configuration)

    const runner = openai.beta.chat.completions.runTools({
      stream: true,
      model,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: message
        }
      ],
      tools: runnables
    })

    const stream = OpenAIStream(runner)
    return new StreamingTextResponse(stream)
  } else {
    return NextResponse.json(
      { error: 'OPENAI API KEY NOT FOUND' },
      { status: 500 }
    )
  }
}
