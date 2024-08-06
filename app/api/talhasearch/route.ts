import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Ratelimit } from '@upstash/ratelimit'
import OpenAI from 'openai'
import { NextResponse } from 'next/server'

import { validateApiKey } from '@/lib/utils'
import { demoSearcherTool, demoSearchRunnable } from '@/lib/tools'
import { demoSearchToolRunnable } from '@/lib/tools/demoSearch'

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


    model = 'gpt-4o-mini'
    const openai = new OpenAI(configuration)

    const messages = [
        { role: "user", content: message },
    ];

    
    const response = await openai.chat.completions.create({
        model: model,
        messages,
        functions: [demoSearchToolRunnable.function],
        function_call: { name: 'demo_search_for_thread' },
    });

    const functionOutput = response.data.choices[0].message?.function_call?.arguments;
    return functionOutput ? JSON.parse(functionOutput) : 'No results found';
  } else {
    return NextResponse.json(
      { error: 'OPENAI API KEY NOT FOUND' },
      { status: 500 }
    )
  }
}
