# Docker Logs
Xem logs Docker cho toàn bộ services hoặc theo từng service trong môi trường development.

## Hành vi mặc định
- Không truyền tham số: tự động hiển thị logs của TẤT CẢ services hiện có trong `docker-compose.yml` (không follow).
- Có truyền tên service: theo dõi liên tục (follow) logs của service đó với độ trễ theo dõi tối đa 20 giây.
- Nếu service không start thành công: tự động chuyển sang chế độ sửa lỗi (xem trạng thái, hiển thị lỗi gần nhất) cho tới khi service lên thành công.

## Lệnh thực thi (PowerShell)
- Xem nhanh logs tất cả services (không follow):
