# File Storage Asset Service

Dịch vụ FastAPI quản lý upload/download file, cấp signed URL và metadata.

Docs: http://localhost:8012/docs#/

## How to run this microservice

**Prerequisites:**
- Python 3.11+
- S3-compatible storage (Filebase recommended)
- MongoDB Atlas hoặc MongoDB local
- Redis Cloud hoặc Redis local
- ClamAV (tùy chọn, cho malware scanning)

**Bước 1: Cấu hình môi trường**
```powershell
cd backend/file-storage-asset-service
Copy-Item env/.env.example env/.env -Force
```

**Bước 2: Chỉnh sửa file env/.env**
Mở file `env/.env` và cập nhật các thông tin sau:
```env
# S3 / Filebase Configuration
S3_ENDPOINT=https://s3.filebase.com
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your_access_key_here
S3_SECRET_ACCESS_KEY=your_secret_key_here
S3_BUCKET=docgo-assets

# Optional IPFS (Filebase RPC) Configuration
IPFS_RPC_ENDPOINT=https://rpc.filebase.io
IPFS_RPC_TOKEN=your_ipfs_token_here

# ClamAV Configuration (Malware Scanner)
CLAMD_HOST=localhost
CLAMD_PORT=3310
USE_CLAMD=false

# File Storage Configuration
MAX_FILE_SIZE=104857600
ALLOWED_FILE_TYPES=pdf,docx,txt,jpg,jpeg,png,gif
UPLOAD_DIR=uploads
TEMP_DIR=temp

# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
MONGODB_DATABASE=docgo_file_storage
MONGODB_FILES_COLLECTION=files
MONGODB_ASSETS_COLLECTION=assets

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_DB=0
REDIS_PASSWORD=
```

**Bước 3: Tạo bucket S3 và cấu hình database**
Trước khi chạy service, bạn cần:
1. Tạo bucket `docgo-assets` trong Filebase hoặc S3 của bạn
2. Cấu hình MongoDB (Atlas hoặc local)
3. Cấu hình Redis (Cloud hoặc local)

**Bước 4: Cài đặt và chạy**
```powershell
python -m venv venv
./venv/Scripts/Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8012
```

**Docs:** `http://localhost:8012/docs#/`

## API Endpoints

### 🔹 File Management (Core)
- `POST /api/v1/file-storage-asset-service/files` - Upload file
- `GET /api/v1/file-storage-asset-service/files` - Liệt kê files (có phân trang)
- `GET /api/v1/file-storage-asset-service/files/{file_id}/download` - Download file
- `POST /api/v1/file-storage-asset-service/files/{file_id}/signed-url` - Tạo signed URL
- `GET /api/v1/file-storage-asset-service/files/{file_id}/versions` - Lấy phiên bản file
- `DELETE /api/v1/file-storage-asset-service/files/{file_id}` - Xóa file/phiên bản

### 🔹 General File Management
- `POST /api/v1/file-storage-asset-service/files/organize` - Tổ chức file vào thư mục
- `POST /api/v1/file-storage-asset-service/files/share` - Chia sẻ file
- `GET /api/v1/file-storage-asset-service/files/search` - Tìm kiếm files
- `GET /api/v1/file-storage-asset-service/files/{file_id}/metadata` - Lấy metadata file
- `POST /api/v1/file-storage-asset-service/files/backup` - Sao lưu files

### 🔹 File Processing
- `POST /api/v1/file-storage-asset-service/process/convert` - Chuyển đổi file
- `POST /api/v1/file-storage-asset-service/process/compress` - Nén file
- `POST /api/v1/file-storage-asset-service/process/extract` - Giải nén file
- `POST /api/v1/file-storage-asset-service/process/validate` - Kiểm tra file

### 🔹 Asset Management
- `POST /api/v1/file-storage-asset-service/assets` - Tạo asset
- `GET /api/v1/file-storage-asset-service/assets/{asset_id}` - Lấy thông tin asset
- `PUT /api/v1/file-storage-asset-service/assets/{asset_id}` - Cập nhật asset
- `DELETE /api/v1/file-storage-asset-service/assets/{asset_id}` - Xóa asset
- `GET /api/v1/file-storage-asset-service/assets` - Lấy danh sách assets
- `GET /api/v1/file-storage-asset-service/assets/{asset_id}/versions` - Lấy phiên bản asset
- `PUT /api/v1/file-storage-asset-service/assets/{asset_id}/restore` - Khôi phục asset

## 🔗 S3 Direct Operations

### List S3 Files
```bash
# Lấy tất cả files
GET /api/v1/file-storage-asset-service/files/s3

# Lọc theo prefix (ví dụ: documents/)
GET /api/v1/file-storage-asset-service/files/s3?prefix=documents/

# Phân trang với continuation token
GET /api/v1/file-storage-asset-service/files/s3?max_keys=50&continuation_token=abc123
```

### Get S3 File Info
```bash
# Lấy thông tin file cụ thể
GET /api/v1/file-storage-asset-service/files/s3/documents/contract.pdf

# Không bao gồm URL trong response
GET /api/v1/file-storage-asset-service/files/s3/documents/contract.pdf?include_url=false
```

### Response Format
```json
{
  "apiVersion": "v1",
  "statusCode": 200,
  "shortMessage": "Success",
  "description": "Đã lấy 10 files từ S3",
  "data": {
    "files": [
      {
        "key": "documents/contract.pdf",
        "size": 1024000,
        "last_modified": "2024-01-15T10:30:00.000Z",
        "etag": "abc123def456",
        "storage_class": "STANDARD",
        "url": "https://bucket.s3.filebase.com/documents/contract.pdf"
      }
    ],
    "is_truncated": false,
    "next_continuation_token": null,
    "total_count": 10,
    "prefix": "documents/"
  }
}
```

## 🚀 Tính năng mới

### File Processing
- **Chuyển đổi file**: Hỗ trợ chuyển đổi giữa các định dạng (PDF, DOCX, TXT, JPG, PNG)
- **Nén file**: Nén file với mức độ nén tùy chọn (1-9)
- **Giải nén file**: Hỗ trợ ZIP, RAR và các định dạng archive khác
- **Kiểm tra file**: Validation file và phát hiện lỗi

### Asset Management
- **Quản lý asset**: Tạo, cập nhật, xóa asset từ file
- **Phân loại asset**: Hỗ trợ các danh mục (document, image, video, audio, archive)
- **Versioning**: Quản lý phiên bản asset
- **Tìm kiếm**: Tìm kiếm asset theo tên, mô tả, tags

### General File Management
- **Tổ chức file**: Sắp xếp file vào thư mục
- **Chia sẻ file**: Chia sẻ file với quyền truy cập
- **Backup**: Sao lưu nhiều file cùng lúc
- **Metadata**: Lấy thông tin chi tiết file

### Database Integration
- **MongoDB**: Lưu trữ metadata file và asset
- **Redis**: Cache và session management
- **S3/Filebase**: Lưu trữ file thực tế

**Lưu ý quan trọng:**
- Đảm bảo bucket `docgo-assets` đã được tạo trong S3/Filebase trước khi chạy service
- Cấu hình MongoDB và Redis trước khi chạy service
- Nếu không có ClamAV, set `USE_CLAMD=false` trong file `.env`
- Service sẽ tự động tạo thư mục `uploads/` và `temp/` nếu chưa tồn tại
- Tất cả API đều trả về format `RestResponse` chuẩn hóa
- Port chuẩn: 8012 (theo quy tắc DocGO)
- Tích hợp đầy đủ MongoDB và Redis cho quản lý file nâng cao