import os

AUTH_SECRET_KEY = os.getenv("AUTH_SECRET")
AUTH_ALGORITHM = "HS256"
AUTH_ACCESS_TOKEN_EXPIRE_MINUTES = 30

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

ELEVATION_URI = os.getenv("ELEVATION_API", "http://localhost:680/api/v1/lookup")