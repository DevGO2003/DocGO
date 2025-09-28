# Document Management Service

## Tổng quan
Document Management Service là microservice Spring Boot quản lý tài liệu với tính năng xử lý file upload và quản lý metadata tài liệu.

## Tính năng chính

### 1. Quản lý tài liệu cơ bản
- CRUD operations cho tài liệu
- Phân trang, sắp xếp, tìm kiếm
- Quản lý trạng thái tài liệu
- Lịch sử sự kiện và file đính kèm

### 2. File Upload & Processing
- Upload file với multipart/form-data
- Tự động phát hiện loại file (PDF, DOCX, TXT, etc.)
- Phân loại file theo loại tài liệu
- Xử lý metadata tự động

### 3. Document Metadata Management
- Quản lý thông tin metadata
- Tìm kiếm và lọc tài liệu
- Quản lý phiên bản tài liệu
- Trạng thái xử lý tài liệu

## Kiến trúc hệ thống

```
Frontend → Document Service → MongoDB
                ↓
            File Storage (Local/Cloud)
                ↓
            Redis Cache
```

## API Endpoints

### Root & Health
- `GET /` - Thông tin service
- `GET /health` - Health check

### Document Management
- `GET /api/v1/document-management-service/documents` - Lấy danh sách tài liệu
- `GET /api/v1/document-management-service/documents/{id}` - Lấy chi tiết tài liệu
- `POST /api/v1/document-management-service/documents` - Tạo tài liệu mới
- `PUT /api/v1/document-management-service/documents/{id}` - Cập nhật tài liệu
- `DELETE /api/v1/document-management-service/documents/{id}` - Xóa tài liệu

## Cách chạy

### 1. Sử dụng Maven Wrapper
```bash
cd backend/document-management-service
./mvnw spring-boot:run
```

### 2. Sử dụng Docker
```bash
docker build -t document-management-service .
docker run -p 8002:8002 document-management-service
```

## Cấu hình

### Environment Variables
- `SPRING_DATA_MONGODB_URI` - MongoDB connection string
- `MONGODB_DATABASE` - Database name (default: docgo_document)
- `REDIS_CLOUD_HOST` - Redis host (default: redis)
- `REDIS_CLOUD_PORT` - Redis port (default: 6379)
- `MAX_FILE_SIZE` - Maximum file size (default: 50MB)

### Port
- **Service Port**: 8002
- **Documentation**: http://localhost:8002/docs

## Dependencies

### Core Dependencies
- Spring Boot 3.5.4
- Spring Data MongoDB
- Spring Security
- Spring Web
- Spring Validation

### Additional Dependencies
- SpringDoc OpenAPI (Swagger UI)
- Redis (Jedis)
- Apache Tika (file type detection)
- Commons FileUpload
- Lombok
- UUID Creator

## Database Schema

### Document Entity
- `id` - Unique identifier
- `title` - Document title
- `description` - Document description
- `filePath` - File storage path
- `fileType` - MIME type
- `fileSize` - File size in bytes
- `status` - Processing status
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp
- `createdBy` - Creator user ID
- `updatedBy` - Last updater user ID

## Development

### Project Structure
```
src/
├── main/
│   ├── java/
│   │   └── com/devgo2003/docgo/document_service/
│   │       ├── DocumentManagementApplication.java
│   │       ├── controller/
│   │       ├── service/
│   │       ├── repository/
│   │       ├── entity/
│   │       ├── dto/
│   │       └── config/
│   └── resources/
│       └── application.properties
└── test/
    └── java/
        └── com/devgo2003/docgo/document_service/
```

### Testing
```bash
./mvnw test
```

## API Documentation
Truy cập Swagger UI tại: http://localhost:8002/docs

## Logs
Logs được ghi với level DEBUG cho package `com.devgo2003.docgo.document_service`
