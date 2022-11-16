from typing import Union

from pydantic import BaseModel


class User(BaseModel):
    email: str
    full_name: Union[str, None] = None


class UserCreate(User):
    password: str


class UserInternal(User):
    hashed_password: str
    disabled: bool = False


class UserExport(User):
    pass
