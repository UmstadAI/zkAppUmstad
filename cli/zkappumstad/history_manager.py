"""
Module for managing chat history in local file system based database.
"""

import shelve
import os
from typing import List, Dict
import inquirer


def select(histories: List[str]) -> str:
    questions = [
        inquirer.List(
            "chat",
            message="Choose a chat to load using enter",
            choices=histories,
        ),
    ]
    answers = inquirer.prompt(questions)
    return answers["chat"]


class ChatDB:
    def __init__(self, db_path: str):
        self.db_path = db_path
        if not os.path.exists(db_path):
            os.makedirs(db_path)
        self.index_file = os.path.join(db_path, "index")

    def add_chat(self, chat_id: str, chat_history: List[Dict]):
        """
        Adds a new chat history to the database.

        :param chat_id: A unique identifier for the chat session.
        :param chat_history: A list of dictionaries, each representing a part of the chat history.
        """
        with shelve.open(self.index_file) as index_db:
            index_db[chat_id] = chat_history

    def get_chat(self, chat_id: str) -> List[Dict]:
        """
        Retrieves a chat history by its ID.

        :param chat_id: The unique identifier for the chat session.
        :return: A list of dictionaries representing the chat history.
        """
        with shelve.open(self.index_file) as index_db:
            return index_db.get(chat_id, [])

    def update_chat(self, chat_id: str, new_state: List[Dict]):
        """
        Updates an existing chat history in the database.

        :param chat_id: The unique identifier for the chat session to be updated.
        :param new_state: A list of dictionaries representing the new chat history.
        """
        with shelve.open(self.index_file, writeback=True) as index_db:
            index_db[chat_id] = new_state

    def delete_chat(self, chat_id: str):
        """
        Deletes a chat history from the database.

        :param chat_id: The unique identifier for the chat session to be deleted.
        """
        with shelve.open(self.index_file, writeback=True) as index_db:
            if chat_id in index_db:
                del index_db[chat_id]

    def list_chats(self) -> List[str]:
        """
        Lists all chat IDs stored in the database.

        :return: A list of chat IDs.
        """
        with shelve.open(self.index_file) as index_db:
            return list(index_db.keys())

    def add_message(self, chat_id: str, message: Dict):
        """
        Adds a new message to a chat history.

        :param chat_id: The unique identifier for the chat session.
        :param message: A dictionary representing the new message to be added.
        """
        with shelve.open(self.index_file, writeback=True) as index_db:
            if chat_id in index_db:
                index_db[chat_id].append(message)
            else:
                index_db[chat_id] = [message]

    def load_chat(self) -> List[Dict]:
        """
        Loads a chat history from the database, let the user select which chat to load.

        :return: A list of dictionaries representing the chat history.
        """
        with shelve.open(self.index_file) as index_db:
            chat_ids = list(index_db.keys())
            if not chat_ids or len(chat_ids) == 0:
                return [], ""
            chat_id = select(chat_ids)
            return index_db.get(chat_id, []), chat_id


if __name__ == "__main__":
    mock_histories = ["chat1", "chat2", "chat3"]
    selected_chat_id = select(mock_histories)
    print(selected_chat_id)
