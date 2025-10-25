import httpx
import os
import json
import logging
from typing import Dict, Any, Tuple, List

logger = logging.getLogger(__name__)

class OpenRouterService:
    def __init__(self) -> None:
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            logger.warning("OPENROUTER_API_KEY not found in environment variables")
        self.base_url = "https://openrouter.ai/api/v1"
        
        # Category mapping for consistent detection
        self.category_mapping = {
            "wildfire": "wildfires",
            "volcano": "volcanoes", 
            "flood": "floods",
            "storm": "storms",
            "earthquake": "earthquakes",
            "drought": "drought",
            "droughts": "drought",  # Handle both singular and plural
            "landslide": "landslides",
            "snow": "snow",
            "ice": "ice",
            "dust": "dust",
            "manmade": "manmade",
            "man-made": "manmade"
        }
        
    def _detect_category(self, message: str) -> str:
        """
        Detect category from message using the category mapping
        """
        message_lower = message.lower()
        
        for keyword, category in self.category_mapping.items():
            if keyword in message_lower:
                return category
                
        return "all"
        
    async def extract_intent(self, message: str) -> Tuple[str, int, str]:
        """
        Extract category, days, and region from user message
        Returns: (category, days, region)
        """
        # Use local pattern matching instead of external API
        message_lower = message.lower()
        
        # Extract category
        category = self._detect_category(message)
        
        # Extract days
        days = 7  # Default to 7 days for recent focus
        if "past week" in message_lower or "last week" in message_lower:
            days = 7
        elif "past month" in message_lower or "last month" in message_lower:
            days = 30
        elif "past year" in message_lower or "last year" in message_lower:
            days = 365
        elif "today" in message_lower:
            days = 1
        elif "yesterday" in message_lower:
            days = 2
        elif "week" in message_lower and "past" not in message_lower and "last" not in message_lower:
            days = 7
        elif "month" in message_lower and "past" not in message_lower and "last" not in message_lower:
            days = 30
        elif "year" in message_lower and "past" not in message_lower and "last" not in message_lower:
            days = 365
        
        # Extract region (simplified)
        region = "all"
        if "north america" in message_lower or "usa" in message_lower or "united states" in message_lower:
            region = "north america"
        elif "europe" in message_lower:
            region = "europe"
        elif "asia" in message_lower:
            region = "asia"
        elif "africa" in message_lower:
            region = "africa"
        elif "oceania" in message_lower or "australia" in message_lower:
            region = "oceania"
        elif "south america" in message_lower:
            region = "south america"
        
        logger.info(f"Extracted intent: category={category}, days={days}, region={region}")
        return category, days, region
            
    async def generate_response(self, message: str, events: List[Dict[str, Any]]) -> str:
        """
        Generate a conversational response about the events
        """
        # Check if user asked specifically about earthquakes
        if "earthquake" in message.lower():
            return """I understand you're asking about earthquakes, but unfortunately the EONET (Earth Observatory Natural Event Tracker) API doesn't currently provide earthquake data. 

EONET focuses on events that can be observed from space, such as:
• Wildfires
• Volcanic eruptions  
• Severe storms
• Floods
• Icebergs
• Dust storms

For earthquake information, I'd recommend checking:
• USGS Earthquake Hazards Program (earthquake.usgs.gov)
• EMSC (European-Mediterranean Seismological Centre)
• Local geological survey websites

Would you like to explore other natural events that are available, such as recent wildfires or volcanic activity?"""
        
        if not events:
            return "I couldn't find any recent natural events matching your query. Try asking about wildfires, volcanoes, floods, storms, or other natural phenomena."
        
        # Extract the specific category the user asked about
        specific_category = self._detect_category(message)
        if specific_category == "all":
            specific_category = None
            
        # Count events by category to provide accurate information
        category_counts = {}
        for event in events:
            event_categories = event.get("categories", [])
            for cat in event_categories:
                cat_title = cat.get("title", "").lower()
                category_counts[cat_title] = category_counts.get(cat_title, 0) + 1
        
        # Generate specific response based on what was asked
        if specific_category and specific_category in category_counts:
            count = category_counts[specific_category]
            if count == 0:
                return f"I searched for recent {specific_category} but didn't find any active events in the past week. This could mean there are no current {specific_category} being tracked by NASA's EONET system, or they may have been resolved recently."
            else:
                return f"I found {count} recent {specific_category} event{'s' if count > 1 else ''} for you. Check out the event cards below for detailed information about each one."
        else:
            # General response for mixed or unspecified categories
            total_events = len(events)
            if total_events == 0:
                return "I couldn't find any recent natural events matching your query. Try asking about wildfires, volcanoes, floods, storms, or other natural phenomena."
            else:
                # List the main categories found
                main_categories = [cat for cat, count in category_counts.items() if count > 0]
                if len(main_categories) == 1:
                    return f"I found {total_events} recent {main_categories[0]} event{'s' if total_events > 1 else ''} for you. Check out the event cards below for more details."
                else:
                    return f"I found {total_events} recent natural events across {len(main_categories)} categories: {', '.join(main_categories)}. Check out the event cards below for more details."
