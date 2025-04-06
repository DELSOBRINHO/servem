from typing import List, Dict, Any
from uuid import UUID
from datetime import datetime, timedelta
import pandas as pd

from ..models.stats import (
    VolunteerStats, EventStats, OrganizationStats, 
    TimeSeriesData, VolunteerGrowthData, SkillDistribution,
    DashboardStats
)
from ..database import supabase

def get_volunteer_stats(volunteer_id: UUID) -> VolunteerStats:
    """
    Get comprehensive statistics for a specific volunteer.
    """
    # Query volunteer events
    events_response = supabase.table("event_volunteers").select(
        "event_id, status, hours_served, created_at"
    ).eq("volunteer_id", str(volunteer_id)).execute()
    
    if not events_response.data:
        return VolunteerStats(
            volunteer_id=volunteer_id,
            total_events=0,
            total_hours=0,
            points=0
        )
    
    # Calculate basic stats
    completed_events = [e for e in events_response.data if e["status"] == "completed"]
    total_events = len(completed_events)
    total_hours = sum(e.get("hours_served", 0) for e in completed_events)
    
    # Get volunteer points
    volunteer_response = supabase.table("volunteers").select(
        "points"
    ).eq("id", str(volunteer_id)).execute()
    
    points = volunteer_response.data[0]["points"] if volunteer_response.data else 0
    
    # Get events by category
    events_by_category = {}
    if completed_events:
        # Get event details for completed events
        event_ids = [e["event_id"] for e in completed_events]
        events_details = supabase.table("events").select(
            "id, category"
        ).in_("id", event_ids).execute()
        
        if events_details.data:
            # Create a mapping of event_id to category
            event_categories = {e["id"]: e.get("category", "Other") for e in events_details.data}
            
            # Count events by category
            for event in completed_events:
                category = event_categories.get(event["event_id"], "Other")
                events_by_category[category] = events_by_category.get(category, 0) + 1
    
    # Calculate activity trend (events per month for the last 6 months)
    activity_trend = []
    if events_response.data:
        # Convert to DataFrame for easier time-based analysis
        df = pd.DataFrame(events_response.data)
        df['created_at'] = pd.to_datetime(df['created_at'])
        
        # Last 6 months
        end_date = datetime.now()
        start_date = end_date - timedelta(days=180)
        
        # Group by month and count events
        df = df[(df['created_at'] >= start_date) & (df['created_at'] <= end_date)]
        monthly_counts = df.groupby(pd.Grouper(key='created_at', freq='M')).size()
        
        # Fill in missing months with zeros
        date_range = pd.date_range(start=start_date, end=end_date, freq='M')
        monthly_counts = monthly_counts.reindex(date_range, fill_value=0)
        
        activity_trend = monthly_counts.tolist()
    
    return VolunteerStats(
        volunteer_id=volunteer_id,
        total_events=total_events,
        total_hours=total_hours,
        points=points,
        events_by_category=events_by_category,
        activity_trend=activity_trend
    )

def get_event_stats(event_id: UUID) -> EventStats:
    """
    Get comprehensive statistics for a specific event.
    """
    # Query event volunteers
    volunteers_response = supabase.table("event_volunteers").select(
        "volunteer_id, status, satisfaction_rating, skills"
    ).eq("event_id", str(event_id)).execute()
    
    if not volunteers_response.data:
        return EventStats(
            event_id=event_id,
            volunteer_count=0,
            completion_rate=0
        )
    
    volunteer_count = len(volunteers_response.data)
    completed_count = len([v for v in volunteers_response.data if v["status"] == "completed"])
    completion_rate = completed_count / volunteer_count if volunteer_count > 0 else 0
    
    # Calculate attendance rate
    attended_count = len([v for v in volunteers_response.data if v["status"] in ["completed", "attended"]])
    attendance_rate = attended_count / volunteer_count if volunteer_count > 0 else 0
    
    # Calculate volunteer satisfaction
    satisfaction_ratings = [v.get("satisfaction_rating") for v in volunteers_response.data if v.get("satisfaction_rating") is not None]
    volunteer_satisfaction = sum(satisfaction_ratings) / len(satisfaction_ratings) if satisfaction_ratings else None
    
    # Calculate skills distribution
    skills_distribution = {}
    for volunteer in volunteers_response.data:
        if volunteer.get("skills"):
            for skill in volunteer["skills"]:
                skills_distribution[skill] = skills_distribution.get(skill, 0) + 1
    
    return EventStats(
        event_id=event_id,
        volunteer_count=volunteer_count,
        completion_rate=completion_rate,
        attendance_rate=attendance_rate,
        volunteer_satisfaction=volunteer_satisfaction,
        skills_distribution=skills_distribution
    )

def get_organization_stats() -> OrganizationStats:
    """
    Get comprehensive organization-wide statistics.
    """
    # Get total volunteers
    volunteers_response = supabase.table("volunteers").select("id, last_activity, created_at, location").execute()
    
    if not volunteers_response.data:
        return OrganizationStats(
            total_volunteers=0,
            active_volunteers=0,
            total_events=0,
            total_volunteer_hours=0,
            volunteer_retention_rate=0
        )
    
    total_volunteers = len(volunteers_response.data)
    
    # Calculate active volunteers (active in last 30 days)
    thirty_days_ago = datetime.now() - timedelta(days=30)
    active_volunteers = len([
        v for v in volunteers_response.data 
        if v.get("last_activity") and datetime.fromisoformat(v["last_activity"]) > thirty_days_ago
    ])
    
    # Get total events
    events_response = supabase.table("events").select("id").execute()
    total_events = len(events_response.data)
    
    # Calculate total volunteer hours
    hours_response = supabase.table("event_volunteers").select("hours_served").eq("status", "completed").execute()
    total_volunteer_hours = sum(h.get("hours_served", 0) for h in hours_response.data)
    
    # Calculate retention rate (simplified)
    retention_rate = active_volunteers / total_volunteers if total_volunteers > 0 else 0
    
    # Calculate growth rate (new volunteers in last 30 days vs previous 30 days)
    if volunteers_response.data:
        df = pd.DataFrame(volunteers_response.data)
        df['created_at'] = pd.to_datetime(df['created_at'])
        
        last_30_days = len(df[df['created_at'] > thirty_days_ago])
        previous_30_days = len(df[(df['created_at'] > thirty_days_ago - timedelta(days=30)) & 
                                 (df['created_at'] <= thirty_days_ago)])
        
        growth_rate = (last_30_days - previous_30_days) / previous_30_days if previous_30_days > 0 else 0
    else:
        growth_rate = 0
    
    # Calculate volunteer distribution by area
    volunteer_distribution_by_area = {}
    for volunteer in volunteers_response.data:
        if volunteer.get("location") and volunteer["location"].get("area"):
            area = volunteer["location"]["area"]
            volunteer_distribution_by_area[area] = volunteer_distribution_by_area.get(area, 0) + 1
    
    return OrganizationStats(
        total_volunteers=total_volunteers,
        active_volunteers=active_volunteers,
        total_events=total_events,
        total_volunteer_hours=total_volunteer_hours,
        volunteer_retention_rate=retention_rate,
        growth_rate=growth_rate,
        volunteer_distribution_by_area=volunteer_distribution_by_area
    )

def get_dashboard_stats() -> DashboardStats:
    """
    Get comprehensive statistics for the dashboard.
    """
    # Get basic organization stats
    org_stats = get_organization_stats()
    
    # Calculate volunteer growth over time
    volunteers_response = supabase.table("volunteers").select("id, created_at").execute()
    
    volunteer_growth = VolunteerGrowthData(months=[], new_volunteers=[], cumulative_volunteers=[])
    
    if volunteers_response.data:
        df = pd.DataFrame(volunteers_response.data)
        df['created_at'] = pd.to_datetime(df['created_at'])
        
        # Last 12 months
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        
        # Filter and group by month
        df = df[(df['created_at'] >= start_date) & (df['created_at'] <= end_date)]
        monthly_counts = df.groupby(pd.Grouper(key='created_at', freq='M')).size()
        
        # Fill in missing months with zeros
        date_range = pd.date_range(start=start_date, end=end_date, freq='M')
        monthly_counts = monthly_counts.reindex(date_range, fill_value=0)
        
        # Format months and calculate cumulative sum
        volunteer_growth.months = [d.strftime('%b %Y') for d in monthly_counts.index]
        volunteer_growth.new_volunteers = monthly_counts.tolist()
        volunteer_growth.cumulative_volunteers = monthly_counts.cumsum().tolist()
    
    # Get skill distribution
    skills_response = supabase.table("volunteers").select("skills").execute()
    
    skill_counts = {}
    if skills_response.data:
        for volunteer in skills_response.data:
            if volunteer.get("skills"):
                for skill in volunteer["skills"]:
                    skill_counts[skill] = skill_counts.get(skill, 0) + 1
    
    # Convert to SkillDistribution objects
    skill_distribution = []
    total_volunteers = len(skills_response.data) if skills_response.data else 0
    
    for skill, count in skill_counts.items():
        percentage = count / total_volunteers if total_volunteers > 0 else 0
        skill_distribution.append(SkillDistribution(
            skill_name=skill,
            volunteer_count=count,
            percentage=percentage
        ))
    
    # Sort by count descending
    skill_distribution.sort(key=lambda x: x.volunteer_count, reverse=True)
    
    # Get recent events
    events_response = supabase.table("events").select(
        "id, title, start_datetime, location, volunteers_needed"
    ).order("start_datetime", desc=True).limit(5).execute()
    
    recent_events = events_response.data if events_response.data else []
    
    return DashboardStats(
        total_volunteers=org_stats.total_volunteers,
        active_volunteers=org_stats.active_volunteers,
        total_events=org_stats.total_events,
        total_hours=org_stats.total_volunteer_hours,
        volunteer_growth=volunteer_growth,
        skill_distribution=skill_distribution,
        recent_events=recent_events
    )