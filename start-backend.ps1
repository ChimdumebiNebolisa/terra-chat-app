# Start TerraChat Backend
Write-Host "Starting TerraChat Backend..." -ForegroundColor Green

# Check if we're in the correct directory
if (-not (Test-Path "backend")) {
    Write-Host "Error: backend directory not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Change to backend directory
Set-Location backend

# Check if Python is available
try {
    python --version
} catch {
    Write-Host "Error: Python not found. Please install Python 3.8+ and try again." -ForegroundColor Red
    exit 1
}

# Check if requirements are installed
if (-not (Test-Path "requirements.txt")) {
    Write-Host "Error: requirements.txt not found in backend directory." -ForegroundColor Red
    exit 1
}

# Install requirements if needed
if (-not (Test-Path "venv") -and -not (Test-Path ".venv")) {
    Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt
}

# Start the backend
Write-Host "Starting backend server..." -ForegroundColor Green
python main.py