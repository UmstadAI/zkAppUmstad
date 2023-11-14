import { kv } from '@vercel/kv'
import { Message, OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { Pinecone } from "@pinecone-database/pinecone";   
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { getContext } from './utils/context'
import { getCodeContext } from './utils/codeContext';

import { setPromtWithContext } from './prompts';
import { formatVercelMessages } from './utils/utils';

import { validateApiKey } from '@/lib/utils'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { getProjectContext } from './utils/projectContext';

export const runtime = 'edge'

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  let openai
  let model

  if (validateApiKey(previewToken)) {
    const configuration = new Configuration({
      apiKey: previewToken
    })

    openai = new OpenAIApi(configuration)
    model = 'gpt-4'
  } else {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    })
    
    openai = new OpenAIApi(configuration)
    model = 'gpt-4'
  }

  const pinecone = new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT as string,     
    apiKey: process.env.PINECONE_API_KEY as string,      
  });      

  const index = pinecone.Index("zkappumstad");
  const codeIndex = pinecone.Index("zkappumstad-codebase");
  const projectIndex = pinecone.Index("zkappumstad-projects");

  const embeddings = new OpenAIEmbeddings()

  const lastMessage = messages[messages.length - 1]
  const context = await getContext(lastMessage.content, '')
  const codeContext = await getCodeContext(lastMessage.content, '')
  const projectContext = await getProjectContext(lastMessage.content, '')
  const promt = setPromtWithContext(codeContext, context, projectContext)

  const res = await openai.createChatCompletion({
    model: model,
    messages: [...promt, ...messages.filter((message: Message) => message.role === 'user')],
    temperature: 0.2,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await kv.hmset(`chat:${id}`, payload)
      await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
  })

  console.log(stream)
  return new StreamingTextResponse(stream)
}
