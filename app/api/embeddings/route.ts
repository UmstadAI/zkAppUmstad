import { tools } from '@/lib/tools'
import { kv } from '@vercel/kv'
import { Ratelimit } from '@upstash/ratelimit'


export async function POST(req: Request) {
  const json = await req.json()
  const { tool, query, project } = json
  const toolObject = tools.find(t => t.name === tool)

  const ip = req.headers.get('x-forwarded-for')
  const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(500, '1d')
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

  if (!toolObject) {
    return new Response('Tool not found', { status: 404 })
  }

  const result: string = project
    ? await toolObject.callable({ query, project })
    : await toolObject.callable({ query })
  return new Response(result, { status: 200 })
}
