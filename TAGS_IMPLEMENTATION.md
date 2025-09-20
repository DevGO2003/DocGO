# Tags Implementation - DocGO

## Tổng quan
Đã triển khai thành công hệ thống quản lý tags cho hợp đồng với các tính năng:
- ✅ API backend cho tags (popular, all, search)
- ✅ Frontend component với lazy loading
- ✅ Hiển thị tags không có dấu gạch dưới
- ✅ Nút mở rộng để xem tất cả tags
- ✅ Performance tối ưu (chỉ load 10 tags phổ biến trước)

## Cấu trúc Backend

### 1. Entity Contract
- Đã cập nhật trường `tags` từ `String` thành `List<String>`
- Hỗ trợ lưu trữ nhiều tags cho mỗi hợp đồng

### 2. API Endpoints
```
GET /api/v1/contract-management-service/tags/popular
- Trả về 10 tags phổ biến nhất
- Sắp xếp theo số lần sử dụng (giảm dần)

GET /api/v1/contract-management-service/tags/all  
- Trả về tất cả tags
- Sắp xếp theo tên (tăng dần)

GET /api/v1/contract-management-service/tags/search?searchTerm=keyword
- Tìm kiếm tags theo từ khóa
- Không phân biệt hoa thường
```

### 3. DTOs
- `TagDto`: Chứa name, displayName, count, isPopular
- `ContractCreateRequest`: Đã thêm trường tags
- `ContractResponseDto`: Đã có trường tags

## Cấu trúc Frontend

### 1. TagFilter Component
- Lazy loading: Chỉ load popular tags ban đầu
- Nút "Xem thêm" để load tất cả tags
- Hiển thị số lượng sử dụng cho mỗi tag
- Format tên tag (bỏ dấu gạch dưới, viết hoa chữ cái đầu)

### 2. Contracts Page
- Tích hợp TagFilter component
- Hiển thị tags đã format trong grid/list view
- Lọc hợp đồng theo tags đã chọn

## Cách Test

### 1. Test Backend API
```bash
# Chạy contract-management-service
cd backend/contract-management-service
mvn spring-boot:run

# Test API (trong terminal khác)
node test-tags-api.js
```

### 2. Test Frontend
```bash
# Chạy frontend
cd frontend/web_nextjs
npm run dev

# Truy cập http://localhost:3000/contracts
# Kiểm tra:
# - Tags hiển thị không có dấu gạch dưới
# - Nút "Xem thêm tags" hoạt động
# - Lọc theo tags hoạt động
```

## Lưu ý Kỹ thuật

### 1. Performance
- Sử dụng MongoDB aggregation để đếm tags
- Chỉ load 10 tags phổ biến ban đầu
- Lazy loading cho danh sách đầy đủ

### 2. Format Tags
- Backend: `formatTagDisplayName()` chuyển "ưu_tiên" → "Ưu tiên"
- Frontend: `replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())`

### 3. Error Handling
- API trả về RestResponse chuẩn
- Frontend có loading states và error messages
- Fallback khi không load được tags

## Kết quả
- ✅ Giải quyết vấn đề hiển thị tags (bỏ dấu gạch dưới)
- ✅ Tối ưu performance (không load hết tags một lần)
- ✅ UX tốt hơn với nút mở rộng
- ✅ Tương thích với API Standards của DocGO
- ✅ Dễ dàng mở rộng và maintain
