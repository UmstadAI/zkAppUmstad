from dotenv import load_dotenv
import os
from openai import OpenAI
from json import loads

load_dotenv(".env.local")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)


def evaluate_results(question: str, answer: str, expected: str) -> float:
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "SYSTEM",
                "content": "Given a set of questions and answers, evaluate the answer using the expected answer as a reference.",
            },
            {
                "role": "user",
                "content": f"""
Question: {question}
Answer: {answer}
Expected: {expected}
""".strip(),
            },
        ],
        model="gpt-3.5-turbo",
        functions=[
            {
                "name": "report_answer",
                "description": "Report the score of the answer. Between 0 and 1. Evaluate it first. Partial credit is allowed.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "evaluation": {
                            "type": "string",
                            "description": "Your comments on compliance with the expected answer.",
                        },
                        "score": {
                            "type": "number",
                            "description": "Your score for the answer. Between 0 and 1.",
                        },
                    },
                    "required": ["evaluation", "score"],
                },
            }
        ],
        function_call={"name": "report_answer"},
    )
    args = chat_completion.choices[0].message.function_call.arguments
    args = loads(args)
    score = float(args["score"])
    return score
