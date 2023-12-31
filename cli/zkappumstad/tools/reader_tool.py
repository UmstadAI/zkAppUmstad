import os
from .tool import Tool
from colorama import Fore, Style

function_description = {
    "name": "read_code",
    "description": "This tool reads and displays the contents of files in the zkApp project directory. It's useful for reviewing the current state of smart contracts and test files. Use this function to read codes from existing zkApps projects. The tool will list all files in the specified directory and display their contents. Use this function if user asks read or evaulate or understand the existing codes in the current zkapps project",
    "parameters": {
        "type": "object",
        "properties": {
            "directory": {
                "type": "string",
                "description": "The directory path from which to read TypeScript files.",
            }
        },
    },
}

function_messages = "Reading code from files..."
basedir = "initial_project/contracts/src/"


def run_tool(directory=basedir):
    directory = basedir
    try:
        if not os.path.exists(directory):
            return f"The directory '{directory}' does not exist."

        ts_files = [
            f
            for f in os.listdir(directory)
            if f.endswith(".ts") or f.endswith(".test.ts")
        ]

        code_content = ""
        for filename in ts_files:
            file_path = os.path.join(directory, filename)
            with open(file_path, "r") as file:
                file_content = file.read()
                code_content += file_content
                print(
                    Fore.GREEN
                    + f"Contents of {file_path}:\n{file_content}\n"
                    + Style.RESET_ALL
                )

        return code_content

    except Exception as e:
        print(f"An error occurred: {e}")


reader_tool = Tool(
    name="read_code",
    description=function_description,
    message=function_messages,
    function=run_tool,
)
