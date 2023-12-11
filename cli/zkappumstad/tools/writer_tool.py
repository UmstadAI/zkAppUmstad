import os
from .tool import Tool
from zkappumstad.utils import fade_in_text

function_description = {
    "name": "write_code",
    "description": "Always run this function after using other functions. Always ask for consent to the user before write file. This tool automates the generation of TypeScript files for zkApp projects and their tests. Use this function when AI wants to generate codes for existing zkApps project such as smart contracts and their tests or user wants to write by you. The generated code aligns with the user's specifications for smart contract functionalities within the zkApps framework. This tool is ideal for developers seeking to streamline their zkApp development process, ensuring rapid prototyping and consistency in code structure.",
    "parameters": {
        "type": "object",
        "properties": {
            "contract_name": {
                "type": "string",
                "description": "The name of the contract related the project",         
            },
            "code": {
                "type": "string",
                "description": "The typescript code for zkApps smart contracts and their tests to write.",
            },
            "is_test": {
                "type": "boolean",
                "description": "true if the code is smart contract test false if it is not test code"
            } 
        },
        "required": ["code", "is_test"],
    },
}

function_messages = "Writing code to file...\n"

basedir = "initial_project/contracts/src"
def run_tool(contract_name, code, is_test):
    try:
        if is_test:
            filename = f"{contract_name}.test.ts"
        else:
            filename = f"{contract_name}.ts"
        file_path = os.path.join(basedir, filename)

        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, 'w') as file:
            file.write(code)
            fade_in_text(f"Code written successfully to {file_path}!", "bold green")

        return code

    except Exception as e:
        print(f"An error occurred: {e}")
    

writer_tool = Tool(
    name="write_code",
    description=function_description,
    message=function_messages,
    function=run_tool,
)