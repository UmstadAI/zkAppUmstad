import csv
from dotenv import load_dotenv
import os
import argparse
from evaluables import OpenAIEvaluable, BaseEvaluable
from evaluate_results import evaluate_results

load_dotenv(".env.local")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def read_eval_data(eval_data_path: str):
    with open(eval_data_path, "r", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        print(reader.fieldnames)
        for row in reader:
            yield row


def main(
    evaluable: BaseEvaluable,
    eval_data_path: str,
    save_results: bool = True,
    evaluate_results: bool = False,
    eval_class: str = "openai",
):
    eval_output_path = f"data/eval_output_{eval_class}.csv"
    if save_results:
        for row in read_eval_data(eval_data_path):
            print(row)
            question = row["question"]
            print("Input:", question)
            print("Output:", evaluable(question))
            print("Expected:", row["expected"])
            print()
            break
    if evaluate_results:
        for row in read_eval_data(eval_output_path):
            question = row["question"]
            answer = row["answer"]
            expected = row["expected"]
            score = evaluate_results(question, answer, expected)
            print("Score:", score)
            print()
            break


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--eval_class", type=str, default="openai", help="openai or umstad"
    )
    parser.add_argument("--data_path", type=str, default="data/eval_data.csv")
    parser.add_argument(
        "--save_results",
        action="store_true",
        default=True,
        help="Whether to get and save results from that evaluable",
    )
    parser.add_argument(
        "--evaluate_results",
        action="store_true",
        default=False,
        help="Whether to evaluate results from that evaluable",
    )
    args = parser.parse_args()
    main(
        OpenAIEvaluable(api_key=OPENAI_API_KEY),
        args.data_path,
        save_results=args.save_results,
        evaluate_results=args.evaluate_results,
    )
