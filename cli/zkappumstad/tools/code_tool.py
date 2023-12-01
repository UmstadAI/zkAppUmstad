import pinecone
import os
from openai import OpenAI
from .tool import Tool
from dotenv import load_dotenv, find_dotenv

print(find_dotenv(".env.local"))
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


def run_tool(query=""):
    print("query", query)
    embeddings = client.embeddings.create(
        input=query,
        model="text-embedding-ada-002",
    )
    embedding = embeddings.data[0].embedding
    index = pinecone.Index("zkappumstad")
    query_results = index.query(
        vector=embedding,
        top_k=3,
        filter={"vector_type": vector_type},
        include_metadata=True,
    )
    matches = query_results.to_dict()["matches"]
    filtered_matches = [match for match in matches if match["score"] > 0.85]
    metadatas = [match["metadata"] for match in filtered_matches]
    titles = [metadata.get("title", "") for metadata in metadatas]
    titles = [title + "\n" if title != "" else "" for title in titles]
    texts = [metadata.get("text", "") for metadata in metadatas]
    texts = [title + text for title, text in zip(titles, texts)]
    texts = ["## Result " + str(i + 1) + ":\n" + text for i, text in enumerate(texts)]
    text = "\n".join(texts)
    # TODO verbosed for debugging, remove later
    print("Query result is: \n", text)
    print("Query result over.")
    return text


code_tool = Tool(
    name="search_for_code_context",
    description=function_description,
    message=function_messages,
    function=run_tool,
)
