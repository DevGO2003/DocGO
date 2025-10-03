# Browser Press Key Command

## Mục đích
Nhấn phím trên bàn phím.

## Cách sử dụng
```bash
/browser-press-key <key>
```

## Tham số
- `<key>`: Tên phím cần nhấn (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định phím
- Kiểm tra phím hợp lệ
- Xác thực quyền nhấn phím
- Hiển thị thông tin phím

### 2. ✅ Validate parameters
- Kiểm tra key name hợp lệ
- Validate keyboard permissions
- Kiểm tra key accessibility

### 3. ⌨️ Thực hiện nhấn phím
- Gọi `mcp_Browser_browser_press_key` với parameters
- Xử lý lỗi key không hợp lệ
- Lấy kết quả key press

### 4. 📊 Phân tích kết quả
- Hiển thị phím đã nhấn
- Phân tích key press results
- Gợi ý sử dụng phím

## Kết quả mong đợi
- ⌨️ **Phím** đã nhấn thành công
- 📈 **Key press results** analysis
- 🎯 **Gợi ý** sử dụng phím
- ✅ **Thông tin** key và page

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Browser Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi key không hợp lệ

## Ví dụ sử dụng
```
/browser-press-key Enter
/browser-press-key Escape
/browser-press-key Tab
/browser-press-key ArrowLeft
```

## Troubleshooting
- **Key không hợp lệ**: Kiểm tra key name
- **Key press failed**: Kiểm tra keyboard permissions
- **Permission denied**: Kiểm tra key press permissions
