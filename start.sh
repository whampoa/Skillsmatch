#!/bin/bash

# LegalConnect Startup Script
# This script sets up and runs the production-ready application

set -e

echo "================================================"
echo "  LegalConnect - Legal Expertise Matching"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

print_status "Python 3 found: $(python3 --version)"

# Navigate to project root
cd "$(dirname "$0")"
PROJECT_ROOT=$(pwd)

# Check if virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo ""
    echo "Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    print_status "Virtual environment created"
    cd "$PROJECT_ROOT"
fi

# Activate virtual environment
echo ""
echo "Activating virtual environment..."
source backend/venv/bin/activate
print_status "Virtual environment activated"

# Install Python dependencies
echo ""
echo "Installing Python dependencies..."
cd backend
pip install -r requirements.txt --quiet
print_status "Python dependencies installed"
cd "$PROJECT_ROOT"

# Check if Node.js is installed (for frontend build)
if ! command -v node &> /dev/null; then
    print_warning "Node.js is not installed. Frontend will be served from existing build."
else
    print_status "Node.js found: $(node --version)"
    
    # Check if frontend needs to be built
    if [ ! -d "frontend/dist" ]; then
        echo ""
        echo "Building frontend..."
        cd frontend
        
        # Install npm dependencies
        if [ ! -d "node_modules" ]; then
            npm install
        fi
        
        # Build the frontend
        npm run build
        print_status "Frontend built successfully"
        cd "$PROJECT_ROOT"
    else
        print_status "Frontend already built"
    fi
fi

# Create .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo ""
    echo "Creating .env file from template..."
    cp backend/.env.example backend/.env
    print_status ".env file created"
    print_warning "Please update backend/.env with your configuration"
fi

# Start the server
echo ""
echo "================================================"
echo "  Starting LegalConnect Server"
echo "================================================"
echo ""
print_status "Server starting on http://localhost:3000"
print_status "API available at http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd backend
python app.py

