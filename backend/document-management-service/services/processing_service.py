from typing import List, Optional, Dict, Any, BinaryIO
from datetime import datetime
import uuid
import os
import asyncio
import tempfile
import zipfile
import rarfile
from pathlib import Path
import magic
from PIL import Image
import json

from config import get_files_collection, get_redis_client
from schemas.general_schemas import (
    FileProcessingRequest, FileProcessingResponse, FileConversionFormat
)
from services.file_service import FileStorageService

class FileProcessingService:
    """Service xử lý file"""
    
    def __init__(self):
        self.files_collection = get_files_collection()
        self.redis_client = get_redis_client()
        self.file_service = FileStorageService()
    
    async def convert_file(self, request: FileProcessingRequest, user_id: str) -> FileProcessingResponse:
        """Chuyển đổi định dạng file"""
        try:
            processing_id = str(uuid.uuid4())
            
            # Lưu trạng thái xử lý vào Redis
            await self.redis_client.setex(
                f"processing:{processing_id}",
                3600,  # 1 giờ
                json.dumps({
                    "status": "processing",
                    "file_id": request.file_id,
                    "processing_type": request.processing_type,
                    "target_format": request.target_format,
                    "created_at": datetime.utcnow().isoformat()
                })
            )
            
            # Lấy file gốc
            file_doc = await self.files_collection.find_one(
                {"file_id": request.file_id, "user_id": user_id}
            )
            
            if not file_doc:
                raise ValueError(f"File {request.file_id} not found")
            
            # Download file content
            file_content = await self.file_service.download_file(
                request.file_id, user_id, file_doc.get("version", 1)
            )
            
            # Xử lý chuyển đổi
            converted_content = await self._perform_conversion(
                file_content, file_doc["file_type"], request.target_format
            )
            
            # Upload file đã chuyển đổi
            converted_filename = f"{Path(file_doc['filename']).stem}.{request.target_format}"
            
            # Tạo UploadFile object giả lập
            from fastapi import UploadFile
            import io
            
            converted_file = UploadFile(
                filename=converted_filename,
                file=io.BytesIO(converted_content),
                size=len(converted_content)
            )
            
            # Upload file mới
            file_info = await self.file_service.upload_file(
                converted_file, user_id, f"converted/{request.file_id}"
            )
            
            # Cập nhật trạng thái hoàn thành
            await self.redis_client.setex(
                f"processing:{processing_id}",
                3600,
                json.dumps({
                    "status": "completed",
                    "file_id": request.file_id,
                    "processing_type": request.processing_type,
                    "target_format": request.target_format,
                    "result_file_id": file_info.file_id,
                    "created_at": datetime.utcnow().isoformat(),
                    "completed_at": datetime.utcnow().isoformat()
                })
            )
            
            return FileProcessingResponse(
                processing_id=processing_id,
                file_id=request.file_id,
                processing_type=request.processing_type,
                status="completed",
                result_file_id=file_info.file_id,
                message="File converted successfully",
                created_at=datetime.utcnow(),
                completed_at=datetime.utcnow()
            )
            
        except Exception as e:
            # Cập nhật trạng thái lỗi
            await self.redis_client.setex(
                f"processing:{processing_id}",
                3600,
                json.dumps({
                    "status": "failed",
                    "file_id": request.file_id,
                    "processing_type": request.processing_type,
                    "error": str(e),
                    "created_at": datetime.utcnow().isoformat()
                })
            )
            
            raise Exception(f"Error converting file: {str(e)}")
    
    async def compress_file(self, request: FileProcessingRequest, user_id: str) -> FileProcessingResponse:
        """Nén file"""
        try:
            processing_id = str(uuid.uuid4())
            compression_level = request.compression_level or 6
            
            # Lưu trạng thái xử lý
            await self.redis_client.setex(
                f"processing:{processing_id}",
                3600,
                json.dumps({
                    "status": "processing",
                    "file_id": request.file_id,
                    "processing_type": request.processing_type,
                    "compression_level": compression_level,
                    "created_at": datetime.utcnow().isoformat()
                })
            )
            
            # Lấy file gốc
            file_doc = await self.files_collection.find_one(
                {"file_id": request.file_id, "user_id": user_id}
            )
            
            if not file_doc:
                raise ValueError(f"File {request.file_id} not found")
            
            # Download file content
            file_content = await self.file_service.download_file(
                request.file_id, user_id, file_doc.get("version", 1)
            )
            
            # Nén file
            compressed_content = await self._perform_compression(
                file_content, file_doc["filename"], compression_level
            )
            
            # Upload file đã nén
            compressed_filename = f"{Path(file_doc['filename']).stem}.zip"
            
            from fastapi import UploadFile
            import io
            
            compressed_file = UploadFile(
                filename=compressed_filename,
                file=io.BytesIO(compressed_content),
                size=len(compressed_content)
            )
            
            # Upload file mới
            file_info = await self.file_service.upload_file(
                compressed_file, user_id, f"compressed/{request.file_id}"
            )
            
            # Cập nhật trạng thái hoàn thành
            await self.redis_client.setex(
                f"processing:{processing_id}",
                3600,
                json.dumps({
                    "status": "completed",
                    "file_id": request.file_id,
                    "processing_type": request.processing_type,
                    "compression_level": compression_level,
                    "result_file_id": file_info.file_id,
                    "created_at": datetime.utcnow().isoformat(),
                    "completed_at": datetime.utcnow().isoformat()
                })
            )
            
            return FileProcessingResponse(
                processing_id=processing_id,
                file_id=request.file_id,
                processing_type=request.processing_type,
                status="completed",
                result_file_id=file_info.file_id,
                message=f"File compressed with level {compression_level}",
                created_at=datetime.utcnow(),
                completed_at=datetime.utcnow()
            )
            
        except Exception as e:
            # Cập nhật trạng thái lỗi
            await self.redis_client.setex(
                f"processing:{processing_id}",
                3600,
                json.dumps({
                    "status": "failed",
                    "file_id": request.file_id,
                    "processing_type": request.processing_type,
                    "error": str(e),
                    "created_at": datetime.utcnow().isoformat()
                })
            )
            
            raise Exception(f"Error compressing file: {str(e)}")
    
    async def extract_file(self, request: FileProcessingRequest, user_id: str) -> FileProcessingResponse:
        """Giải nén file"""
        try:
            processing_id = str(uuid.uuid4())
            extract_path = request.extract_path or f"extracted/{request.file_id}"
            
            # Lưu trạng thái xử lý
            await self.redis_client.setex(
                f"processing:{processing_id}",
                3600,
                json.dumps({
                    "status": "processing",
                    "file_id": request.file_id,
                    "processing_type": request.processing_type,
                    "extract_path": extract_path,
                    "created_at": datetime.utcnow().isoformat()
                })
            )
            
            # Lấy file gốc
            file_doc = await self.files_collection.find_one(
                {"file_id": request.file_id, "user_id": user_id}
            )
            
            if not file_doc:
                raise ValueError(f"File {request.file_id} not found")
            
            # Download file content
            file_content = await self.file_service.download_file(
                request.file_id, user_id, file_doc.get("version", 1)
            )
            
            # Giải nén file
            extracted_files = await self._perform_extraction(
                file_content, file_doc["filename"]
            )
            
            # Upload các file đã giải nén
            result_file_ids = []
            for extracted_file in extracted_files:
                from fastapi import UploadFile
                import io
                
                upload_file = UploadFile(
                    filename=extracted_file["filename"],
                    file=io.BytesIO(extracted_file["content"]),
                    size=len(extracted_file["content"])
                )
                
                file_info = await self.file_service.upload_file(
                    upload_file, user_id, f"{extract_path}/{extracted_file['filename']}"
                )
                result_file_ids.append(file_info.file_id)
            
            # Cập nhật trạng thái hoàn thành
            await self.redis_client.setex(
                f"processing:{processing_id}",
                3600,
                json.dumps({
                    "status": "completed",
                    "file_id": request.file_id,
                    "processing_type": request.processing_type,
                    "extract_path": extract_path,
                    "result_file_ids": result_file_ids,
                    "created_at": datetime.utcnow().isoformat(),
                    "completed_at": datetime.utcnow().isoformat()
                })
            )
            
            return FileProcessingResponse(
                processing_id=processing_id,
                file_id=request.file_id,
                processing_type=request.processing_type,
                status="completed",
                result_file_id=result_file_ids[0] if result_file_ids else None,
                message=f"Extracted {len(extracted_files)} files",
                created_at=datetime.utcnow(),
                completed_at=datetime.utcnow()
            )
            
        except Exception as e:
            # Cập nhật trạng thái lỗi
            await self.redis_client.setex(
                f"processing:{processing_id}",
                3600,
                json.dumps({
                    "status": "failed",
                    "file_id": request.file_id,
                    "processing_type": request.processing_type,
                    "error": str(e),
                    "created_at": datetime.utcnow().isoformat()
                })
            )
            
            raise Exception(f"Error extracting file: {str(e)}")
    
    async def validate_file(self, file_id: str, user_id: str) -> Dict[str, Any]:
        """Kiểm tra tính hợp lệ file"""
        try:
            # Lấy file gốc
            file_doc = await self.files_collection.find_one(
                {"file_id": file_id, "user_id": user_id}
            )
            
            if not file_doc:
                raise ValueError(f"File {file_id} not found")
            
            # Download file content
            file_content = await self.file_service.download_file(
                file_id, user_id, file_doc.get("version", 1)
            )
            
            # Kiểm tra file
            validation_result = await self._perform_validation(file_content, file_doc)
            
            # Cập nhật kết quả validation vào MongoDB
            await self.files_collection.update_one(
                {"file_id": file_id, "user_id": user_id},
                {
                    "$set": {
                        "validation_result": validation_result,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            return validation_result
            
        except Exception as e:
            raise Exception(f"Error validating file: {str(e)}")
    
    async def get_file_metadata(self, file_id: str, user_id: str) -> Dict[str, Any]:
        """Lấy metadata chi tiết file"""
        try:
            # Lấy file gốc
            file_doc = await self.files_collection.find_one(
                {"file_id": file_id, "user_id": user_id}
            )
            
            if not file_doc:
                raise ValueError(f"File {file_id} not found")
            
            # Download file content
            file_content = await self.file_service.download_file(
                file_id, user_id, file_doc.get("version", 1)
            )
            
            # Phân tích metadata
            metadata = await self._analyze_metadata(file_content, file_doc)
            
            return metadata
            
        except Exception as e:
            raise Exception(f"Error getting file metadata: {str(e)}")
    
    async def _perform_conversion(self, file_content: bytes, source_type: str, target_format: str) -> bytes:
        """Thực hiện chuyển đổi file"""
        # Đây là implementation giả lập
        # Trong thực tế cần sử dụng các thư viện chuyển đổi file chuyên dụng
        
        if source_type.startswith("image/") and target_format in ["jpg", "png"]:
            # Chuyển đổi ảnh
            image = Image.open(io.BytesIO(file_content))
            output = io.BytesIO()
            
            if target_format == "jpg":
                image = image.convert("RGB")
                image.save(output, format="JPEG", quality=95)
            elif target_format == "png":
                image.save(output, format="PNG")
            
            return output.getvalue()
        
        # Với các loại file khác, trả về nội dung gốc
        return file_content
    
    async def _perform_compression(self, file_content: bytes, filename: str, level: int) -> bytes:
        """Thực hiện nén file"""
        output = io.BytesIO()
        
        with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED, compresslevel=level) as zip_file:
            zip_file.writestr(filename, file_content)
        
        return output.getvalue()
    
    async def _perform_extraction(self, file_content: bytes, filename: str) -> List[Dict[str, Any]]:
        """Thực hiện giải nén file"""
        extracted_files = []
        
        try:
            # Thử giải nén ZIP
            with zipfile.ZipFile(io.BytesIO(file_content)) as zip_file:
                for file_info in zip_file.filelist:
                    if not file_info.is_dir():
                        content = zip_file.read(file_info.filename)
                        extracted_files.append({
                            "filename": file_info.filename,
                            "content": content,
                            "size": len(content)
                        })
        except zipfile.BadZipFile:
            try:
                # Thử giải nén RAR
                with rarfile.RarFile(io.BytesIO(file_content)) as rar_file:
                    for file_info in rar_file.infolist():
                        if not file_info.is_dir():
                            content = rar_file.read(file_info.filename)
                            extracted_files.append({
                                "filename": file_info.filename,
                                "content": content,
                                "size": len(content)
                            })
            except rarfile.BadRarFile:
                raise ValueError("Unsupported archive format")
        
        return extracted_files
    
    async def _perform_validation(self, file_content: bytes, file_doc: Dict[str, Any]) -> Dict[str, Any]:
        """Thực hiện kiểm tra file"""
        validation_result = {
            "is_valid": True,
            "errors": [],
            "warnings": [],
            "file_type_detected": None,
            "file_size": len(file_content),
            "checksum": None
        }
        
        try:
            # Kiểm tra kích thước
            if len(file_content) == 0:
                validation_result["is_valid"] = False
                validation_result["errors"].append("File is empty")
            
            # Phát hiện loại file thực tế
            detected_type = magic.from_buffer(file_content, mime=True)
            validation_result["file_type_detected"] = detected_type
            
            # Kiểm tra tính nhất quán với content_type đã lưu
            if file_doc.get("content_type") and detected_type != file_doc["content_type"]:
                validation_result["warnings"].append(
                    f"File type mismatch: stored={file_doc['content_type']}, detected={detected_type}"
                )
            
            # Tính checksum
            import hashlib
            checksum = hashlib.md5(file_content).hexdigest()
            validation_result["checksum"] = checksum
            
            # Kiểm tra checksum với database
            if file_doc.get("checksum") and checksum != file_doc["checksum"]:
                validation_result["is_valid"] = False
                validation_result["errors"].append("Checksum mismatch")
            
        except Exception as e:
            validation_result["is_valid"] = False
            validation_result["errors"].append(f"Validation error: {str(e)}")
        
        return validation_result
    
    async def _analyze_metadata(self, file_content: bytes, file_doc: Dict[str, Any]) -> Dict[str, Any]:
        """Phân tích metadata file"""
        metadata = {
            "basic_info": {
                "filename": file_doc["filename"],
                "file_size": len(file_content),
                "content_type": file_doc.get("content_type", ""),
                "created_at": file_doc["created_at"],
                "updated_at": file_doc.get("updated_at", file_doc["created_at"])
            },
            "technical_info": {},
            "extracted_text": None,
            "image_info": None
        }
        
        try:
            # Phát hiện loại file
            detected_type = magic.from_buffer(file_content, mime=True)
            metadata["technical_info"]["detected_type"] = detected_type
            
            # Xử lý ảnh
            if detected_type.startswith("image/"):
                try:
                    image = Image.open(io.BytesIO(file_content))
                    metadata["image_info"] = {
                        "format": image.format,
                        "mode": image.mode,
                        "size": image.size,
                        "width": image.width,
                        "height": image.height
                    }
                except Exception as e:
                    metadata["image_info"] = {"error": str(e)}
            
            # Xử lý văn bản
            if detected_type.startswith("text/"):
                try:
                    text_content = file_content.decode('utf-8')
                    metadata["extracted_text"] = text_content[:1000]  # Chỉ lấy 1000 ký tự đầu
                except UnicodeDecodeError:
                    metadata["extracted_text"] = "Unable to decode as UTF-8"
            
        except Exception as e:
            metadata["technical_info"]["error"] = str(e)
        
        return metadata
