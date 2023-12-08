import pinecone
import os
from openai import OpenAI
from .tool import Tool
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(".env.local"))

pinecone_api_key = os.getenv("PINECONE_API_KEY") or "YOUR_API_KEY"
pinecone_env = os.getenv("PINECONE_ENVIRONMENT") or "YOUR_ENV"
vector_type = os.getenv("CODE_VECTOR_TYPE") or "VECTOR_TYPE"

pinecone.init(api_key=pinecone_api_key, environment=pinecone_env)

client = OpenAI()

function_description = {
    "name": "search_for_code_context",
    "description": "Search for context from code examples in the documentations, use this tool to retrieve context about code, when you need a reference code, Second most used tool.",
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

function_messages = "Fetching context about code snippets...\n"


def get_text_embeddings(query, model_name="text-embedding-ada-002"):
    """Create text embeddings for a given query."""
    try:
        embeddings = client.embeddings.create(input=query, model=model_name)
        return embeddings.data[0].embedding
    except Exception as e:
        print(f"Error in generating embeddings: {e}")
        return None

def query_index(embedding, index_name, top_k=3, vector_type=vector_type):
    """Query the index with the given embedding."""
    try:
        index = pinecone.Index(index_name)
        query_results = index.query(
            vector=embedding,
            top_k=top_k,
            filter={"vector_type": vector_type},
            include_metadata=True
        )
        return query_results.to_dict()["matches"]
    except Exception as e:
        print(f"Error in querying index: {e}")
        return []

def format_results(matches):
    """Format the query results for display."""
    filtered_matches = [match for match in matches if match["score"] > 0.85]
    formatted_texts = []
    for i, match in enumerate(filtered_matches):
        metadata = match["metadata"]
        title = metadata.get("title", "")
        text = metadata.get("text", "")
        formatted_text = f"## Result {i + 1}:\n{title}\n{text}"
        formatted_texts.append(formatted_text)
    return "\n".join(formatted_texts)

def run_tool(query="", vector_type=None):
    """Run the query tool with the given parameters."""
    embedding = get_text_embeddings(query)
    if embedding is None:
        return "Failed to generate embeddings."

    matches = query_index(embedding, "zkappumstad", vector_type=vector_type)
    if not matches:
        return "No matches found."

    formatted_text = format_results(matches)
    return formatted_text



code_tool = Tool(
    name="search_for_code_context",
    description=function_description,
    message=function_messages,
    function=run_tool,
)
