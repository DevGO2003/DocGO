# Script test API Tags
Write-Host "=== TEST API TAGS ===" -ForegroundColor Green

$baseUrl = "http://localhost:8002/api/v1/contract-management-service/tags"

# Test 1: Lấy danh sách tags phổ biến
Write-Host "`n1. Test GET /popular" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/popular" -Method GET -Headers @{"accept"="application/json"}
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Lấy tất cả tags
Write-Host "`n2. Test GET /all" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/all" -Method GET -Headers @{"accept"="application/json"}
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Tìm kiếm tags
Write-Host "`n3. Test GET /search?searchTerm=ưu" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/search?searchTerm=ưu" -Method GET -Headers @{"accept"="application/json"}
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Lấy top 5 last used tags
Write-Host "`n4. Test GET /top5-last-used" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/top5-last-used" -Method GET -Headers @{"accept"="application/json"}
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Lấy top 5 last created tags
Write-Host "`n5. Test GET /top5-last-created" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/top5-last-created" -Method GET -Headers @{"accept"="application/json"}
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Cập nhật thống kê tags
Write-Host "`n6. Test POST /update-statistics" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/update-statistics" -Method POST -Headers @{"accept"="application/json"}
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Lấy tags với phân trang
Write-Host "`n7. Test GET /paginated?page=0&size=5" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/paginated?page=0&size=5" -Method GET -Headers @{"accept"="application/json"}
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== TEST COMPLETED ===" -ForegroundColor Green
