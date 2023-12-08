import time
from colorama import Fore, Style
from rich.text import Text
from rich.console import Console
from rich.markup import escape
from rich.progress import SpinnerColumn, Progress
from zkappumstad.runner import create_completion

console = Console()
from zkappumstad.runner import create_completion

def fade_in_text(text, color, sleep_time=0.01, end_sleep_time=0.3):
    styled_text = Text()
    for char in text:
        styled_text.append(char, style=color)
        console.print(styled_text, end="\r")
        time.sleep(sleep_time)
    time.sleep(end_sleep_time)
    console.print(styled_text)

print(Fore.GREEN + """"
        __   ___                   __  __               __            __
 ____  / /__/   |  ____  ____     / / / /___ ___  _____/ /_____ _____/ /
/_  / / //_/ /| | / __ \/ __ \   / / / / __ `__ \/ ___/ __/ __ `/ __  / 
 / /_/ ,< / ___ |/ /_/ / /_/ /  / /_/ / / / / / (__  ) /_/ /_/ / /_/ /  
/___/_/|_/_/  |_/ .___/ .___/   \____/_/ /_/ /_/____/\__/\__,_/\__,_/   
               /_/   /_/                                                                                                                                     
      """ + Style.RESET_ALL)

fade_in_text("Welcome to zkApp Umstad!", "bold green")
fade_in_text("This is an AI assistant that helps you with Mina zkApps development.", "bold green")
fade_in_text("Type 'quit' to exit.", "bold green")


history = []
while True:
    message = input(Fore.BLUE + "You: " + Style.RESET_ALL)
    if message == "quit":
        break
    completion = create_completion(history, message)
    if completion is None:
        print("[bold red]Sorry, I didn't understand that.[/bold red]")
        continue

    for part in completion:
        print(part or "", end="")
    print()
