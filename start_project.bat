@echo off
echo Starting PulseGuard System...

:: Start Backend
start "PulseGuard Backend" cmd /k "echo Starting Backend (FastAPI)... & pip install -r requirements.txt & uvicorn main:app --reload"

:: Start Frontend
start "PulseGuard Frontend" cmd /k "echo Starting Frontend (Next.js)... & cd web & npm install & npm run dev"

echo.
echo Servers are starting...
echo Backend will be at: http://127.0.0.1:8000
echo Frontend will be at: http://localhost:3000
echo.
echo Waiting for servers to initialize...
timeout /t 10

:: Open Browser
start http://localhost:3000

echo Done! Don't close the terminal windows until you are finished.
pause
