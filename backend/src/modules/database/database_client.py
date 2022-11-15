from src.models.Users import UserInternal
from src.modules.database.database_utils import db, user_collection


def get_user(username: str) -> UserInternal:
    user = user_collection.find_one({"username": username})
    return user
