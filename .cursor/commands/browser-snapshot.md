# Browser Snapshot Command

## Mục đích
Chụp ảnh màn hình trang web hiện tại.

## Cách sử dụng
```bash
/browser-snapshot
```

## Tham số
- Không có tham số

## Quy trình thực hiện

### 1. 🔍 Xác định trang hiện tại
- Kiểm tra trang web đã load
- Xác thực quyền chụp ảnh
- Hiển thị thông tin trang

### 2. ✅ Validate parameters
- Kiểm tra page accessibility
- Validate screenshot permissions
- Kiểm tra browser state

### 3. 📸 Thực hiện chụp ảnh
- Gọi `mcp_Browser_browser_snapshot` với parameters
- Xử lý lỗi accessibility nếu có
- Lấy kết quả snapshot

### 4. 📊 Phân tích kết quả
- Hiển thị ảnh đã chụp
- Phân tích page structure
- Gợi ý sử dụng snapshot

## Kết quả mong đợi
- 📸 **Ảnh màn hình** trang web
- 📈 **Page structure** analysis
- 🎯 **Gợi ý** sử dụng snapshot
- ✅ **Thông tin** trang và accessibility

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Browser Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi accessibility và permissions

## Ví dụ sử dụng
```
/browser-snapshot
```

## Troubleshooting
- **Page không load**: Kiểm tra trang web đã load
- **Accessibility error**: Kiểm tra page accessibility
- **Screenshot failed**: Kiểm tra browser permissions

