import pytest
from fastapi.testclient import TestClient
from uuid import uuid4

from app.main import app
from app.services.statistics import get_volunteer_stats, get_event_stats, get_organization_stats

# Create test client
client = TestClient(app)

def test_get_volunteer_stats_endpoint():
    """
    Test the volunteer statistics endpoint.
    """
    # Create a random UUID
    volunteer_id = str(uuid4())
    
    # Make request
    response = client.get(f"/api/statistics/volunteer/{volunteer_id}")
    
    # We expect a response (might be empty stats for non-existent volunteer)
    assert response.status_code in [200, 404]

def test_get_event_stats_endpoint():
    """
    Test the event statistics endpoint.
    """
    # Create a random UUID
    event_id = str(uuid4())
    
    # Make request
    response = client.get(f"/api/statistics/event/{event_id}")
    
    # We expect a response (might be empty stats for non-existent event)
    assert response.status_code in [200, 404]

def test_get_organization_stats_endpoint():
    """
    Test the organization statistics endpoint.
    """
    # Make request
    response = client.get("/api/statistics/organization")
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert "total_volunteers" in data
    assert "active_volunteers" in data
    assert "total_events" in data