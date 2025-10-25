# Start TerraChat Frontend
Write-Host "Starting TerraChat Frontend..." -ForegroundColor Green

# Check if we're in the correct directory
if (-not (Test-Path "frontend")) {
    Write-Host "Error: frontend directory not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Change to frontend directory
Set-Location frontend

# Check if Node.js is available
try {
    node --version
} catch {
    Write-Host "Error: Node.js not found. Please install Node.js 18+ and try again." -ForegroundColor Red
    exit 1
}

# Check if npm is available
try {
    npm --version
} catch {
    Write-Host "Error: npm not found. Please install npm and try again." -ForegroundColor Red
    exit 1
}

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found in frontend directory." -ForegroundColor Red
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the frontend
Write-Host "Starting frontend development server..." -ForegroundColor Green
npm run dev