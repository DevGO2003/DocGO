# Mongo Switch Command

## Mục đích
Chuyển đổi MongoDB connection sang connection string khác.

## Cách sử dụng
```bash
/mongo-switch [connectionString]
```

## Tham số
- `[connectionString]`: MongoDB connection string (tùy chọn, sử dụng config mặc định nếu không có)

## Quy trình thực hiện

### 1. 🔍 Xác định connection
- Kiểm tra connection string hiện tại
- Validate connection string format
- Hiển thị thông tin connection

### 2. 🔄 Chuyển đổi connection
- Gọi `mcp_MongoDB_switch-connection` với connectionString
- Xử lý lỗi connection nếu có
- Lấy kết quả switch

### 3. 📊 Báo cáo kết quả
- Hiển thị connection mới
- Kiểm tra trạng thái kết nối
- Gợi ý sử dụng connection mới

## Kết quả mong đợi
- 🔄 **Connection** đã chuyển đổi
- 📈 **Trạng thái** kết nối mới
- 🎯 **Gợi ý** sử dụng connection
- ✅ **Thông tin** connection string

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi connection và authentication

## Ví dụ sử dụng
```
/mongo-switch
/mongo-switch mongodb://localhost:27017/docgo_production
/mongo-switch mongodb+srv://user:pass@cluster.mongodb.net/docgo_production
```

## Troubleshooting
- **Connection string không hợp lệ**: Kiểm tra MongoDB connection string format
- **Authentication failed**: Kiểm tra credentials
- **Network timeout**: Kiểm tra network và firewall
- **Database không tồn tại**: Gợi ý tạo database mới
