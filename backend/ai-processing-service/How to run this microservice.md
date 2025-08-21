### How to run this microservice

Prerequisites:
- Python 3.11+
- `GEMINI_API_KEY`

Environment:
```
GEMINI_API_KEY=YOUR_GEMINI_KEY
```

Run (PowerShell):
```powershell
cd backend/ai-processing-service
python -m venv venv
./venv/Scripts/Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env -Force
uvicorn main:app --reload --port 8011
```

Docs: `http://localhost:8011/docs#/`

