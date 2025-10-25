import os
import sys
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    NASA_API_KEY = os.getenv("NASA_API_KEY")
    EONET_BASE_URL = os.getenv("EONET_BASE_URL", "https://eonet.gsfc.nasa.gov/api/v2.1")
    
    @classmethod
    def validate_required_keys(cls):
        """Validate that all required API keys are present and fail-fast if not."""
        missing_keys = []
        
        if not cls.OPENROUTER_API_KEY:
            missing_keys.append("OPENROUTER_API_KEY")
        
        if not cls.NASA_API_KEY:
            missing_keys.append("NASA_API_KEY")
        
        if missing_keys:
            error_msg = f"Missing required environment variables: {', '.join(missing_keys)}. Please check your .env file."
            print(f"ERROR: {error_msg}")
            sys.exit(1)
        
        print("✓ All required API keys are configured")

settings = Settings()
# Validate API keys on import
settings.validate_required_keys()
