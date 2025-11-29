#!/bin/bash

echo "========================================"
echo "DiagnoVision - Complete Setup Script"
echo "========================================"
echo ""
echo "This script will install all dependencies for both backend and frontend."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed or not in PATH."
    echo "Please install Python 3.8+ from https://www.python.org/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Python version:"
python3 --version
echo ""
echo "Node.js version:"
node --version
echo ""
echo "========================================"
echo "Step 1: Setting up Backend"
echo "========================================"
echo ""

cd backend

# Check if venv already exists
if [ -d "venv" ]; then
    echo "Virtual environment already exists. Skipping creation."
else
    echo "Creating virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create virtual environment."
        cd ..
        exit 1
    fi
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing backend dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies."
    cd ..
    exit 1
fi

echo ""
echo "Backend setup completed successfully!"
echo ""
cd ..

echo "========================================"
echo "Step 2: Setting up Frontend"
echo "========================================"
echo ""

cd frontend

echo "Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies."
    cd ..
    exit 1
fi

echo ""
echo "Frontend setup completed successfully!"
echo ""
cd ..

echo ""
echo "========================================"
echo "Setup completed successfully!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Backend: Copy backend/.env.example to backend/.env and fill in your configuration"
echo "2. Backend: Place your model files in backend/models/ directory"
echo "3. Frontend: Update frontend/src/config/firebase.js and supabase.js with your credentials"
echo ""
echo "To run the application:"
echo "  Terminal 1 (Backend): cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "  Terminal 2 (Frontend): cd frontend && npm run dev"
echo ""

