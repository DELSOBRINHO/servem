from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Dict, Optional
from uuid import UUID

from ..models.gamification import Badge, Achievement, LeaderboardEntry
from ..api.auth import get_current_volunteer
from ..services.gamification import get_volunteer_badges, get_volunteer_achievements, get_leaderboard, award_points, award_badge
from ..database import supabase

router = APIRouter()

@router.get("/badges", response_model=List[Badge])
async def get_badges(current_volunteer: Dict = Depends(get_current_volunteer)):
    """
    Get all badges earned by the current volunteer.
    """
    return get_volunteer_badges(UUID(current_volunteer["id"]))

@router.get("/achievements", response_model=List[Achievement])
async def get_achievements(current_volunteer: Dict = Depends(get_current_volunteer)):
    """
    Get all achievements earned by the current volunteer.
    """
    return get_volunteer_achievements(UUID(current_volunteer["id"]))

@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_volunteer_leaderboard(
    timeframe: str = Query("all_time", enum=["weekly", "monthly", "yearly", "all_time"]),
    category: Optional[str] = None,
    limit: int = 10
):
    """
    Get the volunteer leaderboard.
    """
    return get_leaderboard(timeframe, category, limit)

@router.post("/award-points")
async def award_volunteer_points(
    volunteer_id: UUID,
    points: int,
    reason: str,
    category: Optional[str] = None,
    current_volunteer: Dict = Depends(get_current_volunteer)
):
    """
    Award points to a volunteer. Only available to organizers.
    """
    # Check if current volunteer is an organizer
    if not current_volunteer.get("is_organizer", False):
        raise HTTPException(status_code=403, detail="Only organizers can award points")
    
    return award_points(volunteer_id, points, reason, category)

@router.post("/award-badge")
async def award_volunteer_badge(
    volunteer_id: UUID,
    badge_id: str,
    reason: Optional[str] = None,
    current_volunteer: Dict = Depends(get_current_volunteer)
):
    """
    Award a badge to a volunteer. Only available to organizers.
    """
    # Check if current volunteer is an organizer
    if not current_volunteer.get("is_organizer", False):
        raise HTTPException(status_code=403, detail="Only organizers can award badges")
    
    return award_badge(volunteer_id, badge_id, reason)

@router.get("/available-badges")
async def get_available_badges():
    """
    Get all available badges that can be earned.
    """
    response = supabase.table("badges").select("*").execute()
    
    if not response.data:
        return []
    
    return response.data

@router.get("/available-achievements")
async def get_available_achievements():
    """
    Get all available achievements that can be earned.
    """
    response = supabase.table("achievements").select("*").execute()
    
    if not response.data:
        return []
    
    return response.data