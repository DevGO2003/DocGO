# ContractType Migration Guide

## Tổng quan

Đã thực hiện chuẩn hóa enum `ContractType` để chỉ chấp nhận **English constants** thay vì tiếng Việt. Điều này đảm bảo tính nhất quán và tuân thủ chuẩn quốc tế.

## Thay đổi chính

### 1. Enum ContractType
- **Trước**: Chấp nhận cả English constants và tiếng Việt
- **Sau**: Chỉ chấp nhận English constants
- **Ví dụ**: `"Hợp đồng mua bán"` → `"PURCHASE_AGREEMENT"`

### 2. API Validation
- **DTO**: Thêm `@Pattern` validation để chỉ chấp nhận English constants
- **Controller**: Loại bỏ try-catch fallback, validation được xử lý ở DTO level
- **Error Message**: Cung cấp danh sách các giá trị hợp lệ khi lỗi

### 3. Frontend Integration
- **Constants**: Cập nhật `CONTRACT_TYPES` và `CONTRACT_TYPE_LABELS`
- **UI**: Dropdown và form sử dụng English constants
- **Display**: Vẫn hiển thị tiếng Việt cho user thông qua `displayName`

## Danh sách ContractType Constants

### Service Agreements
- `SERVICE_AGREEMENT` - Hợp đồng dịch vụ
- `CONSULTING_AGREEMENT` - Hợp đồng tư vấn
- `MAINTENANCE_AGREEMENT` - Hợp đồng bảo trì
- `SUPPORT_AGREEMENT` - Hợp đồng hỗ trợ
- `TRAINING_AGREEMENT` - Hợp đồng đào tạo

### Purchase Agreements
- `PURCHASE_AGREEMENT` - Hợp đồng mua bán
- `SUPPLY_AGREEMENT` - Hợp đồng cung ứng
- `PROCUREMENT_AGREEMENT` - Hợp đồng mua sắm

### Lease Agreements
- `LEASE_AGREEMENT` - Hợp đồng thuê
- `RENTAL_AGREEMENT` - Hợp đồng cho thuê
- `EQUIPMENT_LEASE` - Hợp đồng thuê thiết bị

### Employment Contracts
- `EMPLOYMENT_CONTRACT` - Hợp đồng lao động
- `CONSULTANT_CONTRACT` - Hợp đồng tư vấn viên
- `FREELANCER_CONTRACT` - Hợp đồng freelancer
- `INTERN_AGREEMENT` - Hợp đồng thực tập

### Confidentiality Agreements
- `CONFIDENTIALITY_AGREEMENT` - Hợp đồng bảo mật
- `NON_DISCLOSURE_AGREEMENT` - Thỏa thuận bảo mật
- `NON_COMPETE_AGREEMENT` - Thỏa thuận không cạnh tranh

### Partnership Agreements
- `PARTNERSHIP_AGREEMENT` - Hợp đồng đối tác
- `JOINT_VENTURE_AGREEMENT` - Hợp đồng liên doanh
- `DISTRIBUTION_AGREEMENT` - Hợp đồng phân phối
- `FRANCHISE_AGREEMENT` - Hợp đồng nhượng quyền

### Licensing Agreements
- `LICENSING_AGREEMENT` - Hợp đồng cấp phép
- `SOFTWARE_LICENSE` - Giấy phép phần mềm
- `TRADEMARK_LICENSE` - Giấy phép thương hiệu
- `PATENT_LICENSE` - Giấy phép bằng sáng chế

### Financial Agreements
- `LOAN_AGREEMENT` - Hợp đồng vay
- `CREDIT_AGREEMENT` - Hợp đồng tín dụng
- `INVESTMENT_AGREEMENT` - Hợp đồng đầu tư
- `INSURANCE_AGREEMENT` - Hợp đồng bảo hiểm

### Technology Agreements
- `SAAS_AGREEMENT` - Hợp đồng SaaS
- `CLOUD_AGREEMENT` - Hợp đồng đám mây
- `HOSTING_AGREEMENT` - Hợp đồng hosting
- `DEVELOPMENT_AGREEMENT` - Hợp đồng phát triển

### Marketing Agreements
- `ADVERTISING_AGREEMENT` - Hợp đồng quảng cáo
- `MARKETING_AGREEMENT` - Hợp đồng marketing
- `SPONSORSHIP_AGREEMENT` - Hợp đồng tài trợ

### Real Estate Agreements
- `PROPERTY_LEASE` - Hợp đồng thuê bất động sản
- `PROPERTY_PURCHASE` - Hợp đồng mua bất động sản
- `CONSTRUCTION_AGREEMENT` - Hợp đồng xây dựng

### Legal Agreements
- `SETTLEMENT_AGREEMENT` - Thỏa thuận dàn xếp
- `ARBITRATION_AGREEMENT` - Thỏa thuận trọng tài
- `MEDIATION_AGREEMENT` - Thỏa thuận hòa giải

### Other Agreements
- `AMENDMENT_AGREEMENT` - Phụ lục hợp đồng
- `TERMINATION_AGREEMENT` - Thỏa thuận chấm dứt
- `RENEWAL_AGREEMENT` - Thỏa thuận gia hạn
- `ASSIGNMENT_AGREEMENT` - Thỏa thuận chuyển nhượng

### General Types
- `OTHER` - Khác
- `GENERAL` - Chung
- `NDA` - Thỏa thuận bảo mật

## Migration Script

### Chạy Migration Database
```bash
# Chạy migration script để cập nhật dữ liệu hiện có
java -jar target/contract-service-1.0.0.jar --migrate-contract-types
```

### Mapping Table
| Tiếng Việt (Cũ) | English Constant (Mới) |
|------------------|------------------------|
| Hợp đồng dịch vụ | SERVICE_AGREEMENT |
| Hợp đồng mua bán | PURCHASE_AGREEMENT |
| Hợp đồng lao động | EMPLOYMENT_CONTRACT |
| Hợp đồng thuê | LEASE_AGREEMENT |
| Hợp đồng đối tác | PARTNERSHIP_AGREEMENT |
| Hợp đồng bảo mật | CONFIDENTIALITY_AGREEMENT |
| Khác | OTHER |

## API Examples

### Tạo Contract với English Constant
```bash
curl -X POST "http://localhost:8003/api/v1/document-management-service/contracts" \
  -H "Content-Type: application/json" \
  -d '{
    "contractNumber": "HD-2024-001",
    "title": "Hợp đồng cung cấp dịch vụ",
    "status": "DRAFT",
    "contractType": "SERVICE_AGREEMENT",
    "partiesJson": "[{\"name\":\"Công ty A\",\"role\":\"Client\"}]",
    "startDate": "2024-01-01T00:00:00",
    "endDate": "2024-12-31T23:59:59",
    "systemId": "SYS-001"
  }'
```

### Response Format
```json
{
  "apiVersion": "v1",
  "statusCode": 201,
  "shortMessage": "Success",
  "description": "Hợp đồng đã được tạo thành công.",
  "data": {
    "id": "uuid-here",
    "contractNumber": "HD-2024-001",
    "title": "Hợp đồng cung cấp dịch vụ",
    "contractType": "SERVICE_AGREEMENT",
    "status": "DRAFT",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid-here",
  "path": "/api/v1/document-management-service/contracts"
}
```

## Error Handling

### Invalid ContractType
```json
{
  "apiVersion": "v1",
  "statusCode": 400,
  "shortMessage": "Bad Request",
  "description": "Loại hợp đồng phải là English constant hợp lệ (ví dụ: PURCHASE_AGREEMENT, SERVICE_AGREEMENT)",
  "data": null,
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid-here",
  "path": "/api/v1/document-management-service/contracts"
}
```

## Frontend Integration

### Constants Usage
```typescript
import { CONTRACT_TYPES, CONTRACT_TYPE_LABELS } from '@/utils/constants'

// Sử dụng English constant
const contractType = CONTRACT_TYPES.SERVICE_AGREEMENT

// Hiển thị tiếng Việt cho user
const displayName = CONTRACT_TYPE_LABELS[CONTRACT_TYPES.SERVICE_AGREEMENT]
// Result: "Hợp đồng dịch vụ"
```

### Form Validation
```typescript
// Form sẽ validate English constants
const formData = {
  contractType: "PURCHASE_AGREEMENT" // ✅ Valid
  // contractType: "Hợp đồng mua bán" // ❌ Invalid
}
```

## Testing

### Test Cases
1. **Valid English Constants**: `PURCHASE_AGREEMENT`, `SERVICE_AGREEMENT`, etc.
2. **Invalid Vietnamese Values**: `"Hợp đồng mua bán"`, `"Dịch vụ"`, etc.
3. **Case Sensitivity**: `"purchase_agreement"` (should work - case insensitive)
4. **Empty/Null Values**: Should be rejected

### Test Script
```bash
# Chạy test script
.\test-simple.ps1
```

## Rollback Plan

Nếu cần rollback:
1. Revert enum `ContractType.fromValue()` method
2. Revert DTO validation
3. Revert frontend constants
4. Chạy reverse migration script

## Benefits

1. **Consistency**: Tất cả API sử dụng English constants
2. **Internationalization**: Dễ dàng mở rộng đa ngôn ngữ
3. **Type Safety**: Frontend có type checking tốt hơn
4. **Documentation**: API docs rõ ràng hơn
5. **Integration**: Dễ tích hợp với hệ thống bên ngoài

## Notes

- **Display Names**: Vẫn hiển thị tiếng Việt cho user thông qua `displayName`
- **Backward Compatibility**: Không có - đây là breaking change
- **Migration Required**: Tất cả dữ liệu hiện có cần được migrate
- **Frontend Update**: Tất cả frontend code cần cập nhật để sử dụng English constants
