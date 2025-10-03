# Browser Hover Command

## Mục đích
Hover vào element trên trang web.

## Cách sử dụng
```bash
/browser-hover <element> <ref>
```

## Tham số
- `<element>`: Mô tả element cần hover (bắt buộc)
- `<ref>`: Reference chính xác của element từ page snapshot (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định element
- Kiểm tra element tồn tại
- Xác thực quyền hover
- Hiển thị thông tin element

### 2. ✅ Validate parameters
- Kiểm tra element reference hợp lệ
- Validate hover permissions
- Kiểm tra element accessibility

### 3. 🖱️ Thực hiện hover
- Gọi `mcp_Browser_browser_hover` với parameters
- Xử lý lỗi element không tồn tại
- Lấy kết quả hover

### 4. 📊 Phân tích kết quả
- Hiển thị element đã hover
- Phân tích hover results
- Gợi ý sử dụng element

## Kết quả mong đợi
- 🖱️ **Element** đã hover thành công
- 📈 **Hover results** analysis
- 🎯 **Gợi ý** sử dụng element
- ✅ **Thông tin** element và page

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Browser Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi element không tồn tại

## Ví dụ sử dụng
```
/browser-hover "Menu item" "menu-item-1"
/browser-hover "Tooltip trigger" "tooltip-trigger"
/browser-hover "Dropdown button" "dropdown-btn"
```

## Troubleshooting
- **Element không tồn tại**: Kiểm tra element reference
- **Hover failed**: Kiểm tra element accessibility
- **Permission denied**: Kiểm tra hover permissions

