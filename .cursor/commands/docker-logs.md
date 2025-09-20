# Docker Logs
Xem logs Docker cho toàn bộ services hoặc theo từng service trong môi trường development local.

## Hành vi mặc định
- Không truyền tham số: tự động hiển thị logs của TẤT CẢ services hiện có trong `docker-compose.local.yml` (không follow).
- Có truyền tên service: theo dõi liên tục (follow) logs của service đó với độ trễ theo dõi tối đa 20 giây.
- Nếu service không start thành công: tự động chuyển sang chế độ sửa lỗi (xem trạng thái, hiển thị lỗi gần nhất) cho tới khi service lên thành công.

## Lệnh thực thi (PowerShell)
- Xem nhanh logs tất cả services (không follow):
```
docker-compose -f docker-compose.local.yml ps | cat
docker-compose -f docker-compose.local.yml logs --tail=200 | cat
```

- Theo dõi 1 service (follow, độ trễ ≤ 20s):
```
$service = "<SERVICE_NAME>"
# Kiểm tra trạng thái nhanh
docker-compose -f docker-compose.local.yml ps | Select-String -Pattern $service | cat
# Theo dõi logs (follow)
docker-compose -f docker-compose.local.yml logs -f --tail=200 $service | cat
```

- Nếu service không start thành công (health/unhealthy/exited), hỗ trợ sửa lỗi nhanh:
```
$service = "<SERVICE_NAME>"
# 1) Xem lỗi gần nhất
docker-compose -f docker-compose.local.yml logs --tail=300 $service | cat
# 2) Kiểm tra cấu hình env/local
Get-ChildItem -Force -Recurse -File -ErrorAction SilentlyContinue env | cat
# 3) Restart service
docker-compose -f docker-compose.local.yml restart $service
# 4) Nếu vẫn lỗi: dừng + khởi động lại sạch
docker-compose -f docker-compose.local.yml stop $service
docker-compose -f docker-compose.local.yml up -d --no-deps --build $service
# 5) Theo dõi lại logs (follow)
docker-compose -f docker-compose.local.yml logs -f --tail=200 $service | cat
```

## Xử lý lỗi tự động

### Khi gặp lỗi trong logs:
1. **Tự động phân tích lỗi** bằng `/ask` command
2. **Đưa ra Best Choice** để sửa lỗi
3. **Thực hiện sửa lỗi** ngay lập tức bằng `/best-choice`

### Quy trình xử lý lỗi:

#### Bước 1: Phát hiện lỗi
```powershell
# Khi thấy lỗi trong logs, tự động chuyển sang phân tích
# Ví dụ: ERROR, FATAL, Exception, Failed, etc.
```

#### Bước 2: Phân tích lỗi với /ask
```powershell
# Tự động gọi /ask với context lỗi
/ask: [ERROR] Service authentication-identity-service failed to start: JWT_SECRET invalid base64
```

#### Bước 3: Thực hiện sửa lỗi với /best-choice
```powershell
# Tự động thực hiện phương án tốt nhất được đề xuất
/best-choice
```

### Các loại lỗi thường gặp và cách xử lý:

#### 🔴 **Lỗi JWT/Configuration**
- **Triệu chứng**: `JWT_SECRET invalid base64`, `Configuration error`
- **Tự động**: Kiểm tra `.env.local`, sửa JWT_SECRET, restart service

#### 🔴 **Lỗi Database Connection**
- **Triệu chứng**: `Connection refused`, `Database not found`
- **Tự động**: Kiểm tra MongoDB URI, restart database service

#### 🔴 **Lỗi Port Conflict**
- **Triệu chứng**: `Port already in use`, `Address already in use`
- **Tự động**: Kill process chiếm port, restart service

#### 🔴 **Lỗi Dependency Missing**
- **Triệu chứng**: `Module not found`, `Package not found`
- **Tự động**: Cài đặt dependency, rebuild container

#### 🔴 **Lỗi Build/Compile**
- **Triệu chứng**: `Build failed`, `Compilation error`
- **Tự động**: Sửa code, rebuild image, restart service

### Script tự động xử lý lỗi:

```powershell
# Function tự động xử lý lỗi
function Handle-DockerError {
    param($ServiceName, $ErrorMessage)
    
    Write-Host "🔍 Phát hiện lỗi trong $ServiceName" -ForegroundColor Red
    Write-Host "📝 Lỗi: $ErrorMessage" -ForegroundColor Yellow
    
    # Gọi /ask để phân tích lỗi
    Write-Host "🤖 Đang phân tích lỗi với /ask..." -ForegroundColor Cyan
    # /ask: [ERROR] $ServiceName: $ErrorMessage
    
    # Gọi /best-choice để sửa lỗi
    Write-Host "🔧 Đang thực hiện sửa lỗi với /best-choice..." -ForegroundColor Green
    # /best-choice
    
    Write-Host "✅ Hoàn thành xử lý lỗi!" -ForegroundColor Green
}
```

## Ghi chú
- "Độ trễ theo dõi tối đa 20 giây" hiểu là theo dõi liên tục (log streaming) và phản hồi sự kiện gần như thời gian thực; không cần polling thủ công quá 20 giây.
- Tên service phải khớp với service trong `docker-compose.local.yml` (ví dụ: `api-gateway-bff`, `contract-management-service`, `web-nextjs`...).
- Nếu cần nhiều service cùng lúc, mở nhiều phiên theo dõi hoặc dùng nhiều cửa sổ terminal.
- **Tự động xử lý lỗi**: Khi phát hiện lỗi, hệ thống sẽ tự động phân tích và sửa lỗi.
