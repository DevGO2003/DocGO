"""
View schemas for projection support in Automation Service
Cung cấp các view khác nhau cho cùng một resource để tối ưu performance
"""

from datetime import datetime
from typing import List, Optional, Dict, Any, Generic, TypeVar
from pydantic import BaseModel, Field
from enum import Enum

T = TypeVar('T')


class ViewType(str, Enum):
    """Các loại view được hỗ trợ"""
    CARD = "card"
    TABLE = "table"
    DETAIL = "detail"
    FULL = "full"


# ============================================================================
# FILE VIEW SCHEMAS
# ============================================================================

class FileCardView(BaseModel):
    """View cho hiển thị file dạng card - chỉ các field cần thiết"""
    file_id: str = Field(..., description="Unique file identifier")
    filename: str = Field(..., description="Original filename")
    file_type: str = Field(..., description="MIME type of the file")
    status: str = Field(..., description="File status")
    upload_time: datetime = Field(..., description="Upload timestamp")
    file_url: str = Field(..., description="Public URL to access the file")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class FileTableView(BaseModel):
    """View cho hiển thị file dạng bảng - nhiều field hơn card view"""
    file_id: str = Field(..., description="Unique file identifier")
    filename: str = Field(..., description="Original filename")
    file_type: str = Field(..., description="MIME type of the file")
    file_size: int = Field(..., description="File size in bytes")
    status: str = Field(..., description="File status")
    upload_time: datetime = Field(..., description="Upload timestamp")
    uploaded_by: str = Field(..., description="User who uploaded the file")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class FileSummaryView(BaseModel):
    """View cho tóm tắt file - rất ít field"""
    file_id: str = Field(..., description="Unique file identifier")
    filename: str = Field(..., description="Original filename")
    status: str = Field(..., description="File status")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class FileMinimalView(BaseModel):
    """View tối thiểu cho file - chỉ id và name"""
    file_id: str = Field(..., description="Unique file identifier")
    filename: str = Field(..., description="Original filename")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# ============================================================================
# BATCH JOB VIEW SCHEMAS
# ============================================================================

class BatchJobCardView(BaseModel):
    """View cho hiển thị batch job dạng card"""
    job_id: str = Field(..., description="Unique job identifier")
    job_name: str = Field(..., description="Job name")
    status: str = Field(..., description="Job status")
    created_at: datetime = Field(..., description="Creation timestamp")
    progress: int = Field(..., description="Progress percentage (0-100)")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class BatchJobTableView(BaseModel):
    """View cho hiển thị batch job dạng bảng"""
    job_id: str = Field(..., description="Unique job identifier")
    job_name: str = Field(..., description="Job name")
    status: str = Field(..., description="Job status")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    progress: int = Field(..., description="Progress percentage (0-100)")
    total_files: int = Field(..., description="Total files to process")
    processed_files: int = Field(..., description="Files processed so far")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class BatchJobSummaryView(BaseModel):
    """View cho tóm tắt batch job"""
    job_id: str = Field(..., description="Unique job identifier")
    job_name: str = Field(..., description="Job name")
    status: str = Field(..., description="Job status")
    progress: int = Field(..., description="Progress percentage (0-100)")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class BatchJobMinimalView(BaseModel):
    """View tối thiểu cho batch job"""
    job_id: str = Field(..., description="Unique job identifier")
    job_name: str = Field(..., description="Job name")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# ============================================================================
# PAGINATED RESPONSE WITH VIEW
# ============================================================================

class PaginatedViewResponse(BaseModel, Generic[T]):
    """Response cho danh sách có phân trang với view support"""
    view: str = Field(..., description="View type được sử dụng")
    items: List[T] = Field(..., description="List of items theo view type")
    pagination: Dict[str, Any] = Field(..., description="Pagination information")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# ============================================================================
# VIEW MAPPER UTILITIES
# ============================================================================

class ViewMapper:
    """Utility class để map data sang các view khác nhau"""
    
    @staticmethod
    def map_file_to_view(file_data: Dict[str, Any], view_type: ViewType) -> BaseModel:
        """Map file data sang view tương ứng"""
        if view_type == ViewType.CARD:
            return FileCardView(
                file_id=file_data["file_id"],
                filename=file_data["filename"],
                file_type=file_data["file_type"],
                status=file_data["status"],
                upload_time=file_data["upload_time"],
                file_url=file_data["file_url"]
            )
        elif view_type == ViewType.TABLE:
            return FileTableView(
                file_id=file_data["file_id"],
                filename=file_data["filename"],
                file_type=file_data["file_type"],
                file_size=file_data["file_size"],
                status=file_data["status"],
                upload_time=file_data["upload_time"],
                uploaded_by=file_data["uploaded_by"]
            )
        else:
            # DETAIL hoặc FULL: trả dữ liệu đầy đủ (tạm thời trả thẳng dữ liệu gốc)
            return file_data
    
    @staticmethod
    def map_batch_job_to_view(job_data: Dict[str, Any], view_type: ViewType) -> BaseModel:
        """Map batch job data sang view tương ứng"""
        if view_type == ViewType.CARD:
            return BatchJobCardView(
                job_id=job_data["job_id"],
                job_name=job_data["job_name"],
                status=job_data["status"],
                created_at=job_data["created_at"],
                progress=job_data["progress"]
            )
        elif view_type == ViewType.TABLE:
            return BatchJobTableView(
                job_id=job_data["job_id"],
                job_name=job_data["job_name"],
                status=job_data["status"],
                created_at=job_data["created_at"],
                updated_at=job_data["updated_at"],
                progress=job_data["progress"],
                total_files=job_data["total_files"],
                processed_files=job_data["processed_files"]
            )
        else:
            # DETAIL hoặc FULL
            return job_data
