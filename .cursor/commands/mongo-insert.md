# Mongo Insert Command

## Mục đích
Thêm một hoặc nhiều documents mới vào collection MongoDB.

## Cách sử dụng
```bash
/mongo-insert <database> <collection> <documents>
```

## Tham số
- `<database>`: Tên database (bắt buộc)
- `<collection>`: Tên collection (bắt buộc)
- `<documents>`: JSON array của documents cần thêm (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định collection
- Kiểm tra database và collection tồn tại
- Xác thực quyền ghi
- Hiển thị thông tin collection

### 2. ✅ Validate documents
- Kiểm tra JSON syntax của documents
- Validate required fields
- Kiểm tra data types

### 3. 📝 Thực hiện insert
- Gọi `mcp_MongoDB_insert-many` với documents
- Xử lý lỗi duplicate key nếu có
- Lấy kết quả insert

### 4. 📊 Báo cáo kết quả
- Hiển thị số documents đã thêm
- Hiển thị IDs của documents mới
- Thống kê thành công/thất bại

## Kết quả mong đợi
- ✅ **Số documents** đã thêm thành công
- 🆔 **IDs** của documents mới
- 📈 **Thống kê** thành công/thất bại
- ⚠️ **Lỗi** nếu có (duplicate key, validation)

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi validation và duplicate key

## Ví dụ sử dụng
```
/mongo-insert docgo_production users [{"name": "John", "email": "john@example.com"}]
/mongo-insert docgo_production contracts [{"title": "Contract 1", "status": "draft"}, {"title": "Contract 2", "status": "active"}]
```

## Troubleshooting
- **Collection không tồn tại**: Tự động tạo collection mới
- **JSON không hợp lệ**: Kiểm tra syntax và format
- **Duplicate key**: Hiển thị lỗi và gợi ý sửa
- **Validation error**: Hiển thị field bị lỗi và gợi ý sửa

