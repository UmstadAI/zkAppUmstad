import os
import pinecone
import requests

from .tool import Tool

from openai import OpenAI
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(".env.local"))

client = OpenAI()

function_description = {
    "name": "search_for_code_context",
    "description": "Always firstly use this tool for any code related requests. Understand and benchmark the smart contract structure. Search for context from code examples in the documentations, use this tool to retrieve context about code, when you need a reference code, Second most used tool.",
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

function_messages = "Fetching context about code snippets..."


def get_text_embeddings(query, model_name="text-embedding-ada-002"):
    """Create text embeddings for a given query."""
    try:
        embeddings = client.embeddings.create(input=query, model=model_name)
        return embeddings.data[0].embedding
    except Exception as e:
        print(f"Error in generating embeddings: {e}")
        return None


def query_index(tool, query):
    url = 'https://zkappsumstad.com/api/embeddings'
    payload = {
        'tool': tool,
        'query': query
    }

    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            try:
                return response.json()
            except ValueError as e:
                return {"error": f"JSON decoding failed: {str(e)}", "response": response.text}
        else:
            return {"error": f"Request failed with status code {response.status_code}", "response": response.text}
    except requests.exceptions.RequestException as e:
        return {"error": f"Request failed: {str(e)}"}
    

def format_results(matches):
    """Format the query results for display."""
    filtered_matches = [match for match in matches if match["score"] > 0.25]
    formatted_texts = []
    for i, match in enumerate(filtered_matches):
        metadata = match["metadata"]
        title = metadata.get("title", "")
        text = metadata.get("text", "")
        formatted_text = f"## Result {i + 1}:\n{title}\n{text}"
        formatted_texts.append(formatted_text)
    return "\n".join(formatted_texts)


def run_tool(query=""):
    """Run the query tool with the given parameters."""
    embedding = get_text_embeddings(query)
    if embedding is None:
        return "Failed to generate embeddings."

    matches = query_index(tool=function_description.name, query=query)
    if not matches:
        return "No matches found in the database for the query: " + query

    formatted_text = format_results(matches)
    return formatted_text


code_tool = Tool(
    name="search_for_code_context",
    description=function_description,
    message=function_messages,
    function=run_tool,
)
