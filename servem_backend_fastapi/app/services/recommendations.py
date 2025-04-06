from typing import List, Dict, Optional
from uuid import UUID
import numpy as np
from datetime import datetime

from ..models.event import EventRecommendation
from ..database import supabase

def get_event_recommendations(volunteer_id: UUID, volunteer: Dict, events: List[Dict], limit: int = 5) -> List[EventRecommendation]:
    """
    Get event recommendations for a volunteer.
    """
    # Get volunteer's skills and interests
    volunteer_skills = volunteer.get("skills", [])
    volunteer_interests = volunteer.get("interests", [])
    
    # Get volunteer's past events
    past_events_response = supabase.table("event_volunteers").select(
        "event_id"
    ).eq("volunteer_id", str(volunteer_id)).execute()
    
    past_event_ids = [e["event_id"] for e in past_events_response.data] if past_events_response.data else []
    
    # Filter out events the volunteer is already registered for
    available_events = [event for event in events if event["id"] not in past_event_ids]
    
    if not available_events:
        return []
    
    # Calculate match scores for each event
    recommendations = []
    
    for event in available_events:
        # Calculate skill match
        required_skills = event.get("required_skills", [])
        
        if not volunteer_skills or not required_skills:
            skill_match = 0
        else:
            matching_skills = [skill for skill in required_skills if skill in volunteer_skills]
            skill_match = len(matching_skills) / len(required_skills) if required_skills else 0
        
        # Calculate interest match
        event_category = event.get("category")
        
        interest_match = 1 if event_category in volunteer_interests else 0
        
        # Calculate location match (simplified)
        location_match = 0.5  # Default value
        
        # Calculate time match (simplified)
        time_match = 0.5  # Default value
        
        # Calculate overall match score
        match_score = (skill_match * 0.4) + (interest_match * 0.3) + (location_match * 0.15) + (time_match * 0.15)
        
        recommendations.append(EventRecommendation(
            event_id=event["id"],
            title=event["title"],
            description=event.get("description"),
            start_datetime=event["start_datetime"],
            end_datetime=event.get("end_datetime"),
            location=event.get("location"),
            category=event.get("category"),
            match_score=match_score,
            skill_match=skill_match,
            interest_match=interest_match,
            location_match=location_match,
            time_match=time_match
        ))
    
    # Sort by match score (descending)
    recommendations.sort(key=lambda x: x.match_score, reverse=True)
    
    return recommendations[:limit]
