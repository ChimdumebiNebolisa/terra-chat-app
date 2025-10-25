#!/usr/bin/env bash
# exit on error
set -o errexit

echo "=== Building TerraChat ==="

# Build frontend first
echo "Building frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
echo "Frontend build complete. Output directory:"
ls -la
cd ..

# Install Python dependencies
echo "Installing Python dependencies..."
cd backend
pip install --upgrade pip
pip install wheel
pip install --only-binary :all: -r requirements.txt || pip install -r requirements.txt
cd ..

echo "=== Build complete ==="
