# Browser Go Back Command

## Mục đích
Quay lại trang trước trong browser history.

## Cách sử dụng
```bash
/browser-back
```

## Tham số
- Không có tham số

## Quy trình thực hiện

### 1. 🔍 Xác định history
- Kiểm tra browser history
- Xác thực có trang trước
- Hiển thị thông tin history

### 2. ✅ Validate parameters
- Kiểm tra history availability
- Validate navigation permissions
- Kiểm tra back button access

### 3. ⬅️ Thực hiện quay lại
- Gọi `mcp_Browser_browser_go_back` với parameters
- Xử lý lỗi history nếu có
- Lấy kết quả navigation

### 4. 📊 Phân tích kết quả
- Hiển thị trang đã quay lại
- Phân tích page content
- Gợi ý sử dụng page

## Kết quả mong đợi
- ⬅️ **Trang trước** đã load thành công
- 📈 **Page content** analysis
- 🎯 **Gợi ý** sử dụng page
- ✅ **Thông tin** navigation history

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Browser Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi history và navigation

## Ví dụ sử dụng
```
/browser-back
```

## Troubleshooting
- **Không có history**: Thông báo không có trang trước
- **Navigation failed**: Kiểm tra browser state
- **Page không load**: Kiểm tra URL accessibility

