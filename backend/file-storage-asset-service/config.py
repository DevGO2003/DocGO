import os
from typing import Optional

import boto3
from botocore.client import Config
from botocore.exceptions import ClientError, NoCredentialsError
from dotenv import load_dotenv
from pathlib import Path
import motor.motor_asyncio
import redis.asyncio as redis


# Load .env files in priority order: .env.local > .env > default lookup
_service_dir = Path(__file__).resolve().parent
_env_local = _service_dir / "env" / ".env.local"
_env_file = _service_dir / "env" / ".env"

# Load .env.local first (highest priority)
if _env_local.exists():
	load_dotenv(dotenv_path=_env_local, override=False)
	print(f"✅ Loaded .env.local from {_env_local}")
# Then load .env if exists
elif _env_file.exists():
	load_dotenv(dotenv_path=_env_file, override=False)
	print(f"✅ Loaded .env from {_env_file}")
# Finally fallback to default lookup (CWD)
else:
	load_dotenv()  # fallback to default lookup (CWD)
	print("✅ Loaded .env from CWD")


def get_env(name: str, default: Optional[str] = None) -> Optional[str]:
	"""Read environment variable with a default value."""
	return os.getenv(name, default)


# S3 / Filebase configuration
S3_ENDPOINT: str = get_env("S3_ENDPOINT")
S3_REGION: str = get_env("S3_REGION")
S3_ACCESS_KEY_ID: str = get_env("S3_ACCESS_KEY", get_env("S3_ACCESS_KEY_ID"))
S3_SECRET_ACCESS_KEY: str = get_env("S3_SECRET_KEY", get_env("S3_SECRET_ACCESS_KEY"))
S3_BUCKET: str = get_env("S3_BUCKET_NAME", get_env("S3_BUCKET"))
S3_ENABLED: bool = get_env("S3_ENABLED", "true").lower() == "true"
S3_PUBLIC_BUCKET: bool = get_env("S3_PUBLIC_BUCKET", "false").lower() == "true"
S3_ADDRESSING_STYLE: str = get_env("S3_ADDRESSING_STYLE", "virtual")  # virtual | path
S3_KEY_STYLE: str = get_env("S3_KEY_STYLE", "detailed")  # detailed | simple
S3_METADATA_MINIMAL: bool = get_env("S3_METADATA_MINIMAL", "false").lower() == "true"
S3_SANITIZE_KEYS: bool = get_env("S3_SANITIZE_KEYS", "true").lower() == "true"

# Debug S3 configuration
print(f"🔧 S3 Configuration:")
print(f"   S3_ENABLED: {S3_ENABLED}")
print(f"   S3_ENDPOINT: {S3_ENDPOINT}")
print(f"   S3_REGION: {S3_REGION}")
print(f"   S3_BUCKET: {S3_BUCKET}")
print(f"   S3_PUBLIC_BUCKET: {S3_PUBLIC_BUCKET}")
print(f"   S3_ADDRESSING_STYLE: {S3_ADDRESSING_STYLE}")

s3_client = boto3.client(
	"s3",
	endpoint_url=S3_ENDPOINT,
	aws_access_key_id=S3_ACCESS_KEY_ID,
	aws_secret_access_key=S3_SECRET_ACCESS_KEY,
	region_name=S3_REGION,
	config=Config(signature_version="s3v4", s3={"addressing_style": S3_ADDRESSING_STYLE}),
)


# Optional IPFS (Filebase RPC) configuration
IPFS_RPC_ENDPOINT: str = get_env("IPFS_RPC_ENDPOINT", "https://rpc.filebase.io")
IPFS_RPC_TOKEN: Optional[str] = get_env("IPFS_RPC_TOKEN")


def ensure_bucket_exists():
	"""Đảm bảo bucket S3 tồn tại nếu đã bật S3 và cấu hình hợp lệ."""
	if not S3_ENABLED:
		return
	if not S3_BUCKET:
		raise ValueError("S3_ENABLED=true nhưng S3_BUCKET chưa được cấu hình")
	try:
		s3_client.head_bucket(Bucket=S3_BUCKET)
		print(f"✅ Bucket '{S3_BUCKET}' đã tồn tại")
	except ClientError as e:
		error_code = e.response['Error'].get('Code') if hasattr(e, 'response') else None
		if error_code == '404':
			try:
				s3_client.create_bucket(Bucket=S3_BUCKET)
				print(f"✅ Đã tạo bucket '{S3_BUCKET}' thành công")
			except ClientError as create_error:
				print(f"❌ Không thể tạo bucket '{S3_BUCKET}': {create_error}")
				raise
		else:
			print(f"❌ Lỗi kiểm tra bucket '{S3_BUCKET}': {e}")
			raise
	except NoCredentialsError:
		print("❌ Không tìm thấy credentials S3. Vui lòng kiểm tra S3_ACCESS_KEY_ID và S3_SECRET_ACCESS_KEY")
		raise


def ensure_local_directories():
	"""Đảm bảo các thư mục local tồn tại."""
	directories = [UPLOAD_DIR, TEMP_DIR]
	for directory in directories:
		if not os.path.exists(directory):
			os.makedirs(directory)
			print(f"✅ Đã tạo thư mục '{directory}'")


def get_presigned_get_url(object_key: str, expires_in_seconds: int = 3600) -> str:
	"""Generate a presigned GET URL for the given S3 key."""
	return s3_client.generate_presigned_url(
		"get_object",
		Params={"Bucket": S3_BUCKET, "Key": object_key},
		ExpiresIn=expires_in_seconds,
	)

def build_public_url(object_key: str) -> str:
	"""Build a public URL in virtual-hosted style if bucket is public."""
	if not S3_BUCKET:
		return ""
	return f"https://{S3_BUCKET}.s3.filebase.com/{object_key}"

def is_s3_enabled() -> bool:
	return bool(S3_ENABLED and S3_BUCKET)

def get_s3_client():
	"""Get S3 client instance."""
	return s3_client

def get_bucket_name() -> str:
	"""Get S3 bucket name."""
	return S3_BUCKET

def get_s3_endpoint() -> str:
	"""Get S3 endpoint URL."""
	return S3_ENDPOINT

def get_s3_region() -> str:
	"""Get S3 region."""
	return S3_REGION

def is_s3_metadata_minimal() -> bool:
	return S3_METADATA_MINIMAL

def is_s3_sanitize_keys() -> bool:
	return S3_SANITIZE_KEYS

# ClamAV configuration
CLAMD_HOST: str = get_env("CLAMD_HOST", "localhost")
CLAMD_PORT: int = int(get_env("CLAMD_PORT", "3310"))
USE_CLAMD: bool = get_env("USE_CLAMD", "true").lower() == "true"

# File storage configuration
MAX_FILE_SIZE: int = int(get_env("MAX_FILE_SIZE", "104857600"))  # 100MB default
ALLOWED_FILE_TYPES: list = get_env("ALLOWED_FILE_TYPES", "pdf,docx,txt,jpg,jpeg,png,gif").split(",")
UPLOAD_DIR: str = get_env("UPLOAD_DIR", "uploads")
TEMP_DIR: str = get_env("TEMP_DIR", "temp")


# MongoDB configuration
MONGODB_URL: str = get_env("MONGODB_ATLAS_URI", get_env("MONGODB_URL", "mongodb://localhost:27017"))
MONGODB_DATABASE: str = get_env("MONGODB_DATABASE", "docgo_file_storage")
MONGODB_FILES_COLLECTION: str = get_env("MONGODB_FILES_COLLECTION", "files")
MONGODB_ASSETS_COLLECTION: str = get_env("MONGODB_ASSETS_COLLECTION", "assets")

# Redis configuration
REDIS_URL: str = get_env("REDIS_URL", "redis://localhost:6379")
REDIS_DB: int = int(get_env("REDIS_DB", "0"))
REDIS_PASSWORD: Optional[str] = get_env("REDIS_CLOUD_PASSWORD", get_env("REDIS_PASSWORD"))

# Kafka configuration
KAFKA_BOOTSTRAP_SERVERS: str = get_env("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
KAFKA_FILE_UPLOADED_TOPIC: str = get_env("KAFKA_FILE_UPLOADED_TOPIC", "file.uploaded")
KAFKA_CLIENT_ID: str = get_env("KAFKA_CLIENT_ID", "file-storage-asset-service")
KAFKA_MESSAGE_KEY_FIELD: str = get_env("KAFKA_MESSAGE_KEY_FIELD", "key")  # key | fileId | filename

# MongoDB client
mongodb_client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
mongodb_database = mongodb_client[MONGODB_DATABASE]
files_collection = mongodb_database[MONGODB_FILES_COLLECTION]
assets_collection = mongodb_database[MONGODB_ASSETS_COLLECTION]

# Redis client
redis_client = redis.from_url(
    REDIS_URL,
    db=REDIS_DB,
    password=REDIS_PASSWORD,
    decode_responses=True
)

def get_mongodb_client():
    """Get MongoDB client instance."""
    return mongodb_client

def get_mongodb_database():
    """Get MongoDB database instance."""
    return mongodb_database

def get_files_collection():
    """Get files collection instance."""
    return files_collection

def get_assets_collection():
    """Get assets collection instance."""
    return assets_collection

def get_redis_client():
    """Get Redis client instance."""
    return redis_client

