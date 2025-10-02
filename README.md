# DocGO - Hệ thống Quản lý Tài liệu Thông minh

## 🚀 Tổng quan

DocGO là một hệ thống quản lý tài liệu thông minh với kiến trúc microservices gồm 4 services chính, tích hợp AI để xử lý và phân tích tài liệu tự động.

## 🏗️ Kiến trúc Hệ thống

### Microservices Architecture

Bảng dịch vụ đang chạy theo `docker-compose.yml` (kiến trúc mới 4 microservices):

| Service | Host Port | Container | Docs/URL | Mô tả |
|---|---|---|---|---|
| API Gateway | 8000 | 8000 | http://localhost:8000/docs#/ | Next.js - API Gateway và BFF |
| User Management Service | 8001 | 8000 | http://localhost:8001/docs#/ | Spring Boot - Quản lý người dùng |
| Document Management Service | 8002 | 8000 | http://localhost:8002/docs#/ | Spring Boot - Quản lý tài liệu |
| Automation Service | 8003 | 8000 | http://localhost:8003/docs#/ | FastAPI - Xử lý tự động và AI |
| Web App | 3000 | 3000 | http://localhost:3000 | Next.js - Frontend application |
| Redis | 6379 | 6379 | redis://localhost:6379 | Cache và session management |
| Kafka (PLAINTEXT) | 9092 | 9092 | PLAINTEXT://localhost:9092 | Message queue |
| MongoDB Atlas | - | - | Cloud | Database chính (Cloud) |

Số lượng service ứng dụng: 4 microservices chính (api-gateway, user-management-service, document-management-service, automation-service) + frontend (web-app) + hạ tầng (Redis, Kafka) + MongoDB Atlas (Cloud).

### Auto-Redirect & Docs
- Các backend service đều phục vụ tài liệu tại `/docs#/` (SpringDoc/FastAPI).
- Web Next.js (port 3000) không có `/docs`.

## 🛠️ Công nghệ sử dụng

### Backend
- **Spring Boot** (Java) - User Management, Document Management
- **FastAPI** (Python) - Automation và AI Processing
- **Next.js** (TypeScript) - API Gateway và BFF

### Database
- **MongoDB Atlas** - Database chính (Cloud)
- **Redis** - Cache và session management

### AI & ML
- **Google Gemini** - Xử lý tài liệu thông minh
- **OCR** - Nhận dạng ký tự quang học

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Orchestration

## 🚀 Cách chạy

### 1. Sử dụng Docker Compose (Khuyến nghị)

```bash
# Clone repository
git clone https://github.com/DevGO2003/DocGO.git
cd DocGO

# Setup environment variables
cp .env.example .env
# Chỉnh sửa .env với các giá trị thực tế (MongoDB URI, JWT Secret, Gemini API Key)

# Chạy toàn bộ hệ thống
docker-compose up -d

# Hoặc chạy từng service
docker-compose up -d kafka redis
docker-compose up -d user-management-service
docker-compose up -d document-management-service
docker-compose up -d automation-service
docker-compose up -d api-gateway
docker-compose up -d web-app

# Xem logs
docker-compose logs -f [service-name]

# Dừng hệ thống
docker-compose down
```

### 2. Development với Volume Mount (Hot Reload)

```bash
# Chạy với volume mount để code thay đổi được sync ngay
docker-compose up -d

# Code thay đổi trên máy host sẽ được reflect ngay trong container
# Không cần rebuild image khi sửa code

# Xem logs real-time
docker-compose logs -f

# Restart service sau khi thay đổi config
docker-compose restart [service-name]
```

### 3. Chạy từng service riêng lẻ

#### API Gateway
```bash
cd backend/api-gateway
npm install
npm run dev
# Truy cập: http://localhost:8000
```

#### User Management Service
```bash
cd backend/user-management-service
./mvnw spring-boot:run
# Truy cập: http://localhost:8001/docs#/
```

#### Document Management Service
```bash
cd backend/document-management-service
./mvnw spring-boot:run
# Truy cập: http://localhost:8002/docs#/
```

#### Automation Service
```bash
cd backend/automation-service
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
# Truy cập: http://localhost:8003/docs#/
```

#### Web App (Frontend)
```bash
cd frontend/web_nextjs
npm install
npm run dev
# Truy cập: http://localhost:3000
```

## 📚 API Documentation

Tất cả các microservices đều có API documentation tự động tại `/docs`:

- **API Gateway**: http://localhost:8000/docs#/
- **User Management Service**: http://localhost:8001/docs#/
- **Document Management Service**: http://localhost:8002/docs#/
- **Automation Service**: http://localhost:8003/docs#/

## 🧪 Testing

### Test Auto-Redirect Feature
```bash
# PowerShell
# cd autofiles (đã loại bỏ thư mục này)
./test-auto-redirect.ps1

# Batch
# cd autofiles (đã loại bỏ thư mục này)
./test-auto-redirect.bat
```

### Test Individual Services
```bash
# Test docs/health
curl http://localhost:8000/docs
curl http://localhost:8001/docs
curl http://localhost:8002/docs
curl http://localhost:8003/docs
```

## 🔧 Cấu hình

### Environment Variables
Dự án sử dụng file `.env` chung ở root để quản lý tất cả environment variables:

```bash
# Copy environment template
cp .env.example .env

# Chỉnh sửa file .env với các giá trị thực tế
nano .env
```

#### Các biến môi trường quan trọng:

**Root .env (Infrastructure only):**
```bash
# Database (MongoDB Atlas)
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/

# Service Ports (có thể tùy chỉnh)
API_GATEWAY_PORT=8000
USER_MANAGEMENT_PORT=8001
DOCUMENT_MANAGEMENT_PORT=8002
AUTOMATION_PORT=8003
WEB_APP_PORT=3000
```

**Service-specific .env files:**
```bash
# backend/user-management-service/.env
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
GOOGLE_CLIENT_ID=your-google-client-id-here

# backend/automation-service/.env
GEMINI_API_KEY=your-gemini-api-key-here
```

#### Ưu điểm của cách quản lý mới:
- ✅ **Layered approach**: Infrastructure secrets ở root, service secrets ở service level
- ✅ **Secure**: Service-specific secrets không expose ở root level
- ✅ **Clear ownership**: Mỗi service quản lý secrets riêng
- ✅ **Flexible**: Dễ dàng override secrets per service
- ✅ **Template**: Có .env.example làm mẫu cho từng layer

### Database Setup (MongoDB Atlas)
```bash
# Tất cả services đã được cấu hình để kết nối trực tiếp với MongoDB Atlas
# Connection string: mongodb+srv://root:sapassword@devgo-docgo-cluster0.hsudzga.mongodb.net/
# Databases được tạo tự động:
# - docgo_user_service (User Management Service)
# - docgo_document_service (Document Management Service)  
# - docgo_automation_service (Automation Service)

# Không cần cài đặt database local, tất cả đều sử dụng MongoDB Atlas
```

## 🐛 Troubleshooting Docker

### 1. Port Conflict
```bash
# Kiểm tra port đang sử dụng
netstat -ano | findstr :8000
# Dừng process hoặc thay đổi port
```

### 2. Container không khởi động
```bash
# Xem logs chi tiết
docker-compose logs [service-name]

# Kiểm tra trạng thái container
docker-compose ps

# Restart service
docker-compose restart [service-name]
```

### 3. Volume Mount Issues
```bash
# Tạo thư mục cần thiết
mkdir -p logs uploads results

# Kiểm tra quyền truy cập
ls -la backend/[service-name]/
```

### 4. Network Issues
```bash
# Kiểm tra network
docker network ls
docker network inspect docgo_docgo-network

# Recreate network
docker-compose down
docker network prune
docker-compose up -d
```

### 5. Environment Variables
```bash
# Kiểm tra environment variables
docker-compose config

# Verify .env files
ls -la backend/*/env/.env
```

## 📁 Cấu trúc Project

```
DocGO/
├── backend/                      # Backend microservices
│   ├── api-gateway/             # API Gateway (Next.js)
│   ├── user-management-service/ # User Management (Spring Boot)
│   ├── document-management-service/ # Document Management (Spring Boot)
│   └── automation-service/      # Automation & AI Processing (FastAPI)
├── frontend/                     # Frontend applications
│   └── web_nextjs/              # Web App (Next.js)
├── documents/                    # Tài liệu dự án
└── script/                       # Scripts và utilities
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phát hành dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ

- **Email**: devgo2003@gmail.com
- **GitHub**: https://github.com/DevGO2003
- **Project**: https://github.com/DevGO2003/DocGO

---

**Lưu ý**: Đây là dự án đang phát triển. Một số tính năng có thể chưa hoàn thiện hoặc đang trong quá trình cải tiến.

—

Nhánh mặc định: `main`. Vui lòng tạo PR vào `main`.
