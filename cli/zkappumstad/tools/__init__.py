from json import dumps


def run_tool(name, args):
    return dumps({"name": name, "args": args}, indent=4)
