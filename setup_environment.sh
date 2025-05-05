#!/bin/bash

# Create a virtual environment
python -m venv ecocast_env

# Activate the virtual environment
source ecocast_env/bin/activate

# Install requirements
pip install -r requirements.txt

echo "Environment setup complete! Run 'source ecocast_env/bin/activate' to activate it."
