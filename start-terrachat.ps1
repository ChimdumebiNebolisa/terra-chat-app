# Start TerraChat Application
Write-Host "Starting TerraChat Application..." -ForegroundColor Green

# Check if backend is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -UseBasicParsing -TimeoutSec 2
    Write-Host "Backend is already running!" -ForegroundColor Green
} catch {
    Write-Host "Starting Backend..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-File", "start-backend.ps1" -WindowStyle Minimized
    Start-Sleep -Seconds 3
}

# Check if frontend is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2
    Write-Host "Frontend is already running!" -ForegroundColor Green
} catch {
    Write-Host "Starting Frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm run dev
}

Write-Host "TerraChat is running at http://localhost:3000" -ForegroundColor Cyan
Write-Host "Test theme at http://localhost:3000/test-theme" -ForegroundColor Cyan
