import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Ratelimit } from '@upstash/ratelimit'
import OpenAI from 'openai'
import { NextResponse } from 'next/server'

import { DISCORD_PROMPT } from './prompts'
import { validateApiKey } from '@/lib/utils'
import { runnables } from '@/lib/tools'

export const runtime = 'edge'

const discordToken = process.env.DISCORD_API_TOKEN as string

async function authorization(token: string) {
  const validTokens = [discordToken];

  if (!validTokens.includes(token)) {
    throw new Error('Unauthorized');
  }
}

export async function POST(req: Request) {
  const json = await req.json()
  const { message, previewToken, authToken } = json

  let configuration
  let model

  try {
    await authorization(authToken)
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

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

    model = 'gpt-4-turbo'
    const openai = new OpenAI(configuration)

    const runner = openai.beta.chat.completions.runTools({
      stream: true,
      model,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: DISCORD_PROMPT
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
