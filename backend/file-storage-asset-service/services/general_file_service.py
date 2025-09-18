from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import os
import json
import asyncio
from pathlib import Path

from config import get_files_collection, get_redis_client
from schemas.general_schemas import (
    GeneralFileRequest, GeneralFileResponse, FileSearchRequest,
    FileBackupRequest, FileBackupResponse, FileMetadataResponse
)
from services.file_service import FileStorageService

class GeneralFileService:
    """Service quản lý file tổng quát"""
    
    def __init__(self):
        self.files_collection = get_files_collection()
        self.redis_client = get_redis_client()
        self.file_service = FileStorageService()
    
    async def organize_file(self, file_id: str, folder_path: str, user_id: str) -> GeneralFileResponse:
        """Tổ chức file vào thư mục"""
        try:
            # Cập nhật thông tin file trong MongoDB
            result = await self.files_collection.update_one(
                {"file_id": file_id, "user_id": user_id},
                {
                    "$set": {
                        "folder_path": folder_path,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            if result.matched_count == 0:
                raise ValueError(f"File {file_id} not found")
            
            # Lấy thông tin file đã cập nhật
            file_doc = await self.files_collection.find_one(
                {"file_id": file_id, "user_id": user_id}
            )
            
            return GeneralFileResponse(
                file_id=file_doc["file_id"],
                filename=file_doc["filename"],
                folder_path=file_doc["folder_path"],
                file_url=file_doc.get("file_url", ""),
                is_public=file_doc.get("is_public", False),
                share_token=file_doc.get("share_token"),
                permissions=file_doc.get("permissions", {}),
                access_count=file_doc.get("access_count", 0),
                last_accessed=file_doc.get("last_accessed"),
                created_at=file_doc["created_at"],
                updated_at=file_doc["updated_at"]
            )
        except Exception as e:
            raise Exception(f"Error organizing file: {str(e)}")
    
    async def share_file(self, file_id: str, user_id: str, permissions: Dict[str, List[str]] = None) -> str:
        """Chia sẻ file với quyền truy cập"""
        try:
            share_token = str(uuid.uuid4())
            
            # Cập nhật thông tin chia sẻ
            await self.files_collection.update_one(
                {"file_id": file_id, "user_id": user_id},
                {
                    "$set": {
                        "share_token": share_token,
                        "permissions": permissions or {},
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            # Lưu token vào Redis với TTL 30 ngày
            await self.redis_client.setex(
                f"share_token:{share_token}",
                30 * 24 * 3600,  # 30 ngày
                json.dumps({
                    "file_id": file_id,
                    "user_id": user_id,
                    "permissions": permissions or {}
                })
            )
            
            return share_token
        except Exception as e:
            raise Exception(f"Error sharing file: {str(e)}")
    
    async def set_file_permissions(self, file_id: str, user_id: str, permissions: Dict[str, List[str]]) -> bool:
        """Thiết lập quyền truy cập file"""
        try:
            result = await self.files_collection.update_one(
                {"file_id": file_id, "user_id": user_id},
                {
                    "$set": {
                        "permissions": permissions,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            return result.modified_count > 0
        except Exception as e:
            raise Exception(f"Error setting permissions: {str(e)}")
    
    async def get_file_history(self, file_id: str, user_id: str) -> List[Dict[str, Any]]:
        """Lấy lịch sử thay đổi file"""
        try:
            # Lấy lịch sử từ Redis cache
            history_key = f"file_history:{file_id}:{user_id}"
            cached_history = await self.redis_client.get(history_key)
            
            if cached_history:
                return json.loads(cached_history)
            
            # Nếu không có cache, tạo lịch sử từ metadata
            file_doc = await self.files_collection.find_one(
                {"file_id": file_id, "user_id": user_id}
            )
            
            if not file_doc:
                return []
            
            history = [
                {
                    "action": "created",
                    "timestamp": file_doc["created_at"],
                    "user_id": file_doc.get("created_by", "unknown"),
                    "description": "File được tạo"
                }
            ]
            
            if file_doc.get("updated_at") != file_doc["created_at"]:
                history.append({
                    "action": "updated",
                    "timestamp": file_doc["updated_at"],
                    "user_id": file_doc.get("updated_by", "unknown"),
                    "description": "File được cập nhật"
                })
            
            # Cache lịch sử trong 1 giờ
            await self.redis_client.setex(
                history_key,
                3600,
                json.dumps(history, default=str)
            )
            
            return history
        except Exception as e:
            raise Exception(f"Error getting file history: {str(e)}")
    
    async def backup_files(self, request: FileBackupRequest, user_id: str) -> FileBackupResponse:
        """Sao lưu files"""
        try:
            backup_id = str(uuid.uuid4())
            backup_name = request.backup_name or f"backup_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
            
            # Lấy thông tin files
            files_info = []
            total_size = 0
            
            for file_id in request.file_ids:
                file_doc = await self.files_collection.find_one(
                    {"file_id": file_id, "user_id": user_id}
                )
                if file_doc:
                    files_info.append(file_doc)
                    total_size += file_doc.get("file_size", 0)
            
            # Tạo backup metadata
            backup_metadata = {
                "backup_id": backup_id,
                "backup_name": backup_name,
                "file_count": len(files_info),
                "backup_size": total_size,
                "files": files_info,
                "created_at": datetime.utcnow(),
                "created_by": user_id,
                "include_metadata": request.include_metadata,
                "compression": request.compression
            }
            
            # Lưu backup metadata vào MongoDB
            await self.files_collection.insert_one(backup_metadata)
            
            # Tạo backup URL (giả lập)
            backup_url = f"/api/v1/file-storage-service/backups/{backup_id}/download"
            
            return FileBackupResponse(
                backup_id=backup_id,
                backup_name=backup_name,
                file_count=len(files_info),
                backup_size=total_size,
                backup_url=backup_url,
                created_at=backup_metadata["created_at"],
                expires_at=datetime.utcnow().replace(day=datetime.utcnow().day + 30)  # 30 ngày
            )
        except Exception as e:
            raise Exception(f"Error creating backup: {str(e)}")
    
    async def search_files(self, request: FileSearchRequest, user_id: str, page: int = 0, size: int = 10) -> List[GeneralFileResponse]:
        """Tìm kiếm files"""
        try:
            # Xây dựng query MongoDB
            query = {"user_id": user_id}
            
            if request.query:
                query["$or"] = [
                    {"filename": {"$regex": request.query, "$options": "i"}},
                    {"description": {"$regex": request.query, "$options": "i"}}
                ]
            
            if request.file_type:
                query["file_type"] = request.file_type
            
            if request.created_from or request.created_to:
                date_query = {}
                if request.created_from:
                    date_query["$gte"] = request.created_from
                if request.created_to:
                    date_query["$lte"] = request.created_to
                query["created_at"] = date_query
            
            if request.size_min or request.size_max:
                size_query = {}
                if request.size_min:
                    size_query["$gte"] = request.size_min
                if request.size_max:
                    size_query["$lte"] = request.size_max
                query["file_size"] = size_query
            
            if request.tags:
                query["tags"] = {"$in": request.tags}
            
            if request.is_public is not None:
                query["is_public"] = request.is_public
            
            # Thực hiện tìm kiếm
            cursor = self.files_collection.find(query).skip(page * size).limit(size)
            files = await cursor.to_list(length=size)
            
            return [
                GeneralFileResponse(
                    file_id=file_doc["file_id"],
                    filename=file_doc["filename"],
                    folder_path=file_doc.get("folder_path", ""),
                    file_url=file_doc.get("file_url", ""),
                    is_public=file_doc.get("is_public", False),
                    share_token=file_doc.get("share_token"),
                    permissions=file_doc.get("permissions", {}),
                    access_count=file_doc.get("access_count", 0),
                    last_accessed=file_doc.get("last_accessed"),
                    created_at=file_doc["created_at"],
                    updated_at=file_doc["updated_at"]
                )
                for file_doc in files
            ]
        except Exception as e:
            raise Exception(f"Error searching files: {str(e)}")
    
    async def get_file_metadata(self, file_id: str, user_id: str) -> FileMetadataResponse:
        """Lấy metadata file"""
        try:
            file_doc = await self.files_collection.find_one(
                {"file_id": file_id, "user_id": user_id}
            )
            
            if not file_doc:
                raise ValueError(f"File {file_id} not found")
            
            # Kiểm tra tính hợp lệ file
            is_valid = True
            validation_errors = []
            
            if not file_doc.get("file_size") or file_doc["file_size"] <= 0:
                is_valid = False
                validation_errors.append("Invalid file size")
            
            if not file_doc.get("content_type"):
                is_valid = False
                validation_errors.append("Missing content type")
            
            return FileMetadataResponse(
                file_id=file_doc["file_id"],
                filename=file_doc["filename"],
                file_size=file_doc.get("file_size", 0),
                content_type=file_doc.get("content_type", ""),
                file_extension=file_doc.get("file_extension", ""),
                checksum=file_doc.get("checksum", ""),
                created_at=file_doc["created_at"],
                modified_at=file_doc.get("updated_at", file_doc["created_at"]),
                is_valid=is_valid,
                validation_errors=validation_errors
            )
        except Exception as e:
            raise Exception(f"Error getting file metadata: {str(e)}")
    
    async def track_file_access(self, file_id: str, user_id: str, accessor_id: str):
        """Theo dõi truy cập file"""
        try:
            # Cập nhật access count và last accessed
            await self.files_collection.update_one(
                {"file_id": file_id, "user_id": user_id},
                {
                    "$inc": {"access_count": 1},
                    "$set": {
                        "last_accessed": datetime.utcnow(),
                        "last_accessor": accessor_id
                    }
                }
            )
            
            # Log access vào Redis
            access_log = {
                "file_id": file_id,
                "user_id": user_id,
                "accessor_id": accessor_id,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            await self.redis_client.lpush(
                f"file_access_log:{file_id}",
                json.dumps(access_log)
            )
            
            # Giữ tối đa 1000 log entries
            await self.redis_client.ltrim(f"file_access_log:{file_id}", 0, 999)
            
        except Exception as e:
            # Log access tracking không quan trọng, chỉ log lỗi
            print(f"Warning: Error tracking file access: {str(e)}")
