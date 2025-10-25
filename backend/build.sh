#!/usr/bin/env bash
# exit on error
set -o errexit

# Build frontend first
echo "Building frontend..."
cd ../frontend
npm install
npm run build
cd ../backend

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install wheel
pip install --only-binary :all: -r requirements.txt || pip install -r requirements.txt
