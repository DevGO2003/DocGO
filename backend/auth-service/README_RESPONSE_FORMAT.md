# Chuẩn hóa Response API - Auth Service

## Tổng quan
Hệ thống đã được chuẩn hóa response format theo cấu trúc thống nhất cho tất cả các API endpoints.

## Cấu trúc Response

### Response thành công (200 OK)
```json
{
  "apiVersion": "v1",
  "statusCode": 200,
  "shortMessage": "Success",
  "description": "Yêu cầu đã được xử lý thành công.",
  "data": {
    "userId": "12345",
    "email": "user@example.com"
  },
  "timestamp": "2025-08-16T12:45:00Z",
  "requestId": "8f92aab3-1234-4567-b9c0-778899aabbcd",
  "path": "/api/users"
}
```

### Response lỗi validation (400 Bad Request)
```json
{
  "apiVersion": "v1",
  "statusCode": 400,
  "shortMessage": "Validation failed",
  "description": "Dữ liệu gửi lên không hợp lệ.",
  "data": {
    "errors": [
      {
        "field": "email",
        "rejectedValue": "abc@",
        "message": "không đúng định dạng"
      }
    ]
  },
  "timestamp": "2025-08-16T12:50:00Z",
  "requestId": "8f92aab3-1234-4567-b9c0-778899aabbce",
  "path": "/api/orders"
}
```

## Cách sử dụng

### 1. Trong Controller
```java
@PostMapping("/register")
public ResponseEntity<RestResponse<AuthResponse>> register(@Valid @RequestBody AuthRequest request) {
    AuthResponse authResponse = authService.register(request.getUsername(), request.getEmail(), request.getPassword());
    RestResponse<AuthResponse> response = ResponseBuilder.success(
        authResponse, 
        "Registration successful", 
        "Tài khoản đã được đăng ký thành công."
    );
    return ResponseEntity.ok(response);
}
```

### 2. Sử dụng ResponseBuilder

#### Response thành công
```java
// Đơn giản
RestResponse<User> response = ResponseBuilder.success(userData);

// Với message tùy chỉnh
RestResponse<User> response = ResponseBuilder.success(
    userData, 
    "User created", 
    "Người dùng đã được tạo thành công"
);
```

#### Response lỗi validation
```java
List<ErrorDetail> errors = Arrays.asList(
    ErrorDetail.builder()
        .field("email")
        .rejectedValue("invalid@email")
        .message("Email không hợp lệ")
        .build()
);

RestResponse<ValidationErrorResponse> response = ResponseBuilder.validationError(errors);
```

#### Response lỗi tùy chỉnh
```java
RestResponse<Object> response = ResponseBuilder.error(
    404, 
    "User not found", 
    "Không tìm thấy người dùng với ID: " + userId
);
```

## Các class chính

### RestResponse<T>
- Wrapper chính cho tất cả response
- Generic type T cho data
- Tự động generate timestamp và requestId

### ErrorDetail
- Mô tả chi tiết lỗi validation
- Chứa field, rejectedValue và message

### ValidationErrorResponse
- Container cho danh sách validation errors
- Sử dụng cho response 400 Bad Request

### ResponseBuilder
- Utility class để tạo response chuẩn hóa
- Các method static để build response nhanh chóng

## Lưu ý
- Tất cả response đều được wrap trong `RestResponse<T>`
- Timestamp và requestId được tự động generate
- Path được lấy từ request context
- API version được set mặc định là "v1"
