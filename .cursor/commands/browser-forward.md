# Browser Go Forward Command

## Mục đích
Đi tới trang tiếp theo trong browser history.

## Cách sử dụng
```bash
/browser-forward
```

## Tham số
- Không có tham số

## Quy trình thực hiện

### 1. 🔍 Xác định history
- Kiểm tra browser history
- Xác thực có trang tiếp theo
- Hiển thị thông tin history

### 2. ✅ Validate parameters
- Kiểm tra history availability
- Validate navigation permissions
- Kiểm tra forward button access

### 3. ➡️ Thực hiện đi tới
- Gọi `mcp_Browser_browser_go_forward` với parameters
- Xử lý lỗi history nếu có
- Lấy kết quả navigation

### 4. 📊 Phân tích kết quả
- Hiển thị trang đã đi tới
- Phân tích page content
- Gợi ý sử dụng page

## Kết quả mong đợi
- ➡️ **Trang tiếp theo** đã load thành công
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
/browser-forward
```

## Troubleshooting
- **Không có history**: Thông báo không có trang tiếp theo
- **Navigation failed**: Kiểm tra browser state
- **Page không load**: Kiểm tra URL accessibility

