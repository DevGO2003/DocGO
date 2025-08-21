# Cấu trúc API Auth Service

## Tổng quan
Auth Service đã được cập nhật để có cấu trúc API **giống hệt** như contract-management-service với URL pattern chuẩn hóa và cùng format response.

## Base URL
```
http://localhost:8082/api/v1/auth-service/auth
```

## Các Endpoints

### 1. Tạo tài khoản mới
- **URL:** `POST /register`
- **Mô tả:** Tạo tài khoản người dùng mới với thông tin cơ bản
- **Request Body:** AuthRequest (username, email, password)
- **Response:** 201 Created với thông tin tài khoản

### 2. Lấy thông tin đăng nhập
- **URL:** `GET /login`
- **Mô tả:** Xác thực thông tin đăng nhập và trả về token
- **Request Body:** LoginRequest (username, password)
- **Response:** 200 OK với token và thông tin người dùng

### 3. Cập nhật thông tin tài khoản
- **URL:** `PUT /{id}`
- **Mô tả:** Cập nhật thông tin tài khoản người dùng
- **Path Variable:** id (Long)
- **Request Body:** AuthRequest
- **Response:** 200 OK với thông tin đã cập nhật

### 4. Xóa mềm tài khoản
- **URL:** `DELETE /{id}`
- **Mô tả:** Thay đổi trạng thái tài khoản thành INACTIVE thay vì xóa vật lý
- **Path Variable:** id (Long)
- **Response:** 200 OK

### 5. Khôi phục tài khoản
- **URL:** `PUT /{id}/restore`
- **Mô tả:** Khôi phục tài khoản đã bị xóa
- **Path Variable:** id (Long)
- **Response:** 200 OK

### 6. Làm mới token
- **URL:** `POST /{id}/refresh`
- **Mô tả:** Tạo token mới khi token cũ hết hạn
- **Path Variable:** id (Long)
- **Headers:** Authorization (refresh token)
- **Response:** 200 OK với token mới

### 7. Đăng xuất
- **URL:** `POST /{id}/logout`
- **Mô tả:** Vô hiệu hóa token hiện tại
- **Path Variable:** id (Long)
- **Headers:** Authorization (access token)
- **Response:** 200 OK

### 8. Xác thực token
- **URL:** `GET /{id}/validate`
- **Mô tả:** Kiểm tra tính hợp lệ của token
- **Path Variable:** id (Long)
- **Headers:** Authorization (access token)
- **Response:** 200 OK nếu token hợp lệ

### 9. Health Check
- **URL:** `GET /health`
- **Mô tả:** Kiểm tra trạng thái dịch vụ
- **Response:** 200 OK với thông tin trạng thái

## So sánh với Contract Management Service

### URL Pattern
| Service | Base URL | Pattern |
|---------|----------|---------|
| Contract Management | `http://localhost:8080/api/v1/contract-management-service/contracts` | `/api/v1/{service-name}/{resource}` |
| Auth Service | `http://localhost:8082/api/v1/auth-service/auth` | `/api/v1/{service-name}/{resource}` |

### Cấu trúc giống hệt
- ✅ **RequestMapping:** `/api/v1/{service-name}/{resource}`
- ✅ **Response Format:** `RestResponse<T>` wrapper
- ✅ **HTTP Status Codes:** 200, 201, 404, etc.
- ✅ **Swagger Annotations:** `@Operation`, `@Tag`
- ✅ **Response Builder Pattern:** Manual builder thay vì utility class
- ✅ **Error Handling:** Tương tự pattern
- ✅ **Path Variables:** Sử dụng `{id}` cho các operations

### Response Format chuẩn hóa
```json
{
  "apiVersion": "v1",
  "statusCode": 200,
  "shortMessage": "Success",
  "description": "Mô tả chi tiết",
  "data": {...},
  "timestamp": "2025-08-16T12:45:00Z",
  "requestId": "uuid-string",
  "path": "/api/v1/auth-service/auth/login"
}
```

## Ví dụ sử dụng

### Tạo tài khoản mới
```bash
curl -X POST http://localhost:8082/api/v1/auth-service/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Cập nhật tài khoản
```bash
curl -X PUT http://localhost:8082/api/v1/auth-service/auth/123 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updateduser",
    "email": "updated@example.com",
    "password": "newpassword123"
  }'
```

### Xóa mềm tài khoản
```bash
curl -X DELETE http://localhost:8082/api/v1/auth-service/auth/123
```

### Kiểm tra trạng thái
```bash
curl -X GET http://localhost:8082/api/v1/auth-service/auth/health
```

## Swagger Documentation
- **URL:** `http://localhost:8082/docs#/`
- **Mô tả:** Tài liệu API đầy đủ với các annotation OpenAPI

## Lưu ý quan trọng
- **Port:** 8082 (khác với contract-management-service: 8080)
- **Context Path:** `/api/v1/auth-service`
- **Cấu trúc giống hệt:** ContractController.java
- **Response Builder:** Manual builder pattern (không dùng utility class)
- **Path Variables:** Tất cả operations đều có `{id}` parameter
- **HTTP Methods:** POST, GET, PUT, DELETE theo RESTful pattern
- **Status Codes:** 200, 201, 404, etc. theo chuẩn HTTP
