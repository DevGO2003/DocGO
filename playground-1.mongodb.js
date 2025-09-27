/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('docgo_contract');

// Create a new document in the collection.
db.getCollection('contracts').insertOne({
  _id: ObjectId('68d5f8bb7e8daa211ef6d77d'),
  contract_number: 'HD-2024-000007',
  title: 'Hợp đồng SaaS',
  status: 'APPROVED',
  contract_type: 'SAAS_AGREEMENT',
  primary_category: 'TECH_SOFTWARE_SAAS',
  risk_level: 'MEDIUM',
  processing_status: 'COMPLETED',
  start_date: '2024-02-15T00:00:00Z',
  end_date: '2025-02-14T23:59:59Z',
  total_value: '24000000',
  currency: 'VND',
  created_at: '2024-02-15T00:00:00Z',
  created_by: 'system',
  updated_at: '2024-02-15T00:00:00Z',
  updated_by: 'system',
  is_deleted: false,
  version: 1
});
