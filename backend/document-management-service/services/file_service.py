import os
import hashlib
import uuid
import base64
import unicodedata
from datetime import datetime, timedelta
from typing import Optional, List, BinaryIO
import boto3
from botocore.exceptions import ClientError
import filetype
import aiofiles
from fastapi import HTTPException, UploadFile
import logging
from datetime import datetime

from schemas.file import FileStatus, FileType, FileInfo, FileVersion, MalwareScanResult
from schemas.file_response import FileResponseDto, FileDetailResponseDto
from schemas.pagination import PaginatedResponse, RequestInfo, ResultInfo
from services.malware_scanner import MalwareScanner
from config import get_s3_client, get_bucket_name, is_s3_enabled, UPLOAD_DIR, S3_KEY_STYLE, is_s3_metadata_minimal, is_s3_sanitize_keys, S3_PUBLIC_BUCKET, build_public_url, get_presigned_get_url, get_s3_endpoint

# Cấu hình logging
logger = logging.getLogger(__name__)

class FileStorageService:
    def __init__(self):
        self.s3_client = get_s3_client()
        self.bucket_name = get_bucket_name()
        self.malware_scanner = MalwareScanner()

    def _generate_file_id(self) -> str:
        """Tạo ID duy nhất cho file"""
        return str(uuid.uuid4())

    def _get_file_type(self, filename: str, content: bytes) -> FileType:
        """Xác định loại file dựa trên extension và magic bytes"""
        ext = filename.lower().split('.')[-1] if '.' in filename else ''
        if ext == 'pdf': return FileType.PDF
        if ext in ['docx', 'doc']: return FileType.DOCX
        if ext == 'txt': return FileType.TXT
        if ext in ['jpg', 'jpeg', 'png', 'gif', 'bmp']: return FileType.IMAGE
        try:
            kind = filetype.guess(content)
            if kind:
                mime = kind.mime
                if 'pdf' in mime: return FileType.PDF
                if 'word' in mime or 'document' in mime: return FileType.DOCX
                if 'text' in mime: return FileType.TXT
                if 'image' in mime: return FileType.IMAGE
        except Exception:
            pass
        return FileType.OTHER

    def _calculate_checksum(self, content: bytes) -> str:
        """Tính MD5 checksum của file"""
        return hashlib.md5(content).hexdigest()

    async def upload_file(self, file: UploadFile, user_id: Optional[str], folder: Optional[str] = None) -> FileInfo:
        """Upload file lên S3, mỗi lần upload tạo một file_id mới."""
        s3_key = None
        try:
            content = await file.read()
            original_name = file.filename or "unknown"
            logger.info(f"[UPLOAD_START] Processing file: {original_name}, size: {len(content)} bytes")

            if is_s3_sanitize_keys():
                import re
                name, ext = os.path.splitext(original_name)
                safe_name = re.sub(r"[^A-Za-z0-9._-]+", "_", name).strip("._-")
                original_name = (safe_name or "file") + ext

            folder_prefix = (folder.strip('/') + '/') if folder else ''
            file_id = self._generate_file_id()
            file_type = self._get_file_type(original_name, content)
            checksum = self._calculate_checksum(content)
            user_id_str = user_id or "public"
            version = 1 # Mỗi lần upload là một file mới, phiên bản 1

            if S3_KEY_STYLE == "simple":
                s3_key = f"{folder_prefix}{original_name}"
            else:
                s3_key = f"{folder_prefix}users/{user_id_str}/files/{file_id}/v{version}/{original_name}"

            logger.info(f"[S3_KEY_GEN] Generated S3 key: {s3_key}")

            if is_s3_enabled():
                ascii_name = unicodedata.normalize('NFKD', original_name).encode('ascii', 'ignore').decode('ascii') or "unknown"
                b64_name = base64.b64encode(original_name.encode('utf-8')).decode('ascii')
                
                put_kwargs = {
                    'Bucket': self.bucket_name,
                    'Key': s3_key,
                    'Body': content,
                    'ContentType': file.content_type or "application/octet-stream",
                }
                if not is_s3_metadata_minimal():
                    put_kwargs['Metadata'] = {
                        'file_id': file_id,
                        'user_id': user_id_str,
                        'original_filename': ascii_name,
                        'original_filename_b64': b64_name,
                        'file_type': str(file_type.value),
                        'checksum': str(checksum),
                        'version': str(version),
                        'upload_time': datetime.utcnow().isoformat()
                    }
                
                self.s3_client.put_object(**put_kwargs)
                logger.info(f"[S3_UPLOAD_SUCCESS] File uploaded to {self.bucket_name}/{s3_key}")
            else:
                # Lưu local
                if S3_KEY_STYLE == "simple":
                    local_dir = os.path.join(UPLOAD_DIR, *(folder_prefix[:-1].split('/') if folder_prefix else []))
                else:
                    local_dir = os.path.join(UPLOAD_DIR, *(folder_prefix[:-1].split('/') if folder_prefix else []), 'users', user_id_str, 'files', file_id, f'v{version}')
                os.makedirs(local_dir, exist_ok=True)
                local_path = os.path.join(local_dir, original_name)
                async with aiofiles.open(local_path, 'wb') as f:
                    await f.write(content)
                s3_key = os.path.relpath(local_path, start=UPLOAD_DIR).replace('\\', '/')
                logger.info(f"[LOCAL_SAVE_SUCCESS] File saved to {local_path}")

            malware_result = await self.malware_scanner.scan_file(content)
            status = FileStatus.CLEAN if malware_result.is_clean else FileStatus.INFECTED

            file_info = FileInfo(
                file_id=file_id,
                filename=original_name,
                file_size=len(content),
                file_type=file_type,
                status=status,
                version=version,
                upload_time=datetime.utcnow(),
                last_modified=datetime.utcnow(),
                checksum=checksum,
                malware_scan_result=malware_result.scan_details,
                s3_key=s3_key
            )
            logger.info(f"[UPLOAD_COMPLETE] Successfully processed file_id: {file_id}")
            return file_info
        except ClientError as e:
            logger.error(f"[S3_ERROR] S3 client error during upload: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"S3 Error: {e.response.get('Error', {}).get('Message', 'Unknown')}")
        except Exception as e:
            logger.error(f"[UPLOAD_FAILED] An unexpected error occurred: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Upload error: {str(e)}")

    async def download_file(self, file_id: str, user_id: str, version: int = 1) -> bytes:
        """Download file từ S3 dựa trên file_id và version."""
        try:
            file_info = await self._get_file_info(file_id, user_id, version)
            if not file_info:
                raise HTTPException(status_code=404, detail=f"File with id {file_id} and version {version} not found.")
            
            response = self.s3_client.get_object(Bucket=self.bucket_name, Key=file_info.s3_key)
            return response['Body'].read()
        except ClientError as e:
            if e.response['Error']['Code'] == 'NoSuchKey':
                raise HTTPException(status_code=404, detail="File version not found in S3.")
            raise HTTPException(status_code=500, detail=f"S3 download error: {str(e)}")

    def generate_signed_url(self, file_id: str, user_id: str, expiration_minutes: int = 60) -> str:
        """Tạo signed URL để download phiên bản mới nhất của file."""
        try:
            file_info = self._get_latest_file_info(file_id, user_id)
            if not file_info:
                raise HTTPException(status_code=404, detail=f"File with id {file_id} not found.")

            return self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': file_info.s3_key},
                ExpiresIn=expiration_minutes * 60
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Could not generate signed URL: {str(e)}")

    async def get_file_versions(self, file_id: str, user_id: str) -> List[FileVersion]:
        """Lấy danh sách phiên bản của file từ S3."""
        if S3_KEY_STYLE == "simple":
            raise HTTPException(status_code=501, detail="Versioning is not supported with 'simple' S3_KEY_STYLE.")
        prefix = f"users/{user_id}/files/{file_id}/"
        try:
            response = self.s3_client.list_objects_v2(Bucket=self.bucket_name, Prefix=prefix)
            if 'Contents' not in response:
                return []

            versions = []
            for obj in response['Contents']:
                key = obj['Key']
                parts = key.split('/')
                try:
                    # .../files/{file_id}/v{version}/{filename}
                    version_str = parts[-2]
                    if version_str.startswith('v'):
                        version = int(version_str[1:])
                        versions.append(FileVersion(
                            version=version,
                            s3_key=key,
                            file_size=obj.get('Size'),
                            upload_time=obj.get('LastModified')
                        ))
                except (ValueError, IndexError):
                    continue # Bỏ qua các key không đúng định dạng
            return sorted(versions, key=lambda v: v.version)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching file versions: {str(e)}")

    async def delete_file(self, file_id: str, user_id: str, version: Optional[int] = None) -> bool:
        """Xóa file hoặc phiên bản cụ thể từ S3."""
        if S3_KEY_STYLE == "simple":
            raise HTTPException(status_code=501, detail="Deletion by file_id is not supported with 'simple' S3_KEY_STYLE.")
        
        prefix_base = f"users/{user_id}/files/{file_id}/"
        if version:
            prefix_to_delete = f"{prefix_base}v{version}/"
        else:
            prefix_to_delete = prefix_base

        try:
            objects_to_delete = self.s3_client.list_objects_v2(Bucket=self.bucket_name, Prefix=prefix_to_delete)
            if 'Contents' not in objects_to_delete:
                raise HTTPException(status_code=404, detail="File or version not found.")

            delete_keys = [{'Key': obj['Key']} for obj in objects_to_delete['Contents']]
            self.s3_client.delete_objects(Bucket=self.bucket_name, Delete={'Objects': delete_keys})
            return True
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting file: {str(e)}")

    def _get_latest_file_info(self, file_id: str, user_id: str) -> Optional[FileInfo]:
        """Helper để lấy thông tin phiên bản mới nhất của file từ S3."""
        if S3_KEY_STYLE == "simple": return None
        prefix = f"users/{user_id}/files/{file_id}/"
        try:
            response = self.s3_client.list_objects_v2(Bucket=self.bucket_name, Prefix=prefix)
            if 'Contents' not in response:
                return None

            latest_obj = max(response['Contents'], key=lambda obj: obj['LastModified'])
            return self._s3_object_to_fileinfo(latest_obj['Key'])
        except (ClientError, ValueError):
            return None

    async def _get_file_info(self, file_id: str, user_id: str, version: int) -> Optional[FileInfo]:
        """Helper để lấy thông tin của một phiên bản file cụ thể từ S3."""
        if S3_KEY_STYLE == "simple": return None
        prefix = f"users/{user_id}/files/{file_id}/v{version}/"
        try:
            response = self.s3_client.list_objects_v2(Bucket=self.bucket_name, Prefix=prefix, MaxKeys=1)
            if 'Contents' not in response or not response['Contents']:
                return None
            return self._s3_object_to_fileinfo(response['Contents'][0]['Key'])
        except ClientError:
            return None

    def _s3_object_to_fileinfo(self, s3_key: str) -> Optional[FileInfo]:
        """Chuyển đổi metadata từ S3 object thành đối tượng FileInfo."""
        try:
            obj_head = self.s3_client.head_object(Bucket=self.bucket_name, Key=s3_key)
            meta = obj_head.get('Metadata', {})
            
            # Lấy filename từ key nếu không có trong metadata
            filename = os.path.basename(s3_key)
            if 'original_filename_b64' in meta:
                try:
                    filename = base64.b64decode(meta['original_filename_b64']).decode('utf-8')
                except Exception:
                    pass # Giữ lại filename từ key nếu decode lỗi
            
            return FileInfo(
                file_id=meta.get('file_id', ''),
                filename=filename,
                file_size=obj_head.get('ContentLength'),
                file_type=FileType(meta.get('file_type', 'OTHER')),
                status=FileStatus.UNKNOWN, # Trạng thái scan không được lưu, cần quét lại nếu muốn
                version=int(meta.get('version', '0')),
                upload_time=datetime.fromisoformat(meta.get('upload_time')) if meta.get('upload_time') else obj_head.get('LastModified'),
                last_modified=obj_head.get('LastModified'),
                checksum=meta.get('checksum', ''),
                s3_key=s3_key
            )
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                return None
            raise

    async def list_s3_files(self, prefix: str = "", max_keys: int = 1000, 
                           continuation_token: Optional[str] = None) -> dict:
        """
        Lấy danh sách files từ S3 bucket.
        """
        try:
            if not is_s3_enabled():
                return {"files": [], "is_truncated": False, "next_continuation_token": None}
            
            # Tạo S3 client mới để đảm bảo sử dụng config mới nhất
            from config import S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION, S3_ADDRESSING_STYLE, S3_BUCKET
            import boto3
            from botocore.client import Config
            
            s3_client = boto3.client(
                "s3",
                endpoint_url=S3_ENDPOINT,
                aws_access_key_id=S3_ACCESS_KEY_ID,
                aws_secret_access_key=S3_SECRET_ACCESS_KEY,
                region_name=S3_REGION,
                config=Config(signature_version="s3v4", s3={"addressing_style": S3_ADDRESSING_STYLE}),
            )
            
            # Debug logging
            logger.info(f"[S3_LIST_DEBUG] Using bucket: {S3_BUCKET}, endpoint: {S3_ENDPOINT}")
            
            list_params = {
                'Bucket': S3_BUCKET,
                'MaxKeys': max_keys
            }
            
            if prefix:
                list_params['Prefix'] = prefix
            if continuation_token:
                list_params['ContinuationToken'] = continuation_token
            
            response = s3_client.list_objects_v2(**list_params)
            
            files = []
            for obj in response.get('Contents', []):
                file_info = {
                    'key': obj['Key'],
                    'size': obj['Size'],
                    'last_modified': obj['LastModified'].isoformat(),
                    'etag': obj['ETag'].strip('"'),
                    'storage_class': obj.get('StorageClass', 'STANDARD')
                }
                
                # Thêm URL cho file
                try:
                    if S3_PUBLIC_BUCKET:
                        file_info['url'] = build_public_url(obj['Key'])
                    else:
                        file_info['url'] = get_presigned_get_url(obj['Key'], expires_in_seconds=3600)
                except Exception as url_error:
                    logger.warning(f"[URL_GENERATION_FAILED] Could not generate URL for {obj['Key']}: {url_error}")
                    file_info['url'] = None
                
                files.append(file_info)
            
            return {
                'files': files,
                'is_truncated': response.get('IsTruncated', False),
                'next_continuation_token': response.get('NextContinuationToken'),
                'total_count': len(files),
                'prefix': prefix
            }
            
        except Exception as e:
            logger.error(f"[LIST_S3_FILES_ERROR] {e}")
            return {"files": [], "is_truncated": False, "next_continuation_token": None, "error": str(e)}

    async def get_all_files_paginated(
        self, 
        page_number: int = 0, 
        page_size: int = 10, 
        sort_by: list = None, 
        sort_direction: list = None, 
        include_deleted: bool = False
    ) -> PaginatedResponse[FileResponseDto]:
        """
        Lấy danh sách files với pagination theo chuẩn contract service
        """
        try:
            # Validate sort parameters
            valid_sort_fields = ['filename', 'size', 'created_at', 'updated_at', 'content_type']
            if sort_by:
                for field in sort_by:
                    if field not in valid_sort_fields:
                        raise HTTPException(status_code=400, detail=f"Invalid sort field: {field}")
            
            # Get files from S3
            s3_result = await self.list_s3_files("", page_size * (page_number + 1))
            files = s3_result.get('files', [])
            
            # Apply sorting
            if sort_by and files:
                for i, field in enumerate(sort_by):
                    direction = sort_direction[i] if sort_direction and i < len(sort_direction) else 'asc'
                    reverse = direction.lower() == 'desc'
                    
                    if field == 'filename':
                        files.sort(key=lambda x: x.get('key', ''), reverse=reverse)
                    elif field == 'size':
                        files.sort(key=lambda x: x.get('size', 0), reverse=reverse)
                    elif field == 'created_at':
                        files.sort(key=lambda x: x.get('last_modified', ''), reverse=reverse)
            
            # Calculate pagination
            total_elements = len(files)
            total_pages = (total_elements + page_size - 1) // page_size
            start_idx = page_number * page_size
            end_idx = start_idx + page_size
            page_files = files[start_idx:end_idx]
            
            # Convert to FileResponseDto
            content = []
            for file_info in page_files:
                file_dto = FileResponseDto(
                    id=file_info.get('key', ''),
                    filename=file_info.get('key', ''),
                    original_filename=file_info.get('key', '').split('/')[-1],
                    content_type=file_info.get('content_type', 'application/octet-stream'),
                    size=file_info.get('size', 0),
                    status='ACTIVE',
                    file_type='DOCUMENT',
                    folder='/'.join(file_info.get('key', '').split('/')[:-1]) if '/' in file_info.get('key', '') else '',
                    version=1,
                    created_at=datetime.fromisoformat(file_info.get('last_modified', '').replace('Z', '+00:00')),
                    updated_at=datetime.fromisoformat(file_info.get('last_modified', '').replace('Z', '+00:00')),
                    s3_key=file_info.get('key', ''),
                    bucket=self.bucket_name,
                    url=file_info.get('url')
                )
                content.append(file_dto)
            
            # Build paginated response
            request_info = RequestInfo(
                page=page_number,
                size=page_size,
                sort_by=sort_by,
                sort_direction=sort_direction
            )
            
            result_info = ResultInfo(
                page=page_number,
                size=page_size,
                total_elements=total_elements,
                total_pages=total_pages,
                first=page_number == 0,
                last=page_number >= total_pages - 1,
                number_of_elements=len(page_files),
                empty=len(page_files) == 0
            )
            
            return PaginatedResponse(
                request=request_info,
                result=result_info,
                content=content
            )
            
        except Exception as e:
            logger.error(f"[GET_ALL_FILES_PAGINATED_FAILED] Error: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Error getting files: {e}")

    async def get_file_by_key(self, key: str) -> FileDetailResponseDto:
        """
        Lấy thông tin chi tiết file theo key
        """
        try:
            if not is_s3_enabled():
                raise HTTPException(status_code=503, detail="S3 service not enabled")
            
            # Get file info from S3
            try:
                response = self.s3_client.head_object(Bucket=self.bucket_name, Key=key)
            except ClientError as e:
                if e.response['Error']['Code'] == '404':
                    raise HTTPException(status_code=404, detail="File not found in S3")
                raise HTTPException(status_code=500, detail=f"S3 error: {e}")
            
            # Generate URL
            url = None
            try:
                if S3_PUBLIC_BUCKET:
                    url = build_public_url(key)
                else:
                    url = get_presigned_get_url(key, expires_in_seconds=3600)
            except Exception as url_error:
                logger.warning(f"[URL_GENERATION_FAILED] Could not generate URL for {key}: {url_error}")
            
            # Convert to FileDetailResponseDto
            file_dto = FileDetailResponseDto(
                id=key,
                filename=key,
                original_filename=key.split('/')[-1],
                content_type=response.get('ContentType', 'application/octet-stream'),
                size=response['ContentLength'],
                status='ACTIVE',
                file_type='DOCUMENT',
                folder='/'.join(key.split('/')[:-1]) if '/' in key else '',
                version=1,
                created_at=response['LastModified'],
                updated_at=response['LastModified'],
                s3_key=key,
                bucket=self.bucket_name,
                url=url,
                metadata=response.get('Metadata', {}),
                checksum=response['ETag'].strip('"'),
                access_count=0
            )
            
            return file_dto
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"[GET_FILE_BY_KEY_FAILED] Error getting file {key}: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Error getting file: {e}")