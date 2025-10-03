# Mongo Create Collection Command

## Mục đích
Tạo collection mới trong database MongoDB.

## Cách sử dụng
```bash
/mongo-create-collection <database> <collection>
```

## Tham số
- `<database>`: Tên database (bắt buộc)
- `<collection>`: Tên collection (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định database
- Kiểm tra database tồn tại
- Xác thực quyền ghi
- Hiển thị thông tin database

### 2. ✅ Validate collection name
- Kiểm tra collection name hợp lệ
- Kiểm tra collection đã tồn tại
- Validate MongoDB naming rules

### 3. 🔄 Tạo collection
- Gọi `mcp_MongoDB_create-collection` với parameters
- Xử lý lỗi duplicate nếu có
- Lấy kết quả tạo collection

### 4. 📊 Báo cáo kết quả
- Hiển thị collection đã tạo
- Phân tích cấu trúc collection
- Gợi ý sử dụng collection

## Kết quả mong đợi
- ✅ **Collection** đã tạo thành công
- 📈 **Cấu trúc** collection mới
- 🎯 **Gợi ý** sử dụng collection
- ✅ **Thông tin** database và collection

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi duplicate collection

## Ví dụ sử dụng
```
/mongo-create-collection docgo_production users
/mongo-create-collection docgo_production contracts
/mongo-create-collection docgo_production documents
```

## Troubleshooting
- **Database không tồn tại**: Tự động tạo database mới
- **Collection đã tồn tại**: Thông báo collection đã có
- **Invalid collection name**: Kiểm tra MongoDB naming rules
- **Permission denied**: Kiểm tra quyền tạo collection
