import pinecone

from .tool import Tool

from openai import OpenAI
from openai.types.chat import ChatCompletion
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(".env.local"))


client = OpenAI()

function_description = {
    "name": "write_prd",
    "description": "This tool is used to write requirements for the zkApp.",
    "parameters": {},
}

function_messages = "Preparing Requirements for zkApp"

SYSTEM_PROMPT = """
Write Requirements  for zkApp. Consider User's needs. 
# Output Format
## Requirements
* Requirement 1
...
* Requirement n

""".strip()


def run_tool(history):
    """Creates a prd using chatgpt"""
    chat_completion: ChatCompletion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            *history,
        ],
        model="gpt-4-1106-preview",
    )
    return chat_completion.choices[0].message.content


prd_tool = Tool(
    name="write_prd",
    description=function_description,
    message=function_messages,
    function=run_tool,
)
