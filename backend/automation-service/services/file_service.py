"""
File Storage Service for Automation Service
Converted from Document Management Service implementation
"""

import os
import uuid
import hashlib
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import UploadFile, HTTPException
from schemas.file_schemas import (
    FileUploadResponse, 
    FileDownloadResponse, 
    FileListResponse, 
    FileMetadata,
    FileDetailsResponse
)


class FileStorageService:
    """File storage service implementation"""
    
    def __init__(self):
        self.upload_directory = os.getenv("UPLOAD_DIR", "uploads")
        self.s3_enabled = os.getenv("S3_ENABLED", "false").lower() == "true"
        self.s3_bucket = os.getenv("S3_BUCKET", "devgo2003-docgo-bucket")
        self.s3_endpoint = os.getenv("S3_ENDPOINT", "https://s3.filebase.com")
        self.s3_region = os.getenv("S3_REGION", "us-east-1")
        self.s3_access_key = os.getenv("S3_ACCESS_KEY_ID", "")
        self.s3_secret_key = os.getenv("S3_SECRET_ACCESS_KEY", "")
        self.base_url = os.getenv("BASE_URL", "http://localhost:8003")
        self.max_file_size = int(os.getenv("MAX_FILE_SIZE", "104857600"))  # 100MB default
        
        # Ensure upload directory exists
        os.makedirs(self.upload_directory, exist_ok=True)
    
    def upload_file(self, file: UploadFile, folder: Optional[str] = None, user_id: Optional[str] = None) -> FileUploadResponse:
        """Upload file to storage"""
        try:
            # Generate unique file ID
            file_id = str(uuid.uuid4())
            
            # Read file content
            file_content = file.file.read()
            file.file.seek(0)  # Reset file pointer
            
            # Calculate file size
            file_size = len(file_content)
            
            # Check file size limit
            if file_size > self.max_file_size:
                raise HTTPException(status_code=400, detail=f"File quá lớn. Kích thước tối đa: {self.max_file_size} bytes")
            
            # Generate S3 key
            s3_key = self._generate_s3_key(file_id, file.filename, folder, user_id)
            
            if self.s3_enabled and self.s3_access_key and self.s3_secret_key:
                # Upload to S3 (Filebase)
                try:
                    import boto3
                    s3_client = boto3.client(
                        's3',
                        endpoint_url=self.s3_endpoint,
                        region_name=self.s3_region,
                        aws_access_key_id=self.s3_access_key,
                        aws_secret_access_key=self.s3_secret_key
                    )
                    
                    # Upload to S3
                    s3_client.put_object(
                        Bucket=self.s3_bucket,
                        Key=s3_key,
                        Body=file_content,
                        ContentType=file.content_type or "application/octet-stream"
                    )
                    
                    # Generate presigned URL for download
                    file_url = s3_client.generate_presigned_url(
                        'get_object',
                        Params={'Bucket': self.s3_bucket, 'Key': s3_key},
                        ExpiresIn=3600  # 1 hour
                    )
                    
                    status = "uploaded_to_s3"
                    message = "File đã được upload lên S3 thành công"
                    
                except Exception as s3_error:
                    # Fallback to local storage if S3 fails
                    local_path = os.path.join(self.upload_directory, file.filename)
                    with open(local_path, "wb") as f:
                        f.write(file_content)
                    
                    file_url = f"{self.base_url}/api/v1/automation-service/files/{file_id}/download"
                    status = "uploaded_local_fallback"
                    message = f"Upload S3 thất bại, đã lưu local: {str(s3_error)}"
            else:
                # Upload to local storage
                local_path = os.path.join(self.upload_directory, file.filename)
                with open(local_path, "wb") as f:
                    f.write(file_content)
                
                file_url = f"{self.base_url}/api/v1/automation-service/files/{file_id}/download"
                status = "uploaded_local"
                message = "File đã được upload local thành công"
            
            return FileUploadResponse(
                file_id=file_id,
                filename=file.filename,
                file_size=file_size,
                file_type=file.content_type or "application/octet-stream",
                status=status,
                upload_time=datetime.now(),
                message=message,
                s3_key=s3_key,
                bucket=self.s3_bucket,
                file_url=file_url
            )
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Lỗi upload file: {str(e)}")
    
    def download_file(self, file_id: str, user_id: Optional[str] = None, version: Optional[int] = None) -> FileDownloadResponse:
        """Download file from storage"""
        try:
            if self.s3_enabled and self.s3_access_key and self.s3_secret_key:
                # Download from S3 (Filebase)
                try:
                    import boto3
                    s3_client = boto3.client(
                        's3',
                        endpoint_url=self.s3_endpoint,
                        region_name=self.s3_region,
                        aws_access_key_id=self.s3_access_key,
                        aws_secret_access_key=self.s3_secret_key
                    )
                    
                    # Try to find the file by listing objects with file_id prefix
                    # First try with file_id directly (most common)
                    response = s3_client.list_objects_v2(
                        Bucket=self.s3_bucket,
                        Prefix=file_id
                    )
                    
                    # If not found, try with documents folder
                    if 'Contents' not in response or not response['Contents']:
                        response = s3_client.list_objects_v2(
                            Bucket=self.s3_bucket,
                            Prefix=f"documents/{file_id}"
                        )
                    
                    # If still not found, try with automation-service prefix
                    if 'Contents' not in response or not response['Contents']:
                        response = s3_client.list_objects_v2(
                            Bucket=self.s3_bucket,
                            Prefix=f"automation-service/{user_id if user_id else 'public'}/{file_id}"
                        )
                    
                    if 'Contents' not in response or not response['Contents']:
                        raise HTTPException(status_code=404, detail="File không tìm thấy trên S3")
                    
                    # Get the first matching object
                    s3_object = response['Contents'][0]
                    s3_key = s3_object['Key']
                    
                    # Download the file
                    file_obj = s3_client.get_object(Bucket=self.s3_bucket, Key=s3_key)
                    file_content = file_obj['Body'].read()
                    
                    # Extract filename from S3 key
                    filename = s3_key.split('/')[-1]
                    content_type = file_obj.get('ContentType', 'application/octet-stream')
                    
                    return FileDownloadResponse(
                        filename=filename,
                        content_type=content_type,
                        file_content=file_content,
                        file_size=len(file_content)
                    )
                    
                except Exception as s3_error:
                    # Fallback to local storage
                    local_path = os.path.join(self.upload_directory, f"{file_id}_*")
                    import glob
                    matching_files = glob.glob(local_path)
                    
                    if matching_files:
                        local_file = matching_files[0]
                        with open(local_file, "rb") as f:
                            file_content = f.read()
                        
                        filename = os.path.basename(local_file)
                        return FileDownloadResponse(
                            filename=filename,
                            content_type="application/octet-stream",
                            file_content=file_content,
                            file_size=len(file_content)
                        )
                    else:
                        raise HTTPException(status_code=404, detail=f"File không tìm thấy: {str(s3_error)}")
            else:
                # Download from local storage
                local_path = os.path.join(self.upload_directory, f"{file_id}_*")
                import glob
                matching_files = glob.glob(local_path)
                
                if matching_files:
                    local_file = matching_files[0]
                    with open(local_file, "rb") as f:
                        file_content = f.read()
                    
                    filename = os.path.basename(local_file)
                    return FileDownloadResponse(
                        filename=filename,
                        content_type="application/octet-stream",
                        file_content=file_content,
                        file_size=len(file_content)
                    )
                else:
                    raise HTTPException(status_code=404, detail="File không tìm thấy trong local storage")
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Lỗi download file: {str(e)}")
    
    def get_all_files(self, page_number: int = 0, page_size: int = 10, 
                     sort_by: Optional[List[str]] = None, 
                     sort_direction: Optional[List[str]] = None, 
                     include_deleted: bool = False) -> FileListResponse:
        """Get all files with pagination"""
        try:
            if self.s3_enabled and self.s3_access_key and self.s3_secret_key:
                # List files from S3 (Filebase)
                try:
                    import boto3
                    s3_client = boto3.client(
                        's3',
                        endpoint_url=self.s3_endpoint,
                        region_name=self.s3_region,
                        aws_access_key_id=self.s3_access_key,
                        aws_secret_access_key=self.s3_secret_key
                    )
                    
                    # List all objects in the bucket
                    response = s3_client.list_objects_v2(Bucket=self.s3_bucket)
                    
                    files = []
                    if 'Contents' in response:
                        for obj in response['Contents']:
                            # Extract file_id from S3 key (assuming format: user_id/file_id_filename)
                            key_parts = obj['Key'].split('/')
                            if len(key_parts) >= 2:
                                file_id = key_parts[1].split('_')[0] if '_' in key_parts[1] else key_parts[1]
                                filename = key_parts[1]
                                uploaded_by = key_parts[0]
                            else:
                                file_id = obj['Key']
                                filename = obj['Key']
                                uploaded_by = "unknown"
                            
                            files.append(FileMetadata(
                                file_id=file_id,
                                filename=filename,
                                s3_key=obj['Key'],
                                bucket=self.s3_bucket,
                                file_size=obj['Size'],
                                file_type=obj.get('ContentType', 'application/octet-stream'),
                                status="uploaded",
                                upload_time=obj['LastModified'],
                                uploaded_by=uploaded_by,
                                metadata={"source": "s3"}
                            ))
                    
                    # Apply pagination
                    start_index = page_number * page_size
                    end_index = start_index + page_size
                    paginated_files = files[start_index:end_index]
                    
                    return FileListResponse(
                        files=paginated_files,
                        total_elements=len(files),
                        total_pages=(len(files) + page_size - 1) // page_size,
                        current_page=page_number,
                        page_size=page_size
                    )
                    
                except Exception as s3_error:
                    # Fallback to local storage
                    import glob
                    local_files = glob.glob(os.path.join(self.upload_directory, "*"))
                    
                    files = []
                    for local_file in local_files:
                        if os.path.isfile(local_file):
                            filename = os.path.basename(local_file)
                            file_id = filename.split('_')[0] if '_' in filename else filename
                            
                            files.append(FileMetadata(
                                file_id=file_id,
                                filename=filename,
                                s3_key=None,
                                bucket=None,
                                file_size=os.path.getsize(local_file),
                                file_type="application/octet-stream",
                                status="uploaded_local",
                                upload_time=datetime.fromtimestamp(os.path.getmtime(local_file)),
                                uploaded_by="system",
                                metadata={"source": "local", "error": str(s3_error)}
                            ))
                    
                    # Apply pagination
                    start_index = page_number * page_size
                    end_index = start_index + page_size
                    paginated_files = files[start_index:end_index]
                    
                    return FileListResponse(
                        files=paginated_files,
                        total_elements=len(files),
                        total_pages=(len(files) + page_size - 1) // page_size,
                        current_page=page_number,
                        page_size=page_size
                    )
            else:
                # List files from local storage
                import glob
                local_files = glob.glob(os.path.join(self.upload_directory, "*"))
                
                files = []
                for local_file in local_files:
                    if os.path.isfile(local_file):
                        filename = os.path.basename(local_file)
                        file_id = filename.split('_')[0] if '_' in filename else filename
                        
                        files.append(FileMetadata(
                            file_id=file_id,
                            filename=filename,
                            s3_key=None,
                            bucket=None,
                            file_size=os.path.getsize(local_file),
                            file_type="application/octet-stream",
                            status="uploaded_local",
                            upload_time=datetime.fromtimestamp(os.path.getmtime(local_file)),
                            uploaded_by="system",
                            metadata={"source": "local"}
                        ))
                
                # Apply pagination
                start_index = page_number * page_size
                end_index = start_index + page_size
                paginated_files = files[start_index:end_index]
                
                return FileListResponse(
                    files=paginated_files,
                    total_elements=len(files),
                    total_pages=(len(files) + page_size - 1) // page_size,
                    current_page=page_number,
                    page_size=page_size
                )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Lỗi lấy danh sách files: {str(e)}")
    
    def get_file_details(self, file_id: str) -> Dict[str, Any]:
        """Get file details"""
        try:
            # For now, we'll return mock data
            # In real implementation, you would query from database
            
            return {
                "file_id": file_id,
                "filename": f"file_{file_id}.txt",
                "file_size": 1024,
                "file_type": "text/plain",
                "status": "uploaded",
                "upload_time": datetime.now().isoformat(),
                "uploaded_by": "system",
                "s3_key": f"mock/s3/key/{file_id}",
                "bucket": self.s3_bucket,
                "file_url": f"{self.base_url}/api/v1/automation-service/files/{file_id}/download",
                "checksum": hashlib.md5(file_id.encode()).hexdigest(),
                "access_count": 0,
                "metadata": {
                    "description": "Mock file for testing",
                    "version": "1.0"
                }
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Lỗi lấy thông tin file: {str(e)}")
    
    def delete_file(self, file_id: str, user_id: Optional[str] = None, version: Optional[int] = None) -> bool:
        """Delete file or specific version"""
        try:
            # For now, we'll simulate file deletion
            # In real implementation, you would delete from S3 and database
            
            return True
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Lỗi xóa file: {str(e)}")
    
    def _generate_s3_key(self, file_id: str, filename: str, folder: Optional[str] = None, user_id: Optional[str] = None) -> str:
        """Generate S3 key for file storage"""
        # Create folder structure: {folder or documents}/{file_id}_{filename}
        # Use 'documents' as default folder to match existing S3 structure
        folder_path = folder or "documents"
        return f"{folder_path}/{file_id}_{filename}"
    
    def _calculate_checksum(self, content: bytes) -> str:
        """Calculate MD5 checksum for file content"""
        return hashlib.md5(content).hexdigest()
