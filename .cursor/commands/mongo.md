# Mongo Command - Kết nối MongoDB Atlas qua MCP

## Mục đích
Khi người dùng cần làm việc với database, command này sẽ:
- **BẮT BUỘC sử dụng MCP MongoDB** connection
- **KHÔNG được tạo file script** Python/JavaScript
- **Kết nối trực tiếp** với MongoDB Atlas qua MCP tools
- **Thực hiện queries** trực tiếp qua MCP requests
- **Phân tích dữ liệu** thực tế

## Quy trình thực hiện

### 1. 🔌 Kết nối MongoDB qua MCP
- **BẮT BUỘC** sử dụng MCP MongoDB tools có sẵn
- **KHÔNG được** tạo file script Python/JavaScript
- **KHÔNG được** sử dụng pymongo trực tiếp
- Kết nối đến cluster Atlas qua MCP
- Xác thực credentials qua MCP

### 2. 📊 Phân tích dữ liệu qua MCP
- **BẮT BUỘC** sử dụng MCP MongoDB tools
- Kiểm tra collections qua MCP requests
- Đếm documents qua MCP queries
- Xem cấu trúc dữ liệu qua MCP
- Tìm dữ liệu bị thiếu/lỗi qua MCP

### 3. 🔧 Thực hiện operations qua MCP
- **BẮT BUỘC** sử dụng MCP MongoDB tools
- **KHÔNG được** tạo file script
- **KHÔNG được** sử dụng pymongo trực tiếp
- Tất cả operations phải qua MCP requests
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
- **Tổng hợp dữ liệu** với số liệu cụ thể từ MCP
- **Đưa ra insights** và patterns từ MCP results
- **Khuyến nghị next steps** với timeline

## ⚠️ QUY TẮC NGHIÊM NGẶT
- **BẮT BUỘC** sử dụng MCP MongoDB tools
- **KHÔNG được** tạo file script Python/JavaScript
- **KHÔNG được** sử dụng pymongo trực tiếp
- **KHÔNG được** sử dụng mongosh trực tiếp
- **CHỈ được** sử dụng MCP MongoDB tools có sẵn
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
- 🔌 **Kết nối thành công** với MongoDB Atlas qua MCP
- 📊 **Báo cáo chi tiết** về dữ liệu từ MCP
- 🔧 **Thực hiện operations** theo yêu cầu qua MCP
- 📈 **Insights và khuyến nghị** dựa trên dữ liệu thực tế từ MCP
- ✅ **Có thể thay đổi** database records qua MCP
- 🛠️ **Sửa/bổ sung MCP server** nếu thiếu tools cần thiết
- 🚫 **TUYỆT ĐỐI KHÔNG** tạo file script để thực hiện operations
