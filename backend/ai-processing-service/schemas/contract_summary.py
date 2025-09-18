from pydantic import BaseModel, Field
from typing import List, Optional, Union
from datetime import datetime

class Party(BaseModel):
    role: str = Field(..., description="Vai trò của bên trong hợp đồng")
    name: str = Field(..., description="Tên công ty/tổ chức")
    representative: str = Field(..., description="Người đại diện")
    taxCode: str = Field(..., description="Mã số thuế")
    contact: str = Field(..., description="Thông tin liên lạc")
    address: str = Field(..., description="Địa chỉ")
    businessLicense: str = Field(..., description="Giấy phép kinh doanh")

class PaymentDetails(BaseModel):
    totalValue: Union[int, float] = Field(..., description="Tổng giá trị hợp đồng (số)")
    schedule: str = Field(..., description="Lịch trình thanh toán")
    currency: str = Field(..., description="Đơn vị tiền tệ")
    paymentMethod: str = Field(..., description="Phương thức thanh toán")

class KeyClause(BaseModel):
    name: str = Field(..., description="Tên điều khoản")
    description: str = Field(..., description="Mô tả điều khoản")
    source: str = Field(..., description="Nguồn tham chiếu (ví dụ: Điều 1)")

class FavorableClause(BaseModel):
    clauseName: str = Field(..., description="Tên điều khoản có lợi")
    description: str = Field(..., description="Mô tả điều khoản")
    benefitTo: str = Field(..., description="Bên được hưởng lợi")

class UnfavorableClause(BaseModel):
    clauseName: str = Field(..., description="Tên điều khoản bất lợi")
    description: str = Field(..., description="Mô tả điều khoản")
    riskTo: str = Field(..., description="Bên chịu rủi ro")

class Reminder(BaseModel):
    type: str = Field(..., description="Loại nhắc nhở (gia hạn, xem xét, hết hạn)")
    date: Optional[str] = Field(None, description="Ngày nhắc nhở (ISO 8601)")
    content: str = Field(..., description="Nội dung nhắc nhở")

class RiskAssessment(BaseModel):
    riskLevel: str = Field(..., description="Mức độ rủi ro (LOW, MEDIUM, HIGH)")
    riskFactors: List[str] = Field(..., description="Danh sách các yếu tố rủi ro")
    mitigationMeasures: List[str] = Field(..., description="Các biện pháp giảm thiểu rủi ro")

class ComplianceStatus(BaseModel):
    status: str = Field(..., description="Trạng thái tuân thủ (COMPLIANT, NON_COMPLIANT, REVIEW_REQUIRED)")
    issues: List[str] = Field(..., description="Danh sách các vấn đề")
    recommendations: List[str] = Field(..., description="Các khuyến nghị")

class ContractSummary(BaseModel):
    id: str = Field(..., description="ID duy nhất của hợp đồng")
    contractNumber: str = Field(..., description="Số hợp đồng")
    status: str = Field(..., description="Trạng thái hợp đồng")
    contractType: str = Field(..., description="Loại hợp đồng")
    title: str = Field(..., description="Tiêu đề hợp đồng")
    tag: List[str] = Field(..., description="Danh sách tag phân loại")
    parties: List[Party] = Field(..., description="Danh sách các bên tham gia")
    object: str = Field(..., description="Đối tượng hợp đồng")
    effectiveDate: str = Field(..., description="Ngày có hiệu lực (ISO 8601)")
    term: str = Field(..., description="Thời hạn hợp đồng")
    paymentDetails: PaymentDetails = Field(..., description="Chi tiết thanh toán")
    keyClauses: List[KeyClause] = Field(..., description="Các điều khoản chính")
    favorableClauses: List[FavorableClause] = Field(..., description="Các điều khoản có lợi")
    unfavorableClauses: List[UnfavorableClause] = Field(..., description="Các điều khoản bất lợi")
    reminders: List[Reminder] = Field(..., description="Danh sách nhắc nhở")
    terminationConditions: str = Field(..., description="Điều kiện chấm dứt hợp đồng")
    riskAssessment: RiskAssessment = Field(..., description="Đánh giá rủi ro")
    complianceStatus: ComplianceStatus = Field(..., description="Trạng thái tuân thủ")

class ContractSummaryResponse(BaseModel):
    contract_summary: ContractSummary = Field(..., description="Tóm tắt hợp đồng")




