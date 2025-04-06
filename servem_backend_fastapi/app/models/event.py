from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from uuid import UUID

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_datetime: datetime
    end_datetime: Optional[datetime] = None
    location: Optional[str] = None
    category: Optional[str] = None
    required_skills: Optional[List[str]] = None
    expected_participants: Optional[int] = None
    status: str = "active"

class EventCreate(EventBase):
    organizer_id: UUID

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None
    location: Optional[str] = None
    category: Optional[str] = None
    required_skills: Optional[List[str]] = None
    expected_participants: Optional[int] = None
    status: Optional[str] = None

class Event(EventBase):
    id: UUID
    organizer_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    current_volunteers: Optional[int] = 0

class EventRecommendation(BaseModel):
    event_id: UUID
    title: str
    description: Optional[str] = None
    start_datetime: datetime
    end_datetime: Optional[datetime] = None
    location: Optional[str] = None
    category: Optional[str] = None
    match_score: float = Field(..., ge=0, le=1)
    skill_match: float = Field(..., ge=0, le=1)
    interest_match: float = Field(..., ge=0, le=1)
    location_match: float = Field(..., ge=0, le=1)
    time_match: float = Field(..., ge=0, le=1)