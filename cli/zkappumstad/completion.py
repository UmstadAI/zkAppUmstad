from openai import OpenAI
from zkappumstad.prompt import SYSTEM_PROMPT
from dotenv import load_dotenv, find_dotenv
import os

print(find_dotenv(".env.local"))
load_dotenv(find_dotenv(".env.local"))

if os.getenv("OPENAI_API_KEY"):
    client = OpenAI()
else:
    client = None


def create_completion(history, message):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *history,
                {"role": "user", "content": message},
            ],
            model="gpt-4-1106-preview",
            stream=True,
        )
        return chat_completion
    except Exception as e:
        print(e)
        return None
