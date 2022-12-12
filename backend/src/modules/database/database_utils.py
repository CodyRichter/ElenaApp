from pymongo import MongoClient

from src.models.Constants import MONGO_URI

client = MongoClient(MONGO_URI, 27017)
db = client["elena_db"]
user_collection = db["users"]  # Create collection for users in database
navigation_history_collection = db[
    "routes"
]  # Create collection for navigation routes in database
