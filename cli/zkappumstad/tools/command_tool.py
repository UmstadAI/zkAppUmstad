import subprocess
from .tool import Tool

function_description = {
    "name": "run_command",
    "description": "The function can be used to run terminal commands in the initial_project folder.",
    "parameters": {
        "type": "object",
        "properties": {
            "command_type": {
                "type": "string",
                "enum": ["TEST", "HELP", "BUILD"],
                "description": "The type of command.",
            },
        },
        "required": ["command_type"],
    },
}

function_messages = "Running command..."

basedir = "initial_project"
basedir_contracts = "initial_project/contracts/"
basedir_src = "initial_project/contracts/src"


def run_tool(command_type=""):
    try:
        if command_type == "TEST":
            result = subprocess.run(
                ["npm", "run", "test"],
                check=True,
                capture_output=True,
                text=True,
                cwd=basedir_contracts,
            )
            output = result.stdout + result.stderr
            print(output)
            return output
        elif command_type == "HELP":
            result = subprocess.run(
                ["zk", "--help"],
                check=True,
                text=True,
                capture_output=True,
                cwd=basedir_contracts,
            )
            output = result.stdout + result.stderr
            print(output)
            return output
        elif command_type == "BUILD":
            result = subprocess.run(
                ["npm", "run", "build"],
                check=False,
                text=True,
                capture_output=True,
                cwd=basedir_contracts,
            )
            print("____STDOUT____")
            print(result.stdout)
            print("____STDERR____")
            print(result.stderr)
            return result.stdout, result.stderr

    except subprocess.CalledProcessError as e:
        print(f"Command failed with error: {e}")
        print(e.stderr)
        output = e.stdout + e.stderr
        return output
    except Exception as e:
        print(f"An error occurred: {e}")


command_tool = Tool(
    name="run_command",
    description=function_description,
    message=function_messages,
    function=run_tool,
)
