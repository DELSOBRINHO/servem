from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class Skill(BaseModel):
    id: UUID
    name: str
    
class Location(BaseModel):
    latitude: float
    longitude: float
    address: Optional[str] = None

class Availability(BaseModel):
    day_of_week: int  # 0-6 (Monday-Sunday)
    start_time: str   # HH:MM format
    end_time: str     # HH:MM format

class VolunteerBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    availability: Optional[List[str]] = None
    location: Optional[str] = None

class VolunteerCreate(VolunteerBase):
    password: str

class VolunteerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    availability: Optional[List[str]] = None
    location: Optional[str] = None

class Volunteer(VolunteerBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    profile_image: Optional[str] = None
    points: int = 0
    is_organizer: bool = False
    events_participated: Optional[int] = 0
    hours_served: Optional[float] = 0
    
    class Config:
        orm_mode = True

class VolunteerLogin(BaseModel):
    email: EmailStr
    password: str

class VolunteerProfile(Volunteer):
    badges: Optional[List[Dict]] = None
    achievements: Optional[List[Dict]] = None
    
class VolunteerSearchParams(BaseModel):
    latitude: float
    longitude: float
    max_distance_km: float = 10.0
    skills: Optional[List[str]] = None
    availability_day: Optional[int] = None