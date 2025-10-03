# Mongo DB Stats Command

## Mục đích
Xem thống kê chi tiết của database MongoDB.

## Cách sử dụng
```bash
/mongo-db-stats <database>
```

## Tham số
- `<database>`: Tên database (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định database
- Kiểm tra database tồn tại
- Xác thực quyền đọc
- Hiển thị thông tin database

### 2. 📊 Lấy thống kê database
- Gọi `mcp_MongoDB_db-stats` với parameters
- Phân tích thống kê database
- Xác định performance metrics

### 3. 📋 Hiển thị kết quả
- Hiển thị thống kê database
- Phân tích performance metrics
- Gợi ý optimizations

## Kết quả mong đợi
- 📊 **Thống kê** database chi tiết
- 📈 **Performance metrics** analysis
- 🎯 **Gợi ý** optimizations
- ✅ **Thông tin** database và stats

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi database không tồn tại

## Ví dụ sử dụng
```
/mongo-db-stats docgo_production
/mongo-db-stats docgo_development
/mongo-db-stats docgo_testing
```

## Troubleshooting
- **Database không tồn tại**: Gợi ý tạo database mới
- **Database trống**: Thông báo không có collections
- **Permission denied**: Kiểm tra quyền đọc database stats

