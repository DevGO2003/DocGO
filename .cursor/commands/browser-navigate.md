# Browser Navigate Command

## Mục đích
Điều hướng đến URL cụ thể trên web.

## Cách sử dụng
```bash
/browser-navigate <url>
```

## Tham số
- `<url>`: URL cần điều hướng đến (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định URL
- Kiểm tra URL hợp lệ
- Validate URL format
- Hiển thị thông tin URL

### 2. ✅ Validate parameters
- Kiểm tra URL syntax
- Validate accessibility
- Kiểm tra network connectivity

### 3. 🌐 Thực hiện điều hướng
- Gọi `mcp_Browser_browser_navigate` với URL
- Xử lý lỗi network nếu có
- Lấy kết quả navigation

### 4. 📊 Phân tích kết quả
- Hiển thị trang web đã load
- Phân tích page content
- Gợi ý sử dụng page

## Kết quả mong đợi
- 🌐 **Trang web** đã load thành công
- 📈 **Page content** analysis
- 🎯 **Gợi ý** sử dụng page
- ✅ **Thông tin** URL và page

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Browser Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi network và timeout

## Ví dụ sử dụng
```
/browser-navigate https://github.com
/browser-navigate https://docs.example.com
/browser-navigate https://app.example.com
```

## Troubleshooting
- **URL không hợp lệ**: Kiểm tra URL format
- **Network timeout**: Kiểm tra kết nối mạng
- **Page không load**: Kiểm tra URL accessibility
- **SSL errors**: Sử dụng HTTP thay vì HTTPS nếu cần

