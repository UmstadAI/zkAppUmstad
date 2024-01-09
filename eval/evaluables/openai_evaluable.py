from openai import OpenAI
from .base import BaseEvaluable


class OpenAIEvaluable(BaseEvaluable):
    def __init__(self, api_key: str):
        super().__init__()
        self.client = OpenAI(api_key=api_key)

    def evaluate(self, message) -> str:
        chat_completion = self.client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": "Say this is a test",
                }
            ],
            model="gpt-3.5-turbo",
        )
        return chat_completion.choices[0].message.content
