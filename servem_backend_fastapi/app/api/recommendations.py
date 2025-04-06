from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Optional
from uuid import UUID

from ..models.event import EventRecommendation
from ..api.auth import get_current_volunteer
from ..services.recommendations import get_event_recommendations
from ..database import supabase

router = APIRouter()

@router.get("/events", response_model=List[EventRecommendation])
async def get_recommended_events(
    limit: int = 5,
    current_volunteer: Dict = Depends(get_current_volunteer)
):
    """
    Get event recommendations for the current volunteer.
    """
    volunteer_id = UUID(current_volunteer["id"])
    
    # Get volunteer profile data
    volunteer = current_volunteer
    
    # Get active events
    events_response = supabase.table("events").select("*").eq("status", "active").execute()
    
    if not events_response.data:
        return []
    
    events = events_response.data
    
    # Get recommendations
    recommendations = get_event_recommendations(volunteer_id, volunteer, events, limit)
    
    return recommendations

@router.get("/skills")
async def get_skill_recommendations(current_volunteer: Dict = Depends(get_current_volunteer)):
    """
    Get skill recommendations for the current volunteer.
    """
    # Get volunteer's current skills
    current_skills = current_volunteer.get("skills", [])
    
    # Get popular skills from events
    events_response = supabase.table("events").select("required_skills").execute()
    
    if not events_response.data:
        return {"recommended_skills": []}
    
    # Extract all skills from events
    all_skills = []
    for event in events_response.data:
        if event.get("required_skills"):
            all_skills.extend(event["required_skills"])
    
    # Count skill occurrences
    skill_counts = {}
    for skill in all_skills:
        if skill in skill_counts:
            skill_counts[skill] += 1
        else:
            skill_counts[skill] = 1
    
    # Filter out skills the volunteer already has
    recommended_skills = []
    for skill, count in sorted(skill_counts.items(), key=lambda x: x[1], reverse=True):
        if skill not in current_skills:
            recommended_skills.append({
                "name": skill,
                "popularity": count
            })
    
    return {"recommended_skills": recommended_skills[:5]}

@router.get("/volunteers/{event_id}")
async def get_volunteer_recommendations(
    event_id: UUID,
    limit: int = 5,
    current_volunteer: Dict = Depends(get_current_volunteer)
):
    """
    Get volunteer recommendations for an event. Only available to event organizers.
    """
    # Check if current volunteer is the organizer of the event
    event_response = supabase.table("events").select("organizer_id").eq("id", str(event_id)).execute()
    
    if not event_response.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event_response.data[0]["organizer_id"] != current_volunteer["id"]:
        raise HTTPException(status_code=403, detail="Only the event organizer can view volunteer recommendations")
    
    # Get event details
    event_details_response = supabase.table("events").select("*").eq("id", str(event_id)).execute()
    
    if not event_details_response.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event = event_details_response.data[0]
    
    # Get all volunteers
    volunteers_response = supabase.table("volunteers").select("*").execute()
    
    if not volunteers_response.data:
        return []
    
    volunteers = volunteers_response.data
    
    # Calculate match scores
    recommendations = []
    
    for volunteer in volunteers:
        # Skip the organizer
        if volunteer["id"] == current_volunteer["id"]:
            continue
        
        # Calculate skill match
        volunteer_skills = volunteer.get("skills", [])
        required_skills = event.get("required_skills", [])
        
        if not volunteer_skills or not required_skills:
            skill_match = 0
        else:
            matching_skills = [skill for skill in required_skills if skill in volunteer_skills]
            skill_match = len(matching_skills) / len(required_skills) if required_skills else 0
        
        # Calculate interest match
        volunteer_interests = volunteer.get("interests", [])
        event_category = event.get("category")
        
        interest_match = 1 if event_category in volunteer_interests else 0
        
        # Calculate location match (simplified)
        location_match = 0.5  # Default value
        
        # Calculate availability match (simplified)
        availability_match = 0.5  # Default value
        
        # Calculate overall match score
        match_score = (skill_match * 0.4) + (interest_match * 0.3) + (location_match * 0.15) + (availability_match * 0.15)
        
        recommendations.append({
            "volunteer_id": volunteer["id"],
            "name": volunteer["name"],
            "email": volunteer["email"],
            "profile_image": volunteer.get("profile_image"),
            "match_score": match_score,
            "skill_match": skill_match,
            "interest_match": interest_match,
            "location_match": location_match,
            "availability_match": availability_match
        })
    
    # Sort by match score (descending)
    recommendations.sort(key=lambda x: x["match_score"], reverse=True)
    
    return recommendations[:limit]