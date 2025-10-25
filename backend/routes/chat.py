from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from models.schemas import ChatRequest, ChatResponse, Event, EventCategory, EventGeometry, EventSource
from services.openrouter_service import OpenRouterService
from services.eonet_service import EONETService
import logging
import httpx
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

# Rate limiter instance
limiter = Limiter(key_func=get_remote_address)

router = APIRouter()
openrouter_service = OpenRouterService()
eonet_service = EONETService()

@router.post("/chat", response_model=ChatResponse)
@limiter.limit("10/minute")  # Allow 10 requests per minute per IP
async def chat(request: Request, chat_request: ChatRequest) -> ChatResponse:
    try:
        # Extract intent from user message
        category, days, region = await openrouter_service.extract_intent(chat_request.message)
        
        # Fetch events from EONET
        events_data = await eonet_service.get_events(category=category, days=days)
        
        # Convert to Event models
        events: List[Event] = []
        for event_data in events_data:
            # Convert categories
            categories = []
            for cat in event_data.get("categories", []):
                categories.append(EventCategory(
                    id=cat.get("id", 0),
                    title=cat.get("title", "Unknown Category")
                ))
            
            # Convert geometries
            geometries = []
            for geom in event_data.get("geometries", []):
                geometries.append(EventGeometry(
                    date=geom.get("date"),
                    type=geom.get("type", "Point"),
                    coordinates=geom.get("coordinates", [])
                ))
            
            # Convert sources
            sources = []
            for src in event_data.get("sources", []):
                sources.append(EventSource(
                    id=src.get("id", ""),
                    url=src.get("url", "")
                ))
            
            event = Event(
                id=event_data.get("id", ""),
                title=event_data.get("title", "Unknown Event"),
                description=event_data.get("description"),
                link=event_data.get("link"),
                categories=categories,
                geometries=geometries,
                sources=sources,
                closed=event_data.get("closed")
            )
            events.append(event)
        
        # Generate conversational response
        response_text = await openrouter_service.generate_response(chat_request.message, events_data)
        
        return ChatResponse(response=response_text, events=events)
        
    except httpx.HTTPError as e:
        logger.error(f"HTTP error in chat endpoint: {e}")
        raise HTTPException(status_code=503, detail="Unable to fetch data from external services. Please try again later.")
    except ValueError as e:
        logger.error(f"Value error in chat endpoint: {e}")
        raise HTTPException(status_code=400, detail="Invalid request data. Please check your input.")
    except Exception as e:
        # Only log full stack trace in development, not production
        import os
        is_production = os.getenv("ENVIRONMENT", "development").lower() == "production"
        if is_production:
            logger.error(f"Unexpected error in chat endpoint: {e}")
        else:
            logger.error(f"Unexpected error in chat endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An unexpected error occurred. Please try again later.")
