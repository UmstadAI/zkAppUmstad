from zkappumstad.code_runner import clean_code_tools, move_ref_tool_to_end

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


def test_move_ref_tool_to_end_unchanged():
    """Test that read_reference_tool is moved to the end of the history"""
    history = [
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
            "function_call": {"name": "read_reference_tool", "arguments": {}},
        },
        {
            "role": "function",
            "name": "read_reference_tool",
            "content": "code in a file",
        },
    ]
    expected_history = [
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
            "function_call": {"name": "read_reference_tool", "arguments": {}},
        },
        {
            "role": "function",
            "name": "read_reference_tool",
            "content": "code in a file",
        },
    ]
    assert move_ref_tool_to_end(history) == expected_history


def test_move_ref_tool_to_end_changed():
    """Test that read_reference_tool is moved to the end of the history"""
    history = [
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
            "function_call": {"name": "read_reference_repo", "arguments": {}},
        },
        {
            "role": "function",
            "name": "read_reference_repo",
            "content": "code in a file",
        },
        {"role": "user", "content": "Explain me the code"},
        {
            "role": "assistant",
            "content": "yes I can",
        },
    ]
    expected_history = [
        {"role": "system", "content": "You are a Mina Agent"},
        {"role": "user", "content": "What is a Mina Agent?"},
        {
            "role": "assistant",
            "content": "A Mina Agent is a program that knows everything about Mina",
        },
        {"role": "user", "content": "Show me an example"},
        {"role": "user", "content": "Explain me the code"},
        {
            "role": "assistant",
            "content": "yes I can",
        },
        {
            "role": "assistant",
            "content": None,
            "function_call": {"name": "read_reference_repo", "arguments": {}},
        },
        {
            "role": "function",
            "name": "read_reference_repo",
            "content": "code in a file",
        },
    ]
    assert move_ref_tool_to_end(history) == expected_history
