@echo off
echo ========================================
echo DiagnoVision - Starting Application
echo ========================================
echo.

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python is not installed or not in PATH.
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if backend venv exists, create if not
cd backend
if not exist venv (
    echo Virtual environment not found. Creating one...
    python -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to create virtual environment.
        cd ..
        pause
        exit /b 1
    )
    echo Installing backend dependencies...
    call venv\Scripts\activate.bat
    pip install --upgrade pip
    pip install -r requirements.txt
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install backend dependencies.
        cd ..
        pause
        exit /b 1
    )
) else (
    echo Virtual environment found.
)

REM Start backend in a new window
echo.
echo Starting Backend Server...
start "DiagnoVision Backend" cmd /k "venv\Scripts\activate.bat && uvicorn app.main:app --reload"
cd ..

REM Wait a moment for backend to start
timeout /t 2 /nobreak >nul

REM Check if frontend node_modules exists
cd frontend
if not exist node_modules (
    echo Frontend dependencies not found. Installing...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install frontend dependencies.
        cd ..
        pause
        exit /b 1
    )
)

REM Start frontend in a new window
echo.
echo Starting Frontend Server...
start "DiagnoVision Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window (servers will continue running)...
pause >nul

