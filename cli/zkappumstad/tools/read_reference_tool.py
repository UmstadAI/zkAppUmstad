import os
from .tool import Tool
from colorama import Fore, Style

function_description = {
    "name": "read_reference_repo",
    "description": "This tool reads the reference zkApps project repository. It's useful to understand zkApps Smart Contract Structure and logic before writing smart contracts and their tests. Always use this function to get reference smart contract code. It will give you example Sudoku Smart contract, their tests and additional files for zkApps. Understand codes and use them for referencing before generate Smart Contracts.",
    "parameters": {
        "type": "object",
        "properties": {
            "directory": {
                "type": "string",
                "description": "The directory path of the reference project",
            }
        },
    },
}

function_messages = "Reading code from files...\n"
basedir = "sudoku/src/"


def run_tool(directory=basedir):
    directory = basedir
    try:
        if not os.path.exists(directory):
            return f"The directory '{directory}' does not exist."

        ts_files = [
            f
            for f in os.listdir(directory)
            if f.endswith(".ts") or f.endswith(".test.ts") or f.endswith(".js")
        ]

        code_content = ""
        for filename in ts_files:
            file_path = os.path.join(directory, filename)
            with open(file_path, "r") as file:
                code_content += file.read()
                print(
                    Fore.GREEN
                    + f"Contents of {file_path}:\n{code_content}\n"
                    + Style.RESET_ALL
                )

        return code_content

    except Exception as e:
        print(f"An error occurred: {e}")


read_reference_tool = Tool(
    name="read_reference_repo",
    description=function_description,
    message=function_messages,
    function=run_tool,
)
