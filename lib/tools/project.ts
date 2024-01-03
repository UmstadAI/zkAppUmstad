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

const VECTOR_TYPE = 'project'

const functionDescription: ChatCompletionCreateParams.Function = {
  name: 'search_for_project_context',
  description:
    'Search for context for example zkApp projects or developer tools on MINA Protocol, use this tool to retrieve project code examples about zkApps, o(1)js, MINA smart contracts. You will need this tool when user asks smart contracts or zkApp projects.',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description:
          'The query to search for. 1-3 sentences are enough. English only.'
      },
      project_name: {
        type: 'string',
        description:
          'It is in the metadata of the index, you can use it to filter the results, optional value that can be used after finding projects.'
      }
    },
    required: ['query']
  }
}

const functionMessage = 'Fetching context about Projects...\n'

async function formatResults(matches: ScoredPineconeRecord[]) {
  const results = []
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    if ((match.score || 1) > 0.75) {
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

export const projectTool: Tool = {
  name: functionDescription.name,
  description: functionDescription,
  message: functionMessage,
  callable: runTool
}

export const projectToolRunnable: RunnableToolFunction<{
  query: string
  project_name: string | undefined
}> = {
  type: 'function',
  function: {
    name: functionDescription.name,
    function: runTool,
    parse: JSON.parse,
    description:
      'Search for context for example zkApp projects or developer tools on MINA Protocol, use this tool to retrieve project code examples about zkApps, o(1)js, MINA smart contracts. You will need this tool when user asks smart contracts or zkApp projects.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'The query to search for. 1-3 sentences are enough. English only.'
        },
        project_name: {
          type: 'string',
          description:
            'It is in the metadata of the index, you can use it to filter the results, optional value that can be used after finding projects.'
        }
      }
    }
  }
}
