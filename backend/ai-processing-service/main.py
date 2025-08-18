from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from .routers import router
app = FastAPI(
    title="AI Processing Service",
    description="Các API AI/ML, OCR, trích xuất, phân loại, tóm tắt, phát hiện rủi ro, cung cấp cho các service khác. Tài liệu tiếng Việt.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "apiVersion": "v1",
            "statusCode": 500,
            "shortMessage": "Internal Server Error",
            "description": f"Lỗi hệ thống: {str(exc)}",
            "data": None,
            "path": str(request.url),
        },
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "apiVersion": "v1",
            "statusCode": 422,
            "shortMessage": "Validation Error",
            "description": str(exc),
            "data": exc.errors(),
            "path": str(request.url),
        },
    )

app.include_router(router)

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
