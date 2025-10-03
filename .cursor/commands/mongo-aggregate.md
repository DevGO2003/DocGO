# Mongo Aggregate Command

## Mục đích
Thực hiện aggregation pipeline trên collection MongoDB để phân tích dữ liệu phức tạp.

## Cách sử dụng
```bash
/mongo-aggregate <database> <collection> <pipeline>
```

## Tham số
- `<database>`: Tên database (bắt buộc)
- `<collection>`: Tên collection (bắt buộc)
- `<pipeline>`: JSON array của aggregation stages (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định collection
- Kiểm tra database và collection tồn tại
- Xác thực quyền đọc
- Hiển thị thông tin collection

### 2. ✅ Validate pipeline
- Kiểm tra JSON syntax của pipeline
- Validate aggregation stages
- Kiểm tra performance impact

### 3. 🔄 Thực hiện aggregation
- Gọi `mcp_MongoDB_aggregate` với pipeline
- Xử lý lỗi syntax nếu có
- Lấy kết quả aggregation

### 4. 📊 Phân tích kết quả
- Hiển thị kết quả aggregation
- Phân tích patterns trong data
- Gợi ý insights từ kết quả

## Kết quả mong đợi
- 📊 **Kết quả** aggregation pipeline
- 📈 **Phân tích** patterns trong data
- 🎯 **Insights** từ kết quả
- ✅ **Thông tin** pipeline và collection

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP MongoDB Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi syntax và performance

## Ví dụ sử dụng
```
/mongo-aggregate docgo_production users [{"$group": {"_id": "$status", "count": {"$sum": 1}}}]
/mongo-aggregate docgo_production contracts [{"$match": {"status": "active"}}, {"$group": {"_id": "$type", "total": {"$sum": "$value"}}}]
```

## Troubleshooting
- **Collection không tồn tại**: Gợi ý tạo collection mới
- **Pipeline không hợp lệ**: Kiểm tra MongoDB aggregation syntax
- **Performance chậm**: Gợi ý tối ưu pipeline hoặc sử dụng index
- **Memory limit**: Giảm kích thước pipeline hoặc sử dụng allowDiskUse
