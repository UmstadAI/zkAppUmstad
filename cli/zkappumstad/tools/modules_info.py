from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
from json import loads

load_dotenv(find_dotenv(".env.local"), override=True)

client = OpenAI()

SYSTEM_MESSAGE = """
You are a debugger in a o1js project. Your task is to parse any build errors to find the root cause of the error.
Create a list of modules/functions/classes that are causing the error.
For example: 
Error:
    src/zkLogin.ts:47:55 - error TS2304: Cannot find name 'MerkleProof'.
What to query:
    "MerkleProof"
""".strip()


def load_modules_info():
    with open("examples/modules.json") as f:
        return loads(f.read())


def parse_build_message(build_message: str):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": SYSTEM_MESSAGE,
            },
            {
                "role": "user",
                "content": build_message,
            },
        ],
        model="gpt-4-1106-preview",
        temperature=0.2,
        functions=[
            {
                "name": "get_build_info",
                "description": "Get definitions for o1js modules or functions",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "modules": {
                            "type": "array",
                            "description": "The query to search for. 1-3 sentences are enough. English only.",
                            "items": {
                                "type": "string",
                                "description": "Name of the module or function or class",
                            },
                        },
                    },
                },
                "required": ["modules"],
            }
        ],
        function_call={"name": "get_build_info"},
    )
    args = chat_completion.choices[0].message.function_call.arguments
    return loads(args)["modules"]


def query_modules_info(modules_info: dict, modules_to_query: list[str]):
    return "\n".join(
        [modules_info[module] for module in modules_to_query if module in modules_info]
    )


def get_modules_info(build_message: str):
    try:
        modules_info = load_modules_info()
        modules_to_query = parse_build_message(build_message)
        return query_modules_info(modules_info, modules_to_query)
    except Exception as e:
        return ""
