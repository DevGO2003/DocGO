import os
from typing import Optional

import boto3
from botocore.client import Config


def get_env(name: str, default: Optional[str] = None) -> Optional[str]:
	"""Read environment variable with a default value."""
	return os.getenv(name, default)


# S3 / Filebase configuration
S3_ENDPOINT: str = get_env("S3_ENDPOINT", "https://s3.filebase.com")
S3_REGION: str = get_env("S3_REGION", "us-east-1")
S3_ACCESS_KEY_ID: str = get_env("S3_ACCESS_KEY_ID", "minioadmin")
S3_SECRET_ACCESS_KEY: str = get_env("S3_SECRET_ACCESS_KEY", "miniopassword")
S3_BUCKET: str = get_env("S3_BUCKET", "docgo-assets")

s3_client = boto3.client(
	"s3",
	endpoint_url=S3_ENDPOINT,
	aws_access_key_id=S3_ACCESS_KEY_ID,
	aws_secret_access_key=S3_SECRET_ACCESS_KEY,
	region_name=S3_REGION,
	config=Config(signature_version="s3v4"),
)


# Optional IPFS (Filebase RPC) configuration
IPFS_RPC_ENDPOINT: str = get_env("IPFS_RPC_ENDPOINT", "https://rpc.filebase.io")
IPFS_RPC_TOKEN: Optional[str] = get_env("IPFS_RPC_TOKEN")


def get_presigned_get_url(object_key: str, expires_in_seconds: int = 3600) -> str:
	"""Generate a presigned GET URL for the given S3 key."""
	return s3_client.generate_presigned_url(
		"get_object",
		Params={"Bucket": S3_BUCKET, "Key": object_key},
		ExpiresIn=expires_in_seconds,
	)


