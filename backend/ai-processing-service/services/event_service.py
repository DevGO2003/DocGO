import asyncio
import json
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional, Callable
import motor.motor_asyncio
import redis.asyncio as redis

from config import (
    get_mongodb_uri, get_mongodb_database, get_mongodb_collections,
    get_redis_url, get_redis_password, get_redis_db, get_event_config
)
from schemas.event_schemas import (
    EventPayload, EventType, EventStatus, EventHandlerRequest,
    EventHandlerResponse, EventSubscriptionRequest, EventSubscriptionResponse,
    EventPublishRequest, EventPublishResponse, EventHistoryRequest,
    EventHistoryResponse, WebSocketEvent
)

class EventService:
    def __init__(self):
        self.mongodb_uri = get_mongodb_uri()
        self.mongodb_db = get_mongodb_database()
        self.collections = get_mongodb_collections()
        self.redis_url = get_redis_url()
        self.redis_password = get_redis_password()
        self.redis_db = get_redis_db()
        self.event_config = get_event_config()
        
        # Initialize connections
        self.mongodb_client = None
        self.mongodb_db_instance = None
        self.redis_client = None
        self.pubsub = None
        
        # Event handlers
        self.handlers: Dict[str, Callable] = {}
        self.subscriptions: Dict[str, str] = {}  # channel -> subscription_id
        
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
            
            # Create pubsub
            self.pubsub = self.redis_client.pubsub()
            
            print("EventService initialized successfully")
        except Exception as e:
            print(f"Error initializing EventService: {e}")
            raise

    async def close(self):
        """Đóng kết nối"""
        if self.pubsub:
            await self.pubsub.close()
        if self.mongodb_client:
            self.mongodb_client.close()
        if self.redis_client:
            await self.redis_client.close()

    async def publish_event(self, request: EventPublishRequest) -> EventPublishResponse:
        """Publish event lên Redis channel"""
        try:
            # Publish event
            await self.redis_client.publish(
                request.channel,
                json.dumps(request.event.model_dump(), default=str)
            )
            
            # Lưu event vào MongoDB để tracking
            await self._save_event(request.event)
            
            return EventPublishResponse(
                success=True,
                message=f"Event published to channel {request.channel}",
                published_at=datetime.now(timezone.utc)
            )
            
        except Exception as e:
            print(f"Error publishing event: {e}")
            return EventPublishResponse(
                success=False,
                message=f"Failed to publish event: {str(e)}",
                published_at=datetime.now(timezone.utc)
            )

    async def subscribe_to_events(self, request: EventSubscriptionRequest) -> EventSubscriptionResponse:
        """Subscribe to Redis channels"""
        try:
            subscription_id = str(uuid.uuid4())
            
            # Subscribe to channels
            for channel in request.channels:
                await self.pubsub.subscribe(channel)
                self.subscriptions[channel] = subscription_id
            
            # Start listening for events
            asyncio.create_task(self._listen_for_events(request.handler_type, request.auto_ack))
            
            return EventSubscriptionResponse(
                subscription_id=subscription_id,
                channels=request.channels,
                status="active",
                created_at=datetime.now(timezone.utc)
            )
            
        except Exception as e:
            print(f"Error subscribing to events: {e}")
            raise

    async def _listen_for_events(self, handler_type: str, auto_ack: bool = True):
        """Lắng nghe events từ Redis"""
        try:
            async for message in self.pubsub.listen():
                if message["type"] == "message":
                    try:
                        # Parse event
                        event_data = json.loads(message["data"])
                        event = EventPayload(**event_data)
                        
                        # Handle event
                        await self._handle_event(event, handler_type, auto_ack)
                        
                    except Exception as e:
                        print(f"Error processing event: {e}")
                        
        except Exception as e:
            print(f"Error listening for events: {e}")

    async def _handle_event(self, event: EventPayload, handler_type: str, auto_ack: bool = True):
        """Xử lý event"""
        try:
            # Tìm handler phù hợp
            handler = self.handlers.get(handler_type)
            if not handler:
                print(f"No handler found for type: {handler_type}")
                return
            
            # Tạo handler request
            handler_request = EventHandlerRequest(
                event=event,
                handler_type=handler_type,
                retry_count=0,
                max_retries=3
            )
            
            # Gọi handler
            response = await handler(handler_request)
            
            # Log kết quả
            print(f"Event {event.eventId} handled: {response.success}")
            
        except Exception as e:
            print(f"Error handling event {event.eventId}: {e}")

    def register_handler(self, handler_type: str, handler: Callable):
        """Đăng ký event handler"""
        self.handlers[handler_type] = handler
        print(f"Handler registered for type: {handler_type}")

    async def _save_event(self, event: EventPayload):
        """Lưu event vào MongoDB"""
        try:
            event_dict = event.model_dump()
            event_dict["_id"] = event.eventId
            event_dict["status"] = EventStatus.PENDING
            
            await self.mongodb_db_instance[self.collections["events"]].insert_one(event_dict)
            
        except Exception as e:
            print(f"Error saving event: {e}")

    async def get_event_history(
        self,
        page: int = 1,
        limit: int = 10,
        event_type: Optional[EventType] = None,
        source: Optional[str] = None,
        status: Optional[EventStatus] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> EventHistoryResponse:
        """Lấy lịch sử events"""
        try:
            # Build filter
            filter_dict = {}
            if event_type:
                filter_dict["eventType"] = event_type
            if source:
                filter_dict["source"] = source
            if status:
                filter_dict["status"] = status
            if start_date or end_date:
                filter_dict["timestamp"] = {}
                if start_date:
                    filter_dict["timestamp"]["$gte"] = start_date
                if end_date:
                    filter_dict["timestamp"]["$lte"] = end_date
            
            # Count total
            total = await self.mongodb_db_instance[self.collections["events"]].count_documents(filter_dict)
            
            # Get events with pagination
            skip = (page - 1) * limit
            cursor = self.mongodb_db_instance[self.collections["events"]].find(
                filter_dict
            ).sort("timestamp", -1).skip(skip).limit(limit)
            
            events = []
            async for doc in cursor:
                # Remove MongoDB _id field
                doc.pop("_id", None)
                events.append(EventPayload(**doc))
            
            return EventHistoryResponse(
                events=events,
                total=total,
                page=page,
                limit=limit,
                total_pages=(total + limit - 1) // limit
            )
            
        except Exception as e:
            print(f"Error getting event history: {e}")
            raise

    async def create_event(
        self,
        event_type: EventType,
        source: str,
        data: Dict[str, Any],
        correlation_id: Optional[str] = None,
        actor: Optional[Dict[str, Any]] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> EventPayload:
        """Tạo event mới"""
        try:
            event = EventPayload(
                eventVersion="v1",
                eventType=event_type,
                eventId=str(uuid.uuid4()),
                timestamp=datetime.now(timezone.utc),
                source=source,
                correlationId=correlation_id or str(uuid.uuid4()),
                actor=actor,
                data=data,
                metadata=metadata
            )
            
            return event
            
        except Exception as e:
            print(f"Error creating event: {e}")
            raise

    async def publish_websocket_event(
        self,
        event_type: str,
        data: Dict[str, Any],
        user_id: Optional[str] = None
    ):
        """Publish WebSocket event"""
        try:
            websocket_event = WebSocketEvent(
                event_type=event_type,
                data=data,
                timestamp=datetime.now(timezone.utc),
                user_id=user_id
            )
            
            # Publish to WebSocket channel
            await self.redis_client.publish(
                "websocket_events",
                json.dumps(websocket_event.model_dump(), default=str)
            )
            
        except Exception as e:
            print(f"Error publishing WebSocket event: {e}")

    async def handle_file_uploaded_event(self, request: EventHandlerRequest) -> EventHandlerResponse:
        """Handler cho file uploaded event"""
        try:
            event = request.event
            
            # Xử lý file uploaded
            print(f"Processing file uploaded event: {event.eventId}")
            
            # Có thể trigger AI processing ở đây
            # Ví dụ: gọi AI service để extract, classify, summarize
            
            return EventHandlerResponse(
                success=True,
                message="File uploaded event processed successfully",
                processed_at=datetime.now(timezone.utc),
                retry_count=request.retry_count
            )
            
        except Exception as e:
            print(f"Error handling file uploaded event: {e}")
            return EventHandlerResponse(
                success=False,
                message=f"Failed to process file uploaded event: {str(e)}",
                processed_at=datetime.now(timezone.utc),
                retry_count=request.retry_count
            )

    async def handle_ai_processing_completed_event(self, request: EventHandlerRequest) -> EventHandlerResponse:
        """Handler cho AI processing completed event"""
        try:
            event = request.event
            
            # Xử lý AI processing completed
            print(f"Processing AI completed event: {event.eventId}")
            
            # Có thể trigger notification ở đây
            # Ví dụ: gửi email thông báo kết quả AI processing
            
            return EventHandlerResponse(
                success=True,
                message="AI processing completed event processed successfully",
                processed_at=datetime.now(timezone.utc),
                retry_count=request.retry_count
            )
            
        except Exception as e:
            print(f"Error handling AI processing completed event: {e}")
            return EventHandlerResponse(
                success=False,
                message=f"Failed to process AI processing completed event: {str(e)}",
                processed_at=datetime.now(timezone.utc),
                retry_count=request.retry_count
            )

    async def handle_notification_sent_event(self, request: EventHandlerRequest) -> EventHandlerResponse:
        """Handler cho notification sent event"""
        try:
            event = request.event
            
            # Xử lý notification sent
            print(f"Processing notification sent event: {event.eventId}")
            
            # Có thể log notification status hoặc trigger follow-up actions
            
            return EventHandlerResponse(
                success=True,
                message="Notification sent event processed successfully",
                processed_at=datetime.now(timezone.utc),
                retry_count=request.retry_count
            )
            
        except Exception as e:
            print(f"Error handling notification sent event: {e}")
            return EventHandlerResponse(
                success=False,
                message=f"Failed to process notification sent event: {str(e)}",
                processed_at=datetime.now(timezone.utc),
                retry_count=request.retry_count
            )

    async def start_event_processing(self):
        """Bắt đầu xử lý events"""
        try:
            # Đăng ký các handlers
            self.register_handler("file_uploaded", self.handle_file_uploaded_event)
            self.register_handler("ai_processing_completed", self.handle_ai_processing_completed_event)
            self.register_handler("notification_sent", self.handle_notification_sent_event)
            
            # Subscribe to channels
            subscription_request = EventSubscriptionRequest(
                channels=list(self.event_config["channels"].values()),
                handler_type="default",
                auto_ack=True
            )
            
            await self.subscribe_to_events(subscription_request)
            
            print("Event processing started")
            
        except Exception as e:
            print(f"Error starting event processing: {e}")
            raise
