#!/bin/bash

# Script to run both backend and frontend for EcoCast
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo -e "${GREEN}🌍 EcoCast - Starting Backend and Frontend${NC}"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.8+${NC}"
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16+${NC}"
    exit 1
fi

# Backend setup
echo -e "${YELLOW}📦 Setting up backend...${NC}"

# Check if virtual environment exists
if [ ! -d "ecocast_env" ]; then
    echo "Creating virtual environment..."
    python3 -m venv ecocast_env
fi

# Activate virtual environment
source ecocast_env/bin/activate

# Install backend dependencies
echo "Installing backend dependencies..."
pip install -q --upgrade pip
pip install -q -r backend/app/requirements.txt

# Install ML/data science dependencies (for scripts like rf_co2_drivers.py)
echo "Installing ML dependencies..."
pip install -q -r requirements.txt || echo -e "${YELLOW}⚠️  Some ML dependencies failed to install, but backend will still work${NC}"

# Run data preparation script if needed (check if medians file exists)
if [ ! -f "artefacts/medians.csv" ]; then
    echo -e "${YELLOW}⚠️  Running data preparation script...${NC}"
    python backend/scripts/build_medians.py || echo -e "${YELLOW}⚠️  Data preparation script failed, continuing anyway...${NC}"
fi

# Frontend setup
echo -e "${YELLOW}📦 Setting up frontend...${NC}"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed."
fi

cd "$PROJECT_ROOT"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit
}

trap cleanup SIGINT SIGTERM

# Start backend
echo ""
echo -e "${GREEN}🚀 Starting backend server on http://localhost:8000${NC}"
source ecocast_env/bin/activate
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend
echo -e "${GREEN}🚀 Starting frontend server on http://localhost:5173${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd "$PROJECT_ROOT"

echo ""
echo -e "${GREEN}✅ Both servers are running!${NC}"
echo ""
echo -e "${GREEN}📍 Frontend: http://localhost:5173${NC}"
echo -e "${GREEN}📍 Backend API: http://localhost:8000${NC}"
echo -e "${GREEN}📍 API Docs: http://localhost:8000/docs${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Wait for both processes
wait

