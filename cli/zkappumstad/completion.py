from openai import OpenAI
from zkappumstad.prompt import SYSTEM_PROMPT
from dotenv import load_dotenv, find_dotenv

print(find_dotenv(".env.local"))
load_dotenv(find_dotenv(".env.local"))
client = OpenAI()


def create_completion(history, message):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *history,
                {"role": "user", "content": message},
            ],
            model="gpt-3.5-turbo",
            stream=True,
        )
        return chat_completion
    except Exception as e:
        print(e)
        return None
