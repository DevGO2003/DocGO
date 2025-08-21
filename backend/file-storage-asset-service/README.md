### File Storage Asset Service

FastAPI service to manage file assets using S3-compatible storage (Filebase).

Run locally:

```bash
cd backend/file-storage-asset-service
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
set S3_ENDPOINT=https://s3.filebase.com
set S3_ACCESS_KEY_ID=YOUR_KEY
set S3_SECRET_ACCESS_KEY=YOUR_SECRET
set S3_BUCKET=docgo-assets
uvicorn main:app --reload --port 8012
```

Endpoints:
- POST `/api/v1/file-storage/upload`
- GET `/api/v1/file-storage/list?prefix=assets/`
- GET `/api/v1/file-storage/url?key=...`
- DELETE `/api/v1/file-storage/delete?key=...`


