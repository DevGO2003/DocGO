# Discord Read Messages Command

## Mục đích
Đọc tin nhắn gần đây từ Discord channel.

## Cách sử dụng
```bash
/discord-read <channel> [limit] [server]
```

## Tham số
- `<channel>`: Tên channel hoặc ID (bắt buộc)
- `[limit]`: Số lượng tin nhắn tối đa (1-100) (tùy chọn, mặc định: 50)
- `[server]`: Tên server hoặc ID (tùy chọn, nếu bot chỉ trong một server)

## Quy trình thực hiện

### 1. 🔍 Xác định channel
- Kiểm tra channel tồn tại
- Xác thực quyền đọc tin nhắn
- Hiển thị thông tin channel

### 2. ✅ Validate parameters
- Kiểm tra limit hợp lệ
- Validate channel access
- Kiểm tra read permissions

### 3. 📝 Thực hiện đọc tin nhắn
- Gọi `mcp_Discord_read_messages` với parameters
- Xử lý lỗi permission nếu có
- Lấy kết quả messages

### 4. 📊 Phân tích kết quả
- Hiển thị danh sách tin nhắn
- Phân tích message patterns
- Gợi ý insights từ messages

## Kết quả mong đợi
- 📊 **Danh sách tin nhắn** từ channel
- 📈 **Message patterns** analysis
- 🎯 **Insights** từ messages
- ✅ **Thông tin** channel và server

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Discord Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi permission và validation

## Ví dụ sử dụng
```
/discord-read general
/discord-read dev-channel 20 devgo-server
/discord-read 123456789012345678 100
```

## Troubleshooting
- **Channel không tồn tại**: Kiểm tra channel name hoặc ID
- **Permission denied**: Kiểm tra quyền đọc tin nhắn
- **Server không tồn tại**: Kiểm tra server name hoặc ID
- **Invalid limit**: Kiểm tra limit value (1-100)
