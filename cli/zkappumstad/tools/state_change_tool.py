from .tool import Tool
from zkappumstad.runners import StateChange


function_description = {
    "name": "change_state",
    "description": "Change the state of the agent. You can use this tool to change the state to coder agent. When you decide to start coding, use this tool to change the state to coder agent.",
    "parameters": {
        "type": "object",
        "properties": {
            "new_state": {
                "type": "number",
                "description": "New state of the agent. 0 for chat agent, 1 for coder agent.",
                "enum": [1],
            },
        },
        "required": ["new_state"],
    },
}

FUNCTION_MESSAGE = "Changing agent state..."


def run_tool(new_state: int):
    """Changes the state of the agent"""
    return StateChange(new_state, "STATE_CHANGE")


state_change_tool = Tool(
    name="change_state",
    description=function_description,
    message=FUNCTION_MESSAGE,
    function=run_tool,
)
