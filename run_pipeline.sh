#!/bin/bash

# Script to run the sustainability pipeline notebook
# This will execute all cells and generate the updated features_full.csv with ecological balance features

cd "$(dirname "$0")"

# Activate virtual environment
if [ ! -d "ecocast_env" ]; then
    echo "❌ Virtual environment not found. Please run ./run.sh first to set up the environment."
    exit 1
fi

source ecocast_env/bin/activate

echo "🚀 Running sustainability_pipeline_v2.ipynb..."
echo "   This will regenerate features_full.csv with the new ecological balance features"
echo ""

# Use the venv's jupyter (which has access to all packages)
echo "📓 Executing notebook with jupyter nbconvert..."
python3 -m jupyter nbconvert --to notebook --execute --inplace sustainability_pipeline_v2.ipynb 2>&1 | grep -v "WARNING\|INFO" || {
    echo ""
    echo "⚠️  nbconvert had issues. Try running interactively instead:"
    echo "   source ecocast_env/bin/activate"
    echo "   jupyter notebook sustainability_pipeline_v2.ipynb"
    echo "   (Then select kernel: Python (ecocast_env))"
    exit 1
}
echo "✅ Notebook execution complete!"

echo ""
echo "📊 Check the output:"
echo "   - data_work/features_full.csv (should now include eco_balance_percap and eco_balance_total)"
echo "   - Look for lag/delta variants: eco_balance_percap_lag1, d_eco_balance_percap, etc."

