from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from config import get_assets_collection, get_files_collection, get_redis_client
from schemas.general_schemas import (
    AssetCreateRequest, AssetUpdateRequest, AssetResponse, AssetCategory, AssetStatus
)
from services.file_service import FileStorageService

class AssetService:
    """Service quản lý asset"""
    
    def __init__(self):
        self.assets_collection = get_assets_collection()
        self.files_collection = get_files_collection()
        self.redis_client = get_redis_client()
        self.file_service = FileStorageService()
    
    async def create_asset(self, request: AssetCreateRequest, user_id: str) -> AssetResponse:
        """Tạo asset mới"""
        try:
            # Kiểm tra file tồn tại
            file_doc = await self.files_collection.find_one(
                {"file_id": request.file_id, "user_id": user_id}
            )
            
            if not file_doc:
                raise ValueError(f"File {request.file_id} not found")
            
            # Tạo asset ID
            asset_id = str(uuid.uuid4())
            
            # Tạo file URL
            file_url = None
            try:
                from config import get_presigned_get_url, build_public_url, S3_PUBLIC_BUCKET
                if S3_PUBLIC_BUCKET:
                    file_url = build_public_url(file_doc["s3_key"])
                else:
                    file_url = get_presigned_get_url(file_doc["s3_key"], expires_in_seconds=3600)
            except Exception as e:
                print(f"Warning: Could not generate file URL: {e}")
            
            # Tạo asset document
            asset_doc = {
                "asset_id": asset_id,
                "name": request.name,
                "description": request.description,
                "category": request.category,
                "file_id": request.file_id,
                "file_url": file_url,
                "tags": request.tags or [],
                "metadata": request.metadata or {},
                "status": AssetStatus.ACTIVE,
                "version": 1,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "created_by": user_id,
                "updated_by": user_id
            }
            
            # Lưu vào MongoDB
            await self.assets_collection.insert_one(asset_doc)
            
            # Cache asset trong Redis
            await self.redis_client.setex(
                f"asset:{asset_id}",
                3600,  # 1 giờ
                str(asset_doc)
            )
            
            return AssetResponse(
                asset_id=asset_doc["asset_id"],
                name=asset_doc["name"],
                description=asset_doc["description"],
                category=asset_doc["category"],
                file_id=asset_doc["file_id"],
                file_url=asset_doc["file_url"],
                tags=asset_doc["tags"],
                metadata=asset_doc["metadata"],
                status=asset_doc["status"],
                version=asset_doc["version"],
                created_at=asset_doc["created_at"],
                updated_at=asset_doc["updated_at"],
                created_by=asset_doc["created_by"],
                updated_by=asset_doc["updated_by"]
            )
            
        except Exception as e:
            raise Exception(f"Error creating asset: {str(e)}")
    
    async def get_asset(self, asset_id: str, user_id: str) -> AssetResponse:
        """Lấy thông tin asset"""
        try:
            # Kiểm tra cache Redis trước
            cached_asset = await self.redis_client.get(f"asset:{asset_id}")
            if cached_asset:
                asset_doc = eval(cached_asset)  # Chuyển đổi từ string
            else:
                # Lấy từ MongoDB
                asset_doc = await self.assets_collection.find_one(
                    {"asset_id": asset_id, "created_by": user_id}
                )
                
                if not asset_doc:
                    raise ValueError(f"Asset {asset_id} not found")
                
                # Cache trong Redis
                await self.redis_client.setex(
                    f"asset:{asset_id}",
                    3600,
                    str(asset_doc)
                )
            
            return AssetResponse(
                asset_id=asset_doc["asset_id"],
                name=asset_doc["name"],
                description=asset_doc["description"],
                category=asset_doc["category"],
                file_id=asset_doc["file_id"],
                file_url=asset_doc["file_url"],
                tags=asset_doc["tags"],
                metadata=asset_doc["metadata"],
                status=asset_doc["status"],
                version=asset_doc["version"],
                created_at=asset_doc["created_at"],
                updated_at=asset_doc["updated_at"],
                created_by=asset_doc["created_by"],
                updated_by=asset_doc["updated_by"]
            )
            
        except Exception as e:
            raise Exception(f"Error getting asset: {str(e)}")
    
    async def update_asset(self, asset_id: str, request: AssetUpdateRequest, user_id: str) -> AssetResponse:
        """Cập nhật asset"""
        try:
            # Kiểm tra asset tồn tại
            existing_asset = await self.assets_collection.find_one(
                {"asset_id": asset_id, "created_by": user_id}
            )
            
            if not existing_asset:
                raise ValueError(f"Asset {asset_id} not found")
            
            # Tạo update document
            update_doc = {
                "updated_at": datetime.utcnow(),
                "updated_by": user_id,
                "version": existing_asset["version"] + 1
            }
            
            if request.name is not None:
                update_doc["name"] = request.name
            if request.description is not None:
                update_doc["description"] = request.description
            if request.category is not None:
                update_doc["category"] = request.category
            if request.tags is not None:
                update_doc["tags"] = request.tags
            if request.metadata is not None:
                update_doc["metadata"] = request.metadata
            if request.status is not None:
                update_doc["status"] = request.status
            
            # Cập nhật trong MongoDB
            await self.assets_collection.update_one(
                {"asset_id": asset_id, "created_by": user_id},
                {"$set": update_doc}
            )
            
            # Xóa cache Redis
            await self.redis_client.delete(f"asset:{asset_id}")
            
            # Lấy asset đã cập nhật
            updated_asset = await self.assets_collection.find_one(
                {"asset_id": asset_id, "created_by": user_id}
            )
            
            return AssetResponse(
                asset_id=updated_asset["asset_id"],
                name=updated_asset["name"],
                description=updated_asset["description"],
                category=updated_asset["category"],
                file_id=updated_asset["file_id"],
                file_url=updated_asset["file_url"],
                tags=updated_asset["tags"],
                metadata=updated_asset["metadata"],
                status=updated_asset["status"],
                version=updated_asset["version"],
                created_at=updated_asset["created_at"],
                updated_at=updated_asset["updated_at"],
                created_by=updated_asset["created_by"],
                updated_by=updated_asset["updated_by"]
            )
            
        except Exception as e:
            raise Exception(f"Error updating asset: {str(e)}")
    
    async def delete_asset(self, asset_id: str, user_id: str) -> bool:
        """Xóa asset (soft delete)"""
        try:
            # Cập nhật trạng thái thành DELETED
            result = await self.assets_collection.update_one(
                {"asset_id": asset_id, "created_by": user_id},
                {
                    "$set": {
                        "status": AssetStatus.DELETED,
                        "updated_at": datetime.utcnow(),
                        "updated_by": user_id
                    }
                }
            )
            
            if result.modified_count == 0:
                raise ValueError(f"Asset {asset_id} not found")
            
            # Xóa cache Redis
            await self.redis_client.delete(f"asset:{asset_id}")
            
            return True
            
        except Exception as e:
            raise Exception(f"Error deleting asset: {str(e)}")
    
    async def list_assets(self, user_id: str, page: int = 0, size: int = 10, 
                         category: Optional[AssetCategory] = None,
                         status: Optional[AssetStatus] = None,
                         search: Optional[str] = None) -> List[AssetResponse]:
        """Lấy danh sách assets"""
        try:
            # Xây dựng query
            query = {"created_by": user_id}
            
            if category:
                query["category"] = category
            if status:
                query["status"] = status
            if search:
                query["$or"] = [
                    {"name": {"$regex": search, "$options": "i"}},
                    {"description": {"$regex": search, "$options": "i"}},
                    {"tags": {"$in": [search]}}
                ]
            
            # Lấy assets
            cursor = self.assets_collection.find(query).skip(page * size).limit(size)
            assets = await cursor.to_list(length=size)
            
            return [
                AssetResponse(
                    asset_id=asset_doc["asset_id"],
                    name=asset_doc["name"],
                    description=asset_doc["description"],
                    category=asset_doc["category"],
                    file_id=asset_doc["file_id"],
                    file_url=asset_doc["file_url"],
                    tags=asset_doc["tags"],
                    metadata=asset_doc["metadata"],
                    status=asset_doc["status"],
                    version=asset_doc["version"],
                    created_at=asset_doc["created_at"],
                    updated_at=asset_doc["updated_at"],
                    created_by=asset_doc["created_by"],
                    updated_by=asset_doc["updated_by"]
                )
                for asset_doc in assets
            ]
            
        except Exception as e:
            raise Exception(f"Error listing assets: {str(e)}")
    
    async def search_assets(self, user_id: str, query: str, category: Optional[AssetCategory] = None) -> List[AssetResponse]:
        """Tìm kiếm assets"""
        try:
            search_query = {
                "created_by": user_id,
                "$or": [
                    {"name": {"$regex": query, "$options": "i"}},
                    {"description": {"$regex": query, "$options": "i"}},
                    {"tags": {"$in": [query]}}
                ]
            }
            
            if category:
                search_query["category"] = category
            
            cursor = self.assets_collection.find(search_query)
            assets = await cursor.to_list(length=100)  # Giới hạn 100 kết quả
            
            return [
                AssetResponse(
                    asset_id=asset_doc["asset_id"],
                    name=asset_doc["name"],
                    description=asset_doc["description"],
                    category=asset_doc["category"],
                    file_id=asset_doc["file_id"],
                    file_url=asset_doc["file_url"],
                    tags=asset_doc["tags"],
                    metadata=asset_doc["metadata"],
                    status=asset_doc["status"],
                    version=asset_doc["version"],
                    created_at=asset_doc["created_at"],
                    updated_at=asset_doc["updated_at"],
                    created_by=asset_doc["created_by"],
                    updated_by=asset_doc["updated_by"]
                )
                for asset_doc in assets
            ]
            
        except Exception as e:
            raise Exception(f"Error searching assets: {str(e)}")
    
    async def get_asset_versions(self, asset_id: str, user_id: str) -> List[AssetResponse]:
        """Lấy danh sách phiên bản asset"""
        try:
            # Tìm tất cả phiên bản của asset
            cursor = self.assets_collection.find(
                {"asset_id": asset_id, "created_by": user_id}
            ).sort("version", -1)
            
            assets = await cursor.to_list(length=100)
            
            return [
                AssetResponse(
                    asset_id=asset_doc["asset_id"],
                    name=asset_doc["name"],
                    description=asset_doc["description"],
                    category=asset_doc["category"],
                    file_id=asset_doc["file_id"],
                    file_url=asset_doc["file_url"],
                    tags=asset_doc["tags"],
                    metadata=asset_doc["metadata"],
                    status=asset_doc["status"],
                    version=asset_doc["version"],
                    created_at=asset_doc["created_at"],
                    updated_at=asset_doc["updated_at"],
                    created_by=asset_doc["created_by"],
                    updated_by=asset_doc["updated_by"]
                )
                for asset_doc in assets
            ]
            
        except Exception as e:
            raise Exception(f"Error getting asset versions: {str(e)}")
    
    async def restore_asset(self, asset_id: str, user_id: str) -> AssetResponse:
        """Khôi phục asset đã xóa"""
        try:
            # Cập nhật trạng thái thành ACTIVE
            result = await self.assets_collection.update_one(
                {"asset_id": asset_id, "created_by": user_id, "status": AssetStatus.DELETED},
                {
                    "$set": {
                        "status": AssetStatus.ACTIVE,
                        "updated_at": datetime.utcnow(),
                        "updated_by": user_id
                    }
                }
            )
            
            if result.modified_count == 0:
                raise ValueError(f"Asset {asset_id} not found or not deleted")
            
            # Lấy asset đã khôi phục
            restored_asset = await self.assets_collection.find_one(
                {"asset_id": asset_id, "created_by": user_id}
            )
            
            return AssetResponse(
                asset_id=restored_asset["asset_id"],
                name=restored_asset["name"],
                description=restored_asset["description"],
                category=restored_asset["category"],
                file_id=restored_asset["file_id"],
                file_url=restored_asset["file_url"],
                tags=restored_asset["tags"],
                metadata=restored_asset["metadata"],
                status=restored_asset["status"],
                version=restored_asset["version"],
                created_at=restored_asset["created_at"],
                updated_at=restored_asset["updated_at"],
                created_by=restored_asset["created_by"],
                updated_by=restored_asset["updated_by"]
            )
            
        except Exception as e:
            raise Exception(f"Error restoring asset: {str(e)}")
