# Mongo Command - Kết nối MongoDB qua MCP Server

## Mục đích
Khi người dùng cần làm việc với database, command này sẽ:
- **BẮT BUỘC sử dụng MCP MongoDB Server** có sẵn trong Cursor
- **KHÔNG được tạo file script** Python/JavaScript
- **Kết nối trực tiếp** với MongoDB qua MCP tools
- **Thực hiện queries** trực tiếp qua MCP requests
- **Phân tích dữ liệu** thực tế từ database

## Quy trình thực hiện

### 1. 🔌 Kết nối MongoDB qua MCP Server
- **BẮT BUỘC** sử dụng MCP MongoDB Server tools có sẵn trong Cursor
- **KHÔNG được** tạo file script Python/JavaScript
- **KHÔNG được** sử dụng pymongo trực tiếp
- **KHÔNG được** sử dụng mongosh trực tiếp
- Kết nối đến MongoDB cluster qua MCP Server
- Xác thực credentials qua MCP Server

### 2. 📊 Phân tích dữ liệu qua MCP Server
- **BẮT BUỘC** sử dụng MCP MongoDB Server tools
- Kiểm tra databases và collections qua MCP requests
- Đếm documents qua MCP queries
- Xem cấu trúc dữ liệu và schema qua MCP
- Tìm dữ liệu bị thiếu/lỗi qua MCP

### 3. 🔧 Thực hiện operations qua MCP Server
- **BẮT BUỘC** sử dụng MCP MongoDB Server tools
- **KHÔNG được** tạo file script
- **KHÔNG được** sử dụng pymongo trực tiếp
- **KHÔNG được** sử dụng mongosh trực tiếp
- Tất cả operations phải qua MCP Server requests
- **ĐƯỢC PHÉP** sửa và bổ sung MCP server nếu thiếu tools cần thiết

| Operation | Mô tả | ✅ Ưu điểm | ⚠️ Nhược điểm | 🎯 Độ khó | ⏱️ Thời gian | 💰 Chi phí |
|-----------|-------|------------|---------------|-----------|-------------|-----------|
| **Query Data** | Tìm kiếm dữ liệu | ✅ Nhanh chóng, ✅ Không thay đổi data | ⚠️ Có thể chậm với data lớn | 🟢 Dễ | 🟢 < 1 phút | 🟢 Thấp |
| **Update Records** | Cập nhật dữ liệu | ✅ Sửa lỗi data, ✅ Đồng bộ thông tin | ⚠️ Có thể mất data, ⚠️ Cần backup trước | 🟡 Trung bình | 🟡 5-15 phút | 🟡 Trung bình |
| **Insert Records** | Thêm dữ liệu mới | ✅ Bổ sung data, ✅ Không ảnh hưởng existing | ⚠️ Có thể duplicate, ⚠️ Cần validate | 🟡 Trung bình | 🟡 10-30 phút | 🟡 Trung bình |
| **Delete Records** | Xóa dữ liệu | ✅ Dọn dẹp data, ✅ Giảm storage | ⚠️ Mất data vĩnh viễn, ⚠️ Cần backup trước | 🔴 Khó | 🔴 30 phút - 2h | 🔴 Cao |
| **Backup Data** | Sao lưu dữ liệu | ✅ An toàn data, ✅ Có thể restore | ⚠️ Tốn storage, ⚠️ Có thể chậm | 🟡 Trung bình | 🟡 15-60 phút | 🟡 Trung bình |
| **Restore Data** | Khôi phục dữ liệu | ✅ Khôi phục data, ✅ Giải quyết lỗi | ⚠️ Có thể ghi đè data mới, ⚠️ Cần kiểm tra kỹ | 🔴 Khó | 🔴 1-4 giờ | 🔴 Cao |

### 4. 📈 Báo cáo kết quả
- **Tổng hợp dữ liệu** với số liệu cụ thể từ MCP Server
- **Đưa ra insights** và patterns từ MCP Server results
- **Khuyến nghị next steps** với timeline

## ⚠️ QUY TẮC NGHIÊM NGẶT
- **BẮT BUỘC** sử dụng MCP MongoDB Server tools có sẵn trong Cursor
- **KHÔNG được** tạo file script Python/JavaScript
- **KHÔNG được** sử dụng pymongo trực tiếp
- **KHÔNG được** sử dụng mongosh trực tiếp
- **CHỈ được** sử dụng MCP MongoDB Server tools có sẵn
- **ĐƯỢC PHÉP** sửa và bổ sung MCP server nếu thiếu tools cần thiết
- **TUYỆT ĐỐI KHÔNG** tạo file script để thực hiện operations

## Ví dụ sử dụng
```
mongo: Kiểm tra xem có bao nhiêu contracts trong database?
mongo: Tìm tất cả contracts có status = 'DRAFT'
mongo: Backup toàn bộ dữ liệu contracts
mongo: Xóa các contracts đã expired hơn 1 năm
mongo: Update status của contracts từ 'PENDING' thành 'APPROVED'
```

## Kết quả mong đợi
- 🔌 **Kết nối thành công** với MongoDB qua MCP Server
- 📊 **Báo cáo chi tiết** về dữ liệu từ MCP Server
- 🔧 **Thực hiện operations** theo yêu cầu qua MCP Server
- 📈 **Insights và khuyến nghị** dựa trên dữ liệu thực tế từ MCP Server
- ✅ **Có thể thay đổi** database records qua MCP Server
- 🛠️ **Sửa/bổ sung MCP server** nếu thiếu tools cần thiết
- 🚫 **TUYỆT ĐỐI KHÔNG** tạo file script để thực hiện operations

## MCP MongoDB Server Tools có sẵn
- `mcp_MongoDB_list-databases` - Liệt kê tất cả databases
- `mcp_MongoDB_list-collections` - Liệt kê collections trong database
- `mcp_MongoDB_find` - Tìm kiếm documents
- `mcp_MongoDB_count` - Đếm số documents
- `mcp_MongoDB_insert-many` - Thêm nhiều documents
- `mcp_MongoDB_update-many` - Cập nhật nhiều documents
- `mcp_MongoDB_delete-many` - Xóa nhiều documents
- `mcp_MongoDB_aggregate` - Thực hiện aggregation pipeline
- `mcp_MongoDB_collection-schema` - Xem schema của collection
- `mcp_MongoDB_collection-indexes` - Xem indexes của collection
- `mcp_MongoDB_create-index` - Tạo index mới
- `mcp_MongoDB_export` - Export dữ liệu
- `mcp_MongoDB_switch-connection` - Chuyển đổi connection
