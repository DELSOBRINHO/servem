from typing import List, Dict, Optional
from uuid import UUID
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from ..models.event import EventRecommendation
from ..database import supabase
from ..utils.geo import calculate_distance

def recommend_events_for_volunteer(volunteer_id: UUID, limit: int = 5) -> List[EventRecommendation]:
    """
    Recommend events for a volunteer based on their skills, interests, and location.
    """
    # Get volunteer data
    volunteer_response = supabase.table("volunteers").select(
        "id, skills, interests, location, availability"
    ).eq("id", str(volunteer_id)).execute()
    
    if not volunteer_response.data:
        raise ValueError(f"Volunteer with ID {volunteer_id} not found")
    
    volunteer = volunteer_response.data[0]
    
    # Get upcoming events
    now = datetime.now()
    events_response = supabase.table("events").select(
        "id, title, description, start_datetime, end_datetime, location, required_skills, category"
    ).gt("start_datetime", now.isoformat()).execute()
    
    if not events_response.data:
        return []
    
    # Get events the volunteer is already signed up for
    signed_up_response = supabase.table("event_volunteers").select(
        "event_id"
    ).eq("volunteer_id", str(volunteer_id)).execute()
    
    signed_up_event_ids = [e["event_id"] for e in signed_up_response.data] if signed_up_response.data else []
    
    # Filter out events the volunteer is already signed up for
    available_events = [e for e in events_response.data if e["id"] not in signed_up_event_ids]
    
    # Calculate scores for each event
    scored_events = []
    
    for event in available_events:
        # Skill match score
        volunteer_skills = set(volunteer.get("skills", []))
        event_skills = set(event.get("required_skills", []))
        
        if event_skills and volunteer_skills:
            skill_match = len(volunteer_skills & event_skills) / len(event_skills)
        else:
            skill_match = 0.5  # Neutral score if no skills specified
        
        # Interest match score
        volunteer_interests = set(volunteer.get("interests", []))
        event_category = event.get("category", "")
        
        interest_match = 1.0 if event_category in volunteer_interests else 0.5
        
        # Location match score
        location_match = 1.0  # Default if no location data
        
        if volunteer.get("location") and event.get("location"):
            vol_lat = volunteer["location"].get("latitude")
            vol_lon = volunteer["location"].get("longitude")
            event_lat = event["location"].get("latitude")
            event_lon = event["location"].get("longitude")
            
            if vol_lat and vol_lon and event_lat and event_lon:
                distance = calculate_distance(vol_lat, vol_lon, event_lat, event_lon)
                # Score decreases as distance increases (up to 50km)
                location_match = max(0, 1 - (distance / 50))
        
        # Availability match score
        availability_match = 1.0  # Default if no availability data
        
        if volunteer.get("availability") and event.get("start_datetime"):
            event_start = datetime.fromisoformat(event["start_datetime"])
            event_day = event_start.strftime("%A").lower()
            event_hour = event_start.hour
            
            # Check if the volunteer is available at this time
            day_availability = volunteer["availability"].get(event_day, [])
            
            if day_availability:
                # Check if the event time falls within any of the volunteer's available time slots
                is_available = False
                for slot in day_availability:
                    start_hour = slot.get("start", 0)
                    end_hour = slot.get("end", 24)
                    
                    if start_hour <= event_hour < end_hour:
                        is_available = True
                        break
                
                availability_match = 1.0 if is_available else 0.2
        
        # Combined score (weighted)
        combined_score = (
            0.4 * skill_match +
            0.2 * interest_match +
            0.2 * location_match +
            0.2 * availability_match
        )
        
        # Add to scored events
        scored_events.append({
            "event": event,
            "score": combined_score,
            "skill_match": skill_match,
            "interest_match": interest_match,
            "location_match": location_match,
            "availability_match": availability_match
        })
    
    # Sort by score (descending)
    scored_events.sort(key=lambda x: x["score"], reverse=True)
    
    # Convert to EventRecommendation objects
    recommendations = []
    for item in scored_events[:limit]:
        event = item["event"]
        recommendations.append(
            EventRecommendation(
                event_id=event["id"],
                title=event["title"],
                description=event.get("description", ""),
                start_datetime=event["start_datetime"],
                end_datetime=event.get("end_datetime"),
                location=event.get("location"),
                match_score=item["score"],
                skill_match=item["skill_match"],
                interest_match=item["interest_match"],
                location_match=item["location_match"],
                availability_match=item["availability_match"]
            )
        )
    
    return recommendations

def get_collaborative_recommendations(volunteer_id: UUID, limit: int = 5) -> List[Dict]:
    """
    Get event recommendations based on collaborative filtering.
    """
    # Get all volunteer-event interactions
    interactions_response = supabase.table("event_volunteers").select(
        "volunteer_id, event_id, status"
    ).execute()
    
    if not interactions_response.data:
        return []
    
    # Convert to DataFrame
    df = pd.DataFrame(interactions_response.data)
    
    # Create a volunteer-event matrix (1 if participated, 0 otherwise)
    volunteer_event_matrix = pd.crosstab(df['volunteer_id'], df['event_id'])
    
    # Check if the volunteer exists in the matrix
    if str(volunteer_id) not in volunteer_event_matrix.index:
        return []
    
    # Calculate volunteer similarity using cosine similarity
    volunteer_similarity = pd.DataFrame(
        cosine_similarity(volunteer_event_matrix),
        index=volunteer_event_matrix.index,
        columns=volunteer_event_matrix.index
    )
    
    # Get similar volunteers
    similar_volunteers = volunteer_similarity[str(volunteer_id)].sort_values(ascending=False)[1:11]  # Top 10 similar volunteers
    
    # Get events that similar volunteers participated in but the target volunteer didn't
    target_volunteer_events = set(volunteer_event_matrix.loc[str(volunteer_id)][volunteer_event_matrix.loc[str(volunteer_id)] > 0].index)
    
    # Collect recommended events with scores
    event_scores = {}
    
    for similar_vol, similarity in similar_volunteers.items():
        similar_vol_events = set(volunteer_event_matrix.loc[similar_vol][volunteer_event_matrix.loc[similar_vol] > 0].index)
        
        # Find events the similar volunteer participated in but the target volunteer didn't
        new_events = similar_vol_events - target_volunteer_events
        
        # Add to event scores, weighted by similarity
        for event_id in new_events:
            if event_id in event_scores:
                event_scores[event_id] += similarity
            else:
                event_scores[event_id] = similarity
    
    # Sort events by score
    sorted_events = sorted(event_scores.items(), key=lambda x: x[1], reverse=True)
    
    # Get event details
    recommended_events = []
    for event_id, score in sorted_events[:limit]:
        event_response = supabase.table("events").select(
            "id, title, description, start_datetime, location"
        ).eq("id", event_id).execute()
        
        if event_response.data:
            event = event_response.data[0]
            recommended_events.append({
                "event_id": event["id"],
                "title": event["title"],
                "description": event.get("description", ""),
                "start_datetime": event["start_datetime"],
                "location": event.get("location"),
                "collaborative_score": score
            })
    
    return recommended_events