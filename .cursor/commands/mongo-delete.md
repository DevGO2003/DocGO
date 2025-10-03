# Mongo Delete Command

## Mục đích
Xóa một hoặc nhiều documents từ collection MongoDB.

## Cách sử dụng
```bash
/mongo-delete <database> <collection> <filter> [confirm]
```

## Tham số
- `<database>`: Tên database (bắt buộc)
- `<collection>`: Tên collection (bắt buộc)
- `<filter>`: JSON filter conditions (bắt buộc)
- `[confirm]`: Xác nhận xóa (--confirm hoặc --yes)

## Quy trình thực hiện

### 1. 🔍 Xác định collection
- Kiểm tra database và collection tồn tại
- Xác thực quyền xóa
- Hiển thị thông tin collection

### 2. ⚠️ Cảnh báo và xác nhận
- Hiển thị số documents sẽ bị xóa
- Cảnh báo về tác động của việc xóa
- Yêu cầu xác nhận từ người dùng

### 3. 🗑️ Thực hiện xóa
- Gọi `mcp_MongoDB_delete-many` với filter
- Xử lý lỗi permission nếu có
- Lấy kết quả delete

### 4. 📊 Báo cáo kết quả
- Hiển thị số documents đã xóa
- Thống kê thành công/thất bại
- Cảnh báo về tác động

## Kết quả mong đợi
- 🗑️ **Số documents** đã xóa
- 📈 **Thống kê** thành công/thất bại
- ⚠️ **Cảnh báo** về tác động
- ✅ **Xác nhận** hoàn thành

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi permission và validation
- **CẢNH BÁO** về tác động không thể hoàn tác

## Ví dụ sử dụng
```
/mongo-delete docgo_production users {"status": "inactive"} --confirm
/mongo-delete docgo_production contracts {"expired": true} --yes
```

## Troubleshooting
- **Collection không tồn tại**: Gợi ý tạo collection mới
- **Filter không hợp lệ**: Kiểm tra JSON syntax
- **Không có documents phù hợp**: Thông báo và gợi ý filter khác
- **Permission denied**: Kiểm tra quyền xóa

