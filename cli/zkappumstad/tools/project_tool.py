import requests

from .tool import Tool
from .api_query import query_project


function_description = {
    "name": "search_for_project_context",
    "description": "Search for context for example zkApp projects or developer tools on MINA Protocol, use this tool to retrieve project code examples about zkApps, o(1)js, MINA smart contracts. You will need this tool when user asks smart contracts or zkApp projects.",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The query to search for. 1-3 sentences are enough. English only. Not a question, just a statement or description of the project.",
            },
            "project_name": {
                "type": "string",
                "description": "It is in the metadata of the index, you can use it to filter the results, optional value that can be used after finding projects.",
            },
        },
        "required": ["query"],
    },
}

function_messages = "Fetching context about Projects..."


def run_tool(query="", project_name=None):
    """Run the search tool with the provided query."""
    matches = query_project(
        tool="search_for_project_context", query=query, project_name=project_name
    )
    if not matches:
        return "No matches found."

    return matches


project_tool = Tool(
    name="search_for_project_context",
    description=function_description,
    message=function_messages,
    function=run_tool,
)
