from .base import BaseEvaluable
from requests import session, Session


class UmstadEvaluable(BaseEvaluable):
    api_key: str
    session: Session

    def __init__(self, api_key: str):
        super().__init__()
        self.api_key = api_key
        self.session = session()

    def make_request(self, message: str) -> str:
        data = {
            "previewToken": self.api_key,
            "message": message,
        }
        response = self.session.post(
            "https://zkappsumstad.com/api/evalapi",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json=data,
            stream=True,
        )
        response_text = ""
        for chunk in response.iter_content(chunk_size=None):
            response_text += chunk.decode("utf-8")
        return response_text

    def evaluate(self, message) -> str:
        response = self.make_request(message)
        return response
