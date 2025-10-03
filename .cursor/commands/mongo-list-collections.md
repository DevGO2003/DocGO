# Mongo List Collections Command

## Mục đích
Liệt kê tất cả collections trong một database MongoDB cụ thể.

## Cách sử dụng
```bash
/mongo-list-collections <database-name>
```

## Tham số
- `<database-name>`: Tên database cần liệt kê collections (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định database
- Kiểm tra database có tồn tại không
- Xác thực quyền truy cập database
- Hiển thị thông tin database

### 2. 📊 Liệt kê collections
- Gọi `mcp_MongoDB_list-collections` với database name
- Lấy danh sách collections và thông tin cơ bản
- Phân loại collections theo mục đích sử dụng

### 3. 📋 Báo cáo kết quả
- Danh sách collections với thông tin chi tiết
- Thống kê tổng số collections
- Gợi ý collections quan trọng cho DocGO

## Kết quả mong đợi
- 📊 **Danh sách collections** trong database
- 📈 **Thống kê** tổng số collections
- 🎯 **Phân loại** collections theo mục đích
- ✅ **Thông tin database** được chọn

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi database không tồn tại

## Ví dụ sử dụng
```
/mongo-list-collections docgo_production
→ Hiển thị collections: users, contracts, documents, events, notifications
```

## Troubleshooting
- **Database không tồn tại**: Gợi ý tạo database mới
- **Lỗi quyền**: Kiểm tra permissions cho database
- **Database trống**: Thông báo không có collections
