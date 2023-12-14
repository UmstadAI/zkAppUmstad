import OpenAI from "openai";
import type { Tool } from "./tool";
import type { ChatCompletionCreateParams } from 'openai/resources/chat'
import { getEmbeddings, getMatchesFromEmbeddings } from "./utils"
import { ScoredPineconeRecord } from "@pinecone-database/pinecone";

export type Metadata = {
    url: string,
    text: string,
    chunk: string,
    hash: string
}

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

async function formatResults() {
    // Not implemented
}

async function runTool(query: string, vector_type: string) {
    const embeddings = await getEmbeddings(query)
    const matches = await getMatchesFromEmbeddings(embeddings, 7, "zkappumstad", vector_type)

    // TODO: Look the matches and if need implement format results
    console.log(matches)
    
}
 
export const docTool: Tool = {
    name: functionDescription.name,
    description: functionDescription,
    message: functionMessage,
    callable: runTool
}