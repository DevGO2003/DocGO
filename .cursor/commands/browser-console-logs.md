# Browser Console Logs Command

## Mục đích
Lấy console logs từ browser.

## Cách sử dụng
```bash
/browser-console-logs
```

## Tham số
- Không có tham số

## Quy trình thực hiện

### 1. 🔍 Xác định browser state
- Kiểm tra browser đang hoạt động
- Xác thực quyền đọc logs
- Hiển thị thông tin browser

### 2. ✅ Validate parameters
- Kiểm tra browser accessibility
- Validate logs permissions
- Kiểm tra console access

### 3. 📝 Thực hiện lấy logs
- Gọi `mcp_Browser_browser_get_console_logs` với parameters
- Xử lý lỗi console access nếu có
- Lấy kết quả console logs

### 4. 📊 Phân tích kết quả
- Hiển thị console logs
- Phân tích log patterns
- Gợi ý sử dụng logs

## Kết quả mong đợi
- 📝 **Console logs** từ browser
- 📈 **Log patterns** analysis
- 🎯 **Gợi ý** sử dụng logs
- ✅ **Thông tin** browser và console

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Browser Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi console access và permissions

## Ví dụ sử dụng
```
/browser-console-logs
```

## Troubleshooting
- **Browser không hoạt động**: Kiểm tra browser state
- **Console access denied**: Kiểm tra console permissions
- **No logs available**: Thông báo không có logs

