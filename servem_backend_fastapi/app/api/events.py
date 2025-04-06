from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Dict, Optional
from uuid import UUID
from datetime import datetime

from ..models.event import Event, EventCreate, EventUpdate
from ..api.auth import get_current_volunteer
from ..database import supabase

router = APIRouter()

@router.post("/", response_model=Event)
async def create_event(event: EventCreate, current_volunteer: Dict = Depends(get_current_volunteer)):
    """
    Create a new event.
    """
    # Prepare event data
    event_data = event.dict()
    event_data["created_at"] = "now()"
    
    # Insert into database
    response = supabase.table("events").insert(event_data).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create event")
    
    return response.data[0]

@router.get("/", response_model=List[Event])
async def get_events(
    status: Optional[str] = None,
    category: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    organizer_id: Optional[UUID] = None,
    skill: Optional[str] = None,
    limit: int = 100,
    offset: int = 0
):
    """
    Get events with optional filtering.
    """
    query = supabase.table("events").select("*")
    
    # Apply filters
    if status:
        query = query.eq("status", status)
    
    if category:
        query = query.eq("category", category)
    
    if start_date:
        query = query.gte("start_datetime", start_date.isoformat())
    
    if end_date:
        query = query.lte("start_datetime", end_date.isoformat())
    
    if organizer_id:
        query = query.eq("organizer_id", str(organizer_id))
    
    if skill:
        # This is a simplification - in a real database, you'd need a more complex query
        # for array containment
        query = query.contains("required_skills", [skill])
    
    # Apply pagination
    query = query.range(offset, offset + limit - 1)
    
    # Execute query
    response = query.execute()
    
    if not response.data:
        return []
    
    # For each event, get the current number of volunteers
    events = response.data
    for event in events:
        volunteers_response = supabase.table("event_volunteers").select(
            "id", count="exact"
        ).eq("event_id", event["id"]).execute()
        
        event["current_volunteers"] = volunteers_response.count if volunteers_response.count is not None else 0
    
    return events

@router.get("/{event_id}", response_model=Event)
async def get_event(event_id: UUID):
    """
    Get a specific event by ID.
    """
    response = supabase.table("events").select("*").eq("id", str(event_id)).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event = response.data[0]
    
    # Get the current number of volunteers
    volunteers_response = supabase.table("event_volunteers").select(
        "id", count="exact"
    ).eq("event_id", str(event_id)).execute()
    
    event["current_volunteers"] = volunteers_response.count if volunteers_response.count is not None else 0
    
    return event

@router.put("/{event_id}", response_model=Event)
async def update_event(
    event_id: UUID,
    event_update: EventUpdate,
    current_volunteer: Dict = Depends(get_current_volunteer)
):
    """
    Update an event.
    """
    # Check if event exists and user is the organizer
    event_response = supabase.table("events").select("organizer_id").eq("id", str(event_id)).execute()
    
    if not event_response.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    organizer_id = event_response.data[0]["organizer_id"]
    
    if organizer_id != current_volunteer["id"]:
        raise HTTPException(status_code=403, detail="You don't have permission to update this event")
    
    # Prepare update data
    update_data = event_update.dict(exclude_unset=True)
    update_data["updated_at"] = "now()"
    
    # Update in database
    response = supabase.table("events").update(update_data).eq("id", str(event_id)).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update event")
    
    return response.data[0]

@router.delete("/{event_id}")
async def delete_event(event_id: UUID, current_volunteer: Dict = Depends(get_current_volunteer)):
    """
    Delete an event.
    """
    # Check if event exists and user is the organizer
    event_response = supabase.table("events").select("organizer_id").eq("id", str(event_id)).execute()
    
    if not event_response.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    organizer_id = event_response.data[0]["organizer_id"]
    
    if organizer_id != current_volunteer["id"]:
        raise HTTPException(status_code=403, detail="You don't have permission to delete this event")
    
    # Delete from database
    response = supabase.table("events").delete().eq("id", str(event_id)).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to delete event")
    
    return {"message": "Event deleted successfully"}

@router.post("/{event_id}/register")
async def register_for_event(event_id: UUID, current_volunteer: Dict = Depends(get_current_volunteer)):
    """
    Register the current volunteer for an event.
    """
    # Check if event exists
    event_response = supabase.table("events").select("id, status").eq("id", str(event_id)).execute()
    
    if not event_response.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event = event_response.data[0]
    
    if event["status"] != "active":
        raise HTTPException(status_code=400, detail="Event is not active")
    
    # Check if volunteer is already registered
    registration_response = supabase.table("event_volunteers").select("id").eq(
        "event_id", str(event_id)
    ).eq("volunteer_id", current_volunteer["id"]).execute()
    
    if registration_response.data:
        raise HTTPException(status_code=400, detail="You are already registered for this event")
    
    # Register volunteer
    registration_data = {
        "event_id": str(event_id),
        "volunteer_id": current_volunteer["id"],
        "status": "registered",
        "created_at": "now()"
    }
    
    response = supabase.table("event_volunteers").insert(registration_data).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to register for event")
    
    return {"message": "Successfully registered for event"}

@router.post("/{event_id}/cancel-registration")
async def cancel_event_registration(event_id: UUID, current_volunteer: Dict = Depends(get_current_volunteer)):
    """
    Cancel the current volunteer's registration for an event.
    """
    # Check if registration exists
    registration_response = supabase.table("event_volunteers").select("id").eq(
        "event_id", str(event_id)
    ).eq("volunteer_id", current_volunteer["id"]).execute()
    
    if not registration_response.data:
        raise HTTPException(status_code=404, detail="You are not registered for this event")
    
    # Delete registration
    response = supabase.table("event_volunteers").delete().eq(
        "event_id", str(event_id)
    ).eq("volunteer_id", current_volunteer["id"]).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to cancel registration")
    
    return {"message": "Successfully cancelled event registration"}

@router.get("/{event_id}/volunteers", response_model=List[Dict])
async def get_event_volunteers(
    event_id: UUID,
    current_volunteer: Dict = Depends(get_current_volunteer)
):
    """
    Get all volunteers registered for an event.
    """
    # Check if event exists and user is the organizer
    event_response = supabase.table("events").select("organizer_id").eq("id", str(event_id)).execute()
    
    if not event_response.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    organizer_id = event_response.data[0]["organizer_id"]
    
    if organizer_id != current_volunteer["id"]:
        raise HTTPException(status_code=403, detail="You don't have permission to view this information")
    
    # Get volunteers
    query = """
    SELECT 
        v.id, v.name, v.email, v.profile_image,
        ev.status, ev.hours_served, ev.created_at as registered_at
    FROM 
        event_volunteers ev
    JOIN 
        volunteers v ON ev.volunteer_id = v.id
    WHERE 
        ev.event_id = ?
    """
    
    response = supabase.rpc("get_event_volunteers", {"event_id_param": str(event_id)}).execute()
    
    if not response.data:
        return []
    
    return response.data

@router.post("/{event_id}/complete")
async def complete_event(
    event_id: UUID,
    current_volunteer: Dict = Depends(get_current_volunteer)
):
    """
    Mark an event as completed.
    """
    # Check if event exists and user is the organizer
    event_response = supabase.table("events").select("organizer_id, status").eq("id", str(event_id)).execute()
    
    if not event_response.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event = event_response.data[0]
    
    if event["organizer_id"] != current_volunteer["id"]:
        raise HTTPException(status_code=403, detail="You don't have permission to complete this event")
    
    if event["status"] != "active":
        raise HTTPException(status_code=400, detail="Only active events can be completed")
    
    # Update event status
    update_response = supabase.table("events").update({
        "status": "completed",
        "updated_at": "now()"
    }).eq("id", str(event_id)).execute()
    
    if not update_response.data:
        raise HTTPException(status_code=500, detail="Failed to complete event")
    
    # Award points to volunteers who participated
    volunteers_response = supabase.table("event_volunteers").select(
        "volunteer_id, status"
    ).eq("event_id", str(event_id)).eq("status", "attended").execute()
    
    if volunteers_response.data:
        for volunteer in volunteers_response.data:
            # Award points for participation
            points_data = {
                "volunteer_id": volunteer["volunteer_id"],
                "points": 10,  # Base points for participation
                "reason": f"Participated in event: {update_response.data[0]['title']}",
                "category": "events",
                "created_at": "now()"
            }
            
            supabase.table("volunteer_points").insert(points_data).execute()
            
            # Update volunteer's total points
            volunteer_response = supabase.table("volunteers").select("points").eq("id", volunteer["volunteer_id"]).execute()
            
            if volunteer_response.data:
                current_points = volunteer_response.data[0].get("points", 0)
                
                supabase.table("volunteers").update({
                    "points": current_points + 10
                }).eq("id", volunteer["volunteer_id"]).execute()
    
    return {"message": "Event completed successfully"}

@router.post("/{event_id}/record-attendance")
async def record_attendance(
    event_id: UUID,
    volunteer_id: UUID,
    hours_served: float,
    current_volunteer: Dict = Depends(get_current_volunteer)
):
    """
    Record a volunteer's attendance and hours served for an event.
    """
    # Check if event exists and user is the organizer
    event_response = supabase.table("events").select("organizer_id").eq("id", str(event_id)).execute()
    
    if not event_response.data:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event_response.data[0]["organizer_id"] != current_volunteer["id"]:
        raise HTTPException(status_code=403, detail="You don't have permission to record attendance")
    
    # Check if volunteer is registered for the event
    registration_response = supabase.table("event_volunteers").select("id").eq(
        "event_id", str(event_id)
    ).eq("volunteer_id", str(volunteer_id)).execute()
    
    if not registration_response.data:
        raise HTTPException(status_code=404, detail="Volunteer is not registered for this event")
    
    # Update attendance
    update_data = {
        "status": "attended",
        "hours_served": hours_served,
        "updated_at": "now()"
    }
    
    response = supabase.table("event_volunteers").update(update_data).eq(
        "event_id", str(event_id)
    ).eq("volunteer_id", str(volunteer_id)).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to record attendance")
    
    # Award additional points based on hours served
    additional_points = int(hours_served * 5)  # 5 points per hour
    
    if additional_points > 0:
        points_data = {
            "volunteer_id": str(volunteer_id),
            "points": additional_points,
            "reason": f"Served {hours_served} hours at event",
            "category": "hours",
            "created_at": "now()"
        }
        
        supabase.table("volunteer_points").insert(points_data).execute()
        
        # Update volunteer's total points
        volunteer_response = supabase.table("volunteers").select("points").eq("id", str(volunteer_id)).execute()
        
        if volunteer_response.data:
            current_points = volunteer_response.data[0].get("points", 0)
            
            supabase.table("volunteers").update({
                "points": current_points + additional_points
            }).eq("id", str(volunteer_id)).execute()
    
    return {"message": "Attendance recorded successfully"}
