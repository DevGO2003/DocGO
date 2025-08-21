from fastapi import FastAPI
from routers import router

app = FastAPI(
	title="File Storage Asset Service",
	description="Dịch vụ lưu trữ và quản lý tài sản (file) dùng S3/Filebase và tùy chọn IPFS.",
	version="1.0.0",
)

app.include_router(router)


@app.get("/", tags=["Root"])
async def read_root():
	return {"message": "Welcome to the File Storage Asset Service. Visit /docs for API documentation."}


if __name__ == "__main__":
	import uvicorn
	uvicorn.run(app, host="0.0.0.0", port=8012)


