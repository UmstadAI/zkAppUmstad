import { tools } from '@/lib/tools'

export async function POST(req: Request) {
  const json = await req.json()
  const { tool, query, project } = json
  const toolObject = tools.find(t => t.name === tool)

  if (!toolObject) {
    return new Response('Tool not found', { status: 404 })
  }

  const result: string = project
    ? await toolObject.callable({ query, project })
    : await toolObject.callable({ query })
  return new Response(result, { status: 200 })
}
