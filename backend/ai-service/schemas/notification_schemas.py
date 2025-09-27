from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
from enum import Enum

class NotificationType(str, Enum):
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    WEBSOCKET = "websocket"

class NotificationStatus(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"
    CANCELLED = "cancelled"

class NotificationPriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"

class NotificationTemplate(BaseModel):
    id: Optional[str] = None
    name: str = Field(..., description="Tên template")
    type: NotificationType = Field(..., description="Loại notification")
    subject: Optional[str] = Field(None, description="Tiêu đề (cho email)")
    content: str = Field(..., description="Nội dung template")
    variables: List[str] = Field(default=[], description="Danh sách biến trong template")
    is_active: bool = Field(default=True, description="Trạng thái hoạt động")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class NotificationRequest(BaseModel):
    type: NotificationType = Field(..., description="Loại notification")
    recipients: List[str] = Field(..., description="Danh sách người nhận")
    subject: Optional[str] = Field(None, description="Tiêu đề (cho email)")
    content: str = Field(..., description="Nội dung notification")
    template_id: Optional[str] = Field(None, description="ID template (tùy chọn)")
    template_variables: Optional[Dict[str, Any]] = Field(None, description="Biến cho template")
    priority: NotificationPriority = Field(default=NotificationPriority.NORMAL, description="Độ ưu tiên")
    scheduled_at: Optional[datetime] = Field(None, description="Thời gian lên lịch gửi")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Metadata bổ sung")

class NotificationResponse(BaseModel):
    id: str = Field(..., description="ID notification")
    type: NotificationType
    recipients: List[str]
    subject: Optional[str] = None
    content: str
    status: NotificationStatus
    priority: NotificationPriority
    created_at: datetime
    sent_at: Optional[datetime] = None
    failed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class NotificationHistoryRequest(BaseModel):
    page: int = Field(default=1, ge=1, description="Số trang")
    limit: int = Field(default=10, ge=1, le=100, description="Số lượng mỗi trang")
    type: Optional[NotificationType] = Field(None, description="Lọc theo loại")
    status: Optional[NotificationStatus] = Field(None, description="Lọc theo trạng thái")
    start_date: Optional[datetime] = Field(None, description="Ngày bắt đầu")
    end_date: Optional[datetime] = Field(None, description="Ngày kết thúc")

class NotificationHistoryResponse(BaseModel):
    notifications: List[NotificationResponse]
    total: int
    page: int
    limit: int
    total_pages: int

class EmailNotificationRequest(BaseModel):
    to: List[EmailStr] = Field(..., description="Danh sách email người nhận")
    cc: Optional[List[EmailStr]] = Field(None, description="Danh sách CC")
    bcc: Optional[List[EmailStr]] = Field(None, description="Danh sách BCC")
    subject: str = Field(..., description="Tiêu đề email")
    content: str = Field(..., description="Nội dung email")
    html_content: Optional[str] = Field(None, description="Nội dung HTML")
    attachments: Optional[List[Dict[str, Any]]] = Field(None, description="File đính kèm")

class SMSNotificationRequest(BaseModel):
    to: List[str] = Field(..., description="Danh sách số điện thoại")
    content: str = Field(..., description="Nội dung SMS")
    sender: Optional[str] = Field(None, description="Số điện thoại gửi")

class PushNotificationRequest(BaseModel):
    user_ids: List[str] = Field(..., description="Danh sách user ID")
    title: str = Field(..., description="Tiêu đề push notification")
    content: str = Field(..., description="Nội dung push notification")
    data: Optional[Dict[str, Any]] = Field(None, description="Dữ liệu bổ sung")
    action_url: Optional[str] = Field(None, description="URL khi click notification")

class WebSocketNotificationRequest(BaseModel):
    user_ids: List[str] = Field(..., description="Danh sách user ID")
    event: str = Field(..., description="Tên event")
    data: Dict[str, Any] = Field(..., description="Dữ liệu event")
