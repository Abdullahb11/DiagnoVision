#!/bin/bash

echo "========================================"
echo "DiagnoVision - Starting Application"
echo "========================================"
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

# Check if backend venv exists, create if not
cd backend
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Creating one..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create virtual environment."
        cd ..
        exit 1
    fi
    echo "Installing backend dependencies..."
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install backend dependencies."
        cd ..
        exit 1
    fi
else
    echo "Virtual environment found."
fi

# Start backend in background
echo ""
echo "Starting Backend Server..."
source venv/bin/activate
uvicorn app.main:app --reload > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Check if frontend node_modules exists
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Frontend dependencies not found. Installing..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install frontend dependencies."
        cd ..
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
fi

# Start frontend in background
echo ""
echo "Starting Frontend Server..."
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "Both servers are starting!"
echo "========================================"
echo ""
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Logs:"
echo "  Backend: backend.log"
echo "  Frontend: frontend.log"
echo ""
echo "To stop servers, run: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop both servers..."
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait

