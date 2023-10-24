import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { Pinecone } from "@pinecone-database/pinecone";   
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { questionPrompt, questionPrompt } from './prompts';

import { validateApiKey } from '@/lib/utils'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

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
    model = 'gpt-3.5-turbo'
  }

  const pinecone = new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT as string,     
    apiKey: process.env.PINECONE_API_KEY as string,      
  });      

  const index = pinecone.Index("zkappumstad");

  const embeddings = new OpenAIEmbeddings()
  const vectorStore = new PineconeStore(embeddings, {pineconeIndex: index})
  const retriever = vectorStore.asRetriever()

  const chain = RunnableSequence.from()

  const res = await openai.createChatCompletion({
    model: model,
    messages,
    temperature: 0.7,
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

  return new StreamingTextResponse(stream)
}
