from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class Badge(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    awarded_at: datetime
    reason: Optional[str] = None

class Achievement(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    points_value: int = 0
    awarded_at: datetime
    progress: float = 1.0  # 0.0 to 1.0

class LeaderboardEntry(BaseModel):
    volunteer_id: UUID
    name: str
    profile_image: Optional[str] = None
    points: int
    rank: int
    events_participated: int = 0
    hours_served: float = 0
    badges_count: int = 0
