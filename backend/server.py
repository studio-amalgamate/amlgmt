from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, status
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import os
import logging
from pathlib import Path
from typing import List

from models import (
    UserCreate, UserLogin, UserResponse, Token,
    ProjectCreate, ProjectUpdate, Project, Media, MediaReorder,
    SiteSettings, SiteSettingsUpdate
)
from auth import (
    get_password_hash, verify_password, create_access_token, verify_token
)
from utils import save_upload_file, delete_upload_file, create_project_slug

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
users_collection = db.users
projects_collection = db.projects
settings_collection = db.settings

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Mount uploads directory BEFORE api routes with /api prefix
class CORSStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Cross-Origin-Resource-Policy"] = "cross-origin"
        return response

app.mount("/api/uploads", CORSStaticFiles(directory="/app/backend/uploads"), name="uploads")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ===== Authentication Routes =====

@api_router.post("/auth/register", response_model=dict)
async def register(user: UserCreate):
    # Check if any user exists
    existing_users = await users_collection.count_documents({})
    if existing_users > 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Registration is closed"
        )
    
    # Check if username already exists
    if await users_collection.find_one({"username": user.username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    # Create user
    hashed_password = get_password_hash(user.password)
    user_doc = {
        "username": user.username,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    await users_collection.insert_one(user_doc)
    
    return {"message": "User created successfully", "user": {"username": user.username}}

@api_router.post("/auth/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(days=7)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"username": user.username}
    }

# ===== Project Routes =====

@api_router.get("/projects", response_model=List[Project])
async def get_projects():
    # Only return published projects for public view
    projects = await projects_collection.find({"published": True}).sort("created_at", -1).to_list(100)
    return [Project(**project) for project in projects]

@api_router.get("/admin/projects", response_model=List[Project])
async def get_all_projects(username: str = Depends(verify_token)):
    # Admin can see all projects including drafts
    projects = await projects_collection.find().sort("created_at", -1).to_list(100)
    return [Project(**project) for project in projects]

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    project = await projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return Project(**project)

@api_router.post("/projects", response_model=Project)
async def create_project(
    project: ProjectCreate,
    username: str = Depends(verify_token)
):
    project_id = create_project_slug(project.title)
    
    # Check if project with same ID exists
    existing = await projects_collection.find_one({"id": project_id})
    if existing:
        # Add timestamp to make it unique
        project_id = f"{project_id}-{int(datetime.now().timestamp())}"
    
    project_doc = {
        "id": project_id,
        "title": project.title,
        "client": project.client,
        "date": project.date,
        "location": project.location,
        "description": project.description,
        "media": [],
        "featured": project.featured,
        "published": project.published if hasattr(project, 'published') else True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await projects_collection.insert_one(project_doc)
    return Project(**project_doc)

@api_router.put("/projects/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    username: str = Depends(verify_token)
):
    project = await projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = {k: v for k, v in project_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await projects_collection.update_one(
        {"id": project_id},
        {"$set": update_data}
    )
    
    updated_project = await projects_collection.find_one({"id": project_id})
    return Project(**updated_project)

@api_router.delete("/projects/{project_id}")
async def delete_project(
    project_id: str,
    username: str = Depends(verify_token)
):
    project = await projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Delete all media files
    for media in project.get("media", []):
        delete_upload_file(media["url"])
    
    await projects_collection.delete_one({"id": project_id})
    return {"message": "Project deleted successfully"}

# ===== Media Routes =====

@api_router.post("/projects/{project_id}/media", response_model=Media)
async def upload_media(
    project_id: str,
    file: UploadFile = File(...),
    username: str = Depends(verify_token)
):
    project = await projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        file_url, file_type = await save_upload_file(file)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Get current max order
    current_media = project.get("media", [])
    max_order = max([m.get("order", 0) for m in current_media], default=-1)
    
    media = Media(
        type=file_type,
        url=file_url,
        alt=file.filename,
        order=max_order + 1
    )
    
    await projects_collection.update_one(
        {"id": project_id},
        {
            "$push": {"media": media.dict()},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    
    return media

@api_router.delete("/projects/{project_id}/media/{media_id}")
async def delete_media(
    project_id: str,
    media_id: str,
    username: str = Depends(verify_token)
):
    project = await projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Find and delete media
    media_item = None
    for media in project.get("media", []):
        if media["id"] == media_id:
            media_item = media
            break
    
    if not media_item:
        raise HTTPException(status_code=404, detail="Media not found")
    
    delete_upload_file(media_item["url"])
    
    await projects_collection.update_one(
        {"id": project_id},
        {
            "$pull": {"media": {"id": media_id}},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    
    return {"message": "Media deleted successfully"}

@api_router.put("/projects/{project_id}/media/reorder", response_model=Project)
async def reorder_media(
    project_id: str,
    reorder: MediaReorder,
    username: str = Depends(verify_token)
):
    project = await projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Update order for each media item
    media_list = project.get("media", [])
    for item in reorder.media_order:
        for media in media_list:
            if media["id"] == item["id"]:
                media["order"] = item["order"]
    
    # Sort by order
    media_list.sort(key=lambda x: x.get("order", 0))
    
    await projects_collection.update_one(
        {"id": project_id},
        {
            "$set": {
                "media": media_list,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    updated_project = await projects_collection.find_one({"id": project_id})
    return Project(**updated_project)

@api_router.put("/projects/{project_id}/media/{media_id}/featured")
async def toggle_media_featured(
    project_id: str,
    media_id: str,
    featured: bool,
    username: str = Depends(verify_token)
):
    project = await projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Update featured status for specific media
    media_list = project.get("media", [])
    media_found = False
    for media in media_list:
        if media["id"] == media_id:
            media["featured"] = featured
            media_found = True
            break
    
    if not media_found:
        raise HTTPException(status_code=404, detail="Media not found")
    
    await projects_collection.update_one(
        {"id": project_id},
        {
            "$set": {
                "media": media_list,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Media featured status updated", "featured": featured}

# ===== Featured Images Route =====

@api_router.get("/featured")
async def get_featured_images():
    import random
    
    # Get all projects (published and unpublished for flexibility)
    projects = await projects_collection.find().to_list(100)
    
    featured_images = []
    for project in projects:
        for media in project.get("media", []):
            # Include media if it's individually featured OR if project is featured
            if media.get("featured", False) or project.get("featured", False):
                featured_images.append({
                    "type": media["type"],
                    "url": media["url"],
                    "alt": media["alt"],
                    "projectId": project["id"],
                    "projectTitle": project["title"]
                })
    
    # Randomize the order
    random.shuffle(featured_images)
    
    return featured_images

# ===== Settings Routes =====

@api_router.get("/settings", response_model=SiteSettings)
async def get_settings():
    settings = await settings_collection.find_one({})
    if not settings:
        # Return default settings
        default_settings = SiteSettings()
        return default_settings
    return SiteSettings(**settings)

@api_router.put("/settings", response_model=SiteSettings)
async def update_settings(
    settings_update: SiteSettingsUpdate,
    username: str = Depends(verify_token)
):
    existing = await settings_collection.find_one({})
    
    update_data = {k: v for k, v in settings_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    if existing:
        await settings_collection.update_one(
            {"_id": existing["_id"]},
            {"$set": update_data}
        )
    else:
        settings_doc = SiteSettings(**update_data).dict()
        await settings_collection.insert_one(settings_doc)
    
    updated_settings = await settings_collection.find_one({})
    return SiteSettings(**updated_settings)

@api_router.post("/settings/logo", response_model=dict)
async def upload_logo(
    file: UploadFile = File(...),
    username: str = Depends(verify_token)
):
    try:
        file_url, file_type = await save_upload_file(file)
        
        # Update settings with logo URL
        await settings_collection.update_one(
            {},
            {"$set": {"logo_url": file_url, "updated_at": datetime.utcnow()}},
            upsert=True
        )
        
        return {"logo_url": file_url}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# ===== Health Check =====

@api_router.get("/")
async def root():
    return {"message": "Photography Portfolio API"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
