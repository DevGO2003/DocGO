# Discord Create Listener Command

## Mục đích
Tạo message listener với keywords và response handler.

## Cách sử dụng
```bash
/discord-create-listener <keywords> <handlerId> [description] [server] [channel] [handlerOptions]
```

## Tham số
- `<keywords>`: Danh sách keywords để lắng nghe (array) (bắt buộc)
- `<handlerId>`: ID của response handler (bắt buộc)
- `[description]`: Mô tả listener (tùy chọn)
- `[server]`: Server name hoặc ID (tùy chọn)
- `[channel]`: Channel name hoặc ID (tùy chọn)
- `[handlerOptions]`: Tùy chọn cho response handler (tùy chọn)

## Quy trình thực hiện

### 1. 🔍 Xác định parameters
- Kiểm tra keywords hợp lệ
- Validate handlerId tồn tại
- Hiển thị thông tin listener

### 2. ✅ Validate parameters
- Kiểm tra keywords array
- Validate handler permissions
- Kiểm tra server/channel access

### 3. 🔄 Thực hiện tạo listener
- Gọi `mcp_Discord_create_listener` với parameters
- Xử lý lỗi validation nếu có
- Lấy kết quả tạo listener

### 4. 📊 Báo cáo kết quả
- Hiển thị listener đã tạo
- Phân tích listener configuration
- Gợi ý sử dụng listener

## Kết quả mong đợi
- ✅ **Listener** đã tạo thành công
- 📈 **Listener configuration** analysis
- 🎯 **Gợi ý** sử dụng listener
- ✅ **Thông tin** keywords và handler

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Discord Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi validation và permission

## Ví dụ sử dụng
```
/discord-create-listener ["hello", "hi"] "greeting-handler" "Greeting listener"
/discord-create-listener ["help", "support"] "help-handler" "Help listener" "devgo-server" "general"
```

## Troubleshooting
- **Keywords không hợp lệ**: Kiểm tra keywords array format
- **Handler không tồn tại**: Kiểm tra handlerId
- **Permission denied**: Kiểm tra quyền tạo listener
- **Server/Channel không tồn tại**: Kiểm tra server và channel names

