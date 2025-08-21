from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from typing import List, Optional
from uuid import uuid4

from config import s3_client, S3_BUCKET, get_presigned_get_url


router = APIRouter(prefix="/api/v1/file-storage", tags=["File Storage"])


@router.post("/upload", summary="Upload a file to S3/Filebase")
async def upload_file(
	folder: str = Query("assets", description="Thư mục con trong bucket để lưu trữ"),
	file: UploadFile = File(...),
):
	try:
		unique_name = f"{uuid4().hex}_{file.filename}"
		object_key = f"{folder}/{unique_name}"
		s3_client.upload_fileobj(file.file, S3_BUCKET, object_key)
		url = get_presigned_get_url(object_key, 7 * 24 * 3600)
		return {
			"statusCode": 200,
			"shortMessage": "Success",
			"data": {"bucket": S3_BUCKET, "key": object_key, "url": url},
		}
	except Exception as exc:
		raise HTTPException(status_code=500, detail=f"Upload error: {exc}")


@router.get("/list", summary="List objects by prefix")
def list_objects(prefix: str = Query("assets/", description="Prefix (thư mục) để liệt kê")):
	try:
		resp = s3_client.list_objects_v2(Bucket=S3_BUCKET, Prefix=prefix)
		items = [
			{"key": o["Key"], "size": o.get("Size", 0)}
			for o in resp.get("Contents", [])
		]
		return {"statusCode": 200, "data": items}
	except Exception as exc:
		raise HTTPException(status_code=500, detail=f"List error: {exc}")


@router.get("/url", summary="Get presigned download URL")
def get_download_url(key: str, expires: int = 3600):
	try:
		url = get_presigned_get_url(key, expires)
		return {"statusCode": 200, "data": {"url": url}}
	except Exception as exc:
		raise HTTPException(status_code=500, detail=f"URL error: {exc}")


@router.delete("/delete", summary="Delete an object")
def delete_object(key: str):
	try:
		s3_client.delete_object(Bucket=S3_BUCKET, Key=key)
		return {"statusCode": 200, "shortMessage": "Deleted", "data": {"key": key}}
	except Exception as exc:
		raise HTTPException(status_code=500, detail=f"Delete error: {exc}")


