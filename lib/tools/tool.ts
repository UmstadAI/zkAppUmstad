import type { ChatCompletionCreateParams } from 'openai/resources/chat'

export type Tool = {
  name: string
  description: ChatCompletionCreateParams.Function
  message: string
  callable: Function
}
