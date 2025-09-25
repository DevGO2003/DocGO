# Best Choice Command - Thực thi phương án tối ưu

## Mục đích
- Chạy ngay phương án tốt nhất (best choice) được AI agent đề xuất ở lần `/ask` gần nhất.
- **Tự động xử lý rủi ro** đã được gợi ý trong phân tích `/ask`.

## Cách dùng
- Nhập: `best-choice`
- Hệ thống sẽ tự động:
  1) Lấy kết quả phân tích gần nhất từ `/ask`
  2) Xác định phương án được gợi ý là "Best Choice"
  3) **Xử lý rủi ro** đã được liệt kê trong phần "Rủi ro và cách xử lý"
  4) Thực thi các bước chẩn đoán/hành động theo đúng khuyến nghị (không yêu cầu mô tả lại)

## Trước khi thực hiện:
  1) Đọc '@10_powershell-terminal-standards.mdc' trong repo

## Xử lý rủi ro tự động

### 🔧 Các loại rủi ro được xử lý:
- **Lỗi import/export**: Kiểm tra và sửa syntax, version compatibility
- **Lỗi dependency/classpath**: Clear cache, reinstall packages
- **Lỗi configuration/endpoint**: Validate config, check port mapping
- **Lỗi database migration**: Kiểm tra schema, rollback nếu cần
- **Lỗi container/Docker**: Rebuild, restart, check logs
- **Lỗi network/connectivity**: Test connection, check firewall

### 🚀 Quy trình xử lý rủi ro:
1. **Phát hiện rủi ro**: Tự động detect lỗi trong quá trình thực thi
2. **Áp dụng giải pháp**: Sử dụng cách sửa đã được gợi ý trong `/ask`
3. **Verify kết quả**: Kiểm tra xem rủi ro đã được giải quyết
4. **Tiếp tục workflow**: Thực thi bước tiếp theo nếu thành công
5. **Báo cáo kết quả**: Thông báo rủi ro đã xử lý hoặc cần can thiệp thủ công

### ⚠️ Rủi ro cần can thiệp thủ công:
- **Rủi ro cao**: Có thể gây mất dữ liệu hoặc break hệ thống
- **Rủi ro phức tạp**: Cần quyết định từ người dùng
- **Rủi ro không có giải pháp**: Cần nghiên cứu thêm

## Ghi chú
- Chỉ áp dụng cho phiên phân tích gần nhất của `/ask`
- Không lặp lại phân tích; tập trung chạy hành động được khuyến nghị
- **Tự động xử lý 80% rủi ro** thông thường
- **Dừng và yêu cầu xác nhận** cho 20% rủi ro phức tạp
- **Báo cáo chi tiết** kết quả xử lý rủi ro
