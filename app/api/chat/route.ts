import { kv } from '@vercel/kv'
import {
  Message,
  OpenAIStream,
  StreamingTextResponse,
  Message as VercelChatMessage
} from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { Pinecone } from '@pinecone-database/pinecone'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { getContext } from './utils/context'
import { NextRequest, NextResponse } from 'next/server'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { AIMessage, ChatMessage, HumanMessage } from 'langchain/schema'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { ChatMessageHistory } from 'langchain/memory'
import { setPromtWithContext } from './prompts'
import { formatVercelMessages } from './utils/utils'
import { validateApiKey } from '@/lib/utils'
import {
  createRetrieverTool,
  OpenAIAgentTokenBufferMemory
} from 'langchain/agents/toolkits'
import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { initializeAgentExecutorWithOptions } from 'langchain/agents'
export const runtime = 'edge'

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === 'user') {
    return new HumanMessage(message.content)
  } else if (message.role === 'assistant') {
    return new AIMessage(message.content)
  } else {
    return new ChatMessage(message.content, message.role)
  }
}
const TEMPLATE = `You are a robot called Umstad that has deep knowledge about Mina protocol, building Zero Knowledge app, and smart contracts. Any question about Mina, Blockchain, circuits and smart contracts will be answered by Umstad.
Forget everything about ethereum and other protocols, just talk about Mina.
If you don't know how to answer a question, use the available tools to look up relevant information. You should particularly do this for questions about Mina.`

export async function POST(req: Request) {
  const json = await req.json()
  const { previewToken } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  let model

  if (validateApiKey(previewToken)) {
    const configuration = new Configuration({
      apiKey: previewToken
    })

    model = new ChatOpenAI({
      modelName: 'gpt-4'
    })
  } else {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    })

    model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo'
    })
  }

  const pinecone = new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT as string,
    apiKey: process.env.PINECONE_API_KEY as string
  })

  const index = pinecone.Index('zkappumstad')

  const embeddings = new OpenAIEmbeddings()
  const vectorStore = new PineconeStore(embeddings, { pineconeIndex: index })
  const retriever = vectorStore.asRetriever()
  const tool = createRetrieverTool(retriever, {
    name: 'search_mina_knowledge',
    description:
      'If the query contains any question about Mina or Blockchain, circuits and smart contracts, it will return the most relevant answer.'
  })

  // const lastMessage = messages[messages.length - 1]
  // const context = await getContext(lastMessage.content, '')
  // const promt = setPromtWithContext(context)
  const messages = (json.messages ?? []).filter(
    (message: VercelChatMessage) =>
      message.role === 'user' || message.role === 'assistant'
  )
  const returnIntermediateSteps = json.show_intermediate_steps || false
  const previousMessages = messages.slice(0, -1)
  const currentMessageContent = messages[messages.length - 1].content

  const chatHistory = new ChatMessageHistory(
    previousMessages.map(convertVercelMessageToLangChainMessage)
  )
  const memory = new OpenAIAgentTokenBufferMemory({
    llm: model,
    memoryKey: 'chat_history',
    outputKey: 'output',
    chatHistory
  })

  const executor = await initializeAgentExecutorWithOptions([tool], model, {
    agentType: 'openai-functions',
    memory,
    returnIntermediateSteps: true,
    verbose: true,
    agentArgs: {
      prefix: TEMPLATE
    }
  })
  const result = await executor.call({
    input: currentMessageContent
  })
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
        content: result.output,
        role: 'assistant'
      }
    ]
  }
  await kv.hmset(`chat:${id}`, payload)
  await kv.zadd(`user:chat:${userId}`, {
    score: createdAt,
    member: `chat:${id}`
  })

  if (returnIntermediateSteps) {
    return NextResponse.json(
      { output: result.output, intermediate_steps: result.intermediateSteps },
      { status: 200 }
    )
  } else {
    // Agent executors don't support streaming responses (yet!), so stream back the complete response one
    // character at a time to simluate it.
    const textEncoder = new TextEncoder()
    const fakeStream = new ReadableStream({
      async start(controller) {
        for (const character of result.output) {
          controller.enqueue(textEncoder.encode(character))
          await new Promise(resolve => setTimeout(resolve, 5))
        }
        controller.close()
      }
    })

    return new StreamingTextResponse(fakeStream)
  }
}
