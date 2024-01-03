import requests

from .tool import Tool
from .api_query import query_index

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

function_messages = "Fetching context about mina docs..."


def run_tool(query=""):
    """Run the search tool with the provided query."""
    matches = query_index(tool="search_for_context", query=query)
    if not matches:
        return "No matches found."

    return matches


doc_tool = Tool(
    name="search_for_context",
    description=function_description,
    message=function_messages,
    function=run_tool,
)
