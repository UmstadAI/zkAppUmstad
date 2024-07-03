import type { Tool } from './tool'
import type { ChatCompletionCreateParams } from 'openai/resources/chat'
import { getEmbeddings, getMatchesFromEmbeddings } from './utils'
import { ScoredPineconeRecord } from '@pinecone-database/pinecone'
import { RunnableToolFunction } from 'openai/lib/RunnableFunction'

export type Metadata = {
  guild_id: string;
  thread_id: string;
  title: string;
  message?: string | null;
  messages?: string | null;
  message_id?: string | null;
  created_at: string;
  owner_id: string;
  thread_link: string,
  message_link?: string | null,
};


const VECTOR_TYPE = 'demoSearch'

const functionDescription: ChatCompletionCreateParams.Function = {
  name: 'demo_search_for_thread',
  description:
  'Search for context in discord threads',
  parameters: {
    type: 'object',
    properties: {}
  }
}

const functionMessage = 'Fetching context about search results...\n'

async function formatResults(matches: ScoredPineconeRecord[]) {
  const results = []
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    if ((match.score || 1) > 0.25) {
      const metadata = match.metadata as Metadata

      const guildId = metadata.guild_id;
      const threadId = metadata.thread_id;
      const title = metadata.title;
      const message = metadata.message;
      const messages = metadata.messages;
      const messageId = metadata.message_id;
      const createdAt = metadata.created_at.toString();
      const ownerId = metadata.owner_id;
      const threadLink = metadata.thread_link;
      const messageLink = metadata.message_link;

      // TODO!: Excluded message id here but later add on depends on the format if bigint or number it comes from forum listener
      const formattedMetadata = `
        Guild ID: ${guildId}
        Thread ID: ${threadId}
        Title: ${title}
        Message: ${message || 'None'}
        Message ID: ${messageId || 'None'}
        Messages: ${messages || 'None'}
        Thread Link: ${threadLink}
        Message Link: ${messageLink || 'None'}
        Created At: ${createdAt}
        Owner ID: ${ownerId}
      `.trim();

      results.push(formattedMetadata)
    }
  }
  return results.join('\n')
}

const runTool = (message_content:string) => async (args: { }): Promise<string>=> {
  try {
    const embeddings = await getEmbeddings(message_content)
    const matches = await getMatchesFromEmbeddings(embeddings, 15, VECTOR_TYPE)

    return formatResults(matches)
  } catch (e) {
    console.log('Error fetching docs: ', e)
    return 'Error fetching docs'
  }
}

export const demoSearchTool: Tool = {
  name: functionDescription.name,
  description: functionDescription,
  message: functionMessage,
  callable: runTool
}

export const demoSearchToolRunnable = (message: string): RunnableToolFunction<{ query: string }> => ({
  type: 'function',
  function: {
    name: functionDescription.name,
    function: runTool(message),
    parse: JSON.parse,
    description:
      'Search for context in discord threads',
    parameters: {
      type: 'object',
      properties: {}
    }
  }
})
