from openai import OpenAI
from zkappumstad.prompt import SYSTEM_PROMPT
from dotenv import load_dotenv, find_dotenv
from openai.types.chat import ChatCompletion
from openai._streaming import Stream
from typing import Generator, str
from json import loads

print(find_dotenv(".env.local"))
load_dotenv(find_dotenv(".env.local"))
client = OpenAI()
function_description = {
    "name": "get_current_weather",
    "description": "Get the current weather in a given location",
    "parameters": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA",
            },
            "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
        },
        "required": ["location"],
    },
}

function_messages = {"get_current_weather": "Fetching the weather data...\n"}


def create_completion(history, message) -> Generator[str]:
    while True:
        try:
            history = history + [{"role": "user", "content": message}]
            chat_completion: Stream[ChatCompletion] = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    *history,
                ],
                model="gpt-4-1106-preview",
                stream=True,
                functions=[function_description],
            )
            part = chat_completion.__next__()
            if "name" in part.choices[0].delta.function_call:
                yield function_messages[part.choices[0].delta.function_call.name]
                args = "".join(
                    list(
                        part.choices[0].delta.function_call.args
                        for part in chat_completion
                    )
                )
                # args = loads(args)
                result = args
                history = history + [{"role": "assistant", "content": result}]
                continue
            for part in chat_completion:
                yield part.choices[0].delta.function_call or ""
        except Exception as e:
            print(e)
            return None


if __name__ == "__main__":
    create_completion([], "What's the weather in San Francisco?")
