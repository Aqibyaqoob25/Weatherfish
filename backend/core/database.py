# Database Setup File
# This connects our app to the SQLite database
# Learning: SQLAlchemy ORM (Object-Relational Mapping)
# NOTE: ORM means we can use Python classes instead of SQL queries!

from sqlalchemy import create_engine  # creates database connection
from sqlalchemy.ext.declarative import declarative_base  # base class for models
from sqlalchemy.orm import sessionmaker  # creates database sessions
import os
from pathlib import Path

# Find the project root directory
# going up 3 levels: database.py -> core -> backend -> project root
BASE_DIR = Path(__file__).resolve().parent.parent.parent
print(f"Database module loaded. Base dir: {BASE_DIR}")  # debug

# Set up database path
# using SQLite because it's easy - just a single file!
DEFAULT_DB_PATH = BASE_DIR / "data" / "database" / "weatherfish.db"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")
print(f"Database location: {DATABASE_URL}")  # debug print

# Create the database engine
# This is like the connection to the database
# NOTE: check_same_thread=False is needed for SQLite to work with FastAPI
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Create session maker
# Sessions are like conversations with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all database models
# All our models (like User) will inherit from this
Base = declarative_base()

def get_db():
    # This function gives us a database session
    # It's used with FastAPI's Depends() thing
    # NOTE: the 'yield' keyword is like 'return' but it keeps the function alive
    db = SessionLocal()  # create a new session
    try:
        yield db  # give the session to the caller
    finally:
        db.close()  # always close the session when done!
