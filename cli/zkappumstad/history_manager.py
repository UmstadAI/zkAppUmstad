"""
Module for managing chat history in local file system based database.
"""

import shelve
import os
from typing import List, Dict


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

    def update_chat(self, chat_id: str, new_message: Dict):
        """
        Updates a chat history by adding a new message to it.

        :param chat_id: The unique identifier for the chat session.
        :param new_message: A dictionary representing the new message to be added.
        """
        with shelve.open(self.index_file, writeback=True) as index_db:
            if chat_id in index_db:
                index_db[chat_id].append(new_message)
            else:
                index_db[chat_id] = [new_message]

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
