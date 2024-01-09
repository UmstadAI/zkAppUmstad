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

const VECTOR_TYPE = 'issue'

const functionDescription: ChatCompletionCreateParams.Function = {
  name: 'search_for_issue_context',
  description:
    'Search for context about problems, errors, issues, discussions an their solutions on MINA protocol, zkApps, o1js, use this tool to retrieve problems, errors, issues and their solutions about zkApps, o(1)js, MINA smart contracts. You will need this tool when user ask about problems, issues, errors, creative questions etc. or strange questions',
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

const functionMessage = 'Fetching context about issues...\n'

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
  const matches = await getMatchesFromEmbeddings(embeddings, 2, VECTOR_TYPE)

  return formatResults(matches)
}

export const issueTool: Tool = {
  name: functionDescription.name,
  description: functionDescription,
  message: functionMessage,
  callable: runTool
}

export const issueToolRunnable: RunnableToolFunction<{ query: string }> = {
  type: 'function',
  function: {
    name: functionDescription.name,
    function: runTool,
    parse: JSON.parse,
    description:
      'Search for context about problems, errors, issues, discussions an their solutions on MINA protocol, zkApps, o1js, use this tool to retrieve problems, errors, issues and their solutions about zkApps, o(1)js, MINA smart contracts. You will need this tool when user ask about problems, issues, errors, creative questions etc. or strange questions',
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
