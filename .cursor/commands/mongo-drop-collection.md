# Mongo Drop Collection Command

## Mục đích
Xóa collection khỏi database MongoDB.

## Cách sử dụng
```bash
/mongo-drop-collection <database> <collection> [confirm]
```

## Tham số
- `<database>`: Tên database (bắt buộc)
- `<collection>`: Tên collection (bắt buộc)
- `[confirm]`: Xác nhận xóa (--confirm hoặc --yes)

## Quy trình thực hiện

### 1. 🔍 Xác định collection
- Kiểm tra database và collection tồn tại
- Xác thực quyền xóa
- Hiển thị thông tin collection

### 2. ⚠️ Cảnh báo và xác nhận
- Hiển thị số documents trong collection
- Cảnh báo về tác động của việc xóa
- Yêu cầu xác nhận từ người dùng

### 3. 🗑️ Thực hiện xóa
- Gọi `mcp_MongoDB_drop-collection` với parameters
- Xử lý lỗi permission nếu có
- Lấy kết quả drop

### 4. 📊 Báo cáo kết quả
- Hiển thị collection đã xóa
- Thống kê thành công/thất bại
- Cảnh báo về tác động

## Kết quả mong đợi
- 🗑️ **Collection** đã xóa thành công
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
/mongo-drop-collection docgo_production users --confirm
/mongo-drop-collection docgo_production contracts --yes
```

## Troubleshooting
- **Collection không tồn tại**: Thông báo collection không có
- **Permission denied**: Kiểm tra quyền xóa collection
- **Database không tồn tại**: Gợi ý tạo database mới
