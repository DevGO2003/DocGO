# Mongo Count Command

## Mục đích
Đếm số lượng documents trong một collection MongoDB với điều kiện lọc.

## Cách sử dụng
```bash
/mongo-count <database> <collection> [filter]
```

## Tham số
- `<database>`: Tên database (bắt buộc)
- `<collection>`: Tên collection (bắt buộc)
- `[filter]`: JSON filter conditions (tùy chọn, mặc định: {})

## Quy trình thực hiện

### 1. 🔍 Xác định collection
- Kiểm tra database và collection tồn tại
- Xác thực quyền truy cập
- Hiển thị thông tin collection

### 2. 🔢 Thực hiện đếm
- Gọi `mcp_MongoDB_count` với parameters
- Áp dụng filter conditions nếu có
- Lấy kết quả count

### 3. 📊 Phân tích kết quả
- Hiển thị số lượng documents
- So sánh với tổng số documents
- Phân tích distribution theo filter

## Kết quả mong đợi
- 🔢 **Số lượng** documents phù hợp
- 📈 **Tỷ lệ** so với tổng số documents
- 🎯 **Phân tích** distribution theo filter
- ✅ **Thông tin** collection và filter

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi collection không tồn tại

## Ví dụ sử dụng
```
/mongo-count docgo_production users
/mongo-count docgo_production contracts {"status": "active"}
/mongo-count docgo_production documents {"type": "contract"}
```

## Troubleshooting
- **Collection không tồn tại**: Gợi ý tạo collection mới
- **Filter không hợp lệ**: Kiểm tra JSON syntax
- **Timeout**: Tối ưu filter hoặc sử dụng index

