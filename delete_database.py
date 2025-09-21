#!/usr/bin/env python3
"""
Script to delete docgo_contract_service database
"""
import pymongo
import sys

def delete_database():
    try:
        # Connect to MongoDB (using default localhost:27017)
        # Try without authentication first
        client = pymongo.MongoClient('mongodb://localhost:27017/')
        
        # Test connection
        try:
            client.admin.command('ping')
            print("✅ Connected to MongoDB successfully")
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            return False
        
        # List all databases first
        print("📋 Current databases:")
        for db_name in client.list_database_names():
            db = client[db_name]
            collections = db.list_collection_names()
            print(f"  - {db_name}: {len(collections)} collections")
        
        # Check if target database exists
        if 'docgo_contract_service' not in client.list_database_names():
            print("❌ Database 'docgo_contract_service' not found!")
            return False
        
        # Get the database
        db = client['docgo_contract_service']
        
        # List collections in the database
        collections = db.list_collection_names()
        print(f"\n🗂️ Collections in docgo_contract_service:")
        for collection_name in collections:
            collection = db[collection_name]
            count = collection.count_documents({})
            print(f"  - {collection_name}: {count} documents")
        
        # Drop the database
        print(f"\n🗑️ Dropping database 'docgo_contract_service'...")
        client.drop_database('docgo_contract_service')
        
        # Verify deletion
        remaining_dbs = client.list_database_names()
        if 'docgo_contract_service' not in remaining_dbs:
            print("✅ Database 'docgo_contract_service' successfully deleted!")
            
            print("\n📋 Remaining databases:")
            for db_name in remaining_dbs:
                if db_name not in ['admin', 'local', 'config']:  # Skip system databases
                    db = client[db_name]
                    collections = db.list_collection_names()
                    print(f"  - {db_name}: {len(collections)} collections")
            
            return True
        else:
            print("❌ Failed to delete database!")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    finally:
        client.close()

if __name__ == "__main__":
    print("🚀 Starting database deletion process...")
    success = delete_database()
    sys.exit(0 if success else 1)
