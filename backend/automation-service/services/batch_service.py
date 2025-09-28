import asyncio
import json
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import motor.motor_asyncio
import redis.asyncio as redis
from concurrent.futures import ThreadPoolExecutor, as_completed

from config import (
    get_mongodb_uri, get_mongodb_database, get_mongodb_collections,
    get_redis_url, get_redis_password, get_redis_db, get_batch_config
)
from schemas.batch_schemas import (
    BatchJobRequest, BatchJobResponse, BatchJobStatus, BatchJobType,
    BatchJobPriority, BatchProcessingRequest, BatchProcessingResponse
)
from services.ai_processing_service import AIProcessingService

class BatchService:
    def __init__(self):
        self.mongodb_uri = get_mongodb_uri()
        self.mongodb_db = get_mongodb_database()
        self.collections = get_mongodb_collections()
        self.redis_url = get_redis_url()
        self.redis_password = get_redis_password()
        self.redis_db = get_redis_db()
        self.batch_config = get_batch_config()
        
        # Initialize connections
        self.mongodb_client = None
        self.mongodb_db_instance = None
        self.redis_client = None
        self.executor = ThreadPoolExecutor(max_workers=self.batch_config["max_workers"])
        
    async def initialize(self):
        """Khởi tạo kết nối database và Redis"""
        try:
            # MongoDB connection
            self.mongodb_client = motor.motor_asyncio.AsyncIOMotorClient(self.mongodb_uri)
            self.mongodb_db_instance = self.mongodb_client[self.mongodb_db]
            
            # Redis connection
            redis_params = {"url": self.redis_url, "db": self.redis_db}
            if self.redis_password:
                redis_params["password"] = self.redis_password
            self.redis_client = redis.from_url(**redis_params)
            
            print("BatchService initialized successfully")
        except Exception as e:
            print(f"Error initializing BatchService: {e}")
            raise

    async def close(self):
        """Đóng kết nối"""
        if self.mongodb_client:
            self.mongodb_client.close()
        if self.redis_client:
            await self.redis_client.close()
        if self.executor:
            self.executor.shutdown(wait=True)

    async def create_batch_job(self, request: BatchJobRequest) -> BatchJobResponse:
        """Tạo batch job mới"""
        try:
            job_id = str(uuid.uuid4())
            now = datetime.now(timezone.utc)
            
            # Tạo job record
            job_data = {
                "id": job_id,
                "type": request.type,
                "name": request.name,
                "description": request.description,
                "status": BatchJobStatus.PENDING,
                "priority": request.priority,
                "progress": 0,
                "data": request.data,
                "result": None,
                "error_message": None,
                "created_at": now,
                "started_at": None,
                "completed_at": None,
                "failed_at": None,
                "retry_count": 0,
                "max_retries": request.max_retries,
                "timeout": request.timeout,
                "metadata": request.metadata or {}
            }
            
            # Lưu vào MongoDB
            await self.mongodb_db_instance[self.collections["batch_jobs"]].insert_one(job_data)
            
            # Thêm vào Redis queue nếu không có scheduled_at
            if not request.scheduled_at or request.scheduled_at <= now:
                await self._add_to_queue(job_id, request.priority)
            
            return BatchJobResponse(**job_data)
            
        except Exception as e:
            print(f"Error creating batch job: {e}")
            raise

    async def get_batch_job_status(self, job_id: str) -> BatchJobResponse:
        """Lấy trạng thái batch job"""
        try:
            job_doc = await self.mongodb_db_instance[self.collections["batch_jobs"]].find_one(
                {"id": job_id}
            )
            
            if not job_doc:
                raise ValueError(f"Batch job {job_id} not found")
            
            return BatchJobResponse(**job_doc)
            
        except Exception as e:
            print(f"Error getting batch job status: {e}")
            raise

    async def process_batch_job(self, job_id: str):
        """Xử lý batch job"""
        try:
            # Lấy job data
            job_doc = await self.mongodb_db_instance[self.collections["batch_jobs"]].find_one(
                {"id": job_id}
            )
            
            if not job_doc:
                raise ValueError(f"Batch job {job_id} not found")
            
            job = BatchJobResponse(**job_doc)
            
            # Cập nhật trạng thái thành RUNNING
            await self._update_job_status(
                job_id, 
                BatchJobStatus.RUNNING, 
                started_at=datetime.now(timezone.utc)
            )
            
            # Xử lý job theo loại
            result = await self._execute_job(job)
            
            # Cập nhật kết quả
            await self._update_job_status(
                job_id,
                BatchJobStatus.COMPLETED,
                progress=100,
                result=result,
                completed_at=datetime.now(timezone.utc)
            )
            
        except Exception as e:
            print(f"Error processing batch job {job_id}: {e}")
            
            # Cập nhật trạng thái lỗi
            await self._update_job_status(
                job_id,
                BatchJobStatus.FAILED,
                error_message=str(e),
                failed_at=datetime.now(timezone.utc)
            )
            raise

    async def _execute_job(self, job: BatchJobResponse) -> Dict[str, Any]:
        """Thực thi job theo loại"""
        if job.type == BatchJobType.AI_PROCESSING:
            return await self._execute_ai_processing_job(job)
        elif job.type == BatchJobType.NOTIFICATION_SEND:
            return await self._execute_notification_job(job)
        elif job.type == BatchJobType.FILE_PROCESSING:
            return await self._execute_file_processing_job(job)
        else:
            raise ValueError(f"Unsupported job type: {job.type}")

    async def _execute_ai_processing_job(self, job: BatchJobResponse) -> Dict[str, Any]:
        """Thực thi AI processing job"""
        try:
            files = job.data.get("files", [])
            processing_type = job.data.get("processing_type", "extract")
            options = job.data.get("options", {})
            
            results = []
            total_files = len(files)
            
            ai_service = AIProcessingService()
            
            for i, file_data in enumerate(files):
                try:
                    # Cập nhật tiến độ
                    progress = int((i / total_files) * 100)
                    await self._update_job_progress(job.id, progress, f"Processing {file_data.get('filename', 'unknown')}")
                    
                    # Xử lý file
                    if processing_type == "extract":
                        result = await self._extract_file_content(file_data, ai_service)
                    elif processing_type == "summarize":
                        result = await self._summarize_file_content(file_data, ai_service)
                    elif processing_type == "classify":
                        result = await self._classify_file_content(file_data, ai_service)
                    else:
                        raise ValueError(f"Unsupported processing type: {processing_type}")
                    
                    results.append({
                        "file_id": file_data.get("file_id"),
                        "filename": file_data.get("filename"),
                        "status": "success",
                        "result": result
                    })
                    
                except Exception as e:
                    results.append({
                        "file_id": file_data.get("file_id"),
                        "filename": file_data.get("filename"),
                        "status": "failed",
                        "error": str(e)
                    })
            
            return {
                "processing_type": processing_type,
                "total_files": total_files,
                "successful_files": len([r for r in results if r["status"] == "success"]),
                "failed_files": len([r for r in results if r["status"] == "failed"]),
                "results": results
            }
            
        except Exception as e:
            print(f"Error executing AI processing job: {e}")
            raise

    async def _execute_notification_job(self, job: BatchJobResponse) -> Dict[str, Any]:
        """Thực thi notification job"""
        try:
            notifications = job.data.get("notifications", [])
            results = []
            
            for notification_data in notifications:
                try:
                    # Gửi notification (implement based on your notification service)
                    # This is a placeholder - you would integrate with your notification service
                    result = {"status": "sent", "notification_id": str(uuid.uuid4())}
                    results.append(result)
                except Exception as e:
                    results.append({"status": "failed", "error": str(e)})
            
            return {
                "total_notifications": len(notifications),
                "successful_notifications": len([r for r in results if r["status"] == "sent"]),
                "failed_notifications": len([r for r in results if r["status"] == "failed"]),
                "results": results
            }
            
        except Exception as e:
            print(f"Error executing notification job: {e}")
            raise

    async def _execute_file_processing_job(self, job: BatchJobResponse) -> Dict[str, Any]:
        """Thực thi file processing job"""
        try:
            files = job.data.get("files", [])
            results = []
            
            for file_data in files:
                try:
                    # Xử lý file (implement based on your requirements)
                    result = {"status": "processed", "file_id": file_data.get("file_id")}
                    results.append(result)
                except Exception as e:
                    results.append({"status": "failed", "error": str(e)})
            
            return {
                "total_files": len(files),
                "successful_files": len([r for r in results if r["status"] == "processed"]),
                "failed_files": len([r for r in results if r["status"] == "failed"]),
                "results": results
            }
            
        except Exception as e:
            print(f"Error executing file processing job: {e}")
            raise

    async def _extract_file_content(self, file_data: Dict[str, Any], ai_service: AIProcessingService) -> Dict[str, Any]:
        """Extract nội dung file"""
        # Implement file extraction logic
        return {"extracted_text": "Sample extracted text"}

    async def _summarize_file_content(self, file_data: Dict[str, Any], ai_service: AIProcessingService) -> Dict[str, Any]:
        """Summarize nội dung file"""
        # Implement file summarization logic
        return {"summary": "Sample summary"}

    async def _classify_file_content(self, file_data: Dict[str, Any], ai_service: AIProcessingService) -> Dict[str, Any]:
        """Classify nội dung file"""
        # Implement file classification logic
        return {"classification": "contract", "confidence": 0.95}

    async def _add_to_queue(self, job_id: str, priority: BatchJobPriority):
        """Thêm job vào Redis queue"""
        try:
            queue_name = self.batch_config["queue_name"]
            priority_score = self._get_priority_score(priority)
            
            await self.redis_client.zadd(
                queue_name,
                {job_id: priority_score}
            )
            
        except Exception as e:
            print(f"Error adding job to queue: {e}")
            raise

    def _get_priority_score(self, priority: BatchJobPriority) -> int:
        """Chuyển đổi priority thành score cho Redis sorted set"""
        priority_scores = {
            BatchJobPriority.URGENT: 1,
            BatchJobPriority.HIGH: 2,
            BatchJobPriority.NORMAL: 3,
            BatchJobPriority.LOW: 4
        }
        return priority_scores.get(priority, 3)

    async def _update_job_status(
        self, 
        job_id: str, 
        status: BatchJobStatus,
        progress: Optional[int] = None,
        started_at: Optional[datetime] = None,
        completed_at: Optional[datetime] = None,
        failed_at: Optional[datetime] = None,
        result: Optional[Dict[str, Any]] = None,
        error_message: Optional[str] = None
    ):
        """Cập nhật trạng thái job"""
        update_data = {"status": status}
        if progress is not None:
            update_data["progress"] = progress
        if started_at:
            update_data["started_at"] = started_at
        if completed_at:
            update_data["completed_at"] = completed_at
        if failed_at:
            update_data["failed_at"] = failed_at
        if result:
            update_data["result"] = result
        if error_message:
            update_data["error_message"] = error_message
            
        await self.mongodb_db_instance[self.collections["batch_jobs"]].update_one(
            {"id": job_id},
            {"$set": update_data}
        )

    async def _update_job_progress(self, job_id: str, progress: int, current_item: str = None):
        """Cập nhật tiến độ job"""
        update_data = {"progress": progress}
        if current_item:
            update_data["current_item"] = current_item
            
        await self.mongodb_db_instance[self.collections["batch_jobs"]].update_one(
            {"id": job_id},
            {"$set": update_data}
        )

    async def get_batch_jobs(
        self,
        page: int = 1,
        limit: int = 10,
        job_type: Optional[BatchJobType] = None,
        status: Optional[BatchJobStatus] = None,
        priority: Optional[BatchJobPriority] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Lấy danh sách batch jobs"""
        try:
            # Build filter
            filter_dict = {}
            if job_type:
                filter_dict["type"] = job_type
            if status:
                filter_dict["status"] = status
            if priority:
                filter_dict["priority"] = priority
            if start_date or end_date:
                filter_dict["created_at"] = {}
                if start_date:
                    filter_dict["created_at"]["$gte"] = start_date
                if end_date:
                    filter_dict["created_at"]["$lte"] = end_date
            
            # Count total
            total = await self.mongodb_db_instance[self.collections["batch_jobs"]].count_documents(filter_dict)
            
            # Get jobs with pagination
            skip = (page - 1) * limit
            cursor = self.mongodb_db_instance[self.collections["batch_jobs"]].find(
                filter_dict
            ).sort("created_at", -1).skip(skip).limit(limit)
            
            jobs = []
            async for doc in cursor:
                jobs.append(BatchJobResponse(**doc))
            
            return {
                "jobs": jobs,
                "total": total,
                "page": page,
                "limit": limit,
                "total_pages": (total + limit - 1) // limit
            }
            
        except Exception as e:
            print(f"Error getting batch jobs: {e}")
            raise

    async def cancel_batch_job(self, job_id: str) -> bool:
        """Hủy batch job"""
        try:
            # Cập nhật trạng thái thành CANCELLED
            await self._update_job_status(
                job_id,
                BatchJobStatus.CANCELLED
            )
            
            # Xóa khỏi queue nếu có
            await self.redis_client.zrem(self.batch_config["queue_name"], job_id)
            
            return True
            
        except Exception as e:
            print(f"Error cancelling batch job: {e}")
            return False

    async def retry_batch_job(self, job_id: str) -> bool:
        """Retry batch job"""
        try:
            # Reset job status
            await self._update_job_status(
                job_id,
                BatchJobStatus.PENDING,
                progress=0,
                error_message=None,
                failed_at=None
            )
            
            # Thêm lại vào queue
            job_doc = await self.mongodb_db_instance[self.collections["batch_jobs"]].find_one(
                {"id": job_id}
            )
            
            if job_doc:
                await self._add_to_queue(job_id, BatchJobPriority(job_doc["priority"]))
            
            return True
            
        except Exception as e:
            print(f"Error retrying batch job: {e}")
            return False
