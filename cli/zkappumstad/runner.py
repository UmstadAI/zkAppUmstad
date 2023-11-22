from typing import Generator
from json import loads
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
from openai.types.chat import ChatCompletion
from openai._streaming import Stream
from zkappumstad.tools import run_tool
from zkappumstad.prompt import SYSTEM_PROMPT

print(find_dotenv(".env.local"))
load_dotenv(find_dotenv(".env.local"))
client = OpenAI()
function_description = {
    "name": "search_for_context",
    "description": "Search for context about any topic about Mina docs",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The query to search for",
            },
        },
        "required": ["query"],
    },
}

function_messages = {"search_for_context": "Fetching context about mina docs...\n"}


def create_completion(history, message) -> Generator[str, None, None]:
    while True:
        try:
            history.append({"role": "user", "content": message})
            chat_completion: Stream[ChatCompletion] = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    *history,
                ],
                model="gpt-4-1106-preview",
                stream=True,
                functions=[function_description],
                function_call="auto",
            )
            part = next(chat_completion)
            if part.choices[0].delta.function_call:
                function_name = part.choices[0].delta.function_call.name
                yield function_messages[part.choices[0].delta.function_call.name]
                args = "".join(
                    list(
                        part.choices[0].delta.function_call.arguments
                        for part in chat_completion
                        if part.choices[0].delta.function_call
                    )
                )
                history.append(
                    {
                        "role": "assistant",
                        "content": None,
                        "function_call": {"name": function_name, "arguments": args},
                    }
                )

                args = loads(args)
                result = run_tool(function_name, args)
                history.append(
                    {"role": "function", "name": function_name, "content": result}
                )
                continue
            yield part.choices[0].delta.content
            for part in chat_completion:
                yield part.choices[0].delta.content or ""
            break
        except Exception as e:
            print(e)
            print(e.with_traceback())
            return None


if __name__ == "__main__":
    create_completion([], "What's the weather in San Francisco?")
