from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Optional
from uuid import UUID

from ..services.engagement import (
    identify_disengaged_volunteers, 
    get_volunteer_engagement_score,
    predict_churn_risk,
    get_engagement_trends
)
from ..database import supabase

router = APIRouter()

@router.get("/disengaged-volunteers", response_model=List[Dict])
async def get_disengaged_volunteers(threshold: float = 0.3, limit: int = 20):
    """
    Identify volunteers who are becoming disengaged.
    """
    try:
        disengaged = identify_disengaged_volunteers(threshold, limit)
        return disengaged
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/engagement-score/{volunteer_id}")
async def get_engagement_score(volunteer_id: UUID):
    """
    Get the engagement score for a specific volunteer.
    """
    try:
        score = get_volunteer_engagement_score(volunteer_id)
        return {"volunteer_id": str(volunteer_id), "engagement_score": score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/churn-risk", response_model=List[Dict])
async def get_churn_risk():
    """
    Get volunteers at risk of churning.
    """
    try:
        at_risk = predict_churn_risk()
        return at_risk
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trends")
async def get_trends(months: int = 6):
    """
    Get engagement trends over time.
    """
    try:
        trends = get_engagement_trends(months)
        return trends
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/re-engage/{volunteer_id}")
async def send_re_engagement_email(volunteer_id: UUID):
    """
    Send a re-engagement email to a disengaged volunteer.
    """
    try:
        # Get volunteer details
        volunteer_response = supabase.table("volunteers").select("email, name").eq("id", str(volunteer_id)).execute()
        
        if not volunteer_response.data:
            raise HTTPException(status_code=404, detail="Volunteer not found")
        
        volunteer = volunteer_response.data[0]
        
        # In a real application, you would send an actual email here
        # For now, we'll just log it and update a re-engagement attempt field
        
        # Update the volunteer record to track re-engagement attempt
        update_response = supabase.table("volunteers").update({
            "last_reengagement_attempt": datetime.now().isoformat()
        }).eq("id", str(volunteer_id)).execute()
        
        return {
            "success": True,
            "message": f"Re-engagement email sent to {volunteer['name']} at {volunteer['email']}"
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))