from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Any, Generic, TypeVar
from datetime import datetime
import uuid

T = TypeVar('T')

class RestResponse(BaseModel, Generic[T]):
    """
    Chuẩn hóa response envelope cho tất cả API endpoints
    """
    model_config = ConfigDict(json_encoders={datetime: lambda v: v.isoformat()})
    
    apiVersion: str = Field("v1", description="Phiên bản API")
    statusCode: int = Field(..., description="Mã trạng thái HTTP")
    shortMessage: str = Field(..., description="Thông báo ngắn gọn")
    description: str = Field(..., description="Mô tả chi tiết kết quả")
    data: Optional[T] = Field(None, description="Dữ liệu response")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Thời gian xử lý")
    requestId: str = Field(default_factory=lambda: str(uuid.uuid4()), description="ID duy nhất của request")
    path: str = Field(..., description="Đường dẫn API được gọi")

class ErrorResponse(BaseModel):
    """
    Response cho lỗi
    """
    model_config = ConfigDict(json_encoders={datetime: lambda v: v.isoformat()})
    
    apiVersion: str = Field("v1", description="Phiên bản API")
    statusCode: int = Field(..., description="Mã trạng thái HTTP")
    shortMessage: str = Field(..., description="Thông báo lỗi ngắn gọn")
    description: str = Field(..., description="Mô tả chi tiết lỗi")
    error: str = Field(..., description="Thông tin lỗi")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Thời gian xảy ra lỗi")
    requestId: str = Field(default_factory=lambda: str(uuid.uuid4()), description="ID duy nhất của request")
    path: str = Field(..., description="Đường dẫn API được gọi")
