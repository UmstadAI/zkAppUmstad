import type { Tool } from './tool'
import type { ChatCompletionCreateParams } from 'openai/resources/chat'
import { getEmbeddings, getMatchesFromEmbeddings } from './utils'
import { ScoredPineconeRecord } from '@pinecone-database/pinecone'
import { RunnableToolFunction } from 'openai/lib/RunnableFunction'

export type Metadata = {
  guild_id: number;
  thread_id: number;
  title: string;
  message?: string | null;
  messages?: string | null;
  message_id?: string | null;
  created_at: string;
  owner_id: string;
};


const VECTOR_TYPE = 'demoSearch'

const functionDescription: ChatCompletionCreateParams.Function = {
  name: 'demo_search_for_thread',
  description:
  'Search for context about discord threads',
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

const functionMessage = 'Fetching context about mina docs...\n'

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
      const createdAt = metadata.created_at;
      const ownerId = metadata.owner_id;

      const formattedMetadata = `
        Guild ID: ${metadata.guild_id}
        Thread ID: ${metadata.thread_id}
        Title: ${metadata.title}
        Message: ${metadata.message || 'None'}
        Messages: ${metadata.messages || 'None'}
        Message ID: ${metadata.message_id || 'None'}
        Created At: ${metadata.created_at}
        Owner ID: ${metadata.owner_id}
      `.trim();

      results.push(formattedMetadata)
    }
  }
  return results.join('\n')
}

async function runTool(args: { query: string }): Promise<string> {
  try {
    const embeddings = await getEmbeddings(args.query)
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

export const demoSearchToolRunnable: RunnableToolFunction<{ query: string }> = {
  type: 'function',
  function: {
    name: functionDescription.name,
    function: runTool,
    parse: JSON.parse,
    description:
      'Search for context about discord threads',
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
