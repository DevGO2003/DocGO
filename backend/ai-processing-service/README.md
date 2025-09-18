# AI Processing Service

## 🚀 Tổng quan

AI Processing Service là một microservice xử lý tài liệu thông minh sử dụng Google Gemini AI để trích xuất và tóm tắt thông tin từ các hợp đồng.

## 🛠️ Công nghệ sử dụng

- **FastAPI** - Web framework
- **Google Gemini AI** - AI model cho xử lý tài liệu
- **python-docx** - Đọc file DOCX
- **PyPDF2** - Đọc file PDF
- **Pydantic** - Data validation

## 📋 Tính năng

### 1. Extract API
- **Endpoint**: `POST /api/v1/ai-processing-service/extract`
- **Chức năng**: Trích xuất thông tin từ file DOCX/PDF
- **Input**: File hợp đồng (docx, pdf)
- **Output**: Văn bản trích xuất từ AI

### 2. Summarize API
- **Endpoint**: `POST /api/v1/ai-processing-service/summarize`
- **Chức năng**: Tóm tắt hợp đồng thành JSON
- **Input**: File TXT hoặc chuỗi văn bản
- **Output**: JSON tóm tắt hợp đồng

## 🚀 Cách chạy

### Prerequisites:
- Python 3.11+
- `GEMINI_API_KEY`
- MongoDB Atlas (hoặc local MongoDB)
- Redis Cloud (hoặc local Redis)
- Twilio Account (cho SMS notifications - tùy chọn)

### Environment:
```bash
# AI Processing
GEMINI_API_KEY=YOUR_GEMINI_KEY

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DATABASE=ai_processing_db

# Redis Cloud
REDIS_URL=redis://username:password@host:port
REDIS_PASSWORD=your_redis_password
REDIS_DB=0

# SMTP Configuration (cho email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_USE_TLS=true

# Twilio Configuration (cho SMS notifications)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Batch Processing
BATCH_MAX_WORKERS=4
BATCH_QUEUE_NAME=ai_processing_queue
BATCH_RESULT_TTL=3600

# Event Handling
REDIS_FILE_UPLOADED_CHANNEL=file.uploaded
REDIS_AI_COMPLETED_CHANNEL=ai.processing.completed
REDIS_NOTIFICATION_SENT_CHANNEL=notification.sent
```

### 1. Cài đặt dependencies
```bash
cd backend/ai-processing-service
pip install -r requirements.txt
```

### 2. Cấu hình môi trường
```bash
# Copy file môi trường
cp env_example.txt .env

# Cập nhật GEMINI_API_KEY trong .env
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Chạy service

#### Run (PowerShell):
```powershell
cd backend/ai-processing-service
python -m venv venv
./venv/Scripts/Activate.ps1
pip install -r requirements.txt
# Copy file env từ thư mục env
Copy-Item env/.env.example env/.env -Force
# Chỉnh sửa file env/.env với các giá trị thực tế
uvicorn main:app --reload --port 8017
```

#### Run (Docker):
```bash
cd backend/ai-processing-service
docker build -t ai-processing-service .
docker run -p 8017:8000 --env-file env/.env ai-processing-service
```

### 4. Truy cập
- **API Documentation**: http://localhost:8017/docs
- **Health Check**: http://localhost:8017/health
- **Root**: http://localhost:8017/ (tự động redirect sang /docs)

## 📚 API Documentation

### Extract API
```bash
curl -X POST "http://localhost:8017/api/v1/ai-processing-service/extract" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@contract.docx" \
  -H "gemini_api_key: your_api_key"
```

### Summarize API
```bash
# Với file TXT
curl -X POST "http://localhost:8017/api/v1/ai-processing-service/summarize" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@contract.txt"

# Với chuỗi văn bản
curl -X POST "http://localhost:8017/api/v1/ai-processing-service/summarize" \
  -H "Content-Type: application/json" \
  -d '{"text": "Nội dung hợp đồng..."}'
```

## 🔧 Cấu hình

### Environment Variables
- `HOST`: Host để bind service (mặc định: 0.0.0.0)
- `PORT`: Port để chạy service (mặc định: 8017)
- `GEMINI_API_KEY`: API key cho Google Gemini AI
- `MAX_FILE_SIZE`: Kích thước file tối đa (mặc định: 100MB)
- `ALLOWED_FILE_TYPES`: Các loại file được phép (docx,pdf,txt)
- `RESULTS_DIR`: Thư mục lưu file tạm (mặc định: results)

## 🐳 Docker

### Build image
```bash
docker build -t docgo-ai-processing-service:latest .
```

### Chạy container
```bash
docker run -p 8017:8017 \
  -e GEMINI_API_KEY=your_api_key \
  docgo-ai-processing-service:latest
```

## 📁 Cấu trúc Project

```
ai-processing-service/
├── main.py              # FastAPI app entry point
├── routers.py           # API routes
├── config.py            # Configuration
├── schemas/
│   └── response.py      # Response models
├── requirements.txt     # Python dependencies
├── env_example.txt      # Environment template
├── README.md           # This file
└── results/            # Temporary files directory
```

## 🔍 Troubleshooting

### Lỗi thường gặp

1. **422 Validation Error**: Kiểm tra format file và payload
2. **500 Internal Server Error**: Kiểm tra GEMINI_API_KEY và kết nối mạng
3. **File không được hỗ trợ**: Chỉ hỗ trợ docx, pdf, txt

### Logs
```bash
# Xem logs khi chạy với uvicorn
uvicorn main:app --host 0.0.0.0 --port 8017 --reload --log-level debug
```

## Features:
- **AI Processing**: Extract, Summarize, Classify documents
- **Notification Service**: Email, SMS, Push, WebSocket notifications
- **Batch Processing**: Xử lý hàng loạt files với job queue
- **Event Handling**: Redis Pub/Sub cho real-time events
- **MongoDB Integration**: Lưu trữ notifications, batch jobs, events
- **Redis Integration**: Message queue và caching

## API Endpoints:
- `POST /api/v1/ai-processing-service/extract` - Trích xuất nội dung file
- `POST /api/v1/ai-processing-service/summarize` - Tóm tắt hợp đồng
- `POST /api/v1/ai-processing-service/classify` - Phân loại tài liệu
- `POST /api/v1/ai-processing-service/notifications/send` - Gửi notification
- `GET /api/v1/ai-processing-service/notifications/history` - Lịch sử notification
- `POST /api/v1/ai-processing-service/batch/process` - Xử lý hàng loạt
- `GET /api/v1/ai-processing-service/batch/status/{job_id}` - Trạng thái batch job
- `POST /api/v1/ai-processing-service/events/handle` - Xử lý events

Docs: `http://localhost:8017/docs#/`

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License