# README for the Evaluation Script

## Overview
This Python script is designed for evaluating different AI models' performance on a set of predefined questions and answers. The script supports models like OpenAI's GPT and custom models like 'Umstad'. It measures response accuracy and latency, providing insights into the model's effectiveness and efficiency.

## Features
- **Multiple Evaluables Support**: Ability to evaluate different models including OpenAI's models and custom models.
- **Performance Metrics**: Calculates the average latency and accuracy of the responses.
- **Data Management**: Reads evaluation data and appends results to an output file for further analysis.
- **Environment Variables Support**: Uses `.env.local` file for API keys.

## Prerequisites
- Python 3.x
- Required Python packages:
  - `csv` for file operations.
  - `dotenv` for loading environment variables.
  - `os` and `argparse` for file path and argument parsing.
  - `datetime` and `tqdm` for performance timing and progress bar display.

## Usage
1. **Setup**:
   - Place your API key in the `.env.local` file.
   - Install the required Python packages.

2. **Preparing Evaluation Data**:
   - The evaluation data should be in a CSV format with columns for 'question' and 'expected' answer.

3. **Running the Script**:
   - Execute the script using the command line.
   - Optional arguments:
     - `--eval_class`: Specify the evaluation model class ('openai', 'umstad', or 'gpt-4').
     - `--data_path`: Path to the evaluation data CSV file.
     - `--save_results`: Flag to save the results.
     - `--evaluate_results`: Flag to evaluate the saved results.

4. **Output**:
   - Results are saved in the `eval_output` directory in CSV format.
   - Displays average latency and accuracy in the console.

## Example Command
```bash
python3 script_name.py --eval_class openai --data_path data/eval_data.csv --save_results --evaluate_results
```

This will evaluate the OpenAI model using questions from `data/eval_data.csv`, save the results, and then evaluate these results.

## Note
- Ensure the evaluation data file and `.env.local` are correctly set up before running the script.
- The script can be modified to add support for additional models or different evaluation metrics.