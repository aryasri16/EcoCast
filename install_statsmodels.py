import sys
import subprocess

def install_package(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

# Install statsmodels which contains the ARIMA model
install_package('statsmodels')
print("statsmodels installed successfully!")
