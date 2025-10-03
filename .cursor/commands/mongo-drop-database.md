# Mongo Drop Database Command

## Mục đích
Xóa toàn bộ database MongoDB.

## Cách sử dụng
```bash
/mongo-drop-database <database> [confirm]
```

## Tham số
- `<database>`: Tên database (bắt buộc)
- `[confirm]`: Xác nhận xóa (--confirm hoặc --yes)

## Quy trình thực hiện

### 1. 🔍 Xác định database
- Kiểm tra database tồn tại
- Xác thực quyền xóa
- Hiển thị thông tin database

### 2. ⚠️ Cảnh báo và xác nhận
- Hiển thị số collections trong database
- Cảnh báo về tác động của việc xóa
- Yêu cầu xác nhận từ người dùng

### 3. 🗑️ Thực hiện xóa
- Gọi `mcp_MongoDB_drop-database` với parameters
- Xử lý lỗi permission nếu có
- Lấy kết quả drop

### 4. 📊 Báo cáo kết quả
- Hiển thị database đã xóa
- Thống kê thành công/thất bại
- Cảnh báo về tác động

## Kết quả mong đợi
- 🗑️ **Database** đã xóa thành công
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
/mongo-drop-database docgo_production --confirm
/mongo-drop-database docgo_testing --yes
```

## Troubleshooting
- **Database không tồn tại**: Thông báo database không có
- **Permission denied**: Kiểm tra quyền xóa database
- **Database đang sử dụng**: Gợi ý dừng connections trước

