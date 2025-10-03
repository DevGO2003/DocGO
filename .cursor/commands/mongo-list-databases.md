# Mongo List Databases Command

## Mục đích
Liệt kê tất cả databases có sẵn trong MongoDB cluster.

## Cách sử dụng
```bash
/mongo-list-databases
```

## Quy trình thực hiện

### 1. 🔌 Kết nối MongoDB
- Sử dụng MCP MongoDB Server để kết nối
- Xác thực credentials nếu cần
- Kiểm tra trạng thái kết nối

### 2. 📊 Liệt kê databases
- Gọi `mcp_MongoDB_list-databases` để lấy danh sách
- Hiển thị tên database và thông tin cơ bản
- Phân loại databases theo mục đích sử dụng

### 3. 📋 Báo cáo kết quả
- Danh sách databases với thông tin chi tiết
- Thống kê tổng số databases
- Gợi ý database phù hợp cho dự án DocGO

## Kết quả mong đợi
- 📊 **Danh sách databases** có sẵn
- 📈 **Thống kê** tổng số databases
- 🎯 **Gợi ý** database phù hợp
- ✅ **Trạng thái kết nối** MongoDB

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi kết nối

## Ví dụ sử dụng
```
/mongo-list-databases
→ Hiển thị danh sách databases: docgo_production, docgo_development, docgo_testing
```

## Troubleshooting
- **Lỗi kết nối**: Kiểm tra MongoDB connection string
- **Lỗi quyền**: Kiểm tra credentials và permissions
- **Timeout**: Tăng thời gian timeout nếu cần
