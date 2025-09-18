# Best Choice Command - Thực thi phương án tối ưu

## Mục đích
- Chạy ngay phương án tốt nhất (best choice) được AI agent đề xuất ở lần `/ask` gần nhất.

## Cách dùng
- Nhập: `best-choice`
- Hệ thống sẽ tự động:
  1) Lấy kết quả phân tích gần nhất từ `/ask`
  2) Xác định phương án được gợi ý là “Best Choice”
  3) Thực thi các bước chẩn đoán/hành động theo đúng khuyến nghị (không yêu cầu mô tả lại)

## Ghi chú
- Chỉ áp dụng cho phiên phân tích gần nhất của `/ask`
- Không lặp lại phân tích; tập trung chạy hành động được khuyến nghị
- Nếu cần xác nhận thủ công (ví dụ có rủi ro), hệ thống sẽ dừng và yêu cầu xác nhận
