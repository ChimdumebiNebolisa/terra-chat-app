# TerraChat Setup Guide

This guide will help you set up TerraChat on your local machine for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Python 3.8+** - [Download here](https://www.python.org/downloads/)
- **Git** - [Download here](https://git-scm.com/)

## API Keys Setup

### 1. OpenRouter API Key (Required)

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to your API keys section
4. Create a new API key
5. Copy the key (starts with `sk-or-v1-`)

### 2. NASA API Key (Optional but Recommended)

1. Visit [NASA API Portal](https://api.nasa.gov/)
2. Fill out the simple form
3. You'll receive an API key immediately
4. Copy the key

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd terra-chat
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create environment file:
   ```bash
   # Create .env file
   copy .env.example .env  # Windows
   cp .env.example .env    # macOS/Linux
   ```

5. Edit the `.env` file and add your API keys:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   NASA_API_KEY=your_nasa_api_key_here
   EONET_BASE_URL=https://eonet.gsfc.nasa.gov/api/v2.1
   ```

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   # Create .env.local file
   copy .env.local.example .env.local  # Windows
   cp .env.local.example .env.local    # macOS/Linux
   ```

4. Edit the `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

## Running the Application

### Option 1: Using PowerShell Scripts (Windows)

1. **Start both services:**
   ```powershell
   .\start-all.ps1
   ```

2. **Or start individually:**
   ```powershell
   # Terminal 1 - Backend
   .\start-backend.ps1
   
   # Terminal 2 - Frontend
   .\start-frontend.ps1
   ```

### Option 2: Manual Start

1. **Start the backend:**
   ```bash
   cd backend
   python main.py
   ```

2. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```

### Option 3: Using the Main Script

```powershell
.\start-terrachat.ps1
```

## Verification

1. **Backend Health Check:**
   - Visit: http://localhost:8000/api/health
   - Should return: `{"status": "healthy", "message": "TerraChat API is running"}`

2. **Frontend Application:**
   - Visit: http://localhost:3000
   - Should see the TerraChat interface

3. **Test the Chat:**
   - Try asking: "Show me recent wildfires"
   - You should see event cards with real data

## Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'fastapi'`
**Solution:** Make sure you're in the virtual environment and run `pip install -r requirements.txt`

**Problem:** `OPENROUTER_API_KEY not found`
**Solution:** Check that your `.env` file exists in the backend directory and contains the correct API key

**Problem:** `Port 8000 already in use`
**Solution:** Kill the process using port 8000 or change the port in `main.py`

### Frontend Issues

**Problem:** `npm: command not found`
**Solution:** Install Node.js from https://nodejs.org/

**Problem:** `Module not found` errors
**Solution:** Run `npm install` in the frontend directory

**Problem:** Frontend can't connect to backend
**Solution:** Check that the backend is running and the `NEXT_PUBLIC_API_URL` in `.env.local` is correct

### General Issues

**Problem:** PowerShell execution policy error
**Solution:** Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

**Problem:** API rate limits
**Solution:** The app includes rate limiting. Wait a minute before making more requests.

## Development Tips

1. **Hot Reload:** Both frontend and backend support hot reload during development
2. **Logs:** Check the console output for error messages
3. **API Testing:** Use the health endpoint to verify backend connectivity
4. **Environment Variables:** Never commit `.env` files to version control

## Next Steps

- Read the [API Documentation](API.md) for detailed endpoint information
- Check the [README](README.md) for project overview
- Explore the codebase to understand the architecture

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure API keys are correctly configured
4. Check that both services are running
5. Review the console logs for error messages
