# User Model - Database Table Definition
# This defines what a User looks like in our database
# Learning: SQLAlchemy models and how databases work!

from sqlalchemy import Column, Integer, String  # these are column types
from backend.core.database import Base  # base class for models
import json  # for converting lists to/from JSON strings

class User(Base):
    # This class represents a user in our database
    # Each property is a column in the 'users' table
    
    __tablename__ = "users"  # the table name in the database

    # Columns in the users table:
    id = Column(Integer, primary_key=True, index=True)  # unique ID for each user
    username = Column(String, unique=True, index=True, nullable=False)  # username must be unique!
    email = Column(String, unique=True, index=True, nullable=False)  # email must be unique too
    hashed_password = Column(String, nullable=False)  # we never store plain passwords!
    
    # Optional user preferences (can be None/empty)
    hobbies = Column(String, nullable=True)  # stored as JSON string (like: '["gaming", "tennis"]')
    cities = Column(String, nullable=True)  # stored as JSON string
    zipcodes = Column(String, nullable=True)  # stored as JSON string
    language = Column(String, default="de")  # default is german ("de")

    # These are "properties" - they convert JSON strings to Python lists
    # NOTE: @property makes them act like variables instead of functions
    @property
    def hobbies_list(self):
        # convert JSON string to list
        # example: '["gaming"]' becomes ["gaming"]
        return json.loads(self.hobbies) if self.hobbies else []

    @property
    def cities_list(self):
        # same for cities
        return json.loads(self.cities) if self.cities else []

    @property
    def zipcodes_list(self):
        # same for zipcodes
        return json.loads(self.zipcodes) if self.zipcodes else []
