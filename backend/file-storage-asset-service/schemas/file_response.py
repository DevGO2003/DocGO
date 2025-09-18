"""
File response schemas for file storage service
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class FileResponseDto(BaseModel):
    """File response DTO for getAll API"""
    id: str
    filename: str
    original_filename: str
    content_type: str
    size: int
    status: str
    file_type: str
    folder: str
    version: int
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    deleted_by: Optional[str] = None
    s3_key: Optional[str] = None
    bucket: Optional[str] = None
    url: Optional[str] = None

class FileDetailResponseDto(BaseModel):
    """File detail response DTO for getOne API"""
    id: str
    filename: str
    original_filename: str
    content_type: str
    size: int
    status: str
    file_type: str
    folder: str
    version: int
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    deleted_by: Optional[str] = None
    s3_key: Optional[str] = None
    bucket: Optional[str] = None
    url: Optional[str] = None
    # Additional metadata
    metadata: Optional[dict] = None
    checksum: Optional[str] = None
    last_accessed: Optional[datetime] = None
    access_count: int = 0
