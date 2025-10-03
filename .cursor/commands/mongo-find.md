# Mongo Find Command

## Mục đích
Tìm kiếm documents trong một collection MongoDB với các điều kiện lọc.

## Cách sử dụng
```bash
/mongo-find <database> <collection> [filter] [options]
```

## Tham số
- `<database>`: Tên database (bắt buộc)
- `<collection>`: Tên collection (bắt buộc)
- `[filter]`: JSON filter conditions (tùy chọn)
- `[options]`: Tùy chọn tìm kiếm (limit, sort, projection)

## Quy trình thực hiện

### 1. 🔍 Xác định collection
- Kiểm tra database và collection tồn tại
- Xác thực quyền truy cập
- Hiển thị thông tin collection

### 2. 🔎 Thực hiện tìm kiếm
- Gọi `mcp_MongoDB_find` với parameters
- Áp dụng filter conditions nếu có
- Áp dụng options (limit, sort, projection)

### 3. 📊 Phân tích kết quả
- Hiển thị documents tìm được
- Thống kê số lượng results
- Phân tích patterns trong data

## Kết quả mong đợi
- 📊 **Documents** tìm được
- 📈 **Thống kê** số lượng results
- 🎯 **Phân tích** patterns trong data
- ✅ **Thông tin** collection và filter

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi collection không tồn tại

## Ví dụ sử dụng
```
/mongo-find docgo_production users {"status": "active"}
/mongo-find docgo_production contracts {"type": "employment"} --limit 10
/mongo-find docgo_production documents {} --sort "createdAt" --limit 5
```

## Troubleshooting
- **Collection không tồn tại**: Gợi ý tạo collection mới
- **Filter không hợp lệ**: Kiểm tra JSON syntax
- **Kết quả trống**: Thông báo không có documents phù hợp
- **Timeout**: Giảm limit hoặc tối ưu filter

