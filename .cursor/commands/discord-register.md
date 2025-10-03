# Discord Register Commands Command

## Mục đích
Đăng ký slash commands cho Discord bot.

## Cách sử dụng
```bash
/discord-register [server]
```

## Tham số
- `[server]`: Server ID để đăng ký commands (tùy chọn, nếu không có sẽ đăng ký globally)

## Quy trình thực hiện

### 1. 🔍 Xác định server
- Kiểm tra server tồn tại (nếu có)
- Xác thực quyền đăng ký commands
- Hiển thị thông tin server

### 2. ✅ Validate parameters
- Kiểm tra server ID hợp lệ (nếu có)
- Validate bot permissions
- Kiểm tra command registration permissions

### 3. 🔄 Thực hiện đăng ký commands
- Gọi `mcp_Discord_register_commands` với parameters
- Xử lý lỗi permission nếu có
- Lấy kết quả registration

### 4. 📊 Báo cáo kết quả
- Hiển thị commands đã đăng ký
- Phân tích registration results
- Gợi ý sử dụng commands

## Kết quả mong đợi
- ✅ **Commands** đã đăng ký thành công
- 📈 **Registration results** analysis
- 🎯 **Gợi ý** sử dụng commands
- ✅ **Thông tin** server và registration

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Discord Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi permission và validation

## Ví dụ sử dụng
```
/discord-register
/discord-register 123456789012345678
```

## Troubleshooting
- **Server không tồn tại**: Kiểm tra server ID
- **Permission denied**: Kiểm tra quyền đăng ký commands
- **Bot không có quyền**: Kiểm tra bot permissions
- **Commands đã tồn tại**: Thông báo commands đã được đăng ký
