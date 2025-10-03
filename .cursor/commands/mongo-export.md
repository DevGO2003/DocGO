# Mongo Export Command

## Mục đích
Export dữ liệu từ collection MongoDB sang định dạng EJSON.

## Cách sử dụng
```bash
/mongo-export <database> <collection> <exportTitle> <exportTarget> [options]
```

## Tham số
- `<database>`: Tên database (bắt buộc)
- `<collection>`: Tên collection (bắt buộc)
- `<exportTitle>`: Tiêu đề export (bắt buộc)
- `<exportTarget>`: JSON object định nghĩa export target (bắt buộc)
- `[options]`: Tùy chọn (jsonExportFormat, responseBytesLimit)

## Quy trình thực hiện

### 1. 🔍 Xác định collection
- Kiểm tra database và collection tồn tại
- Xác thực quyền đọc
- Hiển thị thông tin collection

### 2. ✅ Validate export parameters
- Kiểm tra JSON syntax của exportTarget
- Validate export format
- Kiểm tra export size limits

### 3. 📤 Thực hiện export
- Gọi `mcp_MongoDB_export` với parameters
- Xử lý lỗi timeout nếu có
- Lấy kết quả export

### 4. 📊 Báo cáo kết quả
- Hiển thị export đã hoàn thành
- Phân tích kích thước export
- Gợi ý sử dụng dữ liệu

## Kết quả mong đợi
- 📤 **Export** đã hoàn thành
- 📈 **Kích thước** và format export
- 🎯 **Gợi ý** sử dụng dữ liệu
- ✅ **Thông tin** export và collection

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi timeout và size limits

## Ví dụ sử dụng
```
/mongo-export docgo_production users "Users Export" {"name": "find", "arguments": {}}
/mongo-export docgo_production contracts "Contracts Export" {"name": "aggregate", "arguments": {"pipeline": [{"$match": {"status": "active"}}]}}
```

## Troubleshooting
- **Collection không tồn tại**: Gợi ý tạo collection mới
- **Export target không hợp lệ**: Kiểm tra MongoDB export syntax
- **Timeout**: Tăng responseBytesLimit hoặc giảm kích thước export
- **Permission denied**: Kiểm tra quyền export
