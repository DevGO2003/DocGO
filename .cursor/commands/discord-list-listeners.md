# Discord List Listeners Command

## Mục đích
Liệt kê tất cả message listeners đang hoạt động.

## Cách sử dụng
```bash
/discord-list-listeners
```

## Tham số
- Không có tham số

## Quy trình thực hiện

### 1. 🔍 Xác định listeners
- Kiểm tra quyền đọc listeners
- Xác thực bot permissions
- Hiển thị thông tin listeners

### 2. ✅ Validate permissions
- Kiểm tra read permissions
- Validate bot access
- Kiểm tra listener permissions

### 3. 📝 Lấy danh sách listeners
- Gọi `mcp_Discord_list_listeners` với parameters
- Xử lý lỗi permission nếu có
- Lấy kết quả listeners

### 4. 📊 Phân tích kết quả
- Hiển thị danh sách listeners
- Phân tích listener configurations
- Gợi ý sử dụng listeners

## Kết quả mong đợi
- 📊 **Danh sách listeners** đang hoạt động
- 📈 **Listener configurations** analysis
- 🎯 **Gợi ý** sử dụng listeners
- ✅ **Thông tin** listeners và status

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Discord Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi permission và validation

## Ví dụ sử dụng
```
/discord-list-listeners
```

## Troubleshooting
- **Permission denied**: Kiểm tra quyền đọc listeners
- **Bot không có quyền**: Kiểm tra bot permissions
- **No listeners**: Thông báo không có listeners

