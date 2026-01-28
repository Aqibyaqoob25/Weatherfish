# Configuration File
# This file stores all the settings for the app
# Learning: how to organize settings and use environment variables!

import os
from pathlib import Path

# Figure out where the project folder is
# __file__ is this file, then go up 3 folders to get project root
# NOTE: learned about Path from professor!
BASE_DIR = Path(__file__).resolve().parent.parent.parent
print(f"Project directory: {BASE_DIR}")  # debug print

# Database settings
# Using SQLite because it's simple - just a file!
# TODO: might need PostgreSQL later for production
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/data/database/weatherfish.db")

# JWT (JSON Web Token) settings
# These are for user authentication (login stuff)
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")  # IMPORTANT: change this!
ALGORITHM = os.getenv("ALGORITHM", "HS256")  # encryption algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))  # token lasts 30 mins

# Scheduler settings
# The app sends daily reports at this time
DAILY_REPORT_TIME = os.getenv("DAILY_REPORT_TIME", "07:00")  # 7 AM every day
print(f"Daily reports scheduled for: {DAILY_REPORT_TIME}")

# Weather Data directories
# These are where we save all the weather files
WEATHER_DATA_DIR = BASE_DIR / "data" / "weather"  # raw weather JSON files
STRUCTURED_DATA_DIR = BASE_DIR / "frontend" / "public" / "structured_data"  # processed data
SPEECH_OUTPUT_DIR = BASE_DIR / "frontend" / "public" / "speech"  # audio files (MP3)
TEXT_OUTPUT_DIR = BASE_DIR / "frontend" / "public" / "weather_text_from_gpt"  # AI text reports

print(f"Weather data will be saved to: {WEATHER_DATA_DIR}")

# AI Model settings
# Using Llama 3.2 3B model from HuggingFace
# NOTE: this model is pretty good and runs on my laptop!
MODEL_PATH = os.getenv("MODEL_PATH", "hugging-quants/Llama-3.2-3B-Instruct-Q4_K_M-GGUF")
MODEL_FILE = os.getenv("MODEL_FILE", "llama-3.2-3b-instruct-q4_k_m.gguf")
print(f"Using AI model: {MODEL_PATH}")
