# DocGO - Hệ thống Quản lý Tài liệu Thông minh

## 🚀 Tổng quan

DocGO là một hệ thống quản lý tài liệu thông minh với kiến trúc microservices, tích hợp AI để xử lý và phân tích tài liệu tự động.

## 🏗️ Kiến trúc Hệ thống

### Microservices Architecture (Local Compose)

Bảng dịch vụ đang chạy theo `docker-compose.local.yml` (host port → container 8000):

| Service | Host Port | Container | Docs/URL |
|---|---|---|---|
| API Gateway BFF | 8000 | 8000 | http://localhost:8000/docs#/ |
| Web Next.js | 3000 | 3000 | http://localhost:3000 |
| Authentication Identity Service | 8001 | 8000 | http://localhost:8001/docs#/ |
| Contract Management Service | 8002 | 8000 | http://localhost:8002/docs#/ |
| AI Processing Service | 8003 | 8000 | http://localhost:8003/docs#/ |
| File Storage Service | 8004 | 8000 | http://localhost:8004/docs#/ |
| MongoDB MCP Server | 8005 | 3000 | http://localhost:8005 |
| Redis | 6379 | 6379 | redis://localhost:6379 |
| Kafka (PLAINTEXT) | 9092 | 9092 | PLAINTEXT://localhost:9092 |

Số lượng service ứng dụng: 6 (web-nextjs, api-gateway-bff, authentication-identity-service, contract-management-service, ai-processing-service, file-storage-service) + hạ tầng (Redis, Kafka, MCP).

### Auto-Redirect & Docs
- Các backend service đều phục vụ tài liệu tại `/docs#/` (SpringDoc/FastAPI).
- Web Next.js (port 3000) không có `/docs`.

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
docker compose -f docker-compose.local.yml up -d

# Hoặc chạy từng service
docker compose -f docker-compose.local.yml up redis kafka
docker compose -f docker-compose.local.yml up web-nextjs
docker compose -f docker-compose.local.yml up api-gateway-bff
docker compose -f docker-compose.local.yml up authentication-identity-service
docker compose -f docker-compose.local.yml up contract-management-service
docker compose -f docker-compose.local.yml up ai-processing-service
docker compose -f docker-compose.local.yml up file-storage-service
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
# Truy cập: http://localhost:8001/docs#/
```

#### Contract Management Service
```bash
cd backend/contract-management-service
./mvnw spring-boot:run
# Truy cập: http://localhost:8002/docs#/
```

#### AI Processing Service
```bash
cd backend/ai-processing-service
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
# Truy cập (qua compose): http://localhost:8003/docs#/
```

#### File Storage Service
```bash
cd backend/file-storage-asset-service
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
# Truy cập (qua compose): http://localhost:8004/docs#/
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
# Test docs/health
curl http://localhost:8000/docs
curl http://localhost:8001/docs
curl http://localhost:8002/docs
curl http://localhost:8003/docs
curl http://localhost:8004/docs
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

### Database Setup (nếu sử dụng MariaDB nội bộ riêng)
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

—

Nhánh mặc định: `main`. Vui lòng tạo PR vào `main`.
