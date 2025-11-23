#!/usr/bin/env python3
"""
Add Ecological Balance features to features_full.csv

This script adds:
- eco_balance_percap = total_BiocapPerCap - total_EFConsPerCap
- eco_balance_total = total_BiocapTotGHA - total_EFConsTotGHA

And their lag/delta variants will be created by the pipeline.
"""

import pandas as pd
import sys
import os

def add_eco_balance_features(input_file='data_work/features_full.csv', 
                             output_file=None):
    """
    Add ecological balance features to the features_full.csv file.
    
    Parameters:
    -----------
    input_file : str
        Path to the input features_full.csv file
    output_file : str, optional
        Path to output file. If None, overwrites input_file.
    """
    if output_file is None:
        output_file = input_file
    
    print(f"Reading {input_file}...")
    panel = pd.read_csv(input_file)
    
    print(f"Original shape: {panel.shape}")
    print(f"Columns containing 'Biocap': {[c for c in panel.columns if 'Biocap' in c]}")
    print(f"Columns containing 'EFCons': {[c for c in panel.columns if 'EFCons' in c]}")
    
    # Add per-capita ecological balance
    if 'total_BiocapPerCap' in panel.columns and 'total_EFConsPerCap' in panel.columns:
        panel['eco_balance_percap'] = panel['total_BiocapPerCap'] - panel['total_EFConsPerCap']
        print('✅ Added eco_balance_percap = total_BiocapPerCap - total_EFConsPerCap')
        print(f"   Range: {panel['eco_balance_percap'].min():.3f} to {panel['eco_balance_percap'].max():.3f}")
    else:
        missing = []
        if 'total_BiocapPerCap' not in panel.columns:
            missing.append('total_BiocapPerCap')
        if 'total_EFConsPerCap' not in panel.columns:
            missing.append('total_EFConsPerCap')
        print(f'⚠️  Warning: Missing columns: {missing}')
    
    # Add total ecological balance
    if 'total_BiocapTotGHA' in panel.columns and 'total_EFConsTotGHA' in panel.columns:
        panel['eco_balance_total'] = panel['total_BiocapTotGHA'] - panel['total_EFConsTotGHA']
        print('✅ Added eco_balance_total = total_BiocapTotGHA - total_EFConsTotGHA')
        print(f"   Range: {panel['eco_balance_total'].min():.3e} to {panel['eco_balance_total'].max():.3e}")
    else:
        missing = []
        if 'total_BiocapTotGHA' not in panel.columns:
            missing.append('total_BiocapTotGHA')
        if 'total_EFConsTotGHA' not in panel.columns:
            missing.append('total_EFConsTotGHA')
        print(f'⚠️  Warning: Missing columns: {missing}')
    
    # Save the updated file
    panel.to_csv(output_file, index=False)
    print(f"\n✅ Features saved to: {output_file}")
    print(f"Final shape: {panel.shape}")
    
    return panel

if __name__ == '__main__':
    # Allow command-line argument for input file
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'data_work/features_full.csv'
    add_eco_balance_features(input_file)

