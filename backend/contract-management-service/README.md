# Contract Management Service

## Tổng quan
Contract Management Service là microservice Spring Boot quản lý hợp đồng với tính năng **xử lý file upload tự động bằng AI** thông qua Kafka.

## Tính năng chính

### 1. Quản lý hợp đồng cơ bản
- CRUD operations cho hợp đồng
- Phân trang, sắp xếp, tìm kiếm
- Quản lý trạng thái hợp đồng
- Lịch sử sự kiện và file đính kèm

### 2. **File Upload & AI Processing (MỚI)**
- Upload file với multipart/form-data
- Tự động phát hiện loại file (PDF, DOCX, TXT)
- Phân loại file: hợp đồng hoặc tài liệu thường
- Gửi yêu cầu xử lý AI qua Kafka
- Nhận kết quả xử lý và tự động tạo hợp đồng

### 3. **Contract Summary & AI Insights (MỚI)**
- Tóm tắt hợp đồng tự động
- Phân loại loại hợp đồng
- Đánh giá mức độ rủi ro
- Trích xuất điều khoản chính
- Trạng thái xử lý AI

### 4. **Kafka Integration (MỚI)**
- Producer: Gửi yêu cầu xử lý hợp đồng
- Consumer: Nhận kết quả xử lý từ AI service
- Asynchronous processing
- Event-driven architecture

## Kiến trúc hệ thống

```
Frontend → Contract Service → Kafka → AI Processing Service
                ↓
            Database (MariaDB)
                ↓
            File Storage (Local)
```

## Luồng xử lý

### Upload file thường
1. Frontend gửi file với `isContract=false`
2. Contract Service lưu file và metadata
3. Trả về response thành công

### Upload file hợp đồng
1. Frontend gửi file với `isContract=true`
2. Contract Service lưu file và metadata
3. Gửi yêu cầu xử lý qua Kafka
4. AI Processing Service xử lý file
5. Gửi kết quả qua Kafka
6. Contract Service tạo hợp đồng với thông tin AI
7. Cập nhật trạng thái xử lý

## API Endpoints

### File Upload
- `POST /api/v1/contract-management-service/files/upload` - Upload file
- `GET /api/v1/contract-management-service/files/{fileId}/status` - Trạng thái xử lý

### Contract Management
- `POST /api/v1/contract-management-service/contracts` - Tạo hợp đồng
- `GET /api/v1/contract-management-service/contracts` - Danh sách hợp đồng
- `GET /api/v1/contract-management-service/contracts/{id}` - Chi tiết hợp đồng
- `PUT /api/v1/contract-management-service/contracts/{id}` - Cập nhật hợp đồng
- `DELETE /api/v1/contract-management-service/contracts/{id}` - Xóa hợp đồng

## Cấu hình

### Database
- MariaDB 11.2+
- Schema tự động cập nhật (Hibernate DDL)

### Kafka
- Bootstrap servers: localhost:9092
- Topics: `contract-processing-requests`, `contract-processing-results`
- Consumer group: `contract-service-group`

### File Upload
- Thư mục upload: `uploads/`
- Kích thước tối đa: 50MB
- Hỗ trợ: PDF, DOCX, TXT

## Chạy ứng dụng

### Yêu cầu
- Java 17+
- Maven 3.6+
- MariaDB 11.2+
- Kafka 3.0+

### Cách chạy
```bash
# 1. Cài đặt dependencies
mvn clean install

# 2. Cấu hình database và Kafka
# 3. Chạy ứng dụng
mvn spring-boot:run
```

Ứng dụng chạy tại: http://localhost:8003
API Documentation: http://localhost:8003/docs

## Contract Management Service - Hướng dẫn chạy

## Tổng quan
Contract Management Service là một microservice Spring Boot quản lý hợp đồng với các tính năng CRUD, phân trang, sắp xếp, tìm kiếm và **xử lý file upload tự động bằng AI**.

## Tính năng mới
- **File Upload & AI Processing**: Upload file và tự động phát hiện, xử lý hợp đồng bằng AI
- **Kafka Integration**: Giao tiếp với các service khác qua Kafka để xử lý AI
- **Contract Summary**: Lưu trữ thông tin tóm tắt hợp đồng (loại, rủi ro, điều khoản chính)
- **Smart Processing**: Tự động phân loại file và xử lý theo loại

## Yêu cầu hệ thống
- Java 17 hoặc cao hơn
- Maven 3.6+
- MariaDB 11.2+
- **Kafka 3.0+** (bắt buộc cho tính năng AI processing)
- Docker (tùy chọn)

## Cách 1: Chạy trực tiếp với Maven

### 1. Cài đặt dependencies
```bash
mvn clean install
```

### 2. Cấu hình database
Tạo file `.env` từ `env/.env.example`:
```bash
# Windows PowerShell
Copy-Item env/.env.example env/.env -Force

# Linux/Mac
cp env/.env.example env/.env
```

Cập nhật thông tin database trong file `env/.env`:
```properties
DB_HOST=localhost
DB_PORT=3306
DB_NAME=docgo_contract_service
DB_USERNAME=root
DB_PASSWORD=your_password_here
```

### 3. Cấu hình Kafka
Đảm bảo Kafka đang chạy và cập nhật cấu hình trong `application.properties`:
```properties
spring.kafka.bootstrap-servers=localhost:9092
app.kafka.topic.contract-processing=contract-processing-requests
app.kafka.topic.callback=contract-processing-results
```

### 4. Khởi động MariaDB
```bash
# Sử dụng Docker
docker run -d --name mariadb-contract \
  -e MYSQL_ROOT_PASSWORD=your_password_here \
  -e MYSQL_DATABASE=docgo_contract_service \
  -p 3306:3306 \
  mariadb:11.2

# Hoặc cài đặt MariaDB locally
```

### 5. Khởi động Kafka
```bash
# Sử dụng Docker
docker run -d --name kafka \
  -p 9092:9092 \
  -e KAFKA_CFG_NODE_ID=0 \
  -e KAFKA_CFG_PROCESS_ROLES=controller,broker \
  -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
  -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT \
  -e KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER \
  -e KAFKA_CFG_INTER_BROKER_LISTENER_NAME=PLAINTEXT \
  -e KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093 \
  -e KAFKA_CFG_LOG_DIRS=/tmp/kraft-combined-logs \
  -e KAFKA_CFG_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  -e KAFKA_CFG_TRANSACTION_STATE_LOG_REPLICATION_FACTOR=1 \
  -e KAFKA_CFG_TRANSACTION_STATE_LOG_MIN_ISR=1 \
  confluentinc/cp-kafka:7.4.0

# Hoặc sử dụng docker-compose
# cd autofiles (đã loại bỏ)
docker-compose -f docker-compose.local.yml up kafka
```

### 6. Cập nhật database schema
Chạy script SQL để cập nhật schema:
```sql
-- Chạy file database/update_contract_schema.sql
-- Hoặc để Hibernate tự động tạo (spring.jpa.hibernate.ddl-auto=update)
```

### 7. Chạy ứng dụng
```bash
mvn spring-boot:run
```

Ứng dụng sẽ chạy tại: http://localhost:8003
API Documentation: http://localhost:8003/docs#/

## Cách 2: Chạy với Docker

### 1. Build Docker image
```bash
# Sử dụng script có sẵn
# cd autofiles (đã loại bỏ)
./build-contract-service.bat  # Windows
./build-contract-service.ps1  # PowerShell

# Hoặc build thủ công
cd backend/contract-management-service
docker build -t docgo-contract-service:latest .
```

### 2. Chạy với docker-compose (khuyến nghị)
```bash
# cd autofiles (đã loại bỏ)
docker-compose -f docker-compose.local.yml up contract-management-service
```

### 3. Chạy standalone
```bash
docker run -p 8003:8003 \
  -e SPRING_DATASOURCE_URL=jdbc:mariadb://host.docker.internal:3306/docgo_contract_service \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=your_password_here \
  -e SPRING_KAFKA_BOOTSTRAP_SERVERS=host.docker.internal:9092 \
  --name contract-service \
  docgo-contract-service:latest
```

## API Endpoints

### Base URL
```
http://localhost:8003/api/v1/contract-management-service
```

### Các endpoint chính
- `POST /contracts` - Tạo hợp đồng mới
- `GET /contracts` - Lấy danh sách hợp đồng (có phân trang)
- `GET /contracts/{id}` - Lấy chi tiết hợp đồng
- `PUT /contracts/{id}` - Cập nhật hợp đồng
- `DELETE /contracts/{id}` - Xóa mềm hợp đồng
- `PUT /contracts/{id}/restore` - Khôi phục hợp đồng
- `GET /contracts/{id}/events` - Lấy lịch sử sự kiện
- `GET /contracts/{id}/attachments` - Lấy file đính kèm

### **API File Upload mới**
- `POST /files/upload` - Upload file và xử lý hợp đồng
- `GET /files/{fileId}/status` - Kiểm tra trạng thái xử lý file

### Query Parameters cho phân trang
- `pageNumber` (mặc định: 0)
- `pageSize` (mặc định: 10)
- `sortBy` - Danh sách trường sắp xếp
- `sortDirection` - Hướng sắp xếp (ASC/DESC)
- `searchTerm` - Từ khóa tìm kiếm
- `includeDeleted` - Bao gồm bản ghi đã xóa (mặc định: false)

## Luồng xử lý File Upload

### 1. Upload file
```
Frontend → POST /files/upload → Contract Service
```

### 2. Phân loại file
- Nếu `isContract=true`: Gửi yêu cầu xử lý AI qua Kafka
- Nếu `isContract=false`: Chỉ lưu file, không xử lý AI

### 3. Xử lý AI (nếu là hợp đồng)
```
Contract Service → Kafka → AI Processing Service → Kafka → Contract Service
```

### 4. Tạo hợp đồng
- Tự động tạo hợp đồng với thông tin tóm tắt từ AI
- Cập nhật trạng thái xử lý

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
  "path": "/api/v1/contract-management-service/contracts"
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
- **Base URL**: `/api/v1/contract-management-service`
- **Documentation**: `/docs`