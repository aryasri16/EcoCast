# Ecological Balance Feature - Web App Guide

## ✅ What Was Added

The Ecological Balance feature has been integrated into the web app! This shows whether each country is in **ecological reserve** (positive balance) or **ecological deficit** (overshoot).

## 🌐 How to View in the Web App

### Step 1: Start the Backend and Frontend
```bash
cd /Users/arya/CS486-06/EcoCast
./run.sh
```

### Step 2: Access the Feature
1. Open the web app at `http://localhost:5173`
2. Click on countries on the globe to add them to your selection
3. In the **"Snapshot & Compare"** panel at the bottom, you'll see country chips
4. Each country chip now has a **"View Ecological Balance"** button (green button)
5. Click it to open a detailed drawer showing:
   - Current ecological balance status (Reserve/Deficit/Balanced)
   - Per-capita balance over time (line chart)
   - Biocapacity vs Footprint comparison
   - Latest year statistics

## 📊 What You'll See

### Current Status Card
- **Per-Capita Balance**: Shows the latest year's balance in gha/capita
- **Status**: Color-coded (Green = Reserve, Red = Deficit, Yellow = Balanced)
- **Biocapacity & Footprint**: The underlying values

### Time Series Chart
- Line chart showing ecological balance over time
- Zero line (dashed) indicates the break-even point
- Positive values = Reserve (country regenerates more than it consumes)
- Negative values = Deficit (country consumes more than it regenerates)

### Biocapacity vs Footprint Bars
- Visual comparison of biocapacity (green) vs footprint (red)
- Shows the relationship that determines the balance

## 🔌 API Endpoint

The backend now exposes:
```
GET /eco-balance/{iso}
```

Returns timeseries data with:
- `year`: Year of the data point
- `eco_balance_percap`: Per-capita balance (biocapacity - footprint)
- `eco_balance_total`: Total balance in global hectares
- `total_BiocapPerCap`: Biocapacity per capita
- `total_EFConsPerCap`: Ecological footprint per capita
- `total_BiocapTotGHA`: Total biocapacity
- `total_EFConsTotGHA`: Total footprint

## 🚀 Next Steps

1. **Run the pipeline** to ensure `features_full.csv` has the eco_balance features:
   ```bash
   source ecocast_env/bin/activate
   jupyter notebook sustainability_pipeline_v2.ipynb
   # Select kernel: Python (ecocast_env)
   # Run all cells
   ```

2. **Restart the backend** if it's already running:
   ```bash
   # Stop current backend (Ctrl+C)
   # Then restart with ./run.sh
   ```

3. **Test the feature**:
   - Select a country on the globe
   - Click "View Ecological Balance" button
   - You should see the timeseries chart and current status

## 📝 Notes

- The feature automatically includes lag and delta variants when the pipeline runs
- Negative balance = Ecological overshoot (unsustainable)
- Positive balance = Ecological reserve (sustainable)
- This complements CO₂, renewables, and economic indicators in the Random Forest models

