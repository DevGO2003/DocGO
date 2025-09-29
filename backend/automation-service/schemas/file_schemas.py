"""
File schemas for Automation Service
Converted from Document Management Service DTOs
"""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class FileUploadResponse(BaseModel):
    """Response schema for file upload"""
    file_id: str = Field(..., description="Unique file identifier")
    filename: str = Field(..., description="Original filename")
    file_size: int = Field(..., description="File size in bytes")
    file_type: str = Field(..., description="MIME type of the file")
    status: str = Field(..., description="Upload status")
    upload_time: datetime = Field(..., description="Upload timestamp")
    message: str = Field(..., description="Status message")
    s3_key: str = Field(..., description="S3 object key")
    bucket: str = Field(..., description="S3 bucket name")
    file_url: str = Field(..., description="Public URL to access the file")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class FileDownloadResponse(BaseModel):
    """Response schema for file download"""
    filename: str = Field(..., description="Filename for download")
    content_type: str = Field(..., description="MIME type of the file")
    file_content: bytes = Field(..., description="File content as bytes")
    file_size: int = Field(..., description="File size in bytes")

    class Config:
        json_encoders = {
            bytes: lambda v: v.decode('utf-8', errors='ignore')
        }


class FileMetadata(BaseModel):
    """File metadata schema"""
    file_id: str = Field(..., description="Unique file identifier")
    filename: str = Field(..., description="Original filename")
    s3_key: str = Field(..., description="S3 object key")
    bucket: str = Field(..., description="S3 bucket name")
    file_size: int = Field(..., description="File size in bytes")
    file_type: str = Field(..., description="MIME type of the file")
    status: str = Field(..., description="File status")
    upload_time: datetime = Field(..., description="Upload timestamp")
    uploaded_by: str = Field(..., description="User who uploaded the file")
    metadata: Dict[str, str] = Field(default_factory=dict, description="Additional metadata")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class FileListResponse(BaseModel):
    """Response schema for file list with pagination"""
    files: List[FileMetadata] = Field(..., description="List of file metadata")
    total_elements: int = Field(..., description="Total number of files")
    total_pages: int = Field(..., description="Total number of pages")
    current_page: int = Field(..., description="Current page number")
    page_size: int = Field(..., description="Number of files per page")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class FileDetailsResponse(BaseModel):
    """Response schema for file details"""
    file_id: str = Field(..., description="Unique file identifier")
    filename: str = Field(..., description="Original filename")
    file_size: int = Field(..., description="File size in bytes")
    file_type: str = Field(..., description="MIME type of the file")
    status: str = Field(..., description="File status")
    upload_time: datetime = Field(..., description="Upload timestamp")
    uploaded_by: str = Field(..., description="User who uploaded the file")
    s3_key: str = Field(..., description="S3 object key")
    bucket: str = Field(..., description="S3 bucket name")
    file_url: str = Field(..., description="Public URL to access the file")
    checksum: Optional[str] = Field(None, description="File checksum")
    access_count: int = Field(0, description="Number of times file was accessed")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
