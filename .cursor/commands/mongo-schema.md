# Mongo Schema Command

## Mục đích
Phân tích và hiển thị schema của collection MongoDB.

## Cách sử dụng
```bash
/mongo-schema <database> <collection> [options]
```

## Tham số
- `<database>`: Tên database (bắt buộc)
- `<collection>`: Tên collection (bắt buộc)
- `[options]`: Tùy chọn (sampleSize, responseBytesLimit)

## Quy trình thực hiện

### 1. 🔍 Xác định collection
- Kiểm tra database và collection tồn tại
- Xác thực quyền đọc
- Hiển thị thông tin collection

### 2. 📊 Phân tích schema
- Gọi `mcp_MongoDB_collection-schema` với parameters
- Phân tích cấu trúc documents
- Xác định fields và data types

### 3. 📋 Hiển thị schema
- Hiển thị schema structure
- Phân tích data types và constraints
- Gợi ý optimizations

## Kết quả mong đợi
- 📊 **Schema structure** của collection
- 📈 **Data types** và constraints
- 🎯 **Gợi ý** optimizations
- ✅ **Thông tin** collection và sample size

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi collection không tồn tại

## Ví dụ sử dụng
```
/mongo-schema docgo_production users
/mongo-schema docgo_production contracts --sampleSize 100
/mongo-schema docgo_production documents --responseBytesLimit 1048576
```

## Troubleshooting
- **Collection không tồn tại**: Gợi ý tạo collection mới
- **Collection trống**: Thông báo không có documents để phân tích
- **Timeout**: Giảm sampleSize hoặc responseBytesLimit
