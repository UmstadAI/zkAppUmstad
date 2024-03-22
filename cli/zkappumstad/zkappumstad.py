import os
import uuid
import platform

from colorama import Fore, Style
from rich.console import Console
from zkappumstad.utils import fade_in_text
from zkappumstad.runner import create_completion
from zkappumstad.code_runner import code_runner, clean_code_tools
from zkappumstad.runners import StreamMessage, ToolMessage, StateChange
from zkappumstad.history_manager import ChatDB

chat_db = ChatDB("chat_db")

console = Console()


def startup():
    print(
        Fore.GREEN
        + """
    __   ___                        __  __               __            __
____  / /__/   |  ____  ____  _____   / / / /___ ___  _____/ /_____ _____/ /
/_  / / //_/ /| | / __ \/ __ \/ ___/  / / / / __ `__ \/ ___/ __/ __ `/ __  / 
/ /_/ ,< / ___ |/ /_/ / /_/ (__  )  / /_/ / / / / / (__  ) /_/ /_/ / /_/ /  
/___/_/|_/_/  |_/ .___/ .___/____/   \____/_/ /_/ /_/____/\__/\__,_/\__,_/   
            /_/   /_/                                                                                                                                                                                                                   
        """
        + Style.RESET_ALL
    )

    fade_in_text("Welcome to zkApp Umstad!", "bold green")
    fade_in_text(
        "This is an AI assistant that helps you with Mina zkApps development.",
        "bold green",
    )
    fade_in_text("Type 'load' to load a previous conversation", "bold blue")
    fade_in_text("Type 'save' to save your conversation", "bold blue")
    fade_in_text("Type 'reset' to reset conversation", "bold blue")
    fade_in_text("Type 'quit' to exit.", "bold red")


def clear_screen():
    command = "cls" if platform.system().lower() == "windows" else "clear"
    os.system(command)


def save_conversation_to_markdown(markdown_history: list):
    filename = f"conversation_{uuid.uuid4()}.md"

    with open(filename, "w") as file:
        for line in markdown_history:
            file.write(line + "\n")
    print(Fore.GREEN + "Conversation saved to " + filename + Style.RESET_ALL)


def save_conversation_history(history: list):
    chat_id = str("0")
    chat_db.add_chat(chat_id, history)
    print(Fore.GREEN + "Conversation saved with ID: " + chat_id + Style.RESET_ALL)


def load_conversation_history():
    chat_id = str("0")
    history = chat_db.get_chat(chat_id)
    print(Fore.GREEN + "Conversation loaded with ID: " + chat_id + Style.RESET_ALL)
    return history


def main():

    startup()

    history = []
    markdown_history = []

    state: int = 0
    user_message: str = ""
    while True:
        if state == 0:
            user_message = input(Fore.BLUE + "\nYou: " + Style.RESET_ALL)
            markdown_history.append(f"**You**: {user_message}")

        if user_message.lower() == "quit":
            break
        elif user_message.lower() == "load":
            history = load_conversation_history()
            continue
        elif user_message.lower() == "save":
            save_conversation_to_markdown(markdown_history)
            save_conversation_history(history)
            continue
        elif user_message.lower() == "reset":
            history.clear()
            markdown_history.clear()
            clear_screen()
            startup()
            continue

        completion = (
            create_completion(history, user_message)
            if state == 0
            else code_runner(history, max_iterations=5)
        )
        if completion is None:
            print("[bold red]Sorry, I didn't understand that.[/bold red]")
            continue

        response_text = ""
        for part in completion:
            if isinstance(part, StreamMessage):
                print(part.message or "", end="")
                response_text += part.message or ""
            elif isinstance(part, ToolMessage):
                fade_in_text(part.message, "bold blue")
                response_text += part.message
            elif isinstance(part, StateChange):
                state = part.new_state
                history = clean_code_tools(history)

        print()
        markdown_history.append(f"**Umstad:** {response_text} \n")


def help():
    print("Usage: zkumstad-[command]")
    print("Commands:")
    print("  start    Start the application")
    print("  help     Display this help message")
    print("  create   Creates zkapps project in current folder")


if __name__ == "__main__":
    main()
