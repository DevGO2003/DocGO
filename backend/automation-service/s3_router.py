"""
S3 Testing Router for Automation Service
Similar to Gemini testing router
"""

from fastapi import APIRouter, HTTPException
from typing import Optional
import os
import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from datetime import datetime
import uuid

from schemas.response import RestResponse

# Create router
router = APIRouter(prefix="/api/v1/automation-service/v1/s3", tags=["⚙️ APIs Kiểm tra Hệ thống"])


@router.get("/get-config", summary="Cấu hình S3", response_model=RestResponse[dict])
async def get_s3_config():
    """
    ## 📖 Mô tả
    API lấy thông tin cấu hình S3 và trạng thái hệ thống lưu trữ.
    Kiểm tra kết nối, cấu hình và hiển thị thông tin chi tiết về hệ thống file storage.
    
    ## 🔹 Đầu vào
    
    Không có tham số đầu vào - API này chỉ trả về thông tin cấu hình hiện tại.
    
    ## 🔹 Đầu ra
    
    📄 **data** (object)
    - **Mô tả**: Thông tin cấu hình S3 và trạng thái hệ thống
    - **Bao gồm**: 
      - `s3`: Cấu hình S3 (enabled, endpoint, region, bucket)
      - `file_storage`: Cấu hình file storage (upload_dir, max_file_size)
      - `status`: Trạng thái kết nối và hoạt động
    
    📊 **apiVersion** (string)
    - **Mô tả**: Phiên bản API hiện tại
    - **Giá trị**: "v1"
    
    🔢 **statusCode** (integer)
    - **Mô tả**: Mã trạng thái xử lý
    - **Các giá trị**: 200 (thành công), 500 (lỗi server)
    
    📋 **shortMessage** (string)
    - **Mô tả**: Thông báo ngắn gọn về kết quả
    - **Ví dụ**: "Success", "Internal Server Error"
    
    📖 **description** (string)
    - **Mô tả**: Mô tả chi tiết về kết quả kiểm tra
    - **Ví dụ**: "Đã lấy thông tin cấu hình S3 thành công"
    
    🕒 timestamp
    Loại: string (ISO-8601)
    Mô tả: Thời gian xử lý yêu cầu
    
    🆔 requestId
    Loại: string (UUID)
    Mô tả: Định danh duy nhất của yêu cầu
    
    🛣️ path
    Loại: string
    Mô tả: Đường dẫn API được gọi
    """
    try:
        # Lấy cấu hình S3
        s3_enabled = os.getenv("S3_ENABLED", "false").lower() == "true"
        s3_bucket = os.getenv("S3_BUCKET", "devgo2003-docgo-bucket")
        s3_endpoint = os.getenv("S3_ENDPOINT", "https://s3.filebase.com")
        s3_region = os.getenv("S3_REGION", "us-east-1")
        s3_access_key = os.getenv("S3_ACCESS_KEY_ID", "")
        s3_secret_key = os.getenv("S3_SECRET_ACCESS_KEY", "")
        base_url = os.getenv("BASE_URL", "http://localhost:8003")
        upload_directory = os.getenv("UPLOAD_DIR", "uploads")
        max_file_size = os.getenv("MAX_FILE_SIZE", "104857600")
        
        # Lấy cấu hình service
        service_name = os.getenv("SERVICE_NAME", "automation-service")
        host = os.getenv("HOST", "0.0.0.0")
        port = os.getenv("PORT", "8003")
        debug = os.getenv("DEBUG", "false")
        
        # Lấy cấu hình Kafka
        kafka_servers = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
        kafka_group_id = os.getenv("KAFKA_GROUP_ID", "automation-service")
        
        # Lấy cấu hình Redis
        redis_host = os.getenv("REDIS_HOST", "localhost")
        redis_port = os.getenv("REDIS_PORT", "6379")
        redis_db = os.getenv("REDIS_DB", "0")
        
        # Tạo response data
        config_data = {
                "s3": {
                    "enabled": s3_enabled,
                    "bucket": s3_bucket,
                    "endpoint": s3_endpoint,
                    "region": s3_region,
                    "credentials": {
                        "access_key": {
                            "exists": bool(s3_access_key),
                            "length": len(s3_access_key) if s3_access_key else 0,
                            "masked": f"{s3_access_key[:8]}...{s3_access_key[-4:]}" if s3_access_key and len(s3_access_key) > 12 else "N/A" if not s3_access_key else s3_access_key,
                            "status": "CONFIGURED" if s3_access_key else "NOT_CONFIGURED"
                        },
                        "secret_key": {
                            "exists": bool(s3_secret_key),
                            "length": len(s3_secret_key) if s3_secret_key else 0,
                            "masked": f"{s3_secret_key[:8]}...{s3_secret_key[-4:]}" if s3_secret_key and len(s3_secret_key) > 12 else "N/A" if not s3_secret_key else s3_secret_key,
                            "status": "CONFIGURED" if s3_secret_key else "NOT_CONFIGURED"
                        }
                    },
                    "status": "READY" if s3_enabled and s3_access_key and s3_secret_key else "NOT_CONFIGURED"
                },
            "service": {
                "name": service_name,
                "host": host,
                "port": port,
                "debug": debug.lower() == "true",
                "version": "2.0.0"
            },
            "kafka": {
                "bootstrap_servers": kafka_servers,
                "group_id": kafka_group_id,
                "status": "CONFIGURED"
            },
            "redis": {
                "host": redis_host,
                "port": redis_port,
                "database": redis_db,
                "status": "CONFIGURED"
            },
                "file_storage": {
                    "base_url": base_url,
                    "upload_directory": upload_directory,
                    "max_file_size": max_file_size,
                    "s3_enabled": s3_enabled,
                    "status": "CONFIGURED"
                },
            "system": {
                "python_path": os.getcwd(),
                "environment": os.getenv("NODE_ENV", "development"),
                "env_files": {
                    "dotenv_loaded": True,
                    "env_exists": os.path.exists("env/.env"),
                    "env_example_exists": os.path.exists("env/.env.example")
                }
            }
        }
        
        return RestResponse(
            apiVersion="v1",
            statusCode=200,
            shortMessage="Success",
            description="Đã lấy cấu hình S3 thành công",
            data=config_data,
            timestamp=datetime.now().isoformat(),
            requestId=str(uuid.uuid4()),
            path="/api/v1/automation-service/s3/get-config"
        )
        
    except Exception as e:
        return RestResponse(
            apiVersion="v1",
            statusCode=500,
            shortMessage="Error",
            description=f"Lỗi lấy cấu hình S3: {str(e)}",
            data=None,
            timestamp=datetime.now().isoformat(),
            requestId=str(uuid.uuid4()),
            path="/api/v1/automation-service/s3/get-config"
        )
