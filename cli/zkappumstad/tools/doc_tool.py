import os
import pinecone

from .tool import Tool

from openai import OpenAI
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(".env.local"))

pinecone_api_key = os.getenv("PINECONE_API_KEY") or "YOUR_API_KEY"
pinecone_env = os.getenv("PINECONE_ENVIRONMENT") or "YOUR_ENV"
vector_type = os.getenv("DOCS_VECTOR_TYPE") or "VECTOR_TYPE"

pinecone.init(api_key=pinecone_api_key, environment=pinecone_env)

client = OpenAI()

function_description = {
    "name": "search_for_context",
    "description": "Search for context about any topic from Mina, o1js, Auro Wallet documentations, use this tool to retrieve context about zkApps, o(1)js, wallets, ideas, MINA smart contracts. You will need this tool almost everytime.",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The query to search for. 1-3 sentences are enough. English only.",
            },
        },
        "required": ["query"],
    },
}

function_messages = "Fetching context about mina docs...\n"


def get_text_embbeddings(query, model="text-embedding-ada-002"):
    """Generate embeddings for a given query."""
    try:
        embeddings = client.embeddings.create(input=query, model=model)
        return embeddings.data[0].embedding
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        return None


def query_index(embedding, index_name="zkappumstad", top_k=7, vector_type=vector_type):
    """Query the index using the generated embeddings."""
    try:
        index = pinecone.Index(index_name)
        return index.query(
            vector=embedding,
            top_k=top_k,
            filter={"vector_type": vector_type},
            include_metadata=True,
        ).to_dict()["matches"]
    except Exception as e:
        print(f"Error querying index: {e}")
        return []


def format_results(matches):
    """Format the results from the index query."""
    results = []
    for i, match in enumerate(matches):
        if match["score"] > 0.85:
            metadata = match["metadata"]
            title = metadata.get("title", "")
            text = metadata.get("text", "")
            formatted_result = f"## Result {i + 1}:\n{title}\n{text}"
            results.append(formatted_result)
    return "\n".join(results)


def run_tool(query="", vector_type=vector_type):
    """Run the search tool with the provided query."""
    embedding = get_text_embbeddings(query)
    if embedding is None:
        return "Failed to generate embeddings."

    matches = query_index(embedding, vector_type=vector_type)
    if not matches:
        return "No matches found."

    return format_results(matches)


doc_tool = Tool(
    name="search_for_context",
    description=function_description,
    message=function_messages,
    function=run_tool,
)
