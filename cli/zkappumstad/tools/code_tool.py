import os
import requests

from .tool import Tool
from .api_query import query_index

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
