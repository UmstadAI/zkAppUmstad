import type { Tool } from './tool'
import type { ChatCompletionCreateParams } from 'openai/resources/chat'
import { getEmbeddings, getMatchesFromEmbeddings } from './utils'
import { ScoredPineconeRecord } from '@pinecone-database/pinecone'
import { RunnableToolFunction } from 'openai/lib/RunnableFunction'

export type Metadata = {
  url: string
  text: string
  chunk: string
  hash: string
}

const VECTOR_TYPE = 'demoSearch'

const functionDescription: ChatCompletionCreateParams.Function = {
  name: 'demo_search_for_thread',
  description:
  'Search for context about discord threads',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description:
          'The query to search for. 1-3 sentences are enough. English only.'
      }
    },
    required: ['query']
  }
}

const functionMessage = 'Fetching context about mina docs...\n'

async function formatResults(matches: ScoredPineconeRecord[]) {
  const results = []
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    if ((match.score || 1) > 0.25) {
      const metadata = match.metadata as Metadata
      const title = metadata.text
      const text = metadata.text
      const formatted_result = `## Result ${i + 1}:\n${title}\n${text}`
      results.push(formatted_result)
    }
  }
  return results.join('\n')
}

async function runTool(args: { query: string }): Promise<string> {
  try {
    const embeddings = await getEmbeddings(args.query)
    const matches = await getMatchesFromEmbeddings(embeddings, 15, VECTOR_TYPE)

    return formatResults(matches)
  } catch (e) {
    console.log('Error fetching docs: ', e)
    return 'Error fetching docs'
  }
}

export const demoSearchTool: Tool = {
  name: functionDescription.name,
  description: functionDescription,
  message: functionMessage,
  callable: runTool
}

export const demoSearchToolRunnable: RunnableToolFunction<{ query: string }> = {
  type: 'function',
  function: {
    name: functionDescription.name,
    function: runTool,
    parse: JSON.parse,
    description:
      'Search for context about discord threads',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'The query to search for. 1-3 sentences are enough. English only.'
        }
      }
    }
  }
}
