from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class EventType(str, Enum):
    FILE_UPLOADED = "file.uploaded"
    AI_PROCESSING_STARTED = "ai.processing.started"
    AI_PROCESSING_COMPLETED = "ai.processing.completed"
    AI_PROCESSING_FAILED = "ai.processing.failed"
    NOTIFICATION_SENT = "notification.sent"
    NOTIFICATION_FAILED = "notification.failed"
    BATCH_JOB_STARTED = "batch.job.started"
    BATCH_JOB_COMPLETED = "batch.job.completed"
    BATCH_JOB_FAILED = "batch.job.failed"
    CONTRACT_CREATED = "contract.created"
    CONTRACT_UPDATED = "contract.updated"
    CONTRACT_DELETED = "contract.deleted"

class EventStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class EventPayload(BaseModel):
    eventVersion: str = Field(default="v1", description="Version của event schema")
    eventType: EventType = Field(..., description="Loại sự kiện")
    eventId: str = Field(..., description="UUID duy nhất cho event")
    timestamp: datetime = Field(..., description="Thời điểm phát sinh event")
    source: str = Field(..., description="Tên service phát sinh event")
    correlationId: str = Field(..., description="ID liên kết với request gốc")
    actor: Optional[Dict[str, Any]] = Field(None, description="Thông tin người thực hiện")
    data: Dict[str, Any] = Field(..., description="Payload chính của event")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadata bổ sung")

class EventHandlerRequest(BaseModel):
    event: EventPayload = Field(..., description="Event cần xử lý")
    handler_type: str = Field(..., description="Loại handler")
    retry_count: int = Field(default=0, ge=0, description="Số lần retry")
    max_retries: int = Field(default=3, ge=0, description="Số lần retry tối đa")

class EventHandlerResponse(BaseModel):
    success: bool = Field(..., description="Trạng thái xử lý")
    message: str = Field(..., description="Thông báo kết quả")
    processed_at: datetime = Field(..., description="Thời gian xử lý")
    retry_count: int = Field(..., description="Số lần retry")
    next_retry_at: Optional[datetime] = Field(None, description="Thời gian retry tiếp theo")

class EventSubscriptionRequest(BaseModel):
    channels: List[str] = Field(..., description="Danh sách channels cần subscribe")
    handler_type: str = Field(..., description="Loại handler")
    auto_ack: bool = Field(default=True, description="Tự động acknowledge")

class EventSubscriptionResponse(BaseModel):
    subscription_id: str = Field(..., description="ID subscription")
    channels: List[str]
    status: str = Field(..., description="Trạng thái subscription")
    created_at: datetime

class EventPublishRequest(BaseModel):
    channel: str = Field(..., description="Channel để publish")
    event: EventPayload = Field(..., description="Event cần publish")
    ttl: Optional[int] = Field(None, description="Time to live (giây)")

class EventPublishResponse(BaseModel):
    success: bool = Field(..., description="Trạng thái publish")
    message: str = Field(..., description="Thông báo kết quả")
    published_at: datetime = Field(..., description="Thời gian publish")

class EventHistoryRequest(BaseModel):
    page: int = Field(default=1, ge=1, description="Số trang")
    limit: int = Field(default=10, ge=1, le=100, description="Số lượng mỗi trang")
    event_type: Optional[EventType] = Field(None, description="Lọc theo loại event")
    source: Optional[str] = Field(None, description="Lọc theo source")
    status: Optional[EventStatus] = Field(None, description="Lọc theo trạng thái")
    start_date: Optional[datetime] = Field(None, description="Ngày bắt đầu")
    end_date: Optional[datetime] = Field(None, description="Ngày kết thúc")

class EventHistoryResponse(BaseModel):
    events: List[EventPayload]
    total: int
    page: int
    limit: int
    total_pages: int

class WebSocketEvent(BaseModel):
    event_type: str = Field(..., description="Loại event")
    data: Dict[str, Any] = Field(..., description="Dữ liệu event")
    timestamp: datetime = Field(..., description="Thời gian event")
    user_id: Optional[str] = Field(None, description="User ID (nếu có)")
