#!/usr/bin/env python3
"""
Test script for automation-service
"""
import requests
import time
import subprocess
import sys
import os

def test_service():
    """Test the automation service"""
    print("🧪 Testing Automation Service...")
    
    # Test health endpoint
    try:
        response = requests.get("http://127.0.0.1:8017/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"📊 Response: {response.json()}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_docs_endpoint():
    """Test docs endpoint"""
    try:
        response = requests.get("http://127.0.0.1:8017/docs", timeout=5)
        if response.status_code == 200:
            print("✅ Docs endpoint accessible")
            return True
        else:
            print(f"❌ Docs endpoint failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Docs endpoint failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Automation Service test...")
    
    # Test if service is running
    if test_service():
        print("✅ Service is running correctly!")
        test_docs_endpoint()
    else:
        print("❌ Service is not running or not accessible")
        print("💡 Try starting the service with: uvicorn main:app --host 127.0.0.1 --port 8017")
        sys.exit(1)
