import os
import uuid
import platform

from colorama import Fore, Style
from rich.console import Console
from zkappumstad.utils import fade_in_text
from zkappumstad.runner import create_completion

console = Console()

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
fade_in_text("Type 'save' to save your conversation", "bold blue")
fade_in_text("Type 'reset' to reset conversation", "bold blue")
fade_in_text("Type 'quit' to exit.", "bold red")


history = []
markdown_history = []

def clear_screen():
    command = 'cls' if platform.system().lower()=="windows" else 'clear'
    os.system(command)

def save_conversation_to_markdown():
    filename = f"conversation_{uuid.uuid4()}.md"

    with open(filename, "w") as file:
        for line in markdown_history:
            file.write(line + "\n")
    print(Fore.GREEN + "Conversation saved to " + filename + Style.RESET_ALL)

while True:
    user_message = input(Fore.BLUE + "\nYou: " + Style.RESET_ALL)
    markdown_history.append(f"**You**: {user_message}")

    if user_message.lower() == "quit":
        break
    elif user_message.lower() == "save":
        save_conversation_to_markdown()
        continue
    elif user_message.lower() == "reset":
        history.clear()
        markdown_history.clear()
        clear_screen()
        continue

    completion = create_completion(history, user_message)
    if completion is None:
        print("[bold red]Sorry, I didn't understand that.[/bold red]")
        continue

    response_text = ""
    for part in completion:
        print(part or "", end="")
        response_text += part or ""

    print()
    markdown_history.append(f"**Umstad:** {response_text} \n")

