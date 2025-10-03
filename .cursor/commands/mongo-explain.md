# Mongo Explain Command

## Mục đích
Giải thích query execution plan của MongoDB query.

## Cách sử dụng
```bash
/mongo-explain <database> <collection> <method> [verbosity]
```

## Tham số
- `<database>`: Tên database (bắt buộc)
- `<collection>`: Tên collection (bắt buộc)
- `<method>`: JSON object định nghĩa method và arguments (bắt buộc)
- `[verbosity]`: Mức độ chi tiết (queryPlanner, executionStats, allPlansExecution)

## Quy trình thực hiện

### 1. 🔍 Xác định collection
- Kiểm tra database và collection tồn tại
- Xác thực quyền đọc
- Hiển thị thông tin collection

### 2. ✅ Validate method
- Kiểm tra JSON syntax của method
- Validate method arguments
- Kiểm tra verbosity level

### 3. 🔄 Thực hiện explain
- Gọi `mcp_MongoDB_explain` với parameters
- Xử lý lỗi syntax nếu có
- Lấy kết quả explain

### 4. 📊 Phân tích kết quả
- Hiển thị execution plan
- Phân tích performance metrics
- Gợi ý optimizations

## Kết quả mong đợi
- 📊 **Execution plan** chi tiết
- 📈 **Performance metrics** analysis
- 🎯 **Gợi ý** optimizations
- ✅ **Thông tin** query và collection

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi syntax và validation

## Ví dụ sử dụng
```
/mongo-explain docgo_production users {"name": "find", "arguments": {"filter": {"status": "active"}}}
/mongo-explain docgo_production contracts {"name": "aggregate", "arguments": {"pipeline": [{"$match": {"type": "employment"}}]}} --verbosity executionStats
```

## Troubleshooting
- **Collection không tồn tại**: Gợi ý tạo collection mới
- **Method không hợp lệ**: Kiểm tra MongoDB method syntax
- **Arguments không hợp lệ**: Kiểm tra method arguments
- **Permission denied**: Kiểm tra quyền explain query

