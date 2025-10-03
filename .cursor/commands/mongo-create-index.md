# Mongo Create Index Command

## Mục đích
Tạo index mới cho collection MongoDB để tối ưu performance.

## Cách sử dụng
```bash
/mongo-create-index <database> <collection> <keys> [name]
```

## Tham số
- `<database>`: Tên database (bắt buộc)
- `<collection>`: Tên collection (bắt buộc)
- `<keys>`: JSON object định nghĩa index keys (bắt buộc)
- `[name]`: Tên index (tùy chọn, tự động generate nếu không có)

## Quy trình thực hiện

### 1. 🔍 Xác định collection
- Kiểm tra database và collection tồn tại
- Xác thực quyền ghi
- Hiển thị thông tin collection

### 2. ✅ Validate index keys
- Kiểm tra JSON syntax của keys
- Validate index key structure
- Kiểm tra duplicate index

### 3. 🔄 Tạo index
- Gọi `mcp_MongoDB_create-index` với parameters
- Xử lý lỗi duplicate nếu có
- Lấy kết quả tạo index

### 4. 📊 Báo cáo kết quả
- Hiển thị index đã tạo
- Phân tích performance impact
- Gợi ý optimizations

## Kết quả mong đợi
- ✅ **Index** đã tạo thành công
- 📈 **Performance impact** của index
- 🎯 **Gợi ý** optimizations
- ✅ **Thông tin** index và collection

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi duplicate index

## Ví dụ sử dụng
```
/mongo-create-index docgo_production users {"email": 1}
/mongo-create-index docgo_production contracts {"status": 1, "createdAt": -1}
/mongo-create-index docgo_production documents {"title": "text", "content": "text"}
```

## Troubleshooting
- **Collection không tồn tại**: Gợi ý tạo collection mới
- **Index keys không hợp lệ**: Kiểm tra MongoDB index syntax
- **Duplicate index**: Thông báo index đã tồn tại
- **Permission denied**: Kiểm tra quyền tạo index

