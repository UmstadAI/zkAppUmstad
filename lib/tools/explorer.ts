import type { Tool } from './tool'
import type { ChatCompletionCreateParams } from 'openai/resources/chat'
import { RunnableToolFunction } from 'openai/lib/RunnableFunction'
import {
  getAccountInfo,
  getBlockInfo,
  getBlockchainSummary,
  getCurrentPrice,
  getLatestBlock
} from './utils'

const functionDescription: ChatCompletionCreateParams.Function = {
  name: 'explorer_tool',
  description:
    'This tool takes inputs like transaction hash, account id or block hash and process it then gives the details to the user. Also can be used to get current summary of the blockchain or latest block or current Price of MINA in dollar.',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description:
          'The query to search for. 1-3 sentences are enough. English only.'
      },
      input: {
        type: 'string',
        description: 'Block Hash or Account Id'
      }
    },
    required: ['query']
  }
}

const functionMessage = 'Fetching context from explorer...\n'

function isPublicKey(inputString: string | undefined): boolean {
  const prefix = 'B62'
  return inputString !== undefined && inputString.startsWith(prefix)
}

async function runTool(args: {
  query: string
  input: string
}): Promise<string> {
  if (isPublicKey(args.input)) {
    const response = await getAccountInfo(args.input)
    return response
  } else {
    if (args.input) {
      const response = await getBlockInfo(args.input)
      return response
    } else {
      const currentPrice = 'Current MINA Price is: ' + (await getCurrentPrice())
      const latestBlockResponse = await getLatestBlock()
      const summaryResponse = await getBlockchainSummary()
      return currentPrice + latestBlockResponse + summaryResponse
    }
  }
}

export const explorerTool: Tool = {
  name: functionDescription.name,
  description: functionDescription,
  message: functionMessage,
  callable: runTool
}

export const explorerToolRunnable: RunnableToolFunction<{
  query: string
  input: string
}> = {
  type: 'function',
  function: {
    name: functionDescription.name,
    function: runTool,
    parse: JSON.parse,
    description:
      'This tool takes inputs like transaction hash, account id or block hash and process it then gives the details to the user. Also can be used to get current summary of the blockchain or latest block or current Price of MINA in dollar.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'The query to search for. 1-3 sentences are enough. English only.'
        },
        input: {
          type: 'string',
          description: 'Block Hash or Account Id'
        }
      }
    }
  }
}
