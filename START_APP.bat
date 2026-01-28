@echo off
echo ========================================
echo    WEATHERFISH - Starting Application
echo ========================================
echo.
echo This will open TWO terminal windows:
echo   1. Backend Server (Python/FastAPI)
echo   2. Frontend Server (React/Vite)
echo.
echo Press any key to continue...
pause >nul

echo Starting Backend Server...
start "WeatherFish Backend" cmd /k "call venv\Scripts\activate && uvicorn backend.main:app --reload"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "WeatherFish Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173 
echo API Docs: http://127.0.0.1:8000/docs
echo ========================================
echo.
echo To stop the servers, close both terminal windows.
echo.
