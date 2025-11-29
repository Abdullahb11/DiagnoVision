#!/bin/bash

echo "Installing DiagnoVision Backend dependencies..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed or not in PATH."
    echo "Please install Python 3.8+ from https://www.python.org/"
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "ERROR: pip3 is not installed or not in PATH."
    exit 1
fi

echo "Python version:"
python3 --version
echo ""
echo "pip version:"
pip3 --version
echo ""

echo "Creating virtual environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create virtual environment."
    exit 1
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Installation completed successfully!"
    echo "========================================"
    echo ""
    echo "Next steps:"
    echo "1. Copy .env.example to .env and fill in your configuration"
    echo "2. Place your model files in the models/ directory"
    echo "3. Activate virtual environment: source venv/bin/activate"
    echo "4. Run the server: python -m uvicorn app.main:app --reload"
    echo ""
else
    echo ""
    echo "========================================"
    echo "Installation failed!"
    echo "========================================"
    echo ""
    exit 1
fi

