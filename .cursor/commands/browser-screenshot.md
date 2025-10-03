# Browser Screenshot Command

## Mục đích
Chụp ảnh màn hình trang web hiện tại.

## Cách sử dụng
```bash
/browser-screenshot
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
- Gọi `mcp_Browser_browser_screenshot` với parameters
- Xử lý lỗi screenshot nếu có
- Lấy kết quả screenshot

### 4. 📊 Phân tích kết quả
- Hiển thị ảnh đã chụp
- Phân tích screenshot results
- Gợi ý sử dụng screenshot

## Kết quả mong đợi
- 📸 **Ảnh màn hình** trang web
- 📈 **Screenshot results** analysis
- 🎯 **Gợi ý** sử dụng screenshot
- ✅ **Thông tin** trang và browser

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Browser Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi screenshot và permissions

## Ví dụ sử dụng
```
/browser-screenshot
```

## Troubleshooting
- **Page không load**: Kiểm tra trang web đã load
- **Screenshot failed**: Kiểm tra browser permissions
- **Permission denied**: Kiểm tra screenshot permissions

