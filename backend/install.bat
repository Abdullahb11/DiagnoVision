@echo off
echo Installing DiagnoVision Backend dependencies...
echo.

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python is not installed or not in PATH.
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check if pip is installed
where pip >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: pip is not installed or not in PATH.
    pause
    exit /b 1
)

echo Python version:
python --version
echo.
echo pip version:
pip --version
echo.

echo Creating virtual environment...
python -m venv venv
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create virtual environment.
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install --upgrade pip
pip install -r requirements.txt

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Installation completed successfully!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Copy .env.example to .env and fill in your configuration
    echo 2. Place your model files in the models/ directory
    echo 3. Activate virtual environment: venv\Scripts\activate.bat
    echo 4. Run the server: python -m uvicorn app.main:app --reload
    echo.
) else (
    echo.
    echo ========================================
    echo Installation failed!
    echo ========================================
    echo.
)

pause

