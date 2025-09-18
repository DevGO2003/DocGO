# 🚀 API Gateway BFF - DocGO

API Gateway Backend for Frontend (BFF) sử dụng Next.js và Kafka để kết nối và quản lý các microservice của hệ thống DocGO.

## ✨ Tính năng chính

- 🔗 **Service Discovery & Routing**: Tự động định tuyến request đến microservice phù hợp
- 📡 **Kafka Integration**: Xử lý events và message streaming
- 🔐 **Authentication & Authorization**: JWT-based security với middleware
- 📊 **Health Monitoring**: Real-time monitoring tất cả các service
- 🚦 **Rate Limiting**: Bảo vệ API khỏi abuse
- 📝 **Comprehensive Logging**: Winston-based logging với rotation
- 🛡️ **Security**: CORS, Helmet, và các biện pháp bảo mật khác

## 🏗️ Kiến trúc

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │  API Gateway     │    │  Microservices  │
│   (React/Next)  │◄──►│  BFF (Next.js)   │◄──►│  (Spring/FastAPI)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │     Kafka        │
                       │   (Events)       │
                       └──────────────────┘
```

## 🚀 Khởi động nhanh

### Yêu cầu
- Node.js 18.0.0+
- Kafka broker (localhost:9092)
- Các microservice đang chạy

### Cài đặt
```bash
cd backend/api-gateway-bff
npm install
cp env_example.txt .env
# Chỉnh sửa .env với các giá trị phù hợp
npm run dev
```

### Truy cập
- **Trang chủ**: http://localhost:8000
- **Health Check**: http://localhost:8000/api/health
- **API Base**: http://localhost:8000/api/v1/

## 📚 Tài liệu chi tiết

## Mô tả
API Gateway BFF (Backend for Frontend) sử dụng Next.js để kết nối và quản lý 4 microservices chính của DocGO:
- `authentication-identity-service` (Spring Boot) - Port 8001
- `contract-management-service` (Spring Boot) - Port 8002  
- `ai-processing-service` (FastAPI) - Port 8003
- `file-storage-service` (FastAPI) - Port 8004

## Yêu cầu hệ thống
- Node.js 18.0.0 trở lên
- npm hoặc yarn
- 4 microservice đang chạy:
  - Authentication Service: http://localhost:8001
  - Contract Management Service: http://localhost:8002
  - AI Processing Service: http://localhost:8003
  - File Storage Service: http://localhost:8004

## Cài đặt

### 1. Cài đặt dependencies
```bash
cd backend/api-gateway-bff
npm install
```

### 2. Cấu hình môi trường
Tạo file `.env` từ template:
```bash
# PowerShell
Copy-Item env_example.txt .env -Force

# Linux/Mac
cp env_example.txt .env
```

Chỉnh sửa file `.env` với các giá trị phù hợp:
```env
# API Gateway Configuration
PORT=8000
NODE_ENV=development

# Service URLs
AUTH_SERVICE_URL=http://localhost:8001
CONTRACT_SERVICE_URL=http://localhost:8002
AI_SERVICE_URL=http://localhost:8003
FILE_SERVICE_URL=http://localhost:8004

# Kafka Configuration
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=api-gateway-bff
KAFKA_GROUP_ID=api-gateway-group

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=logs/api-gateway.log

# Security
CORS_ORIGIN=*
ENABLE_COMPRESSION=true
ENABLE_HELMET=true
```

### 3. Khởi động Kafka (nếu chưa có)
```bash
# Sử dụng Docker
docker run -d --name kafka -p 9092:9092 apache/kafka:2.13-3.6.1

# Hoặc sử dụng Kafka đã cài đặt sẵn
```

## Chạy ứng dụng

### Chế độ Development
```bash
npm run dev
```

### Chế độ Production
```bash
npm run build
npm start
```

## Kiểm tra hoạt động

### 1. Trang chủ
- URL: http://localhost:8000
- Hiển thị trạng thái hệ thống và thông tin các service

### 2. Health Check
- URL: http://localhost:8000/api/health
- Kiểm tra trạng thái của tất cả các service và Kafka

### 3. API Endpoints
- Base URL: http://localhost:8000/api/
- Authentication: `/api/auth/*`
- Contract Management: `/api/contracts/*`
- AI Processing: `/api/ai/*`
- File Storage: `/api/files/*`
- Health Check: `/api/health`

## Cấu trúc thư mục
```
api-gateway-bff/
├── lib/                    # Thư viện và utilities
│   ├── services/          # Service clients
│   │   ├── authService.ts
│   │   ├── contractService.ts
│   │   ├── aiService.ts
│   │   └── fileService.ts
│   └── utils/             # Utilities
│       ├── apiClient.ts
│       ├── errorHandler.ts
│       └── circuitBreaker.ts
├── pages/                 # Next.js pages và API routes
│   ├── api/              # API endpoints
│   │   ├── auth/         # Authentication routes
│   │   ├── contracts/    # Contract management routes
│   │   ├── ai/           # AI processing routes
│   │   ├── files/        # File storage routes
│   │   └── health.ts     # Health check endpoint
│   └── index.tsx         # Trang chủ
├── middleware.ts          # Next.js middleware
├── package.json           # Dependencies và scripts
├── next.config.js         # Cấu hình Next.js
├── tsconfig.json          # Cấu hình TypeScript
└── README.md
```

## Tính năng chính

### 1. API Gateway & Routing
- Tự động định tuyến request đến 4 microservice
- Hỗ trợ tất cả HTTP methods (GET, POST, PUT, DELETE)
- Xử lý query parameters và request body
- Load balancing và failover

### 2. Authentication & Authorization
- JWT token validation
- Role-based access control
- Token refresh mechanism
- Secure header forwarding

### 3. Middleware Stack
- Rate limiting (60 requests/minute)
- CORS handling
- Request logging
- Error handling với RestResponse format
- Circuit breaker pattern

### 4. Health Monitoring
- Kiểm tra trạng thái tất cả microservice
- Service health caching
- Uptime tracking
- Performance metrics
- Circuit breaker status

## 🔧 Cấu hình

### Environment Variables
```env
# Service URLs
AUTHENTICATION_SERVICE_URL=http://localhost:8001
USER_MANAGEMENT_SERVICE_URL=http://localhost:8002
CONTRACT_MANAGEMENT_SERVICE_URL=http://localhost:8003
AI_PROCESSING_SERVICE_URL=http://localhost:8017
FILE_STORAGE_SERVICE_URL=http://localhost:8012

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=api-gateway-bff

# Security
JWT_SECRET=your-secret-key
RATE_LIMIT_MAX_REQUESTS=100
```

### Port Mapping
- **API Gateway BFF**: 8000
- **Authentication Service**: 8001  
- **User Management Service**: 8002
- **Contract Management Service**: 8003
- **AI Processing Service**: 8017
- **File Storage Service**: 8012

## 📡 API Endpoints

### Authentication Service
```
POST /api/v1/authentication-identity-service/auth/register
GET  /api/v1/authentication-identity-service/auth/login
PUT  /api/v1/authentication-identity-service/auth/{id}
```

### User Management Service
```
GET    /api/v1/user-management-service/users/{id}
PUT    /api/v1/user-management-service/users/{id}
GET    /api/v1/user-management-service/approvals/{id}
```

## Troubleshooting

### 1. Kafka Connection Error
```
❌ Failed to connect to Kafka: ECONNREFUSED
```
**Giải pháp:**
- Kiểm tra Kafka broker có đang chạy không
- Kiểm tra port 9092 có bị block không
- Verify KAFKA_BROKERS trong .env

### 2. Service Connection Error
```
❌ Service authentication is not available
```
**Giải pháp:**
- Kiểm tra microservice có đang chạy không
- Verify URL trong .env
- Kiểm tra firewall/network

### 3. Port Already in Use
```
❌ Port 8000 is already in use
```
**Giải pháp:**
- Thay đổi PORT trong .env
- Hoặc dừng service đang sử dụng port 8000

### 4. JWT Secret Error
```
❌ JWT_SECRET is not set
```
**Giải pháp:**
- Đặt JWT_SECRET trong .env
- Sử dụng secret key mạnh và bảo mật

## Monitoring & Logging

### 1. Log Files
- `logs/combined.log`: Tất cả logs
- `logs/error.log`: Chỉ error logs
- Log level có thể điều chỉnh qua LOG_LEVEL

### 2. Metrics
- Request count và response time
- Service health status
- Kafka message throughput
- Error rate và types

### 3. Alerts
- Service down notification
- High error rate warning
- Kafka connection failure

## Security Considerations

### 1. JWT Secret
- Sử dụng secret key mạnh (ít nhất 32 ký tự)
- Không commit secret vào source code
- Rotate secret định kỳ

### 2. Rate Limiting
- Mặc định: 100 requests/15 minutes
- Có thể điều chỉnh qua environment variables
- IP-based rate limiting

### 3. CORS
- Cấu hình CORS_ORIGIN phù hợp với production
- Không để CORS_ORIGIN=* trong production

## Performance Optimization

### 1. Connection Pooling
- Axios connection pooling cho microservice
- Kafka producer/consumer optimization
- Database connection management

### 2. Caching
- Response caching cho static data
- Health check result caching
- Service discovery caching

### 3. Load Balancing
- Round-robin routing giữa multiple instances
- Health check based routing
- Circuit breaker pattern

## Deployment

### 1. Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["npm", "start"]
```

### 2. Environment Variables
- Sử dụng environment variables cho production
- Không hardcode sensitive information
- Sử dụng secret management service

### 3. Health Checks
- Kubernetes liveness probe: `/api/health`
- Docker health check
- Load balancer health check

## Support & Maintenance

### 1. Log Rotation
- Log files tự động rotate khi đạt 5MB
- Giữ tối đa 5 file log
- Compress old log files

### 2. Updates
- Regular dependency updates
- Security patches
- Performance improvements

### 3. Backup
- Configuration backup
- Log archive
- Service discovery data backup

## 🐛 Troubleshooting

### Kafka Connection Issues
- Kiểm tra Kafka broker có đang chạy không
- Verify KAFKA_BROKERS trong .env
- Kiểm tra port 9092

### Service Connection Issues
- Kiểm tra microservice có đang chạy không
- Verify service URLs trong .env
- Kiểm tra firewall/network

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

Dự án này thuộc về DocGO và được phát triển bởi devgo2003.

## 📞 Hỗ trợ

- **Issues**: Tạo issue trên GitHub
- **Documentation**: Xem README.md này
- **Team**: devgo2003

---

**Made with ❤️ by devgo2003 for DocGO**