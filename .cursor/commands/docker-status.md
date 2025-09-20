# Docker Status

Xem trạng thái các Docker containers đang chạy.

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

## Ghi chú
- Kiểm tra trạng thái trước khi chạy `/start` hoặc `/docker-logs`
- Sử dụng `/docker-down` để dừng tất cả services
- Sử dụng `/docker-logs` để xem logs chi tiết
