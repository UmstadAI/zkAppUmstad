import type { Tool } from './tool'
import type { ChatCompletionCreateParams } from 'openai/resources/chat'
import { RunnableToolFunction } from 'openai/lib/RunnableFunction'

const functionDescription: ChatCompletionCreateParams.Function = {
  name: 'explorer_tool',
  description:
    'This tool takes inputs like transaction hash, account id or block hash and process it then gives the details to the user.',
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
        description: 'Transaction Hash or Block Hash or Account Id'
      }
    },
    required: ['query']
  }
}

const functionMessage = 'Fetching context from explorer...\n'

function isPublicKey(inputString: string | undefined): boolean {
    const prefix = "B62";
    return inputString !== undefined && inputString.startsWith(prefix);
}
  

async function runTool(args: { query: string, input: string }): Promise<string> {
    console.log(args.query, args.input)
    if(isPublicKey(args.input)) {
        return "It is public key"
    } else {
        return "It is possibly transaction hash"
    }
}

export const explorerTool: Tool = {
  name: functionDescription.name,
  description: functionDescription,
  message: functionMessage,
  callable: runTool
}

export const explorerToolRunnable: RunnableToolFunction<{ query: string }> = {
  type: 'function',
  function: {
    name: functionDescription.name,
    function: runTool,
    parse: JSON.parse,
    description:
      'This tool takes inputs like transaction hash, account id or block hash and process it then gives the details to the user.',
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
            description: 'Transaction Hash or Block Hash or Account Id'
        }
      }
    }
  }
}