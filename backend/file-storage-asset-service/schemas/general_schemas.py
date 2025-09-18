from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class FileProcessingType(str, Enum):
    """Loại xử lý file"""
    CONVERT = "convert"
    COMPRESS = "compress"
    EXTRACT = "extract"
    VALIDATE = "validate"
    METADATA = "metadata"

class FileConversionFormat(str, Enum):
    """Định dạng chuyển đổi file"""
    PDF = "pdf"
    DOCX = "docx"
    TXT = "txt"
    JPG = "jpg"
    PNG = "png"
    ZIP = "zip"

class AssetCategory(str, Enum):
    """Danh mục asset"""
    DOCUMENT = "document"
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    ARCHIVE = "archive"
    OTHER = "other"

class AssetStatus(str, Enum):
    """Trạng thái asset"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    ARCHIVED = "archived"
    DELETED = "deleted"

class FileProcessingRequest(BaseModel):
    """Request xử lý file"""
    file_id: str = Field(..., description="ID của file cần xử lý")
    processing_type: FileProcessingType = Field(..., description="Loại xử lý file")
    target_format: Optional[FileConversionFormat] = Field(None, description="Định dạng đích (cho convert)")
    compression_level: Optional[int] = Field(None, ge=1, le=9, description="Mức độ nén (1-9)")
    extract_path: Optional[str] = Field(None, description="Đường dẫn giải nén")

class FileProcessingResponse(BaseModel):
    """Response xử lý file"""
    processing_id: str = Field(..., description="ID của quá trình xử lý")
    file_id: str = Field(..., description="ID của file gốc")
    processing_type: FileProcessingType = Field(..., description="Loại xử lý")
    status: str = Field(..., description="Trạng thái xử lý")
    result_file_id: Optional[str] = Field(None, description="ID của file kết quả")
    message: str = Field(..., description="Thông báo")
    created_at: datetime = Field(..., description="Thời gian tạo")
    completed_at: Optional[datetime] = Field(None, description="Thời gian hoàn thành")

class AssetCreateRequest(BaseModel):
    """Request tạo asset"""
    name: str = Field(..., description="Tên asset")
    description: Optional[str] = Field(None, description="Mô tả asset")
    category: AssetCategory = Field(..., description="Danh mục asset")
    file_id: str = Field(..., description="ID của file gốc")
    tags: Optional[List[str]] = Field(None, description="Tags của asset")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadata bổ sung")

class AssetUpdateRequest(BaseModel):
    """Request cập nhật asset"""
    name: Optional[str] = Field(None, description="Tên asset")
    description: Optional[str] = Field(None, description="Mô tả asset")
    category: Optional[AssetCategory] = Field(None, description="Danh mục asset")
    tags: Optional[List[str]] = Field(None, description="Tags của asset")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadata bổ sung")
    status: Optional[AssetStatus] = Field(None, description="Trạng thái asset")

class AssetResponse(BaseModel):
    """Response asset"""
    asset_id: str = Field(..., description="ID của asset")
    name: str = Field(..., description="Tên asset")
    description: Optional[str] = Field(None, description="Mô tả asset")
    category: AssetCategory = Field(..., description="Danh mục asset")
    file_id: str = Field(..., description="ID của file gốc")
    file_url: Optional[str] = Field(None, description="URL của file")
    tags: List[str] = Field(default_factory=list, description="Tags của asset")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Metadata")
    status: AssetStatus = Field(..., description="Trạng thái asset")
    version: int = Field(..., description="Phiên bản asset")
    created_at: datetime = Field(..., description="Thời gian tạo")
    updated_at: datetime = Field(..., description="Thời gian cập nhật")
    created_by: str = Field(..., description="Người tạo")
    updated_by: str = Field(..., description="Người cập nhật")

class GeneralFileRequest(BaseModel):
    """Request quản lý file tổng quát"""
    file_id: str = Field(..., description="ID của file")
    folder_path: Optional[str] = Field(None, description="Đường dẫn thư mục")
    permissions: Optional[Dict[str, List[str]]] = Field(None, description="Quyền truy cập")
    is_public: bool = Field(False, description="Có phải file công khai không")
    share_token: Optional[str] = Field(None, description="Token chia sẻ")

class GeneralFileResponse(BaseModel):
    """Response quản lý file tổng quát"""
    file_id: str = Field(..., description="ID của file")
    filename: str = Field(..., description="Tên file")
    folder_path: str = Field(..., description="Đường dẫn thư mục")
    file_url: str = Field(..., description="URL của file")
    is_public: bool = Field(..., description="Có phải file công khai không")
    share_token: Optional[str] = Field(None, description="Token chia sẻ")
    permissions: Dict[str, List[str]] = Field(default_factory=dict, description="Quyền truy cập")
    access_count: int = Field(0, description="Số lần truy cập")
    last_accessed: Optional[datetime] = Field(None, description="Lần truy cập cuối")
    created_at: datetime = Field(..., description="Thời gian tạo")
    updated_at: datetime = Field(..., description="Thời gian cập nhật")

class FileMetadataResponse(BaseModel):
    """Response metadata file"""
    file_id: str = Field(..., description="ID của file")
    filename: str = Field(..., description="Tên file")
    file_size: int = Field(..., description="Kích thước file")
    content_type: str = Field(..., description="Loại nội dung")
    file_extension: str = Field(..., description="Phần mở rộng file")
    checksum: str = Field(..., description="Checksum file")
    created_at: datetime = Field(..., description="Thời gian tạo")
    modified_at: datetime = Field(..., description="Thời gian sửa đổi")
    is_valid: bool = Field(..., description="File có hợp lệ không")
    validation_errors: List[str] = Field(default_factory=list, description="Lỗi validation")

class FileSearchRequest(BaseModel):
    """Request tìm kiếm file"""
    query: Optional[str] = Field(None, description="Từ khóa tìm kiếm")
    category: Optional[AssetCategory] = Field(None, description="Danh mục")
    file_type: Optional[str] = Field(None, description="Loại file")
    created_from: Optional[datetime] = Field(None, description="Tạo từ ngày")
    created_to: Optional[datetime] = Field(None, description="Tạo đến ngày")
    size_min: Optional[int] = Field(None, description="Kích thước tối thiểu")
    size_max: Optional[int] = Field(None, description="Kích thước tối đa")
    tags: Optional[List[str]] = Field(None, description="Tags")
    is_public: Optional[bool] = Field(None, description="File công khai")

class FileBackupRequest(BaseModel):
    """Request sao lưu file"""
    file_ids: List[str] = Field(..., description="Danh sách ID file cần sao lưu")
    backup_name: Optional[str] = Field(None, description="Tên backup")
    include_metadata: bool = Field(True, description="Bao gồm metadata")
    compression: bool = Field(True, description="Nén backup")

class FileBackupResponse(BaseModel):
    """Response sao lưu file"""
    backup_id: str = Field(..., description="ID của backup")
    backup_name: str = Field(..., description="Tên backup")
    file_count: int = Field(..., description="Số lượng file")
    backup_size: int = Field(..., description="Kích thước backup")
    backup_url: str = Field(..., description="URL download backup")
    created_at: datetime = Field(..., description="Thời gian tạo")
    expires_at: Optional[datetime] = Field(None, description="Thời gian hết hạn")
