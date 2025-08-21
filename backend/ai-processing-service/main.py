from fastapi import FastAPI
import routers

app = FastAPI(
    title="AI Processing Service",
    description="Một dịch vụ xử lý tài liệu sử dụng AI.",
    version="1.0.0",
)

app.include_router(routers.router)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the AI Processing Service. Visit /docs for API documentation."}