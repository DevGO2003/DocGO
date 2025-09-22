# Send Discord Letter Command

## Mục đích
Gửi thư báo cáo công việc đã hoàn thành đến Discord cho quý ngài Thái Gõ thông qua Yasuo phong linh.

## Cách sử dụng
```bash
/send-discord-letter <tên ta> <tóm tắt nội dung> <đề xuất yêu cầu tiếp theo> <tên ngươi>
```

## Script dùng kèm
- Command này sẽ tạo (nếu chưa tồn tại) và sử dụng script PowerShell tại: `.cursor/scripts/reusable/send-discord-letter.ps1`.
- Có thể gọi trực tiếp script này khi cần:
```powershell
powershell -ExecutionPolicy Bypass -File .cursor/scripts/reusable/send-discord-letter.ps1 "<tên ta>" "<tóm tắt nội dung>" "<đề xuất yêu cầu tiếp theo>" "<tên ngươi>" "https://discord.com/api/webhooks/xxx/yyy"
```

## Parameters
- **Tên ta** (bắt buộc): Tên của quý ngài Thái Gõ
- **Tóm tắt nội dung** (bắt buộc): Mô tả ngắn gọn công việc đã hoàn thành
- **Đề xuất yêu cầu tiếp theo** (bắt buộc): Gợi ý task tiếp theo (best choice)
- **Tên ngươi** (bắt buộc): Tên của Yasuo phong linh

## Ví dụ sử dụng
```bash
/send-discord-letter "Thái Gõ" "Đã tạo file setup-cursor.md với các commands chuẩn hóa" "Tiếp tục phát triển microservice hoặc tối ưu hóa Docker setup" "Yasuo phong linh"
```

## Format thư Discord
Thư sẽ được gửi với format đẹp bao gồm:
- [THU] :mailbox: Tiêu đề thư với khung viền
- [CONG VIEC] :clipboard: Tóm tắt công việc đã hoàn thành
- [DE XUAT] :bulb: Đề xuất yêu cầu tiếp theo
- Chữ ký từ Yasuo phong linh :crossed_swords:
- [THOI GIAN] :clock1: và [NGAY] :calendar: thông tin thời gian
- Sử dụng emoji Discord an toàn và ký tự ASCII

## Xử lý lỗi
Script sẽ hiển thị:
- ✅ Thông báo thành công với màu xanh
- ❌ Thông báo lỗi chi tiết nếu thất bại
- 🔧 Gợi ý khắc phục sự cố

## Lưu ý
- Webhook URL đã được cấu hình sẵn
- Script hỗ trợ PowerShell 5+
- Tự động format thời gian theo chuẩn Việt Nam
- **Quan trọng**: Sử dụng tiếng Việt không dấu và emoji Discord (format :emoji:) để tránh lỗi encoding
- Emoji Discord được sử dụng: :mailbox:, :clipboard:, :bulb:, :crossed_swords:, :clock1:, :calendar:
- Có thể tùy chỉnh webhook URL nếu cần
 - Script thực thi nằm tại `.cursor/scripts/reusable/send-discord-letter.ps1`; command sẽ tự tạo nếu thiếu.

## Workflow tích hợp
Command này được sử dụng trong workflow chuẩn của Yasuo phong linh:
1. Nhận yêu cầu từ quý ngài Thái Gõ
2. Thực hiện task
3. Báo cáo kết quả
4. Gửi Discord letter với `/send-discord-letter`
