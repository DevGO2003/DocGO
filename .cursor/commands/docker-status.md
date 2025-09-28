# Docker Status

Xem trạng thái các Docker containers đang chạy cho kiến trúc 4 microservices.

## Lệnh chính
```bash
docker compose -f docker-compose.yml ps
```

## Lệnh chi tiết
```bash
# Xem tất cả containers (bao gồm stopped)
docker compose -f docker-compose.yml ps -a

# Xem với thông tin chi tiết
docker compose -f docker-compose.yml ps --format "table {{.Name}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

# Xem logs realtime của tất cả services
docker compose -f docker-compose.yml logs -f

# Xem logs của service cụ thể
docker compose -f docker-compose.yml logs -f <service-name>
```

## Services kiến trúc mới
- `api-gateway` - Port 8000
- `user-management-service` - Port 8001
- `document-management-service` - Port 8002
- `automation-service` - Port 8003

## Ghi chú
- Kiểm tra trạng thái trước khi chạy `/start` hoặc `/docker-logs`
- Sử dụng `/docker-down` để dừng tất cả services
- Sử dụng `/docker-logs` để xem logs chi tiết
- Kiến trúc mới: 4 microservices thay vì 6 services cũ






