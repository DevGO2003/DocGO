from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class FileStatus(str, Enum):
    PENDING = "pending"
    SCANNING = "scanning"
    CLEAN = "clean"
    INFECTED = "infected"
    ERROR = "error"

class FileType(str, Enum):
    PDF = "pdf"
    DOCX = "docx"
    TXT = "txt"
    IMAGE = "image"
    OTHER = "other"

class FileUploadResponse(BaseModel):
    file_id: str = Field(..., description="ID duy nhất của file")
    filename: str = Field(..., description="Tên file gốc")
    file_size: int = Field(..., description="Kích thước file (bytes)")
    file_type: FileType = Field(..., description="Loại file")
    status: FileStatus = Field(..., description="Trạng thái file")
    upload_time: datetime = Field(..., description="Thời gian upload")
    message: str = Field(..., description="Thông báo kết quả")
    s3_key: Optional[str] = Field(None, description="S3 key của file")
    bucket: Optional[str] = Field(None, description="S3 bucket chứa file")
    file_url: Optional[str] = Field(None, description="URL để truy cập file")

class FileInfo(BaseModel):
    file_id: str = Field(..., description="ID duy nhất của file")
    filename: str = Field(..., description="Tên file gốc")
    file_size: int = Field(..., description="Kích thước file (bytes)")
    file_type: FileType = Field(..., description="Loại file")
    status: FileStatus = Field(..., description="Trạng thái file")
    version: int = Field(..., description="Phiên bản file")
    upload_time: datetime = Field(..., description="Thời gian upload")
    last_modified: datetime = Field(..., description="Thời gian sửa đổi cuối")
    checksum: str = Field(..., description="Checksum MD5 của file")
    malware_scan_result: Optional[str] = Field(None, description="Kết quả quét malware")
    s3_key: Optional[str] = Field(None, description="Object key đã lưu trên S3 hoặc đường dẫn local")

class SignedURLRequest(BaseModel):
    file_id: str = Field(..., description="ID của file cần tạo signed URL")
    expiration_minutes: int = Field(60, description="Thời gian hết hạn URL (phút)", ge=1, le=1440)

class SignedURLResponse(BaseModel):
    file_id: str = Field(..., description="ID của file")
    signed_url: str = Field(..., description="Signed URL để download")
    expiration_time: datetime = Field(..., description="Thời gian hết hạn URL")
    filename: str = Field(..., description="Tên file")

class FileVersion(BaseModel):
    version: int = Field(..., description="Số phiên bản")
    file_id: str = Field(..., description="ID của file")
    upload_time: datetime = Field(..., description="Thời gian upload")
    file_size: int = Field(..., description="Kích thước file")
    checksum: str = Field(..., description="Checksum MD5")
    status: FileStatus = Field(..., description="Trạng thái file")

class FileListResponse(BaseModel):
    files: List[FileInfo] = Field(..., description="Danh sách file")
    total_count: int = Field(..., description="Tổng số file")
    page_number: int = Field(..., description="Số trang hiện tại")
    page_size: int = Field(..., description="Kích thước trang")

class MalwareScanResult(BaseModel):
    file_id: str = Field(..., description="ID của file")
    scan_time: datetime = Field(..., description="Thời gian quét")
    is_clean: bool = Field(..., description="File có sạch không")
    threat_name: Optional[str] = Field(None, description="Tên mối đe dọa nếu có")
    scan_details: str = Field(..., description="Chi tiết kết quả quét")
