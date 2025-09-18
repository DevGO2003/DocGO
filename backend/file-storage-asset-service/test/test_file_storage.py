import pytest
import requests
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_file_upload():
    response = client.post(
        "/api/v1/file-storage-service/files/upload",
        files={"file": ("test.txt", "test content", "text/plain")}
    )
    assert response.status_code == 200
    assert "fileId" in response.json()["data"]

def test_file_download():
    # First upload a file
    upload_response = client.post(
        "/api/v1/file-storage-service/files/upload",
        files={"file": ("test.txt", "test content", "text/plain")}
    )
    file_id = upload_response.json()["data"]["fileId"]
    
    # Then download it
    response = client.get(f"/api/v1/file-storage-service/files/{file_id}")
    assert response.status_code == 200
    assert response.content == b"test content"

def test_asset_management():
    response = client.post(
        "/api/v1/file-storage-service/assets",
        json={
            "name": "Test Asset",
            "description": "Test asset description",
            "fileId": "123"
        }
    )
    assert response.status_code == 200
    assert "assetId" in response.json()["data"]
