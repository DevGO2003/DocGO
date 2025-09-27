from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from fastapi.openapi.utils import get_openapi
from starlette.middleware.base import BaseHTTPMiddleware
import routers
import os
import asyncio
from datetime import datetime
import uuid
from kafka_worker import worker
# from services.notification_service import NotificationService
from services.batch_service import BatchService
from services.event_service import EventService

app = FastAPI(
    title="AI Processing Service",
    description="Một dịch vụ xử lý tài liệu sử dụng AI với tích hợp notification, batch processing và event handling.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_version="3.0.3"
)

# Actor/Correlation middleware per MDC 06
class ActorCorrelationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Correlation ID
        correlation_id = request.headers.get("X-Correlation-Id") or str(uuid.uuid4())
        # Actor detection with sensible defaults
        actor = request.headers.get("X-Actor")
        if not actor:
            # Try to derive from gateway headers/user context if any in the future
            actor = "system"

        # Attach to request.state for downstream usage
        request.state.correlation_id = correlation_id
        request.state.actor = actor

        response = await call_next(request)
        # Propagate headers back for traceability
        response.headers["X-Correlation-Id"] = correlation_id
        response.headers["X-Actor"] = actor
        return response

# Register middleware early
app.add_middleware(ActorCorrelationMiddleware)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routers.router)

# Initialize services
# notification_service = NotificationService()
batch_service = BatchService()
event_service = EventService()

# Custom OpenAPI schema để đảm bảo tương thích với Swagger UI
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
        openapi_version="3.0.3"
    )
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

@app.get("/", tags=["Root"])
async def read_root():
    """
    Root endpoint - tự động redirect sang /docs để hiển thị API documentation
    """
    return RedirectResponse(url="/docs", status_code=302)

@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint - kiểm tra trạng thái service
    """
    return {
        "status": "healthy",
        "service": "AI Processing Service",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "ai_model": "Gemini 2.0 Flash",
        "supported_formats": ["docx", "pdf", "txt"]
    }

@app.on_event("startup")
async def on_startup():
    try:
        # Initialize all services
        # await notification_service.initialize()
        await batch_service.initialize()
        await event_service.initialize()
        
        # Start event processing
        await event_service.start_event_processing()
        
        # Start Kafka worker
        await worker.start()
        
        print("AI Processing Service started successfully with all integrations")
    except Exception as e:
        print(f"Error during startup: {e}")
        # Không chặn service nếu một số service không sẵn sàng
        pass

@app.on_event("shutdown")
async def on_shutdown():
    try:
        # Stop all services
        # await notification_service.close()
        await batch_service.close()
        await event_service.close()
        await worker.stop()
        
        print("AI Processing Service shutdown completed")
    except Exception as e:
        print(f"Error during shutdown: {e}")
        pass

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    """
    Validation error handler - trả về HTTP 200 với statusCode 400 trong RestResponse format
    """
    from schemas.response import ErrorResponse
    
    error_details = []
    for error in exc.errors():
        error_details.append(f"{'.'.join(str(loc) for loc in error['loc'])}: {error['msg']}")
    
    error_response = ErrorResponse(
        statusCode=400,
        shortMessage="Bad Request",
        description="Dữ liệu đầu vào không hợp lệ",
        error="; ".join(error_details),
        path=str(request.url),
        timestamp=datetime.now(),
        requestId=str(uuid.uuid4())
    )
    
    return JSONResponse(
        status_code=200,  # Luôn trả về HTTP 200
        content=error_response.model_dump(mode='json')
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """
    Custom HTTP exception handler - trả về HTTP 200 với statusCode tương ứng trong RestResponse format
    """
    from schemas.response import ErrorResponse
    
    # Map HTTP status codes to statusCode trong RestResponse
    status_code_mapping = {
        400: 400,  # Bad Request
        401: 401,  # Unauthorized
        403: 403,  # Forbidden
        404: 404,  # Not Found
        409: 409,  # Conflict
        422: 422,  # Unprocessable Entity
        500: 500   # Internal Server Error
    }
    
    mapped_status_code = status_code_mapping.get(exc.status_code, 500)
    
    error_response = ErrorResponse(
        statusCode=mapped_status_code,
        shortMessage="Error",
        description=f"HTTP {exc.status_code}: {exc.detail}",
        error=exc.detail,
        path=str(request.url),
        timestamp=datetime.now(),
        requestId=str(uuid.uuid4())
    )
    
    return JSONResponse(
        status_code=200,  # Luôn trả về HTTP 200
        content=error_response.model_dump(mode='json')
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """
    General exception handler - trả về HTTP 200 với statusCode 500 trong RestResponse format
    """
    from schemas.response import ErrorResponse
    
    error_response = ErrorResponse(
        statusCode=500,
        shortMessage="Internal Server Error",
        description="Lỗi không lường trước xảy ra trong quá trình xử lý",
        error=str(exc),
        path=str(request.url),
        timestamp=datetime.now(),
        requestId=str(uuid.uuid4())
    )
    
    return JSONResponse(
        status_code=200,  # Luôn trả về HTTP 200
        content=error_response.model_dump(mode='json')
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)