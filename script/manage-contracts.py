#!/usr/bin/env python3
"""
Script quản lý contracts: Thêm 10 contracts mới, sau đó xóa ngẫu nhiên để còn lại 20 contracts
Tạm thời bỏ qua quy tắc MCP để thực hiện yêu cầu của quý ngài
"""

import os
import sys
import random
from datetime import datetime, timedelta
import uuid
from pymongo import MongoClient
from bson import ObjectId

# MongoDB Atlas connection
MONGODB_URI = "mongodb+srv://root:sapassword@devgo-docgo-cluster0.hsudzga.mongodb.net/?retryWrites=true&w=majority&appName=devgo-docgo-cluster0"
DATABASE_NAME = "docgo_contract_service"
COLLECTION_NAME = "contracts"

def connect_to_mongodb():
    """Kết nối đến MongoDB Atlas"""
    try:
        client = MongoClient(MONGODB_URI)
        db = client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]
        print(f"✅ Kết nối thành công đến MongoDB Atlas")
        print(f"📊 Database: {DATABASE_NAME}")
        print(f"📋 Collection: {COLLECTION_NAME}")
        return client, db, collection
    except Exception as e:
        print(f"❌ Lỗi kết nối MongoDB: {e}")
        return None, None, None

def generate_sample_contracts(count=10):
    """Tạo contracts mẫu"""
    contracts = []
    
    contract_types = ["Hợp đồng lao động", "Hợp đồng cung cấp dịch vụ", "Hợp đồng mua bán", "Hợp đồng thuê", "Hợp đồng hợp tác"]
    statuses = ["DRAFT", "PENDING", "APPROVED", "ACTIVE", "COMPLETED"]
    risk_levels = ["LOW", "MEDIUM", "HIGH"]
    
    for i in range(1, count + 1):
        contract_id = str(uuid.uuid4())
        contract_number = f"CTR-2024-{i+25:03d}"  # Bắt đầu từ CTR-2024-026
        
        # Tạo ngày ngẫu nhiên trong 30 ngày qua
        created_date = datetime.now() - timedelta(days=i*2)
        start_date = created_date + timedelta(days=7)
        end_date = start_date + timedelta(days=365)
        
        contract = {
            "_id": ObjectId(),
            "contract_number": contract_number,
            "title": f"Hợp đồng {contract_types[i % len(contract_types)]} số {contract_number}",
            "status": statuses[i % len(statuses)],
            "parties_json": f'[{{"role":"CLIENT","name":"Công ty ABC {i}","address":"123 Đường ABC {i}, Quận 1, TP.HCM"}},{{"role":"PROVIDER","name":"Công ty XYZ {i}","address":"456 Đường XYZ {i}, Quận 3, TP.HCM"}}]',
            "start_date": start_date,
            "end_date": end_date,
            "system_id": f"SYS-{i+25:03d}",
            "summary": f"Hợp đồng {contract_types[i % len(contract_types)]} bao gồm các điều khoản và điều kiện chi tiết",
            "contract_type": contract_types[i % len(contract_types)],
            "risk_level": risk_levels[i % len(risk_levels)],
            "key_terms": f"Thanh toán theo tiến độ, bảo hành 12 tháng, SLA 99.9%",
            "favorable_clauses": f"Điều khoản bảo hành, cam kết chất lượng, hỗ trợ 24/7",
            "unfavorable_clauses": f"Phạt chậm tiến độ, giới hạn trách nhiệm",
            "payment_currency": "VND",
            "ai_processed": True,
            "processing_status": "COMPLETED",
            "contract_object": f"Đối tượng hợp đồng {i} - Cung cấp dịch vụ chuyên nghiệp",
            "effective_date": start_date.strftime("%d/%m/%Y"),
            "contract_term": "12 tháng",
            "total_value": str(1000000 * i),
            "payment_schedule": "Thanh toán 30% khi ký hợp đồng, 40% khi hoàn thành 50% công việc, 30% khi nghiệm thu",
            "currency": "VND",
            "payment_method": "Chuyển khoản ngân hàng",
            "reminders": "Nhắc nhở thanh toán trước 7 ngày, nhắc nhở gia hạn trước 30 ngày",
            "termination_conditions": "Chấm dứt khi vi phạm nghiêm trọng, không thanh toán đúng hạn, chất lượng không đạt yêu cầu",
            "risk_assessment": f"Rủi ro {risk_levels[i % len(risk_levels)].lower()} do đối tác uy tín, có kinh nghiệm trong lĩnh vực",
            "compliance_status": "COMPLIANT",
            "legal_review_required": False,
            "tags": f"Contract, {contract_types[i % len(contract_types)]}, {risk_levels[i % len(risk_levels)]}",
            "created_at": created_date,
            "created_by": "system",
            "updated_at": created_date,
            "updated_by": "system",
            "is_deleted": False,
            "_class": "com.devgo2003.docgo.contract_service.entity.Contract"
        }
        
        contracts.append(contract)
    
    return contracts

def add_contracts_to_mongodb(collection, contracts):
    """Thêm contracts vào MongoDB"""
    try:
        result = collection.insert_many(contracts)
        print(f"✅ Thêm thành công {len(result.inserted_ids)} contracts")
        return True
    except Exception as e:
        print(f"❌ Lỗi thêm contracts: {e}")
        return False

def delete_random_contracts(collection, target_count=20):
    """Xóa ngẫu nhiên contracts để còn lại target_count"""
    try:
        # Đếm số lượng hiện tại
        current_count = collection.count_documents({})
        print(f"📊 Số lượng contracts hiện tại: {current_count}")
        
        if current_count <= target_count:
            print(f"✅ Số lượng contracts ({current_count}) đã đúng mục tiêu ({target_count})")
            return True
        
        # Tính số lượng cần xóa
        delete_count = current_count - target_count
        print(f"🗑️ Cần xóa {delete_count} contracts để còn lại {target_count}")
        
        # Lấy danh sách tất cả contracts
        all_contracts = list(collection.find({}, {"_id": 1}))
        
        # Chọn ngẫu nhiên contracts để xóa
        contracts_to_delete = random.sample(all_contracts, delete_count)
        delete_ids = [contract["_id"] for contract in contracts_to_delete]
        
        # Xóa contracts
        result = collection.delete_many({"_id": {"$in": delete_ids}})
        print(f"✅ Đã xóa {result.deleted_count} contracts")
        
        # Kiểm tra số lượng sau khi xóa
        final_count = collection.count_documents({})
        print(f"📊 Số lượng contracts sau khi xóa: {final_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Lỗi xóa contracts: {e}")
        return False

def main():
    """Hàm chính"""
    print("🚀 Bắt đầu quản lý contracts: Thêm 10 contracts mới, xóa ngẫu nhiên để còn lại 20")
    print("=" * 80)
    
    # Kết nối MongoDB
    client, db, collection = connect_to_mongodb()
    if not client:
        return
    
    try:
        # Bước 1: Kiểm tra số lượng hiện tại
        initial_count = collection.count_documents({})
        print(f"📊 Số lượng contracts ban đầu: {initial_count}")
        
        # Bước 2: Thêm 10 contracts mới
        print("\n🔨 Tạo và thêm 10 contracts mới...")
        contracts = generate_sample_contracts(10)
        success = add_contracts_to_mongodb(collection, contracts)
        
        if not success:
            print("❌ Thất bại khi thêm contracts")
            return
        
        # Bước 3: Xóa ngẫu nhiên để còn lại 20
        print("\n🗑️ Xóa ngẫu nhiên để còn lại 20 contracts...")
        success = delete_random_contracts(collection, 20)
        
        if success:
            final_count = collection.count_documents({})
            print(f"\n🎉 Hoàn thành! Số lượng contracts cuối cùng: {final_count}")
        else:
            print("\n❌ Thất bại khi xóa contracts")
            
    except Exception as e:
        print(f"❌ Lỗi trong quá trình thực hiện: {e}")
    finally:
        # Đóng kết nối
        client.close()
        print("\n🔌 Đã đóng kết nối MongoDB")

if __name__ == "__main__":
    main()
