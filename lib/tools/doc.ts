import OpenAI from "openai";
import type { Tool } from "./tool";
import type { ChatCompletionCreateParams } from 'openai/resources/chat'
import { getEmbeddings, getMatchesFromEmbeddings } from "./utils"

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

function formatResults(matches: any[]) {
// Your implementation here
}


async function runTool(query: string, vector_type: string) {
    const embeddings = await getEmbeddings(query)
    const matches = await getMatchesFromEmbeddings(embeddings, 7, "zkappumstad", vector_type)
}
 
export const docTool: Tool = {
    name: functionDescription.name,
    description: functionDescription,
    message: functionMessage,
    callable: runTool
}