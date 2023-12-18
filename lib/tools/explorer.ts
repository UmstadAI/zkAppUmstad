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
        }
      },
      required: ['query']
    }
}

const functionMessage = 'Fetching context from explorer...\n'

async function runTool(args: { query: string }): Promise<string> {
    return "Get"
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
          }
        }
      }
    }
}
