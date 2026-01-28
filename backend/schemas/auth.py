from pydantic import BaseModel, EmailStr, validator
from typing import List
import json

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    hobbies: List[str] = []

class LoginRequest(BaseModel):
    username_or_email: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    hobbies: List[str] = []

    # pydantic v2 uses `model_config` / `from_attributes` instead of orm_mode
    model_config = {"from_attributes": True}

    @validator('hobbies', pre=True, always=True)
    def parse_hobbies(cls, v):
        if isinstance(v, str):
            return json.loads(v) if v else []
        return v

from typing import Optional

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    current_password: Optional[str] = None
    hobbies: Optional[List[str]] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
