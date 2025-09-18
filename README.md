# DocGO - Hệ thống Quản lý Tài liệu Thông minh

## 🚀 Tổng quan

DocGO là một hệ thống quản lý tài liệu thông minh với kiến trúc microservices, tích hợp AI để xử lý và phân tích tài liệu tự động.

## 🏗️ Kiến trúc Hệ thống

### Microservices Architecture
- **API Gateway BFF** (Port 8000) - Backend for Frontend
- **Authentication Identity Service** (Port 8001) - Xác thực và ủy quyền
- **User Management Service** (Port 8002) - Quản lý người dùng
- **Contract Management Service** (Port 8003) - Quản lý hợp đồng
- **AI Processing Service** (Port 8017) - Xử lý AI
- **File Storage Asset Service** (Port 8012) - Lưu trữ file

### Auto-Redirect Feature
Tất cả các backend microservices đều có tính năng **tự động redirect** từ root path (`/`) sang `/docs` để cải thiện trải nghiệm developer:

- `http://localhost:8001/` → `http://localhost:8001/docs`
- `http://localhost:8002/` → `http://localhost:8002/docs`
- `http://localhost:8003/` → `http://localhost:8003/docs`
- `http://localhost:8012/` → `http://localhost:8012/docs`
- `http://localhost:8017/` → `http://localhost:8017/docs`

## 🛠️ Công nghệ sử dụng

### Backend
- **Spring Boot** (Java) - Authentication, Contract Management
- **FastAPI** (Python) - User Management, AI Processing, File Storage
- **Next.js** (TypeScript) - API Gateway BFF

### Database
- **MariaDB** - Database chính
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

# Chạy toàn bộ hệ thống
# cd autofiles (đã loại bỏ thư mục này)
docker-compose -f docker-compose.local.yml up -d

# Hoặc chạy từng service
docker-compose -f docker-compose.local.yml up mariadb redis
docker-compose -f docker-compose.local.yml up api-gateway-bff
docker-compose -f docker-compose.local.yml up authentication-identity-service
docker-compose -f docker-compose.local.yml up user-management-service
docker-compose -f docker-compose.local.yml up contract-management-service
docker-compose -f docker-compose.local.yml up ai-processing-service
docker-compose -f docker-compose.local.yml up file-storage-asset-service
```

### 2. Chạy từng service riêng lẻ

#### API Gateway BFF
```bash
cd backend/api-gateway-bff
npm install
npm run dev
# Truy cập: http://localhost:8000
```

#### Authentication Identity Service
```bash
cd backend/authentication-identity-service
./mvnw spring-boot:run
# Truy cập: http://localhost:8001 (tự động redirect sang /docs)
```

#### User Management Service
```bash
cd backend/user-management-service
pip install -r requirements.txt
python main.py
# Truy cập: http://localhost:8002 (tự động redirect sang /docs)
```

#### Contract Management Service
```bash
cd backend/contract-management-service
./mvnw spring-boot:run
# Truy cập: http://localhost:8003 (tự động redirect sang /docs)
```

#### AI Processing Service
```bash
cd backend/ai-processing-service
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8017
# Truy cập: http://localhost:8017 (tự động redirect sang /docs)
```

#### File Storage Asset Service
```bash
cd backend/file-storage-asset-service
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8012
# Truy cập: http://localhost:8012 (tự động redirect sang /docs)
```

## 📚 API Documentation

Tất cả các microservices đều có API documentation tự động tại `/docs`:

- **API Gateway BFF**: http://localhost:8000/docs
- **Authentication Service**: http://localhost:8001/docs
- **User Management Service**: http://localhost:8002/docs
- **Contract Management Service**: http://localhost:8003/docs
- **AI Processing Service**: http://localhost:8017/docs
- **File Storage Service**: http://localhost:8012/docs

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
# Test health endpoints
curl http://localhost:8000/api/health
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health
curl http://localhost:8017/health
curl http://localhost:8012/health
```

## 🔧 Cấu hình

### Environment Variables
Mỗi service có file `.env.example` riêng. Copy và cấu hình theo môi trường:

```bash
# Copy environment template
cp backend/[service-name]/env_example.txt backend/[service-name]/.env

# Cấu hình database
SPRING_DATASOURCE_URL=jdbc:mariadb://localhost:3306/docgo
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_password
```

### Database Setup
```sql
-- Tạo database
CREATE DATABASE docgo;
CREATE DATABASE docgo_contract_service;
CREATE DATABASE docgo_user_management_service;

-- Import schema (nếu có)
mysql -u root -p docgo < database/init_user_db.sql
mysql -u root -p docgo_contract_service < backend/contract-management-service/database/init_contract_service.sql
```

## 📁 Cấu trúc Project

```
DocGO/
# ├── autofiles/                    # (đã loại bỏ)
├── backend/                      # Backend microservices
│   ├── api-gateway-bff/         # API Gateway (Next.js)
│   ├── authentication-identity-service/  # Auth Service (Spring Boot)
│   ├── user-management-service/ # User Management (FastAPI)
│   ├── contract-management-service/      # Contract Management (Spring Boot)
│   ├── ai-processing-service/   # AI Processing (FastAPI)
│   └── file-storage-asset-service/       # File Storage (FastAPI)
├── frontend/                     # Frontend applications
├── database/                     # Database scripts
└── document/                     # Tài liệu dự án
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
