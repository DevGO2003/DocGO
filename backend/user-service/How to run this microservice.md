### How to run this microservice

Prerequisites:
- Python 3.11+
- MariaDB with database `docgo_user_service`

Suggested env (PowerShell):
```powershell
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:DB_USER = "root"
$env:DB_PASSWORD = "sapassword"
$env:DB_NAME = "docgo_user_service"

# S3 for avatars (optional)
$env:S3_ENDPOINT = "http://localhost:9000"
$env:S3_ACCESS_KEY_ID = "minioadmin"
$env:S3_SECRET_ACCESS_KEY = "miniopassword"
$env:S3_BUCKET = "system1-avatars"
```

Run:
```powershell
cd backend/user-service
python -m venv venv
./venv/Scripts/Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

Docs: `http://localhost:8001/docs`

