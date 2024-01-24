from zkappumstad.code_runner import clean_code_tools

HISTORY_DATA_READER = [
    {"role": "system", "content": "You are a Mina Agent"},
    {"role": "user", "content": "What is a Mina Agent?"},
    {
        "role": "assistant",
        "content": "A Mina Agent is a program that knows everything about Mina",
    },
    {"role": "user", "content": "Show me an example"},
    {
        "role": "assistant",
        "content": None,
        "function_call": {"name": "read_code", "arguments": {}},
    },
    {"role": "function", "name": "read_code", "content": "code in a file"},
]
HISTORY_EXPECTED_READER = [
    {"role": "system", "content": "You are a Mina Agent"},
    {"role": "user", "content": "What is a Mina Agent?"},
    {
        "role": "assistant",
        "content": "A Mina Agent is a program that knows everything about Mina",
    },
    {"role": "user", "content": "Show me an example"},
]


def test_clean_code_tools():
    """Test that the code tools are cleaned properly"""
    history = clean_code_tools(HISTORY_DATA_READER)
    assert history == HISTORY_EXPECTED_READER
