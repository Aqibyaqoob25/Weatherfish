@echo off
REM WeatherFish Backend Server Startup Script
REM Updated for new project structure

cd /d C:\Users\hp\weatherfish
C:\Users\hp\weatherfish\venv\Scripts\python.exe -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
