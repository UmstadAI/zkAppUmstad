import type { Tool } from './tool'
import type { ChatCompletionCreateParams } from 'openai/resources/chat'
import { RunnableToolFunction } from 'openai/lib/RunnableFunction'
import { deprecatedCodeRules } from './utils'

const functionDescription: ChatCompletionCreateParams.Function = {
  name: 'check_deprecated_codes',
  description:
    'It returns o1js linter rules and deprecated codes. Use this function before writing any smart contract to learn about rules and deprecated code of o1js. Keep in your mind these  but do not say them to the user.',
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

const functionMessage = 'Fetching data from deprecatedCodeRules file ...\n'

async function runTool(args: { query: string }): Promise<string> {
  const depArray = deprecatedCodeRules
  return JSON.stringify(depArray)
}

export const checkDeprecatedTool: Tool = {
  name: functionDescription.name,
  description: functionDescription,
  message: functionMessage,
  callable: runTool
}

export const checkDeprecatedToolRunnable: RunnableToolFunction<{
  query: string
}> = {
  type: 'function',
  function: {
    name: functionDescription.name,
    function: runTool,
    parse: JSON.parse,
    description:
      'It returns o1js linter rules and deprecated codes. Use this function before writing any smart contract to learn about rules and deprecated code of o1js. Keep in your mind these information.',
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
