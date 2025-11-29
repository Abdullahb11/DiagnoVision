#!/bin/bash

echo "Installing DiagnoVision dependencies..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed or not in PATH."
    exit 1
fi

echo "Node.js version:"
node --version
echo ""
echo "npm version:"
npm --version
echo ""

echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Installation completed successfully!"
    echo "========================================"
    echo ""
    echo "To start the development server, run:"
    echo "  npm run dev"
    echo ""
else
    echo ""
    echo "========================================"
    echo "Installation failed!"
    echo "========================================"
    echo ""
    exit 1
fi

