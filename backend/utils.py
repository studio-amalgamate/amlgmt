import os
import uuid
from datetime import datetime
from fastapi import UploadFile
from pathlib import Path
import shutil

UPLOAD_DIR = Path("/app/backend/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi", ".webm"}

def create_project_slug(title: str) -> str:
    """Create URL-friendly slug from title"""
    slug = title.lower().replace(" ", "-")
    slug = "".join(c for c in slug if c.isalnum() or c == "-")
    return slug

async def save_upload_file(file: UploadFile) -> tuple[str, str]:
    """Save uploaded file and return (file_path, file_type)"""
    file_ext = Path(file.filename).suffix.lower()
    
    # Determine file type
    if file_ext in ALLOWED_IMAGE_EXTENSIONS:
        file_type = "image"
    elif file_ext in ALLOWED_VIDEO_EXTENSIONS:
        file_type = "video"
    else:
        raise ValueError(f"Unsupported file type: {file_ext}")
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    filename = f"{timestamp}_{unique_id}{file_ext}"
    file_path = UPLOAD_DIR / filename
    
    # Save file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return relative URL path
    return f"/uploads/{filename}", file_type

def delete_upload_file(url: str):
    """Delete uploaded file"""
    try:
        filename = url.split("/")[-1]
        file_path = UPLOAD_DIR / filename
        if file_path.exists():
            file_path.unlink()
    except Exception as e:
        print(f"Error deleting file: {e}")
