import smtplib
import asyncio
import json
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import aiohttp
import motor.motor_asyncio
import redis.asyncio as redis
from twilio.rest import Client as TwilioClient
from twilio.base.exceptions import TwilioException

from config import (
    get_mongodb_uri, get_mongodb_database, get_mongodb_collections,
    get_redis_url, get_redis_password, get_redis_db,
    get_smtp_config, get_twilio_config, get_websocket_config
)
from schemas.notification_schemas import (
    NotificationRequest, NotificationResponse, NotificationType,
    NotificationStatus, NotificationPriority, NotificationTemplate,
    EmailNotificationRequest, SMSNotificationRequest, PushNotificationRequest,
    WebSocketNotificationRequest
)

class NotificationService:
    def __init__(self):
        self.mongodb_uri = get_mongodb_uri()
        self.mongodb_db = get_mongodb_database()
        self.collections = get_mongodb_collections()
        self.redis_url = get_redis_url()
        self.redis_password = get_redis_password()
        self.redis_db = get_redis_db()
        self.smtp_config = get_smtp_config()
        self.twilio_config = get_twilio_config()
        self.websocket_config = get_websocket_config()
        
        # Initialize connections
        self.mongodb_client = None
        self.mongodb_db_instance = None
        self.redis_client = None
        self.twilio_client = None
        
    async def initialize(self):
        """Khởi tạo kết nối database và external services"""
        try:
            # MongoDB connection
            self.mongodb_client = motor.motor_asyncio.AsyncIOMotorClient(self.mongodb_uri)
            self.mongodb_db_instance = self.mongodb_client[self.mongodb_db]
            
            # Redis connection
            redis_params = {"url": self.redis_url, "db": self.redis_db}
            if self.redis_password:
                redis_params["password"] = self.redis_password
            self.redis_client = redis.from_url(**redis_params)
            
            # Twilio client
            if self.twilio_config["account_sid"] and self.twilio_config["auth_token"]:
                self.twilio_client = TwilioClient(
                    self.twilio_config["account_sid"],
                    self.twilio_config["auth_token"]
                )
            
            print("NotificationService initialized successfully")
        except Exception as e:
            print(f"Error initializing NotificationService: {e}")
            raise

    async def close(self):
        """Đóng kết nối"""
        if self.mongodb_client:
            self.mongodb_client.close()
        if self.redis_client:
            await self.redis_client.close()

    async def send_notification(self, request: NotificationRequest) -> NotificationResponse:
        """Gửi notification theo loại"""
        notification_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)
        
        # Tạo notification record
        notification_data = {
            "id": notification_id,
            "type": request.type,
            "recipients": request.recipients,
            "subject": request.subject,
            "content": request.content,
            "status": NotificationStatus.PENDING,
            "priority": request.priority,
            "created_at": now,
            "metadata": request.metadata or {}
        }
        
        try:
            # Lưu vào MongoDB
            await self.mongodb_db_instance[self.collections["notifications"]].insert_one(notification_data)
            
            # Gửi notification theo loại
            if request.type == NotificationType.EMAIL:
                await self._send_email(request, notification_id)
            elif request.type == NotificationType.SMS:
                await self._send_sms(request, notification_id)
            elif request.type == NotificationType.PUSH:
                await self._send_push(request, notification_id)
            elif request.type == NotificationType.WEBSOCKET:
                await self._send_websocket(request, notification_id)
            
            # Cập nhật trạng thái thành công
            await self._update_notification_status(
                notification_id, 
                NotificationStatus.SENT, 
                sent_at=datetime.now(timezone.utc)
            )
            
            return NotificationResponse(
                id=notification_id,
                type=request.type,
                recipients=request.recipients,
                subject=request.subject,
                content=request.content,
                status=NotificationStatus.SENT,
                priority=request.priority,
                created_at=now,
                sent_at=datetime.now(timezone.utc)
            )
            
        except Exception as e:
            # Cập nhật trạng thái lỗi
            await self._update_notification_status(
                notification_id, 
                NotificationStatus.FAILED, 
                error_message=str(e),
                failed_at=datetime.now(timezone.utc)
            )
            raise

    async def _send_email(self, request: NotificationRequest, notification_id: str):
        """Gửi email notification"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.smtp_config["username"]
            msg['To'] = ", ".join(request.recipients)
            msg['Subject'] = request.subject or "Notification"
            
            # Thêm nội dung
            msg.attach(MIMEText(request.content, 'plain', 'utf-8'))
            
            # Gửi email
            with smtplib.SMTP(self.smtp_config["host"], self.smtp_config["port"]) as server:
                if self.smtp_config["use_tls"]:
                    server.starttls()
                server.login(self.smtp_config["username"], self.smtp_config["password"])
                server.send_message(msg)
                
        except Exception as e:
            print(f"Error sending email: {e}")
            raise

    async def _send_sms(self, request: NotificationRequest, notification_id: str):
        """Gửi SMS notification"""
        if not self.twilio_client:
            raise Exception("Twilio client not configured")
        
        try:
            for recipient in request.recipients:
                message = self.twilio_client.messages.create(
                    body=request.content,
                    from_=self.twilio_config["phone_number"],
                    to=recipient
                )
                print(f"SMS sent to {recipient}: {message.sid}")
                
        except TwilioException as e:
            print(f"Error sending SMS: {e}")
            raise

    async def _send_push(self, request: NotificationRequest, notification_id: str):
        """Gửi push notification"""
        # Implement push notification logic here
        # This would typically integrate with FCM, APNS, or similar service
        print(f"Push notification sent to {len(request.recipients)} recipients")
        pass

    async def _send_websocket(self, request: NotificationRequest, notification_id: str):
        """Gửi WebSocket notification"""
        try:
            # Publish to Redis channel for WebSocket server to pick up
            websocket_data = {
                "notification_id": notification_id,
                "recipients": request.recipients,
                "event": "notification",
                "data": {
                    "subject": request.subject,
                    "content": request.content,
                    "metadata": request.metadata
                },
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            
            await self.redis_client.publish(
                "websocket_notifications", 
                json.dumps(websocket_data)
            )
            
        except Exception as e:
            print(f"Error sending WebSocket notification: {e}")
            raise

    async def _update_notification_status(
        self, 
        notification_id: str, 
        status: NotificationStatus,
        sent_at: Optional[datetime] = None,
        failed_at: Optional[datetime] = None,
        error_message: Optional[str] = None
    ):
        """Cập nhật trạng thái notification"""
        update_data = {"status": status}
        if sent_at:
            update_data["sent_at"] = sent_at
        if failed_at:
            update_data["failed_at"] = failed_at
        if error_message:
            update_data["error_message"] = error_message
            
        await self.mongodb_db_instance[self.collections["notifications"]].update_one(
            {"id": notification_id},
            {"$set": update_data}
        )

    async def get_notification_history(
        self, 
        page: int = 1, 
        limit: int = 10,
        notification_type: Optional[NotificationType] = None,
        status: Optional[NotificationStatus] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Lấy lịch sử notification"""
        try:
            # Build filter
            filter_dict = {}
            if notification_type:
                filter_dict["type"] = notification_type
            if status:
                filter_dict["status"] = status
            if start_date or end_date:
                filter_dict["created_at"] = {}
                if start_date:
                    filter_dict["created_at"]["$gte"] = start_date
                if end_date:
                    filter_dict["created_at"]["$lte"] = end_date
            
            # Count total
            total = await self.mongodb_db_instance[self.collections["notifications"]].count_documents(filter_dict)
            
            # Get notifications with pagination
            skip = (page - 1) * limit
            cursor = self.mongodb_db_instance[self.collections["notifications"]].find(
                filter_dict
            ).sort("created_at", -1).skip(skip).limit(limit)
            
            notifications = []
            async for doc in cursor:
                notifications.append(NotificationResponse(**doc))
            
            return {
                "notifications": notifications,
                "total": total,
                "page": page,
                "limit": limit,
                "total_pages": (total + limit - 1) // limit
            }
            
        except Exception as e:
            print(f"Error getting notification history: {e}")
            raise

    async def create_notification_template(self, template: NotificationTemplate) -> NotificationTemplate:
        """Tạo notification template"""
        try:
            template.id = str(uuid.uuid4())
            template.created_at = datetime.now(timezone.utc)
            template.updated_at = template.created_at
            
            template_dict = template.model_dump()
            await self.mongodb_db_instance[self.collections["notification_templates"]].insert_one(template_dict)
            
            return template
            
        except Exception as e:
            print(f"Error creating notification template: {e}")
            raise

    async def get_notification_templates(self) -> List[NotificationTemplate]:
        """Lấy danh sách notification templates"""
        try:
            cursor = self.mongodb_db_instance[self.collections["notification_templates"]].find(
                {"is_active": True}
            ).sort("created_at", -1)
            
            templates = []
            async for doc in cursor:
                templates.append(NotificationTemplate(**doc))
            
            return templates
            
        except Exception as e:
            print(f"Error getting notification templates: {e}")
            raise

    async def send_bulk_notifications(self, requests: List[NotificationRequest]) -> List[NotificationResponse]:
        """Gửi nhiều notification cùng lúc"""
        results = []
        
        for request in requests:
            try:
                result = await self.send_notification(request)
                results.append(result)
            except Exception as e:
                # Tạo error response
                error_response = NotificationResponse(
                    id=str(uuid.uuid4()),
                    type=request.type,
                    recipients=request.recipients,
                    subject=request.subject,
                    content=request.content,
                    status=NotificationStatus.FAILED,
                    priority=request.priority,
                    created_at=datetime.now(timezone.utc),
                    failed_at=datetime.now(timezone.utc),
                    error_message=str(e)
                )
                results.append(error_response)
        
        return results
