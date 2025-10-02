import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env file
_service_dir = Path(__file__).resolve().parent
_env_file = _service_dir / ".env"

# Load .env if exists
if _env_file.exists():
    load_dotenv(dotenv_path=_env_file, override=False)
    print(f"Loaded .env from {_env_file}")
# Finally fallback to default lookup (CWD)
else:
    load_dotenv()  # fallback to default lookup (CWD)
    print("Loaded .env from CWD")

def get_gemini_api_key():
    """
    Lấy Gemini API Key từ biến môi trường.
    Ném ra lỗi nếu không tìm thấy key.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Biến môi trường GEMINI_API_KEY chưa được thiết lập.")
    return api_key

# MongoDB Atlas configuration - REMOVED (Automation Service không cần database)
# def get_mongodb_uri():
#     """Lấy MongoDB Atlas connection string"""
#     return os.getenv("MONGODB_ATLAS_URI", os.getenv("MONGODB_URI", "mongodb://localhost:27017"))

# def get_mongodb_database():
#     """Lấy tên database MongoDB"""
#     return os.getenv("MONGODB_DATABASE", "docgo_ai")

# def get_mongodb_collections():
#     """Lấy tên các collections MongoDB"""
#     return {
#         "notifications": os.getenv("MONGODB_NOTIFICATIONS_COLLECTION", "notifications"),
#         "batch_jobs": os.getenv("MONGODB_BATCH_JOBS_COLLECTION", "batch_jobs"),
#         "notification_templates": os.getenv("MONGODB_TEMPLATES_COLLECTION", "notification_templates"),
#         "events": os.getenv("MONGODB_EVENTS_COLLECTION", "events")
#     }

# Redis Cloud configuration
def get_redis_url():
    """Lấy Redis Cloud connection string"""
    host = os.getenv("REDIS_CLOUD_HOST", "localhost")
    port = os.getenv("REDIS_CLOUD_PORT", "6379")
    password = os.getenv("REDIS_CLOUD_PASSWORD", "")
    if password:
        return f"redis://:{password}@{host}:{port}"
    return f"redis://{host}:{port}"

def get_redis_password():
    """Lấy Redis password"""
    return os.getenv("REDIS_CLOUD_PASSWORD", os.getenv("REDIS_PASSWORD"))

def get_redis_db():
    """Lấy Redis database number"""
    return int(os.getenv("REDIS_DB", "0"))

# Notification configuration
def get_smtp_config():
    """Lấy cấu hình SMTP cho email"""
    return {
        "host": os.getenv("SMTP_HOST", "smtp.gmail.com"),
        "port": int(os.getenv("SMTP_PORT", "587")),
        "username": os.getenv("SMTP_USERNAME"),
        "password": os.getenv("SMTP_PASSWORD"),
        "use_tls": os.getenv("SMTP_USE_TLS", "true").lower() == "true"
    }

def get_twilio_config():
    """Lấy cấu hình Twilio cho SMS"""
    return {
        "account_sid": os.getenv("TWILIO_ACCOUNT_SID"),
        "auth_token": os.getenv("TWILIO_AUTH_TOKEN"),
        "phone_number": os.getenv("TWILIO_PHONE_NUMBER")
    }

# WebSocket configuration
def get_websocket_config():
    """Lấy cấu hình WebSocket"""
    return {
        "host": os.getenv("WEBSOCKET_HOST", "0.0.0.0"),
        "port": int(os.getenv("WEBSOCKET_PORT", "8001"))
    }

# Batch processing configuration
def get_batch_config():
    """Lấy cấu hình batch processing"""
    return {
        "max_workers": int(os.getenv("BATCH_MAX_WORKERS", "4")),
        "queue_name": os.getenv("BATCH_QUEUE_NAME", "ai_processing_queue"),
        "result_ttl": int(os.getenv("BATCH_RESULT_TTL", "3600"))  # 1 hour
    }

# Event handling configuration
def get_event_config():
    """Lấy cấu hình event handling"""
    return {
        "channels": {
            "file_uploaded": os.getenv("REDIS_FILE_UPLOADED_CHANNEL", "file.uploaded"),
            "ai_processing_completed": os.getenv("REDIS_AI_COMPLETED_CHANNEL", "ai.processing.completed"),
            "notification_sent": os.getenv("REDIS_NOTIFICATION_SENT_CHANNEL", "notification.sent")
        }
    }

# Kafka configs (giữ lại để tương thích)
def get_kafka_bootstrap_servers():
    return os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")

# Consumer topic
def get_kafka_file_uploaded_topic():
    return os.getenv("KAFKA_FILE_UPLOADED_TOPIC", "file.uploaded")

# Producer topics
def get_kafka_text_extracted_topic():
    return os.getenv("KAFKA_TEXT_EXTRACTED_TOPIC", "ai.text.extracted")

def get_kafka_document_classified_topic():
    return os.getenv("KAFKA_DOCUMENT_CLASSIFIED_TOPIC", "ai.document.classified")

def get_kafka_contract_summary_topic():
    return os.getenv("KAFKA_CONTRACT_SUMMARY_TOPIC", "contract.summary.updated")

def get_kafka_client_id():
    return os.getenv("KAFKA_CLIENT_ID", "automation-service")
