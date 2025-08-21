### How to run this microservice

Prerequisites:
- Python 3.11+
- MariaDB running locally with a database for users

Env variables (PowerShell example):
```powershell
# Database
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:DB_USER = "root"
$env:DB_PASSWORD = "sapassword"
$env:DB_NAME = "docgo_user_service"

# Optional S3/MinIO for avatars (defaults already set in code)
$env:S3_ENDPOINT = "http://localhost:9000"
$env:S3_ACCESS_KEY_ID = "minioadmin"
$env:S3_SECRET_ACCESS_KEY = "miniopassword"
$env:S3_BUCKET = "system1-avatars"
```

Steps:
```powershell
cd backend/user-service
python -m venv venv
./venv/Scripts/Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

Docs: `http://localhost:8001/docs`

