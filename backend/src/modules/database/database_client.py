from src.models.Users import UserInternal
from src.modules.database.database_utils import db, user_collection


def get_user_db(email: str) -> UserInternal:
    user = user_collection.find_one({"email": email})
    return UserInternal(**user) if user else None


def create_user_db(user: UserInternal):
    user_collection.insert_one(user.dict())
