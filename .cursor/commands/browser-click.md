# Browser Click Command

## Mục đích
Click vào element trên trang web.

## Cách sử dụng
```bash
/browser-click <element> <ref>
```

## Tham số
- `<element>`: Mô tả element cần click (bắt buộc)
- `<ref>`: Reference chính xác của element từ page snapshot (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định element
- Kiểm tra element tồn tại
- Xác thực quyền click
- Hiển thị thông tin element

### 2. ✅ Validate parameters
- Kiểm tra element reference hợp lệ
- Validate click permissions
- Kiểm tra element accessibility

### 3. 🖱️ Thực hiện click
- Gọi `mcp_Browser_browser_click` với parameters
- Xử lý lỗi element không tồn tại
- Lấy kết quả click

### 4. 📊 Phân tích kết quả
- Hiển thị element đã click
- Phân tích click results
- Gợi ý sử dụng element

## Kết quả mong đợi
- 🖱️ **Element** đã click thành công
- 📈 **Click results** analysis
- 🎯 **Gợi ý** sử dụng element
- ✅ **Thông tin** element và page

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Browser Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi element không tồn tại

## Ví dụ sử dụng
```
/browser-click "Login button" "button-login"
/browser-click "Submit form" "form-submit"
/browser-click "Navigation menu" "nav-menu"
```

## Troubleshooting
- **Element không tồn tại**: Kiểm tra element reference
- **Click failed**: Kiểm tra element accessibility
- **Permission denied**: Kiểm tra click permissions
