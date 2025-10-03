# Mongo Storage Size Command

## Mục đích
Xem kích thước storage của collection MongoDB.

## Cách sử dụng
```bash
/mongo-storage-size <database> <collection>
```

## Tham số
- `<database>`: Tên database (bắt buộc)
- `<collection>`: Tên collection (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định collection
- Kiểm tra database và collection tồn tại
- Xác thực quyền đọc
- Hiển thị thông tin collection

### 2. 📊 Lấy thông tin storage
- Gọi `mcp_MongoDB_collection-storage-size` với parameters
- Phân tích kích thước storage
- Xác định storage efficiency

### 3. 📋 Hiển thị kết quả
- Hiển thị kích thước storage
- Phân tích storage efficiency
- Gợi ý optimizations

## Kết quả mong đợi
- 📊 **Kích thước** storage của collection
- 📈 **Storage efficiency** analysis
- 🎯 **Gợi ý** optimizations
- ✅ **Thông tin** collection và storage

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi collection không tồn tại

## Ví dụ sử dụng
```
/mongo-storage-size docgo_production users
/mongo-storage-size docgo_production contracts
/mongo-storage-size docgo_production documents
```

## Troubleshooting
- **Collection không tồn tại**: Gợi ý tạo collection mới
- **Collection trống**: Thông báo không có dữ liệu
- **Permission denied**: Kiểm tra quyền đọc storage info
