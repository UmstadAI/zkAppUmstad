from dataclasses import dataclass
from typing import Literal


@dataclass
class StreamMessage:
    """
    Used to yield messages to be streamed
    """

    message: str
    message_type: Literal["STREAM_MESSAGE"]


@dataclass
class ToolMessage:
    """
    Used to yield messages to be viewed that indicate a tool is being used
    """

    message: str
    message_type: Literal["TOOL_MESSAGE"]


@dataclass
class StateChange:
    """
    Used to change the state of the runner, which changes the prompt and tools
    """

    new_state: int
    message_type: Literal["STATE_CHANGE"]


RunnerMessage = StreamMessage | ToolMessage | StateChange
