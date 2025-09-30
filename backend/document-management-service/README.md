# Document Management Service

## Tổng quan
Document Management Service là microservice Spring Boot quản lý tài liệu và hợp đồng với tính năng **xử lý file upload tự động bằng AI** thông qua Kafka.

## Tính năng chính

### 1. Quản lý tài liệu cơ bản
- CRUD operations cho tài liệu và hợp đồng
- Phân trang, sắp xếp, tìm kiếm
- Quản lý trạng thái tài liệu
- Lịch sử sự kiện và file đính kèm

### 2. **File Upload & AI Processing (MỚI)**
- Upload file với multipart/form-data
- Tự động phát hiện loại file (PDF, DOCX, TXT)
- Phân loại file: hợp đồng hoặc tài liệu thường
- Gửi yêu cầu xử lý AI qua Kafka
- Nhận kết quả xử lý và tự động tạo tài liệu

### 3. **Document Summary & AI Insights (MỚI)**
- Tóm tắt tài liệu tự động
- Phân loại loại tài liệu
- Đánh giá mức độ rủi ro
- Trích xuất điều khoản chính
- Trạng thái xử lý AI

### 4. **Kafka Integration (MỚI)**
- Producer: Gửi yêu cầu xử lý tài liệu
- Consumer: Nhận kết quả xử lý từ AI service
- Asynchronous processing
- Event-driven architecture

## Kiến trúc hệ thống

```
Frontend → Document Service → Kafka → Automation Service
                ↓
            Database (MongoDB Atlas)
                ↓
            File Storage (Local)
```

## Luồng xử lý

### Upload file thường
1. Frontend gửi file với `isContract=false`
2. Document Service lưu file và metadata
3. Trả về response thành công

### Upload file hợp đồng
1. Frontend gửi file với `isContract=true`
2. Document Service lưu file và metadata
3. Gửi yêu cầu xử lý qua Kafka
4. Automation Service xử lý file
5. Gửi kết quả qua Kafka
6. Document Service tạo tài liệu với thông tin AI
7. Cập nhật trạng thái xử lý

## API Endpoints

### File Upload
- `POST /api/v1/document-management-service/files/upload` - Upload file
- `GET /api/v1/document-management-service/files/{fileId}/status` - Trạng thái xử lý

### Document Management
- `POST /api/v1/document-management-service/documents` - Tạo tài liệu
- `GET /api/v1/document-management-service/documents` - Danh sách tài liệu
- `GET /api/v1/document-management-service/documents/{id}` - Chi tiết tài liệu
- `PUT /api/v1/document-management-service/documents/{id}` - Cập nhật tài liệu
- `DELETE /api/v1/document-management-service/documents/{id}` - Xóa tài liệu

## Cấu hình

### Database
- MongoDB Atlas
- Collections tự động tạo khi cần

### Kafka
- Bootstrap servers: localhost:9092
- Topics: `document-processing-requests`, `document-processing-results`
- Consumer group: `document-service-group`

### File Upload
- Thư mục upload: `uploads/`
- Kích thước tối đa: 50MB
- Hỗ trợ: PDF, DOCX, TXT

## Chạy ứng dụng

### Yêu cầu
- Java 17+
- Maven 3.6+
- MongoDB Atlas
- Kafka 3.0+

### Cách chạy
```bash
# 1. Cài đặt dependencies
mvn clean install

# 2. Cấu hình database và Kafka
# 3. Chạy ứng dụng
mvn spring-boot:run
```

Ứng dụng chạy tại (qua docker compose): http://localhost:8002
API Documentation: http://localhost:8002/docs#/

## Cấu trúc Response

Tất cả API đều trả về response theo format chuẩn:
```json
{
  "apiVersion": "v1",
  "statusCode": 200,
  "shortMessage": "Success",
  "description": "Mô tả kết quả",
  "data": {...},
  "timestamp": "2025-08-23T10:00:00Z",
  "requestId": "uuid-string",
  "path": "/api/v1/document-management-service/contracts"
}
```

## Kafka Topics

### Producer Topics
- `contract-processing-requests`: Gửi yêu cầu xử lý hợp đồng

### Consumer Topics
- `contract-processing-results`: Nhận kết quả xử lý từ AI service

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra MariaDB đã chạy chưa
- Kiểm tra thông tin kết nối trong `.env`
- Đảm bảo database `docgo_contract_service` đã được tạo

### Lỗi kết nối Kafka
- Kiểm tra Kafka đã chạy chưa: `docker ps | grep kafka`
- Kiểm tra cấu hình bootstrap servers
- Kiểm tra topics đã được tạo chưa

### Lỗi port đã sử dụng
- Thay đổi port trong `application.properties`
- Hoặc dừng service đang chạy trên port 8003

### Lỗi Docker build
- Đảm bảo Docker đã cài đặt và chạy
- Kiểm tra Dockerfile có lỗi syntax không
- Xóa image cũ: `docker rmi docgo-contract-service:latest`

## Development

### Hot reload
Khi chạy với Maven, ứng dụng sẽ tự động reload khi có thay đổi code nhờ Spring Boot DevTools.

### Logs
Logs được cấu hình trong `application.properties`:
- Spring Framework: INFO
- Contract Service: DEBUG
- Kafka: DEBUG (khi cần debug)

### Testing
```bash
mvn test
```

## Production Deployment

### Environment Variables
- `SPRING_PROFILES_ACTIVE=production`
- `SPRING_DATASOURCE_URL` - URL database production
- `SPRING_DATASOURCE_USERNAME` - Username database
- `SPRING_DATASOURCE_PASSWORD` - Password database
- `SERVER_PORT` - Port ứng dụng (mặc định: 8003)
- `SPRING_KAFKA_BOOTSTRAP_SERVERS` - Kafka servers production

### Health Check
```
GET http://localhost:8003/actuator/health
```

### Metrics
```
GET http://localhost:8003/actuator/metrics
```

## Development

### Cấu trúc project
```
src/main/java/com/devgo2003/docgo/contract_service/
├── controller/          # REST controllers
├── service/            # Business logic
├── repository/         # Data access
├── entity/            # JPA entities
├── model/             # DTOs
├── config/            # Configuration
└── common/            # Shared components
```

### Hot reload
Spring Boot DevTools hỗ trợ hot reload khi development.

### Testing
```bash
mvn test
```

## Production

### Environment Variables
- `SPRING_PROFILES_ACTIVE=production`
- `SPRING_DATASOURCE_URL`
- `SPRING_KAFKA_BOOTSTRAP_SERVERS`
- `SERVER_PORT=8003`

### Health Check
```
GET /actuator/health
```

### Monitoring
```
GET /actuator/metrics
```

## Troubleshooting

### Lỗi thường gặp
1. **Database connection**: Kiểm tra MariaDB và thông tin kết nối
2. **Kafka connection**: Kiểm tra Kafka server và topics
3. **File upload**: Kiểm tra quyền ghi thư mục upload
4. **Port conflict**: Thay đổi port trong application.properties

### Logs
- Spring Framework: INFO
- Contract Service: DEBUG
- Kafka: DEBUG (khi cần)

## Tài liệu tham khảo

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Kafka Documentation](https://spring.io/projects/spring-kafka)
- [MariaDB Documentation](https://mariadb.org/documentation/)
- [Kafka Documentation](https://kafka.apache.org/documentation/)

## Liên hệ

- **Service**: Contract Management Service
- **Port**: 8003
- **Base URL**: `/api/v1/document-management-service`
- **Documentation**: `/docs`
