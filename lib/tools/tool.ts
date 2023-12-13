import type { ChatCompletionCreateParams } from 'openai/resources/chat'

type Tool = {
  name: string
  description: ChatCompletionCreateParams
  message: string
  callable: Function
}
