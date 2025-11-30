@echo off
echo ========================================
echo DiagnoVision - Complete Setup Script
echo pre req ( python <= 3.11 )
echo ========================================
echo.
echo This script will install all dependencies for both backend and frontend.
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

echo Python version:
python --version
echo.
echo Node.js version:
node --version
echo.
echo ========================================
echo Step 1: Setting up Backend
echo ========================================
echo.

cd backend

REM Check if venv already exists
if exist venv (
    echo Virtual environment already exists. Skipping creation.
) else (
    echo Creating virtual environment...
    python -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to create virtual environment.
        cd ..
        pause
        exit /b 1
    )
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing backend dependencies...
pip install --upgrade pip
pip install -r requirements.txt

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies.
    cd ..
    pause
    exit /b 1
)

echo.
echo Backend setup completed successfully!
echo.
cd ..

echo ========================================
echo Step 2: Setting up Frontend
echo ========================================
echo.

cd frontend

echo Installing frontend dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies.
    cd ..
    pause
    exit /b 1
)

echo.
echo Frontend setup completed successfully!
echo.
cd ..

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Backend: Copy backend\.env.example to backend\.env and fill in your configuration
echo 2. Backend: Place your model files in backend\models\ directory
echo 3. Frontend: Update frontend\src\config\firebase.js and supabase.js with your credentials
echo.
echo To run the application:
echo   Terminal 1 (Backend): cd backend ^&^& venv\Scripts\activate ^&^& uvicorn app.main:app --reload
echo   Terminal 2 (Frontend): cd frontend ^&^& npm run dev
echo.
pause

