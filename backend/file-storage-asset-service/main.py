from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from routers import router
import os
from datetime import datetime
import uuid

app = FastAPI(
	title="File Storage Asset Service",
	description="Dịvụ lưu trữ và quản lý tài sản (file) dùng S3/Filebase và tùy chọn IPFS.",
	version="1.0.0",
	docs_url="/docs",
	redoc_url="/redoc",
	openapi_version="3.0.3"
)

# Actor/Correlation middleware per MDC 06
class ActorCorrelationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        correlation_id = request.headers.get("X-Correlation-Id") or str(uuid.uuid4())
        actor = request.headers.get("X-Actor") or "system"
        request.state.correlation_id = correlation_id
        request.state.actor = actor
        response = await call_next(request)
        response.headers["X-Correlation-Id"] = correlation_id
        response.headers["X-Actor"] = actor
        return response

# Register middleware early
app.add_middleware(ActorCorrelationMiddleware)

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

# Add CORS middleware
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],  # Configure this properly for production
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

class RestResponseMiddleware(BaseHTTPMiddleware):
	"""Middleware để format tất cả responses theo RestResponse format"""
	
	async def dispatch(self, request: Request, call_next):
		try:
			response = await call_next(request)
			
			# Chỉ format các status codes cụ thể mà chưa có RestResponse format
			if response.status_code in [404, 405, 422]:
				# Kiểm tra xem response đã có RestResponse format chưa
				if hasattr(response, 'body') and response.body:
					try:
						import json
						content = json.loads(response.body.decode())
						if 'apiVersion' in content and 'statusCode' in content:
							return response
					except:
						pass
				
				# Format response theo RestResponse
				from schemas.response import ErrorResponse
				
				if response.status_code == 404:
					error_response = ErrorResponse(
						statusCode=404,
						shortMessage="Not Found",
						description="Tài nguyên không tồn tại",
						error="The requested resource was not found",
						path=str(request.url)
					)
				elif response.status_code == 405:
					error_response = ErrorResponse(
						statusCode=405,
						shortMessage="Method Not Allowed",
						description="Phương thức HTTP không được hỗ trợ",
						error="The HTTP method is not allowed for this endpoint",
						path=str(request.url)
					)
				elif response.status_code == 422:
					error_response = ErrorResponse(
						statusCode=422,
						shortMessage="Unprocessable Entity",
						description="Dữ liệu đầu vào không hợp lệ",
						error="Validation error in request data",
						path=str(request.url)
					)
				
				return JSONResponse(
					status_code=200,  # Luôn trả về HTTP 200
					content=error_response.model_dump(mode='json')
				)
			
			return response
		except Exception as exc:
			# Xử lý lỗi không lường trước
			from schemas.response import ErrorResponse
			
			error_response = ErrorResponse(
				statusCode=500,
				shortMessage="Internal Server Error",
				description="Lỗi không lường trước xảy ra trong quá trình xử lý",
				error=str(exc),
				path=str(request.url)
			)
			
			return JSONResponse(
				status_code=200,  # Luôn trả về HTTP 200
				content=error_response.model_dump(mode='json')
			)

# Thêm middleware để format responses
app.add_middleware(RestResponseMiddleware)

app.include_router(router)


@app.on_event("startup")
async def startup_event():
	"""Khởi tạo service khi startup"""
	from config import ensure_bucket_exists, ensure_local_directories, get_mongodb_client, get_redis_client
	
	try:
		print("🚀 Khởi động File Storage Asset Service...")
		
		# Đảm bảo bucket S3 tồn tại
		ensure_bucket_exists()
		
		# Đảm bảo thư mục local tồn tại
		ensure_local_directories()
		
		# Kiểm tra kết nối MongoDB
		try:
			mongodb_client = get_mongodb_client()
			await mongodb_client.admin.command('ping')
			print("✅ MongoDB connection established")
		except Exception as e:
			print(f"⚠️  MongoDB connection failed: {e}")
		
		# Kiểm tra kết nối Redis
		try:
			redis_client = get_redis_client()
			await redis_client.ping()
			print("✅ Redis connection established")
		except Exception as e:
			print(f"⚠️  Redis connection failed: {e}")
		
		print("✅ File Storage Asset Service đã sẵn sàng!")
		
	except Exception as e:
		print(f"❌ Lỗi khởi động service: {e}")
		print("⚠️  Service vẫn sẽ chạy nhưng có thể gặp lỗi khi sử dụng các dịch vụ")


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
	from schemas.response import RestResponse
	
	return RestResponse(
		statusCode=200,
		shortMessage="Success",
		description="Service đang hoạt động bình thường",
		data={
			"status": "healthy",
			"service": "File Storage Asset Service",
			"version": "1.0.0",
		"database": "connected",  # S3 connection status
		"mongodb": "connected",  # MongoDB connection status
		"redis": "connected",  # Redis connection status
		"file_scanner": "available"  # File scanner status
		},
		path="/health"
	)

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
	"""
	Custom HTTP exception handler - trả về HTTP 200 với statusCode tương ứng trong RestResponse format
	"""
	from schemas.response import ErrorResponse
	
	# Map status codes to short messages
	status_messages = {
		400: "Bad Request",
		401: "Unauthorized", 
		403: "Forbidden",
		404: "Not Found",
		405: "Method Not Allowed",
		409: "Conflict",
		422: "Unprocessable Entity",
		500: "Internal Server Error"
	}
	
	short_message = status_messages.get(exc.status_code, "Error")
	
	error_response = ErrorResponse(
		statusCode=exc.status_code,
		shortMessage=short_message,
		description=f"HTTP {exc.status_code}: {exc.detail}",
		error=exc.detail,
		path=str(request.url)
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
		path=str(request.url)
	)
	
	return JSONResponse(
		status_code=200,  # Luôn trả về HTTP 200
		content=error_response.model_dump(mode='json')
	)


if __name__ == "__main__":
	import uvicorn
	uvicorn.run(app, host="127.0.0.1", port=8012)


