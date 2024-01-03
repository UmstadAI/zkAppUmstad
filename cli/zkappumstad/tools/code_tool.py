import requests

from .tool import Tool
from .api_query import query_index

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


def run_tool(query=""):
    """Run the query tool with the given parameters."""
    matches = query_index(tool="search_for_code_context", query=query)
    if not matches:
        return "No matches found in the database for the query: " + query

    return matches


code_tool = Tool(
    name="search_for_code_context",
    description=function_description,
    message=function_messages,
    function=run_tool,
)
