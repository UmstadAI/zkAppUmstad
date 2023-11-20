from zkappumstad.completion import create_completion


print("Welcome to Zkappumstad!")
print("This is an AI assistant that helps you with Mina development.")
print("Type 'quit' to exit.")

while True:
    message = input("You: ")
    if message == "quit":
        break

    completion = create_completion([], message)
    if completion is None:
        print("Sorry, I didn't understand that.")
        continue

    for part in completion.__stream__():
        print(part.choices[0].delta.content or "", end="")
    print()
