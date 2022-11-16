from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from src.models.Exceptions import CredentialException
from src.models.Tokens import Token
from src.models.Users import UserCreate, UserExport, UserInternal
from src.modules.auth.auth_utils import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_password_hash,
)
from src.modules.database.database_client import create_user_db, get_user_db

auth_router = APIRouter()


@auth_router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise CredentialException
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@auth_router.post("/register", response_model=UserExport)
async def register_user(user_create: UserCreate):
    new_user = UserInternal(
        **user_create.dict(), hashed_password=get_password_hash(user_create.password)
    )
    existing_user: UserInternal = get_user_db(new_user.email)
    if existing_user:
        raise CredentialException

    create_user_db(new_user)
    return new_user


@auth_router.get("/profile", response_model=UserExport)
async def get_current_user(current_user: UserInternal = Depends(get_current_user)):
    return current_user
