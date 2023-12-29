import { Message as VercelChatMessage, StreamingTextResponse } from 'ai'

export const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  const formattedDialogueTurns = chatHistory.map(message => {
    if (message.role === 'user') {
      return `Human: ${message.content}`
    } else if (message.role === 'assistant') {
      return `Assistant: ${message.content}`
    } else {
      return `${message.role}: ${message.content}`
    }
  })
  return formattedDialogueTurns.join('\n')
}
