from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
from datetime import datetime

class FileInformation(BaseModel):
    fileId: str = Field(..., description="ID duy nhất của file")
    filename: str = Field(..., description="Tên file")
    fileType: str = Field(..., description="Loại file (CONTRACT, GENERAL)")
    fileKey: str = Field(..., description="Key của file trong storage")
    bucket: str = Field(..., description="Tên bucket chứa file")
    contentType: str = Field(..., description="MIME type của file")
    fileSize: int = Field(..., description="Kích thước file (bytes)")
    uploadedAt: datetime = Field(..., description="Thời gian upload")

class AIProcessingResult(BaseModel):
    extractionMethod: str = Field(..., description="Phương pháp trích xuất")
    confidence: float = Field(..., description="Độ tin cậy (0.0 - 1.0)")
    processingTime: int = Field(..., description="Thời gian xử lý (milliseconds)")
    modelVersion: str = Field(..., description="Phiên bản model AI")
    processedAt: datetime = Field(..., description="Thời gian xử lý")

class ContractSummaryEvent(BaseModel):
    eventVersion: str = Field(..., description="Phiên bản event")
    eventType: str = Field(..., description="Loại event")
    eventId: str = Field(..., description="ID duy nhất của event")
    timestamp: datetime = Field(..., description="Thời gian tạo event")
    source: str = Field(..., description="Nguồn tạo event")
    correlationId: str = Field(..., description="ID tương quan")
    actor: Dict[str, Any] = Field(..., description="Thông tin người thực hiện")
    data: Dict[str, Any] = Field(..., description="Dữ liệu event")
    metadata: Dict[str, Any] = Field(..., description="Metadata bổ sung")

class SummaryCreatedEventData(BaseModel):
    fileInformation: FileInformation = Field(..., description="Thông tin file")
    aiProcessingResult: AIProcessingResult = Field(..., description="Kết quả xử lý AI")
    contractSummary: Dict[str, Any] = Field(..., description="Tóm tắt hợp đồng")

class SummaryCreatedEvent(BaseModel):
    eventVersion: str = Field(default="v1", description="Phiên bản event")
    eventType: str = Field(default="SummaryCreated", description="Loại event")
    eventId: str = Field(..., description="ID duy nhất của event")
    timestamp: datetime = Field(..., description="Thời gian tạo event")
    source: str = Field(default="ai-processing-service", description="Nguồn tạo event")
    correlationId: str = Field(..., description="ID tương quan")
    actor: Dict[str, Any] = Field(..., description="Thông tin người thực hiện")
    data: SummaryCreatedEventData = Field(..., description="Dữ liệu event")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Metadata bổ sung")




