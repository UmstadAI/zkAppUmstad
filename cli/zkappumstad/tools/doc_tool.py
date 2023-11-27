import pinecone
import os
from openai import OpenAI

pinecone_api_key = os.getenv("PINECONE_API_KEY") or "YOUR_API_KEY"
pinecone_env = os.getenv("PINECONE_ENVIRONMENT") or "YOUR_ENV"
pinecone.init(api_key=pinecone_api_key, environment=pinecone_env)

client = OpenAI()

function_description = {
    "name": "search_for_context",
    "description": "Search for context about any topic from Mina documentations, use this tool to retrieve context about zkApps, o(1)js, zkSnarks, MINA smart contracts. You will need this tool almost everytime.",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The query to search for. 1-3 sentences are enough.",
            },
        },
        "required": ["query"],
    },
}

function_messages = "Fetching context about mina docs...\n"


def run_tool(query=""):
    embeddings = client.embeddings.create(
        input=query,
        model="text-embedding-ada-002",
    )
    embeddings = embeddings["embedding"]
    index = pinecone.Index(name="zkappumstad")
    query_results = index.query(queries=list(embeddings), top_k=1)
    return query_results.to_dict()["data"]
