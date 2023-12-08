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
fade_in_text("Type 'quit' to exit.", "bold green")


history = []
while True:
    message = input(Fore.BLUE + "\nYou: " + Style.RESET_ALL)
    if message == "quit":
        break
    completion = create_completion(history, message)
    if completion is None:
        print("[bold red]Sorry, I didn't understand that.[/bold red]")
        continue

    for part in completion:
        print(part or "", end="")
    print()
