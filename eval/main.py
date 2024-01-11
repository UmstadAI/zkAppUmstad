import csv
from dotenv import load_dotenv
import os
import argparse
from evaluables import OpenAIEvaluable, BaseEvaluable, UmstadEvaluable
from evaluate_results import evaluate_results_gpt
from datetime import datetime
from tqdm import tqdm

load_dotenv(".env.local")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def read_eval_data(eval_data_path: str):
    with open(eval_data_path, "r", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            yield row


def append_to_eval_output(
    eval_output_path: str, question: str, answer: str, expected: str, latency: float
):
    if not os.path.exists(eval_output_path):
        with open(eval_output_path, "w", encoding="utf-8") as csvfile:
            writer = csv.DictWriter(
                csvfile, fieldnames=["question", "answer", "expected", "latency"]
            )
            writer.writeheader()
            writer.writerow(
                {
                    "question": question,
                    "answer": answer,
                    "expected": expected,
                    "latency": latency,
                }
            )
        return
    with open(eval_output_path, "a", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(
            csvfile, fieldnames=["question", "answer", "expected", "latency"]
        )
        writer.writerow(
            {
                "question": question,
                "answer": answer,
                "expected": expected,
                "latency": latency,
            }
        )


def main(
    evaluable: BaseEvaluable,
    eval_data_path: str,
    save_results: bool = True,
    evaluate_results: bool = False,
    eval_class: str = "openai",
):
    os.makedirs("eval_output", exist_ok=True)
    eval_output_path = f"eval_output/{eval_class}.csv"
    if save_results:
        total_rows = 0
        total_latency = 0
        print("Fetching results from", eval_class)
        rows = list(read_eval_data(eval_data_path))
        for row in tqdm(rows):
            question = row["question"]
            now = datetime.now()
            answer = evaluable(question)
            latency = (datetime.now() - now).microseconds
            total_rows += 1
            total_latency += latency
            expected = row["expected"]
            append_to_eval_output(eval_output_path, question, answer, expected, latency)
        print("Average latency:", total_latency / total_rows, "microseconds")
    if evaluate_results:
        print("Evaluating results from", eval_class)
        total_rows = 0
        total_score = 0
        rows = list(read_eval_data(eval_output_path))
        for row in tqdm(rows):
            question = row["question"]
            answer = row["answer"]
            expected = row["expected"]
            score = evaluate_results_gpt(question, answer, expected)
            total_rows += 1
            total_score += score
        print("Accuracy:", total_score / total_rows * 100, "%")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--eval_class",
        type=str,
        default="openai",
        help="openai or umstad or gpt-4",
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
    evaluable = None
    if args.eval_class == "openai":
        evaluable = OpenAIEvaluable(api_key=OPENAI_API_KEY)
    elif args.eval_class == "gpt-4":
        evaluable = OpenAIEvaluable(api_key=OPENAI_API_KEY, model="gpt-4-1106-preview")
    elif args.eval_class == "umstad":
        evaluable = UmstadEvaluable(api_key=OPENAI_API_KEY)
    if evaluable is None:
        print("Invalid evaluable class")
        exit(1)
    main(
        evaluable,
        args.data_path,
        save_results=args.save_results,
        evaluate_results=args.evaluate_results,
        eval_class=args.eval_class,
    )
