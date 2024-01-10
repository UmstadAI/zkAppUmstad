from typing import Generator
from json import loads
from colorama import Fore, Style

from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
from zkappumstad.runners import ToolMessage, StateChange

from zkappumstad.tools import (
    Tool,
    writer_tool,
    reader_tool,
    read_reference_tool,
    code_tool,
    command_tool,
    prd_tool,
    issue_tool,
    doc_tool,
    get_modules_info,
)
from zkappumstad.code_runner_prompt import SYSTEM_PROMPT

load_dotenv(find_dotenv(".env.local"), override=True)

client = OpenAI()
tools: dict[str, Tool] = {
    tool.name: tool
    for tool in [
        code_tool,
        writer_tool,
        reader_tool,
        read_reference_tool,
    ]
}


def fetch_code_context(history):
    """
    Fetch code context query built by gpt-4, using the message history.
    """
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *history,
            ],
            model="gpt-4-1106-preview",
            temperature=0.2,
            functions=[code_tool.description],
            function_call={"name": code_tool.name},
        )
        args = chat_completion.choices[0].message.function_call.arguments
        history.append(
            {
                "role": "assistant",
                "content": None,
                "function_call": {"name": code_tool.name, "arguments": args},
            }
        )
        args = loads(args)
        code_context = code_tool.function(**args)
        history.append(
            {
                "role": "function",
                "name": code_tool.name,
                "content": code_context,
            }
        )
        return ToolMessage("Code context fetched.", "TOOL_MESSAGE")
    except Exception as e:
        return ToolMessage("Error fetching code context.", "TOOL_MESSAGE")


def read_references(history):
    """
    If haven't read reference repo, read it.
    """
    try:
        if any(
            [
                message["role"] == "function"
                and message["name"] == read_reference_tool.name
                for message in history
            ]
        ):
            return
        reference = read_reference_tool.function()
        history.append(
            {
                "role": "assistant",
                "content": None,
                "function_call": {"name": read_reference_tool.name, "arguments": "{}"},
            }
        )
        history.append(
            {
                "role": "function",
                "name": read_reference_tool.name,
                "content": reference,
            }
        )
        return ToolMessage("Reference codes read.", "TOOL_MESSAGE")
    except Exception as e:
        return ToolMessage("Error reading reference codes.", "TOOL_MESSAGE")


def write_code_or_test(history, file_type="CONTRACT"):
    """
    Write code using the writer tool.
    """
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *history,
                {"role": "user", "content": "Write " + file_type.lower()},
            ],
            model="gpt-4-1106-preview",
            temperature=0.2,
            functions=[writer_tool.description],
            function_call={"name": writer_tool.name},
        )
        args = chat_completion.choices[0].message.function_call.arguments
        history.append(
            {
                "role": "assistant",
                "content": None,
                "function_call": {"name": writer_tool.name, "arguments": args},
            }
        )
        args = loads(args)
        code = writer_tool.function(**args)
        history.append(
            {
                "role": "function",
                "name": writer_tool.name,
                "content": code,
            }
        )
        return ToolMessage(f"Code written to {args['contract_name']}", "TOOL_MESSAGE")
    except Exception as e:
        print(e)
        return ToolMessage("Error writing code.", "TOOL_MESSAGE")


def build_code(history):
    std_out, std_err = command_tool.function(command_type="BUILD")
    if not std_err and "error" not in std_out.lower():
        return True
    history.append(
        {
            "role": "assistant",
            "content": None,
            "function_call": {"name": command_tool.name, "arguments": "{}"},
        }
    )
    history.append(
        {
            "role": "function",
            "name": command_tool.name,
            "content": std_out,
        }
    )

    return False


def prepare_prd(history):
    """
    Prepare PRD using the prd tool.
    """
    try:
        message = prd_tool.function(history=history)
        writer_tool.function("", message, "README")
        print(Fore.GREEN + message + Style.RESET_ALL)
        history.append(
            {
                "role": "assistant",
                "content": None,
                "function_call": {"name": prd_tool.name, "arguments": "{}"},
            }
        )
        history.append(
            {
                "role": "function",
                "name": prd_tool.name,
                "content": message,
            }
        )
        return ToolMessage("Prepared Requirements for zkApp", "TOOL_MESSAGE")
    except Exception as e:
        return ToolMessage("Error preparing PRD.", "TOOL_MESSAGE")


def create_query_and_search(history):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a developer in the company. Check the message history written code and last build output. Then If you need to make a query on issues or documentation, you can use the following tools.",
                },
                *history,
            ],
            model="gpt-4-1106-preview",
            temperature=0.2,
            functions=[
                {
                    "name": "create_query",
                    "description": "Search for issues on Github and official documentations of Mina and o1js.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "issues_query": {
                                "type": "string",
                                "description": "The query to search for. 1-3 sentences are enough. English only.",
                            },
                            "documentation_query": {
                                "type": "string",
                                "description": "The query to search for. 1-3 sentences are enough. English only.",
                            },
                        },
                    },
                }
            ],
            function_call={"name": "create_query"},
        )
        args = chat_completion.choices[0].message.function_call.arguments
        history.append(
            {
                "role": "assistant",
                "content": None,
                "function_call": {"name": "create_query", "arguments": args},
            }
        )
        args = loads(args)
        response = ""
        issues_query = args.get("issues_query", None)
        if issues_query:
            response += issue_tool.function(query=issues_query)
        documentation_query = args.get("documentation_query", None)
        if documentation_query:
            response += "\n" + doc_tool.function(query=documentation_query)
        if response == "":
            response = "No relevant issues on Github or documentation found."
        history.append(
            {
                "role": "function",
                "name": "create_query",
                "content": response,
            }
        )
        return ToolMessage("Query created.", "TOOL_MESSAGE")
    except Exception as e:
        print(e)
        return ToolMessage("Error creating query.", "TOOL_MESSAGE")


CODE_TOOLS = set([code_tool.name, writer_tool.name, reader_tool.name])


def clean_code_tools(history):
    """
    Remove code tool messages from history.
    """
    return [
        message
        for message in history
        if not (
            (message["role"] == "function" and message["name"] in CODE_TOOLS)
            or (
                message["role"] == "assistant"
                and message["function_call"]["name"] in CODE_TOOLS
            )
        )
    ]


def add_modules_info(history, build_message: str):
    """
    Add modules info to history.
    """
    modules_info = get_modules_info(build_message)
    # print(modules_info)
    history.append(
        {
            "role": "assistant",
            "content": None,
            "function_call": {"name": "get_modules_info", "arguments": "{}"},
        }
    )
    history.append(
        {
            "role": "function",
            "name": "get_modules_info",
            "content": modules_info,
        }
    )


def clear_modules_info(history: list[any]):
    """
    Clear modules info from history.
    """
    module_info_messages = [
        message
        for message in history
        if (message["role"] == "function" and message["name"] == "get_modules_info")
        or (
            message["role"] == "assistant"
            and message["function_call"]["name"] == "get_modules_info"
        )
    ]
    for message in module_info_messages:
        history.remove(message)


def move_ref_tool_to_end(history: list[any]):
    """
    Move read_reference_tool to the end of the history.
    """
    ref_tool = [
        message
        for message in history
        if message["role"] == "function" and message["name"] == read_reference_tool.name
    ]
    ref_tool_call = [
        message
        for message in history
        if message["role"] == "assistant"
        and message["function_call"]
        and message["function_call"]["name"] == read_reference_tool.name
    ]
    if ref_tool_call:
        history.remove(ref_tool_call[0])
        history.remove(ref_tool[0])
        history.append(ref_tool_call[0])
        history.append(ref_tool[0])
    return history


def code_runner(history: list[any], max_iterations=3) -> Generator[str, None, None]:
    yield fetch_code_context(history)
    yield read_references(history)
    # yield prepare_prd(history)
    for i in range(max_iterations):
        yield write_code_or_test(history, file_type="CONTRACT")
        build_success = build_code(history)
        if not build_success:
            yield ToolMessage(
                "Build failed" + ("retrying" if i < max_iterations - 1 else ""),
                "TOOL_MESSAGE",
            )
            clear_modules_info(history)
            add_modules_info(history, build_message=history[-1]["content"])
            yield create_query_and_search(history)
            move_ref_tool_to_end(history)
        else:
            yield ToolMessage("Build succeeded", "TOOL_MESSAGE")
            yield write_code_or_test(history, file_type="TEST")
            yield ToolMessage("Test written", "TOOL_MESSAGE")
            break
    else:
        yield ToolMessage(
            f"Couldn't complete the contract after {max_iterations} tries.",
            "TOOL_MESSAGE",
        )
    yield StateChange(0, "STATE_CHANGE")


if __name__ == "__main__":
    code_runner([])
