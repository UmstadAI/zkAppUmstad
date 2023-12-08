class Tool:
    def __init__(self, name, description, message, function):
        self.name = name
        self.description = description
        self.message = message
        self.function = function

    def __str__(self):
        return self.message

    def __repr__(self):
        return self.message
