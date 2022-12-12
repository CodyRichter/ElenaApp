from typing import List

from src.models.Navigation import NavigationHistoryInstance
from src.models.Users import UserInternal
from src.modules.database.database_utils import (
    db,
    navigation_history_collection,
    user_collection,
)


def get_user_db(email: str) -> UserInternal:
    """
    Get user from database.

    :param email: str User's email
    :return: UserInternal User Data
    """
    user = user_collection.find_one({"email": email})
    return UserInternal(**user) if user else None


def create_user_db(user: UserInternal):
    """
    Create user in database.
    """
    user_collection.insert_one(user.dict())


def save_navigation_history_db(nav_history: NavigationHistoryInstance):
    """
    Save navigation history to database.
    """
    navigation_history_collection.insert_one(nav_history.dict())


def get_navigation_history_db(email: str) -> List[NavigationHistoryInstance]:
    """
    Get all navigation history instances from database for a user

    :param email: str User's email
    :return: UserInternal User Data
    """
    instances = navigation_history_collection.find({"email": email})
    return [NavigationHistoryInstance(**instance) for instance in instances]
