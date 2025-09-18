#!/usr/bin/env python3
"""
Test script để kiểm tra summary validation
"""

import requests
import json
import time

def test_summary_validation():
    """Test summary với field summary để tương thích với contract management service"""
    
    # Tạo file hợp đồng mẫu
    contract_content = """
HỢP ĐỒNG CUNG CẤP DỊCH VỤ PHẦN MỀM
Số: HD-TEST-001/2024

Bên A: CÔNG TY TNHH ABC
Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
Mã số thuế: 0123456789
Người đại diện: Ông Nguyễn Văn A

Bên B: CÔNG TY CỔ PHẦN XYZ
Địa chỉ: 456 Đường XYZ, Quận 3, TP.HCM
Mã số thuế: 9876543210
Người đại diện: Ông Trần Văn B

ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG
Bên B cung cấp dịch vụ phần mềm quản lý cho Bên A.

ĐIỀU 2: THỜI HẠN
Hợp đồng có hiệu lực 12 tháng từ ngày ký.

ĐIỀU 3: GIÁ TRỊ
Tổng giá trị: 10,000,000 VND
Thanh toán: 50% khi ký, 50% khi nghiệm thu.

ĐIỀU 4: TRÁCH NHIỆM
Bên A: Thanh toán đúng hạn
Bên B: Cung cấp dịch vụ chất lượng

ĐIỀU 5: CHẤM DỨT
Hợp đồng chấm dứt khi hết hạn hoặc vi phạm nghiêm trọng.
    """
    
    # Upload file
    print("📤 Uploading test contract file...")
    files = {
        'file': ('HopDongTestValidation.txt', contract_content.encode('utf-8'), 'text/plain')
    }
    
    response = requests.post(
        'http://localhost:8012/api/v1/file-storage-asset-service/files',
        files=files
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Upload successful!")
        
        # Extract file info
        if 'data' in result:
            data = result['data']
            file_id = data.get('file_id', data.get('fileId', 'N/A'))
            file_url = data.get('file_url', data.get('fileUrl', 'N/A'))
            print(f"📄 File ID: {file_id}")
            print(f"🔗 File URL: {file_url}")
        else:
            print("⚠️ No data in response")
        
        # Wait for AI processing
        print("\n⏳ Waiting for AI processing...")
        time.sleep(30)
        
        # Check AI service logs
        print("\n📊 Checking AI service logs...")
        import subprocess
        try:
            logs = subprocess.run([
                'docker-compose', '-f', 'script/docker-compose.local.yml', 
                'logs', 'ai-processing-service', '--tail=50'
            ], capture_output=True, text=True, cwd='.')
            print("AI Service Logs:")
            print(logs.stdout)
        except Exception as e:
            print(f"Could not get logs: {e}")
            
        # Check contract management service logs
        print("\n📊 Checking Contract Management Service logs...")
        try:
            logs = subprocess.run([
                'docker-compose', '-f', 'script/docker-compose.local.yml', 
                'logs', 'contract-management-service', '--tail=20'
            ], capture_output=True, text=True, cwd='.')
            print("Contract Management Service Logs:")
            print(logs.stdout)
        except Exception as e:
            print(f"Could not get logs: {e}")
            
    else:
        print(f"❌ Upload failed: {response.status_code}")
        print(f"Response: {response.text}")

if __name__ == "__main__":
    test_summary_validation()
