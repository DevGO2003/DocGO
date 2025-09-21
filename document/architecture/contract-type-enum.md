# ContractType Enum - Tài liệu kiến trúc

## Tổng quan

Enum `ContractType` là một thành phần cốt lõi trong hệ thống DocGO, được thiết kế để quản lý các loại hợp đồng một cách nhất quán và có cấu trúc. Enum này được sử dụng xuyên suốt hệ thống từ backend đến frontend.

## Thiết kế kiến trúc

### 1. Cấu trúc dữ liệu

```java
public enum ContractType {
    SERVICE_AGREEMENT("SERVICE_AGREEMENT", "Hợp đồng dịch vụ", "Hợp đồng cung cấp dịch vụ"),
    CONSULTING_AGREEMENT("CONSULTING_AGREEMENT", "Hợp đồng tư vấn", "Hợp đồng dịch vụ tư vấn"),
    // ... 47 constants khác
}
```

**Cấu trúc 3 thành phần:**
- `value`: English constant (dùng cho API, database, validation)
- `displayName`: Tên hiển thị tiếng Việt (dùng cho UI)
- `description`: Mô tả chi tiết (dùng cho documentation, tooltip)

### 2. Phân loại theo nhóm

Enum được tổ chức thành 12 nhóm chính:

| Nhóm | Mô tả | Số lượng | Ví dụ |
|------|-------|----------|-------|
| **SERVICE** | Hợp đồng dịch vụ | 5 | SERVICE_AGREEMENT, CONSULTING_AGREEMENT |
| **PURCHASE** | Hợp đồng mua bán | 3 | PURCHASE_AGREEMENT, SUPPLY_AGREEMENT |
| **LEASE** | Hợp đồng thuê mướn | 3 | LEASE_AGREEMENT, RENTAL_AGREEMENT |
| **EMPLOYMENT** | Hợp đồng lao động | 4 | EMPLOYMENT_CONTRACT, CONSULTANT_CONTRACT |
| **CONFIDENTIALITY** | Hợp đồng bảo mật | 3 | CONFIDENTIALITY_AGREEMENT, NDA |
| **PARTNERSHIP** | Hợp đồng đối tác | 4 | PARTNERSHIP_AGREEMENT, JOINT_VENTURE_AGREEMENT |
| **LICENSING** | Hợp đồng cấp phép | 4 | LICENSING_AGREEMENT, SOFTWARE_LICENSE |
| **FINANCIAL** | Hợp đồng tài chính | 4 | LOAN_AGREEMENT, INVESTMENT_AGREEMENT |
| **TECHNOLOGY** | Hợp đồng công nghệ | 4 | SAAS_AGREEMENT, CLOUD_AGREEMENT |
| **MARKETING** | Hợp đồng marketing | 3 | ADVERTISING_AGREEMENT, MARKETING_AGREEMENT |
| **REAL_ESTATE** | Hợp đồng bất động sản | 3 | PROPERTY_LEASE, CONSTRUCTION_AGREEMENT |
| **LEGAL** | Hợp đồng pháp lý | 3 | SETTLEMENT_AGREEMENT, ARBITRATION_AGREEMENT |
| **OTHER** | Các loại khác | 4 | AMENDMENT_AGREEMENT, OTHER, GENERAL |

## Cách sử dụng

### 1. Backend (Java Spring Boot)

#### Enum Definition
```java
@JsonCreator
public static ContractType fromValue(String value) {
    // Chỉ chấp nhận English constants
    for (ContractType type : ContractType.values()) {
        if (type.value.equalsIgnoreCase(trimmedValue)) {
            return type;
        }
    }
    throw new IllegalArgumentException("Unknown ContractType: '" + value + "'");
}
```

#### DTO Validation
```java
@NotBlank(message = "Loại hợp đồng không được để trống")
@Pattern(regexp = "^(SERVICE_AGREEMENT|CONSULTING_AGREEMENT|...)$", 
         message = "Loại hợp đồng không hợp lệ")
private String contractType;
```

#### Controller Usage
```java
@PostMapping
public ResponseEntity<RestResponse<Contract>> createContract(@Valid @RequestBody ContractCreateRequest request) {
    // Validation được xử lý tự động bởi @Valid
    contract.setContractType(ContractType.fromValue(request.getContractType()));
    return ResponseEntity.ok(RestResponse.success(contract));
}
```

### 2. Frontend (TypeScript/React)

#### Constants Definition
```typescript
export const CONTRACT_TYPES = {
  SERVICE_AGREEMENT: 'SERVICE_AGREEMENT',
  CONSULTING_AGREEMENT: 'CONSULTING_AGREEMENT',
  // ... 47 constants khác
} as const

export const CONTRACT_TYPE_LABELS = {
  [CONTRACT_TYPES.SERVICE_AGREEMENT]: 'Hợp đồng dịch vụ',
  [CONTRACT_TYPES.CONSULTING_AGREEMENT]: 'Hợp đồng tư vấn',
  // ... 47 labels khác
} as const
```

#### Component Usage
```typescript
// Dropdown component
<select value={contractType} onChange={handleChange}>
  {Object.entries(CONTRACT_TYPE_LABELS).map(([value, label]) => (
    <option key={value} value={value}>
      {label}
    </option>
  ))}
</select>

// Display component
<span>{CONTRACT_TYPE_LABELS[contractType]}</span>
```

### 3. Database (MongoDB)

#### Document Structure
```json
{
  "_id": "contract_id",
  "contractType": "SERVICE_AGREEMENT",
  "title": "Hợp đồng cung cấp dịch vụ",
  // ... other fields
}
```

#### Query Examples
```javascript
// Tìm theo loại hợp đồng
db.contracts.find({ contractType: "SERVICE_AGREEMENT" })

// Tìm theo nhóm
db.contracts.find({ 
  contractType: { 
    $in: ["SERVICE_AGREEMENT", "CONSULTING_AGREEMENT", "MAINTENANCE_AGREEMENT"] 
  } 
})
```

## Best Practices

### 1. Naming Convention
- **English constants**: UPPER_SNAKE_CASE (ví dụ: `SERVICE_AGREEMENT`)
- **Display names**: Tiếng Việt có dấu (ví dụ: `Hợp đồng dịch vụ`)
- **Descriptions**: Mô tả chi tiết, rõ ràng

### 2. Validation Rules
- **Backend**: Chỉ chấp nhận English constants
- **Frontend**: Sử dụng constants từ `CONTRACT_TYPES`
- **Database**: Lưu trữ English constants
- **API**: Gửi/nhận English constants

### 3. Error Handling
```java
// Backend error message
throw new IllegalArgumentException("Unknown ContractType: '" + value + "'. " +
        "Only English constants are accepted. Valid values are: " + getValidValuesString());
```

### 4. Migration Strategy
- **Dữ liệu cũ**: Migrate từ tiếng Việt sang English constants
- **API compatibility**: Chỉ chấp nhận English constants
- **Frontend**: Cập nhật constants và labels

## Mở rộng và bảo trì

### 1. Thêm loại hợp đồng mới
```java
// 1. Thêm vào enum
NEW_TYPE("NEW_TYPE", "Tên hiển thị", "Mô tả chi tiết"),

// 2. Cập nhật regex validation
@Pattern(regexp = "^(SERVICE_AGREEMENT|...|NEW_TYPE)$")

// 3. Cập nhật frontend constants
export const CONTRACT_TYPES = {
  // ... existing
  NEW_TYPE: 'NEW_TYPE',
} as const
```

### 2. Thay đổi display name
```java
// Chỉ cần cập nhật displayName trong enum
SERVICE_AGREEMENT("SERVICE_AGREEMENT", "Tên mới", "Mô tả mới"),
```

### 3. Thêm nhóm mới
```java
// 1. Thêm constants mới
NEW_GROUP_TYPE1("NEW_GROUP_TYPE1", "Tên 1", "Mô tả 1"),
NEW_GROUP_TYPE2("NEW_GROUP_TYPE2", "Tên 2", "Mô tả 2"),

// 2. Cập nhật getGroup() method
public String getGroup() {
    // ... existing groups
    } else if (value.startsWith("NEW_GROUP_")) {
        return "NEW_GROUP";
    }
    // ...
}
```

## Lợi ích của thiết kế này

### 1. **Tính nhất quán**
- English constants đảm bảo tương thích quốc tế
- Display names tiếng Việt phù hợp với người dùng Việt Nam

### 2. **Dễ bảo trì**
- Cấu trúc rõ ràng, dễ hiểu
- Phân loại theo nhóm giúp quản lý tốt hơn

### 3. **Mở rộng linh hoạt**
- Dễ dàng thêm loại mới
- Hỗ trợ tìm kiếm và lọc theo nhóm

### 4. **Validation mạnh mẽ**
- Regex validation đảm bảo dữ liệu chính xác
- Error messages rõ ràng, hữu ích

### 5. **Performance tốt**
- Enum lookup O(1)
- Không cần query database để lấy danh sách

## Kết luận

Enum `ContractType` được thiết kế để:
- **Chuẩn hóa** các loại hợp đồng trong hệ thống
- **Đảm bảo tính nhất quán** giữa frontend và backend
- **Hỗ trợ đa ngôn ngữ** (English constants + Vietnamese display)
- **Dễ dàng mở rộng** và bảo trì
- **Validation mạnh mẽ** và error handling tốt

Thiết kế này đã giải quyết được lỗi `No enum constant` và tạo nền tảng vững chắc cho việc quản lý các loại hợp đồng trong hệ thống DocGO.
