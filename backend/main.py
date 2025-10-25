from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from routes import chat, health
import os
import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

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

# CORS middleware - allow all origins for single deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(chat.router, prefix="/api", tags=["chat"])

# Serve frontend static files
frontend_path = Path(__file__).parent.parent / "frontend" / "out"
logger = logging.getLogger(__name__)

# Try multiple possible frontend locations
possible_paths = [
    Path(__file__).parent.parent / "frontend" / "out",
    Path(__file__).parent.parent / "frontend" / ".next",
    Path(__file__).parent.parent / "frontend",
]

frontend_found = False
for path in possible_paths:
    if path.exists():
        logger.info(f"Found frontend at: {path}")
        frontend_path = path
        frontend_found = True
        break

if frontend_found:
    # Mount static assets
    static_path = frontend_path / "_next" / "static"
    if static_path.exists():
        app.mount("/_next/static", StaticFiles(directory=str(static_path)), name="static")
    
    # Serve main pages
    @app.get("/")
    async def serve_root():
        """Serve the root index.html"""
        index_path = frontend_path / "index.html"
        if index_path.exists():
            return FileResponse(str(index_path))
        return {"detail": "Frontend not found", "path": str(frontend_path)}
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve frontend files, defaulting to index.html for non-API routes"""
        if full_path.startswith("api"):
            return {"detail": "Not Found"}
        
        if full_path.startswith("_next"):
            return {"detail": "Static file not found"}
        
        file_path = frontend_path / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        
        # Fallback to index.html for SPA routing
        index_path = frontend_path / "index.html"
        if index_path.exists():
            return FileResponse(str(index_path))
        
        return {"detail": "Not Found", "requested": full_path, "frontend_path": str(frontend_path)}
else:
    logger.warning("Frontend build not found! Make sure frontend is built.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
