#!/bin/bash

# Script to stop both backend and frontend servers

echo "🛑 Stopping EcoCast servers..."

# Kill uvicorn processes (backend)
pkill -f "uvicorn backend.app.main:app" && echo "✅ Backend stopped" || echo "⚠️  No backend process found"

# Kill vite processes (frontend)
pkill -f "vite" && echo "✅ Frontend stopped" || echo "⚠️  No frontend process found"

echo "Done!"

