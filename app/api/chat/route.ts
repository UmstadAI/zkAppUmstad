import { kv } from '@vercel/kv'
import { Message, OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { Pinecone } from "@pinecone-database/pinecone";   
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RunnableSequence } from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";

import { SYSTEM_TEMPLATE, setPromtWithContext } from './prompts';
import { formatDocumentsAsString } from "langchain/util/document";

import { validateApiKey } from '@/lib/utils'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts';

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

  // Initialize the LLM to use to answer the question.
  const chatModel = new ChatOpenAI({});

  const embeddings = new OpenAIEmbeddings()
  const vectorStore = new PineconeStore(embeddings, {pineconeIndex: index})
  const vectorStoreRetriever = vectorStore.asRetriever()

  const lastMessage = messages[messages.length - 1]
  const formatMessages = [
    SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
  ];
  const prompt = ChatPromptTemplate.fromMessages(formatMessages);

  const chain = RunnableSequence.from([
    {
      // Extract the "question" field from the input object and pass it to the retriever as a string
      sourceDocuments: RunnableSequence.from([
        (input) => input.question,
        vectorStoreRetriever,
      ]),
      question: (input) => input.question,
    },
    {
      // Pass the source documents through unchanged so that we can return them directly in the final result
      sourceDocuments: (previousStepResult) => previousStepResult.sourceDocuments,
      question: (previousStepResult) => previousStepResult.question,
      context: (previousStepResult) =>
        formatDocumentsAsString(previousStepResult.sourceDocuments),
    },
    {
      result: prompt.pipe(chatModel).pipe(new StringOutputParser()),
      sourceDocuments: (previousStepResult) => previousStepResult.sourceDocuments,
    },
  ]);

  const res = await chain.invoke({
    question: lastMessage.content,
  });


  console.log(JSON.stringify(res, null, 2));

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
