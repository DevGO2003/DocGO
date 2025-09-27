#!/usr/bin/env python3
"""
Test script cho Gemini API
Kiểm tra kết nối và response từ Google Gemini API
"""

import requests
import json
import os
from datetime import datetime

# Cấu hình API
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
API_KEY = "AIzaSyB01z3o-hHlL3ELm8Gp_RIYL1EZCpOnyAA"

def test_gemini_api():
    """Test cơ bản với Gemini API"""
    print("🚀 Bắt đầu test Gemini API...")
    print(f"⏰ Thời gian: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 50)
    
    # Headers
    headers = {
        'Content-Type': 'application/json',
        'X-goog-api-key': API_KEY
    }
    
    # Payload test
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": "Explain how AI works in a few words"
                    }
                ]
            }
        ]
    }
    
    try:
        print("📤 Gửi request đến Gemini API...")
        print(f"🔗 URL: {GEMINI_API_URL}")
        print(f"📝 Prompt: {payload['contents'][0]['parts'][0]['text']}")
        print("-" * 50)
        
        # Gửi request
        response = requests.post(
            GEMINI_API_URL,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📋 Headers: {dict(response.headers)}")
        print("-" * 50)
        
        if response.status_code == 200:
            print("✅ Request thành công!")
            response_data = response.json()
            
            # In ra response đẹp
            print("📄 Response JSON:")
            print(json.dumps(response_data, indent=2, ensure_ascii=False))
            print("-" * 50)
            
            # Trích xuất nội dung trả về
            if 'candidates' in response_data and len(response_data['candidates']) > 0:
                candidate = response_data['candidates'][0]
                if 'content' in candidate and 'parts' in candidate['content']:
                    text_content = candidate['content']['parts'][0].get('text', '')
                    print("🤖 Nội dung AI trả về:")
                    print(f"'{text_content}'")
                else:
                    print("⚠️ Không tìm thấy nội dung trong response")
            else:
                print("⚠️ Không có candidates trong response")
                
        else:
            print(f"❌ Request thất bại với status code: {response.status_code}")
            print(f"📄 Error response: {response.text}")
            
    except requests.exceptions.Timeout:
        print("⏰ Timeout: Request quá lâu")
    except requests.exceptions.ConnectionError:
        print("🌐 Connection Error: Không thể kết nối đến API")
    except requests.exceptions.RequestException as e:
        print(f"❌ Request Error: {e}")
    except json.JSONDecodeError as e:
        print(f"📄 JSON Decode Error: {e}")
    except Exception as e:
        print(f"💥 Unexpected Error: {e}")
    
    print("-" * 50)
    print("🏁 Test hoàn thành!")

def test_gemini_with_vietnamese():
    """Test với prompt tiếng Việt"""
    print("\n🇻🇳 Test với prompt tiếng Việt...")
    print("-" * 50)
    
    headers = {
        'Content-Type': 'application/json',
        'X-goog-api-key': API_KEY
    }
    
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": "Hãy giải thích ngắn gọn về trí tuệ nhân tạo bằng tiếng Việt"
                    }
                ]
            }
        ]
    }
    
    try:
        response = requests.post(
            GEMINI_API_URL,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            response_data = response.json()
            if 'candidates' in response_data and len(response_data['candidates']) > 0:
                candidate = response_data['candidates'][0]
                if 'content' in candidate and 'parts' in candidate['content']:
                    text_content = candidate['content']['parts'][0].get('text', '')
                    print("🤖 AI trả lời bằng tiếng Việt:")
                    print(f"'{text_content}'")
                else:
                    print("⚠️ Không tìm thấy nội dung")
            else:
                print("⚠️ Không có candidates")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"💥 Error: {e}")

if __name__ == "__main__":
    print("🧪 GEMINI API TEST SCRIPT")
    print("=" * 50)
    
    # Test cơ bản
    test_gemini_api()
    
    # Test tiếng Việt
    test_gemini_with_vietnamese()
    
    print("\n✨ Tất cả test đã hoàn thành!")
