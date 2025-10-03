# Mongo Update Command

## Mục đích
Cập nhật một hoặc nhiều documents trong collection MongoDB.

## Cách sử dụng
```bash
/mongo-update <database> <collection> <filter> <update> [options]
```

## Tham số
- `<database>`: Tên database (bắt buộc)
- `<collection>`: Tên collection (bắt buộc)
- `<filter>`: JSON filter conditions (bắt buộc)
- `<update>`: JSON update operations (bắt buộc)
- `[options]`: Tùy chọn (upsert, multi)

## Quy trình thực hiện

### 1. 🔍 Xác định collection
- Kiểm tra database và collection tồn tại
- Xác thực quyền ghi
- Hiển thị thông tin collection

### 2. ✅ Validate parameters
- Kiểm tra JSON syntax của filter và update
- Validate update operations
- Kiểm tra options hợp lệ

### 3. 🔄 Thực hiện update
- Gọi `mcp_MongoDB_update-many` với parameters
- Xử lý lỗi validation nếu có
- Lấy kết quả update

### 4. 📊 Báo cáo kết quả
- Hiển thị số documents đã cập nhật
- Hiển thị documents trước và sau update
- Thống kê thành công/thất bại

## Kết quả mong đợi
- ✅ **Số documents** đã cập nhật
- 📝 **Thay đổi** trong documents
- 📈 **Thống kê** thành công/thất bại
- ⚠️ **Lỗi** nếu có (validation, permission)

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi validation và permission

## Ví dụ sử dụng
```
/mongo-update docgo_production users {"status": "inactive"} {"$set": {"status": "active"}}
/mongo-update docgo_production contracts {"type": "employment"} {"$set": {"status": "approved"}} --upsert
```

## Troubleshooting
- **Collection không tồn tại**: Gợi ý tạo collection mới
- **Filter không hợp lệ**: Kiểm tra JSON syntax
- **Update operations không hợp lệ**: Kiểm tra MongoDB update syntax
- **Không có documents phù hợp**: Thông báo và gợi ý filter khác
