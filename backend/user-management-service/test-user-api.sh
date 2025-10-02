#!/bin/bash

# Test script cho User API mới với query parameters
# Chạy script này để test các combination khác nhau

BASE_URL="http://localhost:8001/api/v1/user-management-service/v1/users"

echo "🧪 Testing User API với Query Parameters"
echo "========================================"

# Test 1: Lấy tất cả người dùng
echo "📋 Test 1: Lấy tất cả người dùng"
curl -X GET "$BASE_URL" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 2: Lấy người dùng theo status
echo "📊 Test 2: Lấy người dùng theo status ACTIVE"
curl -X GET "$BASE_URL?status=ACTIVE" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 3: Tìm kiếm theo searchTerm
echo "🔍 Test 3: Tìm kiếm theo searchTerm"
curl -X GET "$BASE_URL?searchTerm=admin" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 4: Kết hợp nhiều filter
echo "🔗 Test 4: Kết hợp nhiều filter (status + searchTerm)"
curl -X GET "$BASE_URL?status=ACTIVE&searchTerm=admin" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 5: Filter theo roleId
echo "🎭 Test 5: Filter theo roleId"
curl -X GET "$BASE_URL?roleId=admin-123" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 6: Filter theo organizationId
echo "🏢 Test 6: Filter theo organizationId"
curl -X GET "$BASE_URL?organizationId=org-456" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 7: Tìm kiếm username chính xác
echo "👤 Test 7: Tìm kiếm username chính xác"
curl -X GET "$BASE_URL?username=admin_user" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 8: Phân trang
echo "📄 Test 8: Phân trang (page 0, size 5)"
curl -X GET "$BASE_URL?pageNumber=0&pageSize=5" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 9: Sắp xếp
echo "📊 Test 9: Sắp xếp theo username ASC"
curl -X GET "$BASE_URL?sortBy=username&sortDirection=ASC" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 10: Kết hợp tất cả filter
echo "🎯 Test 10: Kết hợp tất cả filter"
curl -X GET "$BASE_URL?searchTerm=admin&status=ACTIVE&roleId=admin-123&organizationId=org-456&username=admin_user&pageNumber=0&pageSize=10&sortBy=createdAt&sortDirection=DESC" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 11: Validation error - pageSize quá lớn
echo "❌ Test 11: Validation error - pageSize quá lớn"
curl -X GET "$BASE_URL?pageSize=101" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 12: Validation error - sortBy không hợp lệ
echo "❌ Test 12: Validation error - sortBy không hợp lệ"
curl -X GET "$BASE_URL?sortBy=invalidField" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 13: Validation error - sortDirection không hợp lệ
echo "❌ Test 13: Validation error - sortDirection không hợp lệ"
curl -X GET "$BASE_URL?sortDirection=INVALID" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

echo "✅ Hoàn thành test User API với Query Parameters"
echo "========================================"









