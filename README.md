# TerraChat - Conversational NASA EONET Tracker

A modern web application that allows users to ask questions about natural events and get real-time data from NASA's EONET API through a conversational interface.

## Features

- 🤖 Conversational AI interface powered by OpenRouter
- 🌍 Real-time natural event data from NASA's EONET API
- 🎨 Modern UI with light/dark mode toggle
- 📱 Responsive design with smooth animations
- 🔍 Expandable event cards with detailed information
- 💾 Chat history persistence in localStorage
- 🔒 Production-ready security features
- 📊 Comprehensive health monitoring
- 🛡️ Input validation and rate limiting
- 🔄 Automatic log rotation

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **OpenRouter** - LLM integration for intent extraction
- **NASA EONET API** - Natural event data source
- **httpx** - Async HTTP client
- **cachetools** - Response caching

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **next-themes** - Theme management
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- OpenRouter API key (get from [https://openrouter.ai/](https://openrouter.ai/))
- NASA API key (optional, for higher rate limits - get from [https://api.nasa.gov/](https://api.nasa.gov/))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd terra-chat
```

2. Set up the backend:
```bash
cd backend
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

### Environment Variables

1. **Backend Environment Setup:**
   
   Copy the example environment file and fill in your API keys:
   ```bash
   cd backend
   cp env.example .env
   ```
   
   Edit the `.env` file with your actual API keys:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   NASA_API_KEY=your_nasa_api_key_here
   EONET_BASE_URL=https://eonet.gsfc.nasa.gov/api/v2.1
   FRONTEND_URL=https://your-production-domain.com
   FRONTEND_STAGING_URL=https://your-staging-domain.com
   ENVIRONMENT=development
   ```

2. **Frontend Environment Setup:**
   
   Create a `.env.local` file in the `frontend` directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

### API Key Setup

- **OpenRouter API Key**: 
  - Visit [https://openrouter.ai/](https://openrouter.ai/)
  - Sign up for an account
  - Generate an API key from your dashboard
  - Add it to your `.env` file

- **NASA API Key** (optional but recommended):
  - Visit [https://api.nasa.gov/](https://api.nasa.gov/)
  - Sign up for a free account
  - Generate an API key
  - Add it to your `.env` file for higher rate limits

### Running the Application

1. Start the backend server:
```bash
cd backend
python main.py
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Type a question about natural events (e.g., "Show me recent wildfires in California")
2. The AI will extract the intent and fetch relevant data from NASA's EONET API
3. View the results in expandable event cards
4. Use the theme toggle to switch between light and dark modes
5. Click "New Chat" to start a fresh conversation

## API Endpoints

- `GET /api/health` - Basic health check endpoint
- `GET /api/health/detailed` - Detailed health check with external API dependency status
- `POST /api/chat` - Chat endpoint for natural language queries (rate limited: 10 requests/minute)

### Health Check Response Examples

**Basic Health Check:**
```json
{
  "status": "healthy",
  "message": "TerraChat API is running"
}
```

**Detailed Health Check:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "dependencies": {
    "openrouter_api": true,
    "nasa_eonet_api": true
  },
  "issues": []
}
```

## Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Set the build command to `npm run build`
3. Set the output directory to `.next`
4. Add environment variables in Vercel dashboard

### Backend (Render)
1. Connect your repository to Render
2. Set the build command to `pip install -r requirements.txt`
3. Set the start command to `python main.py`
4. Add environment variables in Render dashboard

## Security Features

TerraChat includes several production-ready security measures:

- **API Key Validation**: Application fails fast if required API keys are missing
- **Input Validation**: All user inputs are validated with length limits and sanitization
- **CORS Protection**: Production environment restricts allowed origins, methods, and headers
- **Rate Limiting**: 10 requests per minute per IP address to prevent abuse
- **Secure Logging**: Production logs exclude sensitive stack traces
- **Log Rotation**: Automatic log file rotation to prevent disk space issues
- **Dependency Security**: All dependencies pinned to exact versions
- **Health Monitoring**: Comprehensive health checks for external API dependencies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Documentation

- **[Setup Guide](SETUP.md)** - Detailed installation and configuration instructions
- **[API Documentation](API.md)** - Complete API reference and examples
- **[Troubleshooting](SETUP.md#troubleshooting)** - Common issues and solutions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
