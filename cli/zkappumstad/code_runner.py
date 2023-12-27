from typing import Generator
from json import loads

from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
from zkappumstad.runners import ToolMessage, StateChange

from zkappumstad.tools import (
    Tool,
    writer_tool,
    reader_tool,
    read_reference_tool,
    code_tool,
)
from zkappumstad.prompt import SYSTEM_PROMPT

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
            functions=[code_tool],
            function_call=code_tool.name,
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
        yield ToolMessage("Error fetching code context.", "TOOL_MESSAGE")


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


def write_code(history):
    """
    Write code using the writer tool.
    """
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *history,
            ],
            model="gpt-4-1106-preview",
            temperature=0.2,
            functions=[writer_tool],
            function_call=writer_tool.name,
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
        return ToolMessage(f"Code written to {args['filename']}", "TOOL_MESSAGE")
    except Exception as e:
        return ToolMessage("Error writing code.", "TOOL_MESSAGE")


def code_runner(history) -> Generator[str, None, None]:
    yield fetch_code_context(history)
    yield read_references(history)
    yield write_code(history)
    yield StateChange(0, "STATE_CHANGE")


if __name__ == "__main__":
    code_runner([])
