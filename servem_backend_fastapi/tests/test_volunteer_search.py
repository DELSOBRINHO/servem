import pytest
from fastapi.testclient import TestClient
from uuid import uuid4, UUID

from app.main import app
from app.models.volunteer import VolunteerSearchParams
from app.services.volunteer_search import search_volunteers_by_location_and_skills

# Create test client
client = TestClient(app)

def test_search_volunteers_endpoint():
    """
    Test the volunteer search endpoint.
    """
    # Test parameters
    params = {
        "latitude": -23.5505,
        "longitude": -46.6333,
        "max_distance_km": 10.0,
        "skills": ["music", "teaching"]
    }
    
    # Make request
    response = client.get("/api/volunteers/search", params=params)
    
    # Check response
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_volunteer_endpoint():
    """
    Test the get volunteer endpoint.
    """
    # Create a random UUID (this will likely 404 but we're testing the endpoint structure)
    volunteer_id = str(uuid4())
    
    # Make request
    response = client.get(f"/api/volunteers/{volunteer_id}")
    
    # We expect a 404 for a random UUID, but the endpoint should exist
    assert response.status_code in [200, 404]
    if response.status_code == 404:
        assert "Volunteer not found" in response.json().get("detail", "")