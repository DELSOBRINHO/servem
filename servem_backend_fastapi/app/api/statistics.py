from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from uuid import UUID
from datetime import datetime, timedelta

from ..models.stats import (
    VolunteerStats, EventStats, OrganizationStats, 
    TimeSeriesData, DashboardStats
)
from ..services.statistics import (
    get_volunteer_stats, get_event_stats, get_organization_stats,
    get_dashboard_stats
)
from ..database import supabase

router = APIRouter()

@router.get("/volunteer/{volunteer_id}", response_model=VolunteerStats)
async def get_stats_for_volunteer(volunteer_id: UUID):
    """
    Get comprehensive statistics for a specific volunteer.
    """
    try:
        stats = get_volunteer_stats(volunteer_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/event/{event_id}", response_model=EventStats)
async def get_stats_for_event(event_id: UUID):
    """
    Get comprehensive statistics for a specific event.
    """
    try:
        stats = get_event_stats(event_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/organization", response_model=OrganizationStats)
async def get_stats_for_organization():
    """
    Get comprehensive organization-wide statistics.
    """
    try:
        stats = get_organization_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_statistics():
    """
    Get comprehensive statistics for the dashboard.
    """
    try:
        stats = get_dashboard_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/volunteer-growth", response_model=TimeSeriesData)
async def get_volunteer_growth(period: str = "monthly", months: int = 12):
    """
    Get volunteer growth over time.
    
    - period: 'daily', 'weekly', or 'monthly'
    - months: number of months to look back
    """
    try:
        # Get volunteer signup data
        volunteers_response = supabase.table("volunteers").select("created_at").execute()
        
        if not volunteers_response.data:
            return TimeSeriesData(labels=[], values=[])
        
        # Convert to DataFrame for time-based analysis
        import pandas as pd
        df = pd.DataFrame(volunteers_response.data)
        df['created_at'] = pd.to_datetime(df['created_at'])
        
        # Filter for the requested time period
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30 * months)
        df = df[(df['created_at'] >= start_date) & (df['created_at'] <= end_date)]
        
        # Group by the requested period
        if period == "daily":
            freq = "D"
            date_format = "%Y-%m-%d"
        elif period == "weekly":
            freq = "W"
            date_format = "%Y-%m-%d"
        else:  # monthly
            freq = "M"
            date_format = "%b %Y"
        
        counts = df.groupby(pd.Grouper(key='created_at', freq=freq)).size()
        
        # Format the response
        labels = [date.strftime(date_format) for date in counts.index]
        values = counts.tolist()
        
        return TimeSeriesData(labels=labels, values=values)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/volunteer-hours", response_model=TimeSeriesData)
async def get_volunteer_hours(period: str = "monthly", months: int = 12):
    """
    Get volunteer hours over time.
    
    - period: 'daily', 'weekly', or 'monthly'
    - months: number of months to look back
    """
    try:
        # Get volunteer hours data
        hours_response = supabase.table("event_volunteers").select(
            "hours_served, created_at"
        ).eq("status", "completed").execute()
        
        if not hours_response.data:
            return TimeSeriesData(labels=[], values=[])
        
        # Convert to DataFrame for time-based analysis
        import pandas as pd
        df = pd.DataFrame(hours_response.data)
        df['created_at'] = pd.to_datetime(df['created_at'])
        df['hours_served'] = df['hours_served'].fillna(0)
        
        # Filter for the requested time period
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30 * months)
        df = df[(df['created_at'] >= start_date) & (df['created_at'] <= end_date)]
        
        # Group by the requested period
        if period == "daily":
            freq = "D"
            date_format = "%Y-%m-%d"
        elif period == "weekly":
            freq = "W"
            date_format = "%Y-%m-%d"
        else:  # monthly
            freq = "M"
            date_format = "%b %Y"
        
        hours_sum = df.groupby(pd.Grouper(key='created_at', freq=freq))['hours_served'].sum()
        
        # Format the response
        labels = [date.strftime(date_format) for date in hours_sum.index]
        values = hours_sum.tolist()
        
        return TimeSeriesData(labels=labels, values=values)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))