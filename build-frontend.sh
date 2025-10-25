#!/usr/bin/env bash
# Build frontend for deployment
set -e

echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Frontend build complete!"
