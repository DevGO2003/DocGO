from fastapi import FastAPI
import uvicorn

app = FastAPI(
    title="Automation Service",
    description="Một dịch vụ tự động hóa nghiệp vụ với tích hợp thanh toán, promotion, notification, batch processing và event handling.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

@app.get("/")
async def read_root():
    return {"message": "Automation Service is running!"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Automation Service",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8017)


