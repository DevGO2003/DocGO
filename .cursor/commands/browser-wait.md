# Browser Wait Command

## Mục đích
Chờ một khoảng thời gian trước khi thực hiện hành động tiếp theo.

## Cách sử dụng
```bash
/browser-wait <time>
```

## Tham số
- `<time>`: Thời gian chờ (giây) (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định thời gian
- Kiểm tra time hợp lệ
- Xác thực quyền chờ
- Hiển thị thông tin time

### 2. ✅ Validate parameters
- Kiểm tra time value hợp lệ
- Validate wait permissions
- Kiểm tra browser state

### 3. ⏳ Thực hiện chờ
- Gọi `mcp_Browser_browser_wait` với parameters
- Xử lý lỗi timeout nếu có
- Lấy kết quả wait

### 4. 📊 Phân tích kết quả
- Hiển thị thời gian đã chờ
- Phân tích wait results
- Gợi ý sử dụng wait

## Kết quả mong đợi
- ⏳ **Thời gian** đã chờ thành công
- 📈 **Wait results** analysis
- 🎯 **Gợi ý** sử dụng wait
- ✅ **Thông tin** time và browser state

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Browser Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi timeout và validation

## Ví dụ sử dụng
```
/browser-wait 5
/browser-wait 10
/browser-wait 30
```

## Troubleshooting
- **Time không hợp lệ**: Kiểm tra time value
- **Wait failed**: Kiểm tra browser state
- **Permission denied**: Kiểm tra wait permissions
