from datetime import datetime, timedelta

from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from src.models.Constants import (
    AUTH_ACCESS_TOKEN_EXPIRE_MINUTES,
    AUTH_ALGORITHM,
    AUTH_SECRET_KEY,
)
from src.models.Exceptions import CredentialException
from src.models.Tokens import TokenData
from src.models.Users import UserInternal
from src.modules.database.database_client import get_user_db

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "adc247dc6240d79df1875097199a3fdb5607213179358cc5f773f9f55da92f14"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(email: str, password: str):
    user: UserInternal = get_user_db(email)
    if user and verify_password(password, user.hashed_password):
        return user
    return None


def create_access_token(data: dict):
    data_to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=AUTH_ACCESS_TOKEN_EXPIRE_MINUTES)
    data_to_encode.update({"exp": expire})
    return jwt.encode(data_to_encode, AUTH_SECRET_KEY, algorithm=AUTH_ALGORITHM)


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, AUTH_SECRET_KEY, algorithms=[AUTH_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise CredentialException
        token_data = TokenData(email=email)
    except JWTError:
        raise CredentialException

    user = get_user_db(token_data.email)
    if not user or user.disabled:
        raise CredentialException
    return user
