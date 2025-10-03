# Mongo Rename Collection Command

## Mục đích
Đổi tên collection trong database MongoDB.

## Cách sử dụng
```bash
/mongo-rename-collection <database> <collection> <newName> [options]
```

## Tham số
- `<database>`: Tên database (bắt buộc)
- `<collection>`: Tên collection hiện tại (bắt buộc)
- `<newName>`: Tên collection mới (bắt buộc)
- `[options]`: Tùy chọn (dropTarget)

## Quy trình thực hiện

### 1. 🔍 Xác định collection
- Kiểm tra database và collection tồn tại
- Xác thực quyền ghi
- Hiển thị thông tin collection

### 2. ✅ Validate new name
- Kiểm tra tên mới hợp lệ
- Kiểm tra collection mới đã tồn tại
- Validate MongoDB naming rules

### 3. 🔄 Thực hiện rename
- Gọi `mcp_MongoDB_rename-collection` với parameters
- Xử lý lỗi duplicate nếu có
- Lấy kết quả rename

### 4. 📊 Báo cáo kết quả
- Hiển thị collection đã đổi tên
- Phân tích cấu trúc collection mới
- Gợi ý sử dụng collection mới

## Kết quả mong đợi
- ✅ **Collection** đã đổi tên thành công
- 📈 **Cấu trúc** collection mới
- 🎯 **Gợi ý** sử dụng collection mới
- ✅ **Thông tin** database và collection

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi duplicate collection

## Ví dụ sử dụng
```
/mongo-rename-collection docgo_production users user_accounts
/mongo-rename-collection docgo_production contracts contract_documents
/mongo-rename-collection docgo_production documents document_files --dropTarget
```

## Troubleshooting
- **Collection không tồn tại**: Thông báo collection không có
- **Collection mới đã tồn tại**: Sử dụng --dropTarget hoặc chọn tên khác
- **Invalid new name**: Kiểm tra MongoDB naming rules
- **Permission denied**: Kiểm tra quyền rename collection

