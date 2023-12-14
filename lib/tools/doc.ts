import type { Tool } from "./tool";
import type { ChatCompletionCreateParams } from 'openai/resources/chat'

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

function runner() {
    console.log(functionMessage)
}
 
export const docTool: Tool = {
    name: functionDescription.name,
    description: functionDescription,
    message: functionMessage,
    callable: runner
}