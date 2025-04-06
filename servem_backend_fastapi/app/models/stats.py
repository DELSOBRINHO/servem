from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from datetime import datetime, date
from uuid import UUID

class VolunteerStats(BaseModel):
    volunteer_id: UUID
    total_events: int
    total_hours: float
    points: int
    rank: Optional[int] = None
    events_by_category: Optional[Dict[str, int]] = None
    activity_trend: Optional[List[float]] = None
    
class EventStats(BaseModel):
    event_id: UUID
    volunteer_count: int
    completion_rate: float  # 0-1
    attendance_rate: Optional[float] = None
    volunteer_satisfaction: Optional[float] = None
    skills_distribution: Optional[Dict[str, int]] = None
    
class OrganizationStats(BaseModel):
    total_volunteers: int
    active_volunteers: int
    total_events: int
    total_volunteer_hours: float
    volunteer_retention_rate: float  # 0-1
    growth_rate: Optional[float] = None
    volunteer_distribution_by_area: Optional[Dict[str, int]] = None
    
class TimeSeriesData(BaseModel):
    labels: List[str]  # Dates or time periods
    values: List[float]
    
class VolunteerGrowthData(BaseModel):
    months: List[str]
    new_volunteers: List[int]
    cumulative_volunteers: List[int]
    
class SkillDistribution(BaseModel):
    skill_name: str
    volunteer_count: int
    percentage: float
    
class DashboardStats(BaseModel):
    total_volunteers: int
    active_volunteers: int
    total_events: int
    total_hours: float
    volunteer_growth: VolunteerGrowthData
    skill_distribution: List[SkillDistribution]
    recent_events: List[Dict[str, Any]]