from fastapi import FastAPI
import uvicorn

app = FastAPI(
    title="Automation Service",
    description="Một dịch vụ tự động hóa nghiệp vụ với tích hợp thanh toán, promotion, notification, batch processing và event handling.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

@app.get("/", tags=["🏠 API Gốc"])
async def read_root():
    return {"message": "Automation Service is running!"}

@app.get("/health", tags=["🏠 API Gốc"])
async def health_check():
    from schemas.response import RestResponse
    
    return RestResponse(
        statusCode=200,
        shortMessage="Success",
        description="Service đang hoạt động bình thường",
        data={
            "status": "healthy",
            "service": "Automation Service",
            "version": "2.0.0"
        },
        path="/health"
    )

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8017)


