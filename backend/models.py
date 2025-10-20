from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# User Models
class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    username: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Media Models
class Media(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str  # 'image' or 'video'
    url: str
    alt: str = ""
    order: int = 0
    featured: bool = False  # Individual media can be featured

# Project Models
class ProjectCreate(BaseModel):
    title: str
    client: str = ""
    date: str = ""
    location: str = ""
    description: str = ""
    featured: bool = False
    published: bool = True  # New: draft/published status

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    client: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    featured: Optional[bool] = None
    published: Optional[bool] = None  # New: can update publish status

class Project(BaseModel):
    id: str
    title: str
    client: str
    date: str
    location: str
    description: str
    media: List[Media] = []
    featured: bool
    published: bool = True  # New: published status
    created_at: datetime
    updated_at: datetime

class MediaReorder(BaseModel):
    media_order: List[dict]  # [{ id: str, order: int }]
