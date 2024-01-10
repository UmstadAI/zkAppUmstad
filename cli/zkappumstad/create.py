import subprocess
import time


def run_zk_command():
    command = "zk project initial_project"

    process = subprocess.Popen(
        command,
        shell=True,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )

    time.sleep(1)
    process.stdin.write("\n")
    process.stdin.flush()

    time.sleep(2)
    process.stdin.write("\n")
    process.stdin.flush()

    time.sleep(2)
    process.stdin.write("\n")
    process.stdin.flush()

    time.sleep(1)
    process.stdin.write("\n")
    process.stdin.flush()

    time.sleep(1)
    process.stdin.write("\n")
    process.stdin.flush()

    output, error = process.communicate()

    return output, error


if __name__ == "__main__":
    output, error = run_zk_command()

    print("Output:", output)
    print("Error:", error) if error else None
