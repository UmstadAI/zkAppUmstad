import requests

from .tool import Tool
from .api_query import query_index

function_description = {
    "name": "search_for_issue_context",
    "description": "Search for context about problems, errors, issues, discussions an their solutions on MINA protocol, zkApps, o1js, use this tool to retrieve problems, errors, issues and their solutions about zkApps, o(1)js, MINA smart contracts. You will need this tool when user ask about problems, issues, errors, creative questions etc. or strange questions. Do not use the tool over and over again.",
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

function_messages = "Fetching context about issues..."


def run_tool(query=""):
    """Run the search tool with the provided query."""
    matches = query_index(tool="search_for_issue_context", query=query)
    if not matches:
        return "No matches found."

    return matches


issue_tool = Tool(
    name="search_for_issue_context",
    description=function_description,
    message=function_messages,
    function=run_tool,
)
