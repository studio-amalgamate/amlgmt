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
    order: int = 0  # New: for reordering projects

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    client: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    featured: Optional[bool] = None
    published: Optional[bool] = None  # New: can update publish status
    order: Optional[int] = None  # New: can update order

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
    order: int = 0  # New: for reordering projects
    created_at: datetime
    updated_at: datetime

# Settings Models
class SiteSettings(BaseModel):
    brand_name: str = "Your Name"
    logo_url: Optional[str] = None
    about_title: str = "About"
    about_content: str = ""
    contact_email: str = ""
    contact_phone: str = ""
    instagram_url: str = "https://instagram.com"
    clients_list: str = ""
    # New About page fields
    company_name: str = "amalgamate"
    copyright_text: str = "© amalgamate"
    about_paragraph: str = ""
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SiteSettingsUpdate(BaseModel):
    brand_name: Optional[str] = None
    logo_url: Optional[str] = None
    about_title: Optional[str] = None
    about_content: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    instagram_url: Optional[str] = None
    clients_list: Optional[str] = None
    # New About page fields
    company_name: Optional[str] = None
    copyright_text: Optional[str] = None
    about_paragraph: Optional[str] = None

class MediaReorder(BaseModel):
    media_order: List[dict]  # [{ id: str, order: int }]

class ProjectReorder(BaseModel):
    project_order: List[dict]  # [{ id: str, order: int }]
