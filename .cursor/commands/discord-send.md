# Discord Send Message Command

## Mục đích
Gửi tin nhắn đến Discord channel.

## Cách sử dụng
```bash
/discord-send <channel> <message> [server]
```

## Tham số
- `<channel>`: Tên channel hoặc ID (bắt buộc)
- `<message>`: Nội dung tin nhắn (bắt buộc)
- `[server]`: Tên server hoặc ID (tùy chọn, nếu bot chỉ trong một server)

## Quy trình thực hiện

### 1. 🔍 Xác định channel
- Kiểm tra channel tồn tại
- Xác thực quyền gửi tin nhắn
- Hiển thị thông tin channel

### 2. ✅ Validate parameters
- Kiểm tra message hợp lệ
- Validate channel access
- Kiểm tra message permissions

### 3. 📝 Thực hiện gửi tin nhắn
- Gọi `mcp_Discord_send_message` với parameters
- Xử lý lỗi permission nếu có
- Lấy kết quả gửi tin nhắn

### 4. 📊 Báo cáo kết quả
- Hiển thị tin nhắn đã gửi
- Phân tích message content
- Gợi ý sử dụng message

## Kết quả mong đợi
- ✅ **Tin nhắn** đã gửi thành công
- 📈 **Message content** analysis
- 🎯 **Gợi ý** sử dụng message
- ✅ **Thông tin** channel và server

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Discord Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi permission và validation

## Ví dụ sử dụng
```
/discord-send general "Hello everyone!"
/discord-send dev-channel "New feature deployed" devgo-server
/discord-send 123456789012345678 "Status update"
```

## Troubleshooting
- **Channel không tồn tại**: Kiểm tra channel name hoặc ID
- **Permission denied**: Kiểm tra quyền gửi tin nhắn
- **Server không tồn tại**: Kiểm tra server name hoặc ID
- **Message quá dài**: Giảm độ dài message
