from openai import OpenAI
from .base import BaseEvaluable


class OpenAIEvaluable(BaseEvaluable):
    def __init__(self, api_key: str, model: str = "gpt-3.5-turbo"):
        super().__init__()
        self.client = OpenAI(api_key=api_key)
        self.model = model

    def evaluate(self, message) -> str:
        chat_completion = self.client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": message,
                }
            ],
            model=self.model,
        )
        return chat_completion.choices[0].message.content
