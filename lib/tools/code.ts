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

const VECTOR_TYPE = 'code'

const functionDescription: ChatCompletionCreateParams.Function = {
  name: 'search_for_code_context',
  description:
    'Always firstly use this tool for any code related requests. Understand and benchmark the smart contract structure. Search for context from code examples in the documentations, use this tool to retrieve context about code, when you need a reference code, Second most used tool.',
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

const functionMessage = 'Fetching context about code snippets...\n'

async function formatResults(matches: ScoredPineconeRecord[]) {
  const results = []
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    if ((match.score || 1) > 0.65) {
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
  const embeddings = await getEmbeddings(args.query)
  const matches = await getMatchesFromEmbeddings(embeddings, 3, VECTOR_TYPE)

  return formatResults(matches)
}

export const codeTool: Tool = {
  name: functionDescription.name,
  description: functionDescription,
  message: functionMessage,
  callable: runTool
}

export const codeToolRunnable: RunnableToolFunction<{ query: string }> = {
  type: 'function',
  function: {
    name: functionDescription.name,
    function: runTool,
    parse: JSON.parse,
    description:
      'Always firstly use this tool for any code related requests. Understand and benchmark the smart contract structure. Search for context from code examples in the documentations, use this tool to retrieve context about code, when you need a reference code, Second most used tool.',
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
