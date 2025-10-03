# Browser Type Command

## Mục đích
Gõ text vào element trên trang web.

## Cách sử dụng
```bash
/browser-type <element> <ref> <text> [submit]
```

## Tham số
- `<element>`: Mô tả element cần gõ text (bắt buộc)
- `<ref>`: Reference chính xác của element từ page snapshot (bắt buộc)
- `<text>`: Text cần gõ (bắt buộc)
- `[submit]`: Có submit form sau khi gõ (true/false) (tùy chọn, mặc định: false)

## Quy trình thực hiện

### 1. 🔍 Xác định element
- Kiểm tra element tồn tại
- Xác thực quyền gõ text
- Hiển thị thông tin element

### 2. ✅ Validate parameters
- Kiểm tra element reference hợp lệ
- Validate text input permissions
- Kiểm tra element accessibility

### 3. ⌨️ Thực hiện gõ text
- Gọi `mcp_Browser_browser_type` với parameters
- Xử lý lỗi element không tồn tại
- Lấy kết quả typing

### 4. 📊 Phân tích kết quả
- Hiển thị text đã gõ
- Phân tích typing results
- Gợi ý sử dụng element

## Kết quả mong đợi
- ⌨️ **Text** đã gõ thành công
- 📈 **Typing results** analysis
- 🎯 **Gợi ý** sử dụng element
- ✅ **Thông tin** element và text

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Browser Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi element không tồn tại

## Ví dụ sử dụng
```
/browser-type "Username field" "input-username" "john_doe"
/browser-type "Password field" "input-password" "secret123"
/browser-type "Search box" "search-input" "query" --submit
```

## Troubleshooting
- **Element không tồn tại**: Kiểm tra element reference
- **Typing failed**: Kiểm tra element accessibility
- **Permission denied**: Kiểm tra typing permissions

