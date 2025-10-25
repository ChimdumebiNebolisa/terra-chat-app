# TerraChat API Documentation

## Base URL
- Development: `http://localhost:8000`
- Production: `https://your-domain.com` (when deployed)

## Authentication
No authentication required for public endpoints.

## Rate Limiting
- Chat endpoint: 10 requests per minute per IP address
- Health endpoint: No rate limiting

## Endpoints

### Health Check
Check if the API is running.

**GET** `/api/health`

**Response:**
```json
{
  "status": "healthy",
  "message": "TerraChat API is running"
}
```

### Chat
Send a natural language query about natural events.

**POST** `/api/chat`

**Request Body:**
```json
{
  "message": "Show me recent wildfires in California"
}
```

**Response:**
```json
{
  "response": "I found 3 recent wildfire events for you. Check out the event cards below for detailed information about each one.",
  "events": [
    {
      "id": "EONET_12345",
      "title": "Wildfire in California",
      "description": "A large wildfire burning in Northern California...",
      "link": "https://eonet.gsfc.nasa.gov/api/v2.1/events/12345",
      "categories": [
        {
          "id": 8,
          "title": "wildfires"
        }
      ],
      "geometries": [
        {
          "date": "2024-01-15T00:00:00Z",
          "type": "Point",
          "coordinates": [-122.4194, 37.7749]
        }
      ],
      "sources": [
        {
          "id": "NASA",
          "url": "https://earthobservatory.nasa.gov/..."
        }
      ],
      "closed": null
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request data. Please check your input."
}
```

### 503 Service Unavailable
```json
{
  "detail": "Unable to fetch data from external services. Please try again later."
}
```

### 429 Too Many Requests
```json
{
  "detail": "Rate limit exceeded. Please try again later."
}
```

### 500 Internal Server Error
```json
{
  "detail": "An unexpected error occurred. Please try again later."
}
```

## Supported Event Categories

The API can detect and filter by these natural event categories:

- **Wildfires** - Forest and brush fires
- **Volcanoes** - Volcanic eruptions and activity
- **Floods** - Flooding events
- **Storms** - Severe weather and storms
- **Droughts** - Drought conditions
- **Landslides** - Landslide events
- **Snow** - Snow events
- **Ice** - Ice and iceberg events
- **Dust** - Dust storms and haze
- **Man-made** - Human-caused events

## Time Range Queries

You can specify time ranges in your queries:

- "today" - Events from today
- "yesterday" - Events from yesterday
- "past week" or "last week" - Events from the past 7 days
- "past month" or "last month" - Events from the past 30 days
- "past year" or "last year" - Events from the past 365 days

## Regional Queries

You can specify regions in your queries:

- "North America" or "USA" or "United States"
- "Europe"
- "Asia"
- "Africa"
- "Oceania" or "Australia"
- "South America"

## Example Queries

- "Show me recent wildfires"
- "What volcanoes are active in the past month?"
- "Are there any floods in Europe today?"
- "Tell me about storms in the past week"
- "Show me all natural events in Asia"

## Data Source

This API uses NASA's EONET (Earth Observatory Natural Event Tracker) API as the primary data source for natural events. EONET provides real-time data about events that can be observed from space.
