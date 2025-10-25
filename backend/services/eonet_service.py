import httpx
import os
from cachetools import TTLCache
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class EONETService:
    def __init__(self) -> None:
        self.base_url = os.getenv("EONET_BASE_URL", "https://eonet.gsfc.nasa.gov/api/v2.1")
        self.api_key = os.getenv("NASA_API_KEY")
        if not self.api_key:
            logger.warning("NASA_API_KEY not found in environment variables")
        self.cache = TTLCache(maxsize=100, ttl=300)  # 5 minutes cache
        
        # Map category names to EONET category IDs
        self.category_mapping = {
            "drought": 6,
            "dust": 7,
            "dust and haze": 7,
            "earthquakes": 16,
            "floods": 9,
            "landslides": 14,
            "manmade": 19,
            "ice": 15,
            "sea and lake ice": 15,
            "storms": 10,
            "severe storms": 10,
            "snow": 17,
            "temperature": 18,
            "temperature extremes": 18,
            "volcanoes": 12,
            "water color": 13,
            "wildfires": 8
        }
        
    async def get_events(self, category: str = None, days: int = 30, status: str = "open") -> List[Dict[str, Any]]:
        cache_key = f"{category}_{days}_{status}"
        
        if cache_key in self.cache:
            logger.info("Returning cached EONET data")
            return self.cache[cache_key]
            
        try:
            async with httpx.AsyncClient() as client:
                params = {
                    "status": status,
                    "days": days
                }
                if category:
                    # Map category name to EONET category ID
                    category_id = self.category_mapping.get(category.lower())
                    if category_id:
                        params["category"] = category_id
                        logger.info(f"Mapped category '{category}' to EONET ID {category_id}")
                    else:
                        logger.warning(f"Unknown category '{category}', fetching all events")
                if self.api_key:
                    params["api_key"] = self.api_key
                    
                response = await client.get(f"{self.base_url}/events", params=params)
                response.raise_for_status()
                
                data = response.json()
                events = data.get("events", [])
                
                # Filter events by category if specific category was requested
                if category and category.lower() in self.category_mapping:
                    filtered_events = self._filter_events_by_category(events, category.lower())
                    logger.info(f"Filtered {len(events)} events to {len(filtered_events)} {category} events")
                    events = filtered_events
                
                # Cache the results
                self.cache[cache_key] = events
                logger.info(f"Fetched {len(events)} events from EONET API")
                
                return events
                
        except httpx.HTTPError as e:
            logger.error(f"Error fetching EONET data: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return []
    
    def _filter_events_by_category(self, events: List[Dict[str, Any]], category: str) -> List[Dict[str, Any]]:
        """
        Filter events to only include those matching the specified category
        """
        category_id = self.category_mapping.get(category)
        if not category_id:
            return events
            
        filtered_events = []
        for event in events:
            event_categories = event.get("categories", [])
            for cat in event_categories:
                if cat.get("id") == category_id:
                    filtered_events.append(event)
                    break
                    
        return filtered_events
