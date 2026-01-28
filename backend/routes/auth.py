# Authentication Routes - Login and Signup stuff
# This file handles user accounts and security
# Learning about: FastAPI, databases, password hashing, JWT tokens!

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.models import user as auth_models
from backend.schemas import auth as schemas_auth
from backend.core.database import get_db, engine
from passlib.context import CryptContext  # this is for hashing passwords securely
from jose import jwt, JWTError  # JWT = JSON Web Tokens (learned in class!)
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import json
import hashlib

# Create all database tables when this file loads
# this is important or we get errors lol
auth_models.Base.metadata.create_all(bind=engine)

# Setup the router - this is like a mini app inside our main app
router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()  # this checks for Bearer tokens in headers

# Password hashing setup
# NOTE: using argon2 because it's more secure than bcrypt
# learned this from a security video on youtube
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Secret key for JWT tokens - this should be secret!
# TODO: change this in production!!!
SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-prod")
ALGORITHM = "HS256"  # this is the encryption algorithm

def get_password_hash(password: str) -> str:
    # this function takes a plain password and makes it secure
    # it uses hashing so nobody can read the original password
    print(f"Hashing password...")  # debug print
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # this checks if the password user typed matches the hashed one in database
    # returns True if match, False if wrong password
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    # this creates a JWT token for the user
    # the token proves they are logged in
    to_encode = data.copy()  # copy the data dict
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  # encode it
    print(f"Created token for user")  # debug
    return token

@router.post("/signup", response_model=schemas_auth.UserOut)
def signup(user: schemas_auth.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(auth_models.User).filter((auth_models.User.username == user.username) | (auth_models.User.email == user.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    db_user = auth_models.User(
        username=user.username,
        email=user.email,
        hashed_password=get_password_hash(user.password),
        hobbies=json.dumps(user.hobbies)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/logout")
def logout():
    # Since JWT is stateless, logout is handled client-side by removing the token
    # In a production app with refresh tokens, you might blacklist here
    return {"message": "Logged out successfully"}

@router.post("/login", response_model=schemas_auth.Token)
def login(form_data: schemas_auth.LoginRequest, db: Session = Depends(get_db)):
    # expect username/email + password
    user = db.query(auth_models.User).filter((auth_models.User.username == form_data.username_or_email) | (auth_models.User.email == form_data.username_or_email)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token({"sub": user.username, "id": user.id})
    return {"access_token": token, "token_type": "bearer"}

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """Dependency to extract user from a bearer token."""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.query(auth_models.User).filter(auth_models.User.username == username).first()
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@router.get("/me", response_model=schemas_auth.UserOut)
def get_me(current_user: auth_models.User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=schemas_auth.UserOut)
def update_me(update_data: schemas_auth.UserUpdate, current_user: auth_models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Allow users to update their username, email, password, and hobbies."""
    # username
    if update_data.username and update_data.username != current_user.username:
        existing = db.query(auth_models.User).filter(auth_models.User.username == update_data.username).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already registered")
        current_user.username = update_data.username

    # email
    if update_data.email and update_data.email != current_user.email:
        existing = db.query(auth_models.User).filter(auth_models.User.email == update_data.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        current_user.email = update_data.email

    # password - require current_password verification
    if update_data.password:
        if not update_data.current_password:
            raise HTTPException(status_code=400, detail="current_password is required to change password")
        if not verify_password(update_data.current_password, current_user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Current password is incorrect")
        current_user.hashed_password = get_password_hash(update_data.password)

    # hobbies
    if update_data.hobbies is not None:
        current_user.hobbies = json.dumps(update_data.hobbies)

    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me")
def delete_me(current_user: auth_models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.delete(current_user)
    db.commit()
    return {"message": "User deleted successfully"}
