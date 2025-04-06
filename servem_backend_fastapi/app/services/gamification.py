from typing import List, Dict, Optional
from uuid import UUID
from datetime import datetime, timedelta

from ..models.gamification import Badge, Achievement, LeaderboardEntry
from ..database import supabase

def get_volunteer_badges(volunteer_id: UUID) -> List[Badge]:
    """
    Get all badges earned by a volunteer.
    """
    # Get volunteer badges
    badges_response = supabase.table("volunteer_badges").select(
        "badge_id, awarded_at, reason"
    ).eq("volunteer_id", str(volunteer_id)).execute()
    
    if not badges_response.data:
        return []
    
    # Get badge details
    badge_ids = [b["badge_id"] for b in badges_response.data]
    badges_details_response = supabase.table("badges").select(
        "id, name, description, image_url, category"
    ).in_("id", badge_ids).execute()
    
    if not badges_details_response.data:
        return []
    
    # Combine data
    badge_details = {b["id"]: b for b in badges_details_response.data}
    badges = []
    
    for volunteer_badge in badges_response.data:
        badge_id = volunteer_badge["badge_id"]
        if badge_id in badge_details:
            badge = badge_details[badge_id]
            badges.append(Badge(
                id=badge["id"],
                name=badge["name"],
                description=badge.get("description"),
                image_url=badge.get("image_url"),
                category=badge.get("category"),
                awarded_at=volunteer_badge["awarded_at"],
                reason=volunteer_badge.get("reason")
            ))
    
    return badges

def get_volunteer_achievements(volunteer_id: UUID) -> List[Achievement]:
    """
    Get all achievements earned by a volunteer.
    """
    # Get volunteer achievements
    achievements_response = supabase.table("volunteer_achievements").select(
        "achievement_id, awarded_at, progress"
    ).eq("volunteer_id", str(volunteer_id)).execute()
    
    if not achievements_response.data:
        return []
    
    # Get achievement details
    achievement_ids = [a["achievement_id"] for a in achievements_response.data]
    achievements_details_response = supabase.table("achievements").select(
        "id, name, description, image_url, category, points_value"
    ).in_("id", achievement_ids).execute()
    
    if not achievements_details_response.data:
        return []
    
    # Combine data
    achievement_details = {a["id"]: a for a in achievements_details_response.data}
    achievements = []
    
    for volunteer_achievement in achievements_response.data:
        achievement_id = volunteer_achievement["achievement_id"]
        if achievement_id in achievement_details:
            achievement = achievement_details[achievement_id]
            achievements.append(Achievement(
                id=achievement["id"],
                name=achievement["name"],
                description=achievement.get("description"),
                image_url=achievement.get("image_url"),
                category=achievement.get("category"),
                points_value=achievement.get("points_value", 0),
                awarded_at=volunteer_achievement["awarded_at"],
                progress=volunteer_achievement.get("progress", 1.0)
            ))
    
    return achievements

def get_leaderboard(timeframe: str, category: Optional[str] = None, limit: int = 10) -> List[LeaderboardEntry]:
    """
    Get the volunteer leaderboard.
    """
    # Determine date range based on timeframe
    now = datetime.now()
    start_date = None
    
    if timeframe == "weekly":
        start_date = now - timedelta(days=7)
    elif timeframe == "monthly":
        start_date = now - timedelta(days=30)
    elif timeframe == "yearly":
        start_date = now - timedelta(days=365)
    
    # Get points for all volunteers
    if start_date and category:
        points_query = supabase.rpc("get_leaderboard", {
            "start_date_param": start_date.isoformat(),
            "category_param": category,
            "limit_param": limit
        })
    elif start_date:
        points_query = supabase.rpc("get_leaderboard_by_date", {
            "start_date_param": start_date.isoformat(),
            "limit_param": limit
        })
    elif category:
        points_query = supabase.rpc("get_leaderboard_by_category", {
            "category_param": category,
            "limit_param": limit
        })
    else:
        points_query = supabase.rpc("get_leaderboard_all_time", {
            "limit_param": limit
        })
    
    response = points_query.execute()
    
    if not response.data:
        return []
    
    # Format leaderboard entries
    leaderboard = []
    for i, entry in enumerate(response.data):
        leaderboard.append(LeaderboardEntry(
            volunteer_id=entry["volunteer_id"],
            name=entry["name"],
            profile_image=entry.get("profile_image"),
            points=entry["points"],
            rank=i + 1,
            events_participated=entry.get("events_participated", 0),
            hours_served=entry.get("hours_served", 0),
            badges_count=entry.get("badges_count", 0)
        ))
    
    return leaderboard

def award_points(volunteer_id: UUID, points: int, reason: str, category: Optional[str] = None) -> Dict:
    """
    Award points to a volunteer.
    """
    # Prepare points data
    points_data = {
        "volunteer_id": str(volunteer_id),
        "points": points,
        "reason": reason,
        "category": category,
        "created_at": "now()"
    }
    
    # Insert points record
    points_response = supabase.table("volunteer_points").insert(points_data).execute()
    
    if not points_response.data:
        return {"success": False, "message": "Failed to award points"}
    
    # Update volunteer's total points
    volunteer_response = supabase.table("volunteers").select("points").eq("id", str(volunteer_id)).execute()
    
    if volunteer_response.data:
        current_points = volunteer_response.data[0].get("points", 0)
        
        update_response = supabase.table("volunteers").update({
            "points": current_points + points
        }).eq("id", str(volunteer_id)).execute()
        
        if not update_response.data:
            return {"success": False, "message": "Failed to update volunteer points"}
    
    # Check for achievements based on points
    check_point_achievements(volunteer_id)
    
    return {
        "success": True,
        "message": f"Successfully awarded {points} points to volunteer",
        "points_awarded": points
    }

def award_badge(volunteer_id: UUID, badge_id: str, reason: Optional[str] = None) -> Dict:
    """
    Award a badge to a volunteer.
    """
    # Check if badge exists
    badge_response = supabase.table("badges").select("id").eq("id", badge_id).execute()
    
    if not badge_response.data:
        return {"success": False, "message": "Badge not found"}
    
    # Check if volunteer already has this badge
    existing_badge_response = supabase.table("volunteer_badges").select("id").eq(
        "volunteer_id", str(volunteer_id)
    ).eq("badge_id", badge_id).execute()
    
    if existing_badge_response.data:
        return {"success": False, "message": "Volunteer already has this badge"}
    
    # Prepare badge data
    badge_data = {
        "volunteer_id": str(volunteer_id),
        "badge_id": badge_id,
        "reason": reason,
        "awarded_at": "now()"
    }
    
    # Insert badge record
    badge_response = supabase.table("volunteer_badges").insert(badge_data).execute()
    
    if not badge_response.data:
        return {"success": False, "message": "Failed to award badge"}
    
    # Award points for earning a badge
    points_data = {
        "volunteer_id": str(volunteer_id),
        "points": 50,  # Default points for earning a badge
        "reason": f"Earned badge: {badge_id}",
        "category": "badges",
        "created_at": "now()"
    }
    
    supabase.table("volunteer_points").insert(points_data).execute()
    
    # Update volunteer's total points
    volunteer_response = supabase.table("volunteers").select("points").eq("id", str(volunteer_id)).execute()
    
    if volunteer_response.data:
        current_points = volunteer_response.data[0].get("points", 0)
        
        supabase.table("volunteers").update({
            "points": current_points + 50
        }).eq("id", str(volunteer_id)).execute()
    
    return {
        "success": True,
        "message": "Successfully awarded badge to volunteer",
        "badge_id": badge_id
    }

def check_point_achievements(volunteer_id: UUID):
    """
    Check and award achievements based on points.
    """
    # Get volunteer's current points
    volunteer_response = supabase.table("volunteers").select("points").eq("id", str(volunteer_id)).execute()
    
    if not volunteer_response.data:
        return
    
    current_points = volunteer_response.data[0].get("points", 0)
    
    # Get point-based achievements
    achievements_response = supabase.table("achievements").select(
        "id, name, points_threshold"
    ).eq("type", "points").execute()
    
    if not achievements_response.data:
        return
    
    # Get volunteer's existing achievements
    existing_achievements_response = supabase.table("volunteer_achievements").select(
        "achievement_id"
    ).eq("volunteer_id", str(volunteer_id)).execute()
    
    existing_achievement_ids = [a["achievement_id"] for a in existing_achievements_response.data] if existing_achievements_response.data else []
    
    # Check for new achievements
    for achievement in achievements_response.data:
        if achievement["id"] in existing_achievement_ids:
            continue
        
        if current_points >= achievement.get("points_threshold", 0):
            # Award the achievement
            achievement_data = {
                "volunteer_id": str(volunteer_id),
                "achievement_id": achievement["id"],
                "progress": 1.0,
                "awarded_at": "now()"
            }
            
            supabase.table("volunteer_achievements").insert(achievement_data).execute()
            
            # Award points for earning an achievement
            points_data = {
                "volunteer_id": str(volunteer_id),
                "points": 100,  # Default points for earning an achievement
                "reason": f"Earned achievement: {achievement['name']}",
                "category": "achievements",
                "created_at": "now()"
            }
            
            supabase.table("volunteer_points").insert(points_data).execute()
            
            # Update volunteer's total points
            supabase.table("volunteers").update({
                "points": current_points + 100
            }).eq("id", str(volunteer_id)).execute()