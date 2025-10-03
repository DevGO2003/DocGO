# Mongo Logs Command

## Mục đích
Xem MongoDB logs để debug và monitor.

## Cách sử dụng
```bash
/mongo-logs [type] [limit]
```

## Tham số
- `[type]`: Loại logs (global, startupWarnings) - mặc định: global
- `[limit]`: Số lượng log entries tối đa (1-1024) - mặc định: 50

## Quy trình thực hiện

### 1. 🔍 Xác định log type
- Kiểm tra log type hợp lệ
- Xác thực quyền đọc logs
- Hiển thị thông tin log type

### 2. 📊 Lấy logs
- Gọi `mcp_MongoDB_mongodb-logs` với parameters
- Phân tích log entries
- Xác định patterns và errors

### 3. 📋 Hiển thị kết quả
- Hiển thị log entries
- Phân tích patterns và errors
- Gợi ý troubleshooting

## Kết quả mong đợi
- 📊 **Log entries** từ MongoDB
- 📈 **Patterns** và errors analysis
- 🎯 **Gợi ý** troubleshooting
- ✅ **Thông tin** log type và limit

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi log access

## Ví dụ sử dụng
```
/mongo-logs
/mongo-logs global 100
/mongo-logs startupWarnings 20
```

## Troubleshooting
- **Log access denied**: Kiểm tra quyền đọc logs
- **No logs available**: Thông báo không có logs
- **Invalid log type**: Kiểm tra log type hợp lệ
