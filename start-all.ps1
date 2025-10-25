# Start both TerraChat Backend and Frontend
Write-Host "Starting TerraChat Application..." -ForegroundColor Green

# Start backend in background
Write-Host "Starting Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-File", "start-backend.ps1" -WindowStyle Minimized

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting Frontend..." -ForegroundColor Yellow
cd frontend
npm run dev
