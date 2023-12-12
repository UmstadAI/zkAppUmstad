import time
from colorama import Fore, Style
from rich.text import Text
from rich.console import Console
from rich.markup import escape
from rich.progress import SpinnerColumn, Progress

console = Console()


def fade_in_text(text, color, sleep_time=0.01, end_sleep_time=0.3):
    styled_text = Text()
    for char in text:
        styled_text.append(char, style=color)
        console.print(styled_text, end="\r")
        time.sleep(sleep_time)
    time.sleep(end_sleep_time)
    console.print(styled_text)
