#!/usr/bin/env bash
# exit on error
set -o errexit

# Build frontend first
echo "Building frontend..."
cd ../frontend
npm install --legacy-peer-deps
npm run build
echo "Frontend build complete in: $(pwd)"
ls -la
cd ../backend

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install wheel
pip install --only-binary :all: -r requirements.txt || pip install -r requirements.txt
