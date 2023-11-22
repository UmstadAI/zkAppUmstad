from zkappumstad.runner import create_completion


print("Welcome to Zkappumstad!")
print("This is an AI assistant that helps you with Mina development.")
print("Type 'quit' to exit.")

history = []
while True:
    message = input("You: ")
    if message == "quit":
        break
    completion = create_completion(history, message)
    if completion is None:
        print("Sorry, I didn't understand that.")
        continue

    for part in completion:
        print(part or "", end="")
    print()
