from fastapi import APIRouter, HTTPException, Depends, Query, File, UploadFile
from typing import List, Dict, Optional
from uuid import UUID
import base64

from ..models.volunteer import Volunteer, VolunteerUpdate, VolunteerProfile
from ..api.auth import get_current_volunteer
from ..database import supabase

router = APIRouter()

@router.get("/", response_model=List[Volunteer])
async def get_volunteers(
    name: Optional[str] = None,
    skill: Optional[str] = None,
    interest: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    current_volunteer: Dict = Depends(get_current_volunteer)
):
    """
    Get volunteers with optional filtering.
    """
    query = supabase.table("volunteers").select("*")
    
    # Apply filters
    if name:
        query = query.ilike("name", f"%{name}%")
    
    if skill:
        # This is a simplification - in a real database, you'd need a more complex query
        # for array containment
        query = query.contains("skills", [skill])
    
    if interest:
        # This is a simplification - in a real database, you'd need a more complex query
        # for array containment
        query = query.contains("interests", [interest])
    
    # Apply pagination
    query = query.range(offset, offset + limit - 1)
    
    # Execute query
    response = query.execute()
    
    if not response.data:
        return []
    
    # For each volunteer, get additional stats
    volunteers = response.data
    for volunteer in volunteers:
        # Get events participated
        events_response = supabase.table("event_volunteers").select(
            "id", count="exact"
        ).eq("volunteer_id", volunteer["id"]).eq("status", "attended").execute()
        
        volunteer["events_participated"] = events_response.count if events_response.count is not None else 0
        
        # Get hours served
        hours_response = supabase.table("event_volunteers").select(
            "hours_served"
        ).eq("volunteer_id", volunteer["id"]).execute()
        
        total_hours = sum(event.get("hours_served", 0) for event in hours_response.data) if hours_response.data else 0
        volunteer["hours_served"] = total_hours
    
    return volunteers

@router.get("/{volunteer_id}", response_model=VolunteerProfile)
async def get_volunteer(
    volunteer_id: UUID,
    current_volunteer: Dict = Depends(get_current_volunteer)
):
    """
    Get a specific volunteer by ID.
    """
    response = supabase.table("volunteers").select("*").eq("id", str(volunteer_id)).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    
    volunteer = response.data[0]
    
    # Get events participated
    events_response = supabase.table("event_volunteers").select(
        "id", count="exact"
    ).eq("volunteer_id", str(volunteer_id)).eq("status", "attended").execute()
    
    volunteer["events_participated"] = events_response.count if events_response.count is not None else 0
    
    # Get hours served
    hours_response = supabase.table("event_volunteers").select(
        "hours_served"
    ).eq("volunteer_id", str(volunteer_id)).execute()
    
    total_hours = sum(event.get("hours_served", 0) for event in hours_response.data) if hours_response.data else 0
    volunteer["hours_served"] = total_hours
    
    # Get badges
    badges_response = supabase.table("volunteer_badges").select(
        "badge_id, awarded_at, reason"
    ).eq("volunteer_id", str(volunteer_id)).execute()
    
    if badges_response.data:
        badge_ids = [b["badge_id"] for b in badges_response.data]
        badges_details_response = supabase.table("badges").select(
            "id, name, description, image_url, category"
        ).in_("id", badge_ids).execute()
        
        badges = []
        badge_details = {b["id"]: b for b in badges_details_response.data} if badges_details_response.data else {}
        
        for volunteer_badge in badges_response.data:
            badge_id = volunteer_badge["badge_id"]
            if badge_id in badge_details:
                badge = badge_details[badge_id]
                badges.append({
                    "id": badge["id"],
                    "name": badge["name"],
                    "description": badge["description"],
                    "image_url": badge["image_url"],
                    "category": badge.get("category"),
                    "awarded_at": volunteer_badge["awarded_at"],
                    "reason": volunteer_badge.get("reason")
                })
        
        volunteer["badges"] = badges
    else:
        volunteer["badges"] = []
    
    # Get achievements
    achievements_response = supabase.table("volunteer_achievements").select(
        "achievement_id, awarded_at, progress"
    ).eq("volunteer_id", str(volunteer_id)).execute()
    
    if achievements_response.data:
        achievement_ids = [a["achievement_id"] for a in achievements_response.data]
        achievements_details_response = supabase.table("achievements").select(
            "id, name, description, image_url, category, points_value"
        ).in_("id", achievement_ids).execute()
        
        achievements = []
        achievement_details = {a["id"]: a for a in achievements_details_response.data} if achievements_details_response.data else {}
        
        for volunteer_achievement in achievements_response.data:
            achievement_id = volunteer_achievement["achievement_id"]
            if achievement_id in achievement_details:
                achievement = achievement_details[achievement_id]
                achievements.append({
                    "id": achievement["id"],
                    "name": achievement["name"],
                    "description": achievement["description"],
                    "image_url": achievement["image_url"],
                    "category": achievement.get("category"),
                    "points_value": achievement.get("points_value", 0),
                    "awarded_at": volunteer_achievement["awarded_at"],
                    "progress": volunteer_achievement.get("progress", 1.0)
                })
        
        volunteer["achievements"] = achievements
    else:
        volunteer["achievements"] = []
    
    return volunteer

@router.put("/me", response_model=Volunteer)
async def update_volunteer(
    volunteer_update: VolunteerUpdate,
    current_volunteer: Dict = Depends(get_current_volunteer)
):
    """
    Update the current volunteer's profile.
    """
    # Prepare update data
    update_data = volunteer_update.dict(exclude_unset=True)
    update_data["updated_at"] = "now()"
    
    # Update in database
    response = supabase.table("volunteers").update(update_data).eq("id", current_volunteer["id"]).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update volunteer")
    
    return response.data[0]

@router.post("/me/profile-image")
async def upload_profile_image(
    file: UploadFile = File(...),
    current_volunteer: Dict = Depends(get_current_volunteer)
):
    """
    Upload a profile image for the current volunteer.
    """
    # Read file content
    contents = await file.read()
    
    # Convert to base64 for storage
    base64_image = base64.b64encode(contents).decode("utf-8")
    
    # Update volunteer profile
    response = supabase.table("volunteers").update({
        "profile_image": base64_image,
        "updated_at": "now()"
    }).eq("id", current_volunteer["id"]).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to upload profile image")
    
    return {"message": "Profile image uploaded successfully"}

@router.get("/me/events", response_model=List[Dict])
async def get_volunteer_events(
    status: Optional[str] = None,
    current_volunteer: Dict = Depends(get_current_volunteer)
):
    """
    Get all events the current volunteer is registered for.
    """
    query = """
    SELECT 
        e.id, e.title, e.description, e.start_datetime, e.end_datetime,
        e.location, e.category, e.status,
        ev.status as registration_status, ev.hours_served, ev.created_at as registered_at
    FROM 
        event_volunteers ev
    JOIN 
        events e ON ev.event_id = e.id
    WHERE 
        ev.volunteer_id = ?
    """
    
    if status:
        query += f" AND e.status = '{status}'"
    
    response = supabase.rpc("get_volunteer_events", {
        "volunteer_id_param": current_volunteer["id"],
        "status_param": status
    }).execute()
    
    if not response.data:
        return []
    
    return response.data

@router.get("/me/stats")
async def get_volunteer_stats(current_volunteer: Dict = Depends(get_current_volunteer)):
    """
    Get statistics for the current volunteer.
    """
    # Get events participated
    events_response = supabase.table("event_volunteers").select(
        "id", count="exact"
    ).eq("volunteer_id", current_volunteer["id"]).eq("status", "attended").execute()
    
    events_participated = events_response.count if events_response.count is not None else 0
    
    # Get hours served
    hours_response = supabase.table("event_volunteers").select(
        "hours_served"
    ).eq("volunteer_id", current_volunteer["id"]).execute()
    
    total_hours = sum(event.get("hours_served", 0) for event in hours_response.data) if hours_response.data else 0
    
    # Get badges count
    badges_response = supabase.table("volunteer_badges").select(
        "id", count="exact"
    ).eq("volunteer_id", current_volunteer["id"]).execute()
    
    badges_count = badges_response.count if badges_response.count is not None else 0
    
    # Get achievements count
    achievements_response = supabase.table("volunteer_achievements").select(
        "id", count="exact"
    ).eq("volunteer_id", current_volunteer["id"]).execute()
    
    achievements_count = achievements_response.count if achievements_response.count is not None else 0
    
    # Get points
    points = current_volunteer.get("points", 0)
    
    return {
        "events_participated": events_participated,
        "hours_served": total_hours,
        "badges_count": badges_count,
        "achievements_count": achievements_count,
        "points": points
    }