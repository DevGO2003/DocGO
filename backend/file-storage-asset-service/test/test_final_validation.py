#!/usr/bin/env python3
"""
Test script cuối cùng để kiểm tra summary validation
"""

import requests
import json
import time

def test_final_validation():
    """Test summary validation cuối cùng"""
    
    # Tạo file hợp đồng mẫu
    contract_content = """
HỢP ĐỒNG CUNG CẤP DỊCH VỤ PHẦN MỀM
Số: HD-FINAL-001/2024

Bên A: CÔNG TY TNHH FINAL TEST
Địa chỉ: 789 Đường Final, Quận 1, TP.HCM
Mã số thuế: 1111111111
Người đại diện: Ông Final Test A

Bên B: CÔNG TY CỔ PHẦN FINAL PROVIDER
Địa chỉ: 321 Đường Provider, Quận 3, TP.HCM
Mã số thuế: 2222222222
Người đại diện: Ông Final Test B

ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG
Bên B cung cấp dịch vụ phần mềm quản lý tài chính cho Bên A.

ĐIỀU 2: THỜI HẠN
Hợp đồng có hiệu lực 24 tháng từ ngày ký.

ĐIỀU 3: GIÁ TRỊ
Tổng giá trị: 50,000,000 VND
Thanh toán: 30% khi ký, 40% sau 12 tháng, 30% khi nghiệm thu.

ĐIỀU 4: TRÁCH NHIỆM
Bên A: Thanh toán đúng hạn, cung cấp thông tin cần thiết
Bên B: Cung cấp dịch vụ chất lượng, hỗ trợ kỹ thuật

ĐIỀU 5: CHẤM DỨT
Hợp đồng chấm dứt khi hết hạn hoặc vi phạm nghiêm trọng.
    """
    
    # Upload file
    print("📤 Uploading final test contract file...")
    files = {
        'file': ('HopDongFinalTest.txt', contract_content.encode('utf-8'), 'text/plain')
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
        time.sleep(45)
        
        # Check contract management service logs
        print("\n📊 Checking Contract Management Service logs...")
        import subprocess
        try:
            logs = subprocess.run([
                'docker-compose', '-f', 'script/docker-compose.local.yml', 
                'logs', 'contract-management-service', '--tail=30'
            ], capture_output=True, text=True, cwd='.')
            print("Contract Management Service Logs:")
            print(logs.stdout)
        except Exception as e:
            print(f"Could not get logs: {e}")
            
    else:
        print(f"❌ Upload failed: {response.status_code}")
        print(f"Response: {response.text}")

if __name__ == "__main__":
    test_final_validation()
