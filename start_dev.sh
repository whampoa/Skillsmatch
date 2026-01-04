#!/bin/bash

# LegalConnect Development Startup Script
# This script runs both backend and frontend in development mode

set -e

echo "================================================"
echo "  LegalConnect - Development Mode"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd "$(dirname "$0")"
PROJECT_ROOT=$(pwd)

# Setup backend virtual environment if needed
if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd "$PROJECT_ROOT"
fi

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd "$PROJECT_ROOT"
fi

echo ""
echo -e "${GREEN}Starting development servers...${NC}"
echo ""
echo -e "${YELLOW}Backend:${NC} http://localhost:3000"
echo -e "${YELLOW}Frontend:${NC} http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start backend in background
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!

# Start frontend
cd "$PROJECT_ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

# Trap Ctrl+C to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

# Wait for both processes
wait

