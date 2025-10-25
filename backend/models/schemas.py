from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime

class EventCategory(BaseModel):
    id: int
    title: str

class EventGeometry(BaseModel):
    date: Optional[str] = None
    type: str
    coordinates: List[Any]

class EventSource(BaseModel):
    id: str
    url: str

class Event(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    link: Optional[str] = None
    categories: List[EventCategory]
    geometries: List[EventGeometry]
    sources: List[EventSource]
    closed: Optional[str] = None

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=500, description="Chat message (1-500 characters)")
    
    @validator('message')
    def validate_message(cls, v):
        if not v or not v.strip():
            raise ValueError('Message cannot be empty or only whitespace')
        return v.strip()

class ChatResponse(BaseModel):
    response: str
    events: List[Event]
