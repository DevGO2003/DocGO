# Discord Remove Listener Command

## Mục đích
Xóa message listener đã tồn tại.

## Cách sử dụng
```bash
/discord-remove-listener <listenerId>
```

## Tham số
- `<listenerId>`: ID của listener cần xóa (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định listener
- Kiểm tra listener tồn tại
- Xác thực quyền xóa listener
- Hiển thị thông tin listener

### 2. ✅ Validate parameters
- Kiểm tra listenerId hợp lệ
- Validate listener permissions
- Kiểm tra delete permissions

### 3. 🗑️ Thực hiện xóa listener
- Gọi `mcp_Discord_remove_listener` với parameters
- Xử lý lỗi permission nếu có
- Lấy kết quả xóa listener

### 4. 📊 Báo cáo kết quả
- Hiển thị listener đã xóa
- Phân tích deletion results
- Gợi ý tạo listener mới

## Kết quả mong đợi
- ✅ **Listener** đã xóa thành công
- 📈 **Deletion results** analysis
- 🎯 **Gợi ý** tạo listener mới
- ✅ **Thông tin** listener đã xóa

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Discord Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi permission và validation

## Ví dụ sử dụng
```
/discord-remove-listener listener-123
/discord-remove-listener greeting-handler
/discord-remove-listener help-listener
```

## Troubleshooting
- **Listener không tồn tại**: Kiểm tra listenerId
- **Permission denied**: Kiểm tra quyền xóa listener
- **Invalid listenerId**: Kiểm tra listenerId format

