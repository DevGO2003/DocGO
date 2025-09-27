import pytest
import requests
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_ai_extract():
    response = client.post(
        "/api/v1/ai-processing-service/extract",
        files={"file": ("test.pdf", open("test.pdf", "rb"), "application/pdf")}
    )
    assert response.status_code == 200
    assert "extractedText" in response.json()["data"]

def test_ai_summarize():
    response = client.post(
        "/api/v1/ai-processing-service/summarize",
        json={"text": "This is a test document for summarization."}
    )
    assert response.status_code == 200
    assert "summary" in response.json()["data"]

def test_notification_send():
    response = client.post(
        "/api/v1/ai-processing-service/notifications/send",
        json={
            "to": "test@example.com",
            "subject": "Test Notification",
            "message": "This is a test notification"
        }
    )
    assert response.status_code == 200
    assert response.json()["statusCode"] == 200

def test_batch_processing():
    response = client.post(
        "/api/v1/ai-processing-service/batch/process",
        json={
            "files": ["file1.pdf", "file2.pdf"],
            "operation": "extract"
        }
    )
    assert response.status_code == 200
    assert "jobId" in response.json()["data"]
