from typing import Union

from pydantic import BaseModel


class User(BaseModel):
    username: str
    email: Union[str, None] = None
    full_name: Union[str, None] = None


class UserInternal(User):
    hashed_password: str
    disabled: bool = False


class UserExport(User):
    pass
