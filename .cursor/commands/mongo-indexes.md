# Mongo Indexes Command

## Mục đích
Hiển thị tất cả indexes của collection MongoDB.

## Cách sử dụng
```bash
/mongo-indexes <database> <collection>
```

## Tham số
- `<database>`: Tên database (bắt buộc)
- `<collection>`: Tên collection (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định collection
- Kiểm tra database và collection tồn tại
- Xác thực quyền đọc
- Hiển thị thông tin collection

### 2. 📊 Lấy thông tin indexes
- Gọi `mcp_MongoDB_collection-indexes` với parameters
- Phân tích cấu trúc indexes
- Xác định performance impact

### 3. 📋 Hiển thị indexes
- Hiển thị danh sách indexes
- Phân tích performance của từng index
- Gợi ý optimizations

## Kết quả mong đợi
- 📊 **Danh sách indexes** của collection
- 📈 **Performance analysis** của indexes
- 🎯 **Gợi ý** optimizations
- ✅ **Thông tin** collection và index stats

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi collection không tồn tại

## Ví dụ sử dụng
```
/mongo-indexes docgo_production users
/mongo-indexes docgo_production contracts
/mongo-indexes docgo_production documents
```

## Troubleshooting
- **Collection không tồn tại**: Gợi ý tạo collection mới
- **Không có indexes**: Thông báo collection chưa có indexes
- **Permission denied**: Kiểm tra quyền đọc indexes

