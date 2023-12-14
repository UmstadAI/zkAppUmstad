import OpenAI from "openai";
import { Configuration, OpenAIApi } from 'openai-edge'
import type { Tool } from "./tool";
import type { ChatCompletionCreateParams } from 'openai/resources/chat'
import { Pinecone, type ScoredPineconeRecord } from "@pinecone-database/pinecone";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration);
const pinecone = new Pinecone(
    {
      environment: process.env.PINECONE_ENVIRONMENT as string,     
      apiKey: process.env.PINECONE_API_KEY as string,      
    }
);

const functionDescription: ChatCompletionCreateParams.Function = {
    name: "search_for_context",
    description: "Search for context about any topic from Mina, o1js, Auro Wallet documentations, use this tool to retrieve context about zkApps, o(1)js, wallets, ideas, MINA smart contracts. You will need this tool almost everytime.",
    parameters: {
        type: "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The query to search for. 1-3 sentences are enough. English only.",
            },
        },
        "required": ["query"],
    }
}

const functionMessage = "Fetching context about mina docs...\n"

async function getEmbeddings(query: string, model: string = "text-embedding-ada-002") {
    // Your implementation here
}
  
async function queryIndex(embedding: any, indexName: string = "zkappumstad", topK: number = 7, vectorType: string) {
// Your implementation here
}

function formatResults(matches: any[]) {
// Your implementation here
}


function runTool() {
    console.log(functionMessage)
}
 
export const docTool: Tool = {
    name: functionDescription.name,
    description: functionDescription,
    message: functionMessage,
    callable: runTool
}