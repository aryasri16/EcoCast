#!/bin/bash

# Helper script to run Python scripts with the virtual environment activated
# Usage: ./run_python.sh script_name.py [args...]

if [ $# -eq 0 ]; then
    echo "Usage: ./run_python.sh <script.py> [args...]"
    exit 1
fi

SCRIPT="$1"
shift  # Remove first argument, rest are passed to the script

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# Check if virtual environment exists
if [ ! -d "ecocast_env" ]; then
    echo "❌ Virtual environment not found. Please run ./run.sh first to set up the environment."
    exit 1
fi

# Activate virtual environment and run the script
source ecocast_env/bin/activate
python3 "$SCRIPT" "$@"

