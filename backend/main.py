from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from routes import chat, health
import os
import logging
from logging.handlers import RotatingFileHandler

# Determine log level based on environment
log_level = logging.DEBUG if os.getenv("ENVIRONMENT", "development").lower() == "development" else logging.INFO

# Create rotating file handler (10MB max, keep 5 backup files)
file_handler = RotatingFileHandler(
    "terrachat.log", 
    maxBytes=10*1024*1024,  # 10MB
    backupCount=5
)

logging.basicConfig(
    level=log_level,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        file_handler
    ]
)

# Rate limiting configuration
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="TerraChat API", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware - configure based on environment
allowed_origins = [
    "http://localhost:3000",  # Next.js dev server
    "http://127.0.0.1:3000",  # Alternative localhost
]

# Add production origins if specified
if os.getenv("FRONTEND_URL"):
    allowed_origins.append(os.getenv("FRONTEND_URL"))

# Add staging origins if specified
if os.getenv("FRONTEND_STAGING_URL"):
    allowed_origins.append(os.getenv("FRONTEND_STAGING_URL"))

# Determine if we're in production
is_production = os.getenv("ENVIRONMENT", "development").lower() == "production"

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    # Restrict methods in production, allow all in development
    allow_methods=["GET", "POST"] if is_production else ["*"],
    # Restrict headers in production to only what's needed
    allow_headers=["Content-Type", "Authorization"] if is_production else ["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(chat.router, prefix="/api", tags=["chat"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
