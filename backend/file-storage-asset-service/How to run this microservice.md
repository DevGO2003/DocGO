### How to run this microservice

Prerequisites:
- Python 3.11+
- S3-compatible storage (Filebase recommended)

Environment:
1) Create `.env` by copying `env.example` and fill values:
```
S3_ENDPOINT=https://s3.filebase.com
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=YOUR_KEY
S3_SECRET_ACCESS_KEY=YOUR_SECRET
S3_BUCKET=devogo2003-docgo-bucket
```
Optional:
```
IPFS_RPC_ENDPOINT=https://rpc.filebase.io
# IPFS_RPC_TOKEN=...
```

Run (PowerShell):
```powershell
cd backend/file-storage-asset-service
python -m venv venv
./venv/Scripts/Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8012
```

Docs: `http://localhost:8012/docs`

