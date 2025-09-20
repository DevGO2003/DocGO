# Docker Local

Khởi động toàn bộ môi trường local bằng Docker Compose.

## Lệnh chính
`ash
docker compose -f docker-compose.local.yml up -d --no-recreate --no-build
`

## Ghi chú
- Yêu cầu Docker Desktop đang chạy.
- Dùng /docker-local-logs để xem log, /docker-local-status để xem trạng thái, và /docker-local-down để tắt.
