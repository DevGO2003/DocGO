# Docker Local

Khởi động toàn Docker Compose cho kiến trúc 4 microservices.

## Lệnh chính
```bash
docker compose -f docker-compose.yml up -d --no-recreate --no-build
```

## Services được khởi động
- `api-gateway` (Next.js) - Port 8000
- `user-management-service` (Spring Boot) - Port 8001  
- `document-management-service` (Spring Boot) - Port 8002
- `automation-service` (FastAPI) - Port 8003

## Ghi chú
- Yêu cầu Docker Desktop đang chạy.
- Dùng /docker-logs để xem log, /docker-status để xem trạng thái, và /docker-down để tắt.
- Kiến trúc mới: 4 microservices thay vì 6 services cũ.






