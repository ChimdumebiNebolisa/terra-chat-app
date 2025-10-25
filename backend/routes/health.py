from fastapi import APIRouter, HTTPException
import httpx
import asyncio
from config import settings
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

async def check_openrouter_api():
    """Check if OpenRouter API is accessible"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get("https://openrouter.ai/api/v1/models")
            return response.status_code == 200
    except Exception as e:
        logger.warning(f"OpenRouter API check failed: {e}")
        return False

async def check_nasa_eonet_api():
    """Check if NASA EONET API is accessible"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{settings.EONET_BASE_URL}/categories")
            return response.status_code == 200
    except Exception as e:
        logger.warning(f"NASA EONET API check failed: {e}")
        return False

@router.get("/health")
async def health_check():
    """Basic health check"""
    return {"status": "healthy", "message": "TerraChat API is running"}

@router.get("/health/detailed")
async def detailed_health_check():
    """Detailed health check including external API dependencies"""
    health_status = {
        "status": "healthy",
        "timestamp": None,
        "dependencies": {
            "openrouter_api": False,
            "nasa_eonet_api": False
        },
        "issues": []
    }
    
    # Check external APIs concurrently
    openrouter_healthy, nasa_healthy = await asyncio.gather(
        check_openrouter_api(),
        check_nasa_eonet_api(),
        return_exceptions=True
    )
    
    # Handle exceptions
    if isinstance(openrouter_healthy, Exception):
        health_status["dependencies"]["openrouter_api"] = False
        health_status["issues"].append(f"OpenRouter API error: {openrouter_healthy}")
    else:
        health_status["dependencies"]["openrouter_api"] = openrouter_healthy
    
    if isinstance(nasa_healthy, Exception):
        health_status["dependencies"]["nasa_eonet_api"] = False
        health_status["issues"].append(f"NASA EONET API error: {nasa_healthy}")
    else:
        health_status["dependencies"]["nasa_eonet_api"] = nasa_healthy
    
    # Determine overall health
    if not health_status["dependencies"]["openrouter_api"]:
        health_status["status"] = "degraded"
        health_status["issues"].append("OpenRouter API is unavailable - chat functionality may be limited")
    
    if not health_status["dependencies"]["nasa_eonet_api"]:
        health_status["status"] = "degraded"
        health_status["issues"].append("NASA EONET API is unavailable - event data may not be current")
    
    if not health_status["dependencies"]["openrouter_api"] and not health_status["dependencies"]["nasa_eonet_api"]:
        health_status["status"] = "unhealthy"
    
    from datetime import datetime
    health_status["timestamp"] = datetime.utcnow().isoformat()
    
    return health_status
