from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
from enum import Enum

class BatchJobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class BatchJobType(str, Enum):
    AI_PROCESSING = "ai_processing"
    NOTIFICATION_SEND = "notification_send"
    DATA_EXPORT = "data_export"
    DATA_IMPORT = "data_import"
    FILE_PROCESSING = "file_processing"

class BatchJobPriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"

class BatchJobRequest(BaseModel):
    type: BatchJobType = Field(..., description="Loại batch job")
    name: str = Field(..., description="Tên job")
    description: Optional[str] = Field(None, description="Mô tả job")
    data: Dict[str, Any] = Field(..., description="Dữ liệu đầu vào")
    priority: BatchJobPriority = Field(default=BatchJobPriority.NORMAL, description="Độ ưu tiên")
    scheduled_at: Optional[datetime] = Field(None, description="Thời gian lên lịch chạy")
    max_retries: int = Field(default=3, ge=0, le=10, description="Số lần retry tối đa")
    timeout: Optional[int] = Field(None, ge=1, description="Timeout (giây)")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadata bổ sung")

class BatchJobResponse(BaseModel):
    id: str = Field(..., description="ID job")
    type: BatchJobType
    name: str
    description: Optional[str] = None
    status: BatchJobStatus
    priority: BatchJobPriority
    progress: int = Field(0, ge=0, le=100, description="Tiến độ (%)")
    data: Dict[str, Any]
    result: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    failed_at: Optional[datetime] = None
    retry_count: int = Field(0, ge=0)
    max_retries: int
    timeout: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None

class BatchJobStatusRequest(BaseModel):
    job_id: str = Field(..., description="ID job cần kiểm tra")

class BatchJobListRequest(BaseModel):
    page: int = Field(default=1, ge=1, description="Số trang")
    limit: int = Field(default=10, ge=1, le=100, description="Số lượng mỗi trang")
    type: Optional[BatchJobType] = Field(None, description="Lọc theo loại")
    status: Optional[BatchJobStatus] = Field(None, description="Lọc theo trạng thái")
    priority: Optional[BatchJobPriority] = Field(None, description="Lọc theo độ ưu tiên")
    start_date: Optional[datetime] = Field(None, description="Ngày bắt đầu")
    end_date: Optional[datetime] = Field(None, description="Ngày kết thúc")

class BatchJobListResponse(BaseModel):
    jobs: List[BatchJobResponse]
    total: int
    page: int
    limit: int
    total_pages: int

class BatchJobCancelRequest(BaseModel):
    job_id: str = Field(..., description="ID job cần hủy")

class BatchJobRetryRequest(BaseModel):
    job_id: str = Field(..., description="ID job cần retry")

class BatchProcessingRequest(BaseModel):
    files: List[Dict[str, Any]] = Field(..., description="Danh sách file cần xử lý")
    processing_type: str = Field(..., description="Loại xử lý (extract, summarize, classify)")
    options: Optional[Dict[str, Any]] = Field(None, description="Tùy chọn xử lý")
    callback_url: Optional[str] = Field(None, description="URL callback khi hoàn thành")

class BatchProcessingResponse(BaseModel):
    job_id: str = Field(..., description="ID job batch")
    total_files: int = Field(..., description="Tổng số file")
    estimated_time: Optional[int] = Field(None, description="Thời gian ước tính (giây)")
    status_url: str = Field(..., description="URL kiểm tra trạng thái")

class BatchJobProgress(BaseModel):
    job_id: str
    status: BatchJobStatus
    progress: int
    current_item: Optional[str] = None
    total_items: int
    processed_items: int
    failed_items: int
    estimated_remaining: Optional[int] = None
    last_updated: datetime
