# Tính năng Custom Table cho trang Contracts

## Tổng quan
Đã thêm các tính năng custom table cho phép người dùng tùy chỉnh hiển thị bảng, cấu hình số lượng hiển thị và load thêm dữ liệu với nút "Show More".

## Các tính năng mới

### 1. Custom Table Component
- **File**: `src/components/contracts/CustomTable.tsx`
- **Chức năng**: 
  - Hiển thị bảng với các cột có thể tùy chỉnh
  - Hỗ trợ checkbox để chọn nhiều
  - Render nội dung cell theo loại cột
  - Responsive design

### 2. Table Settings Modal
- **File**: `src/components/contracts/TableSettings.tsx`
- **Chức năng**:
  - Cấu hình hiển thị/ẩn cột
  - Sắp xếp thứ tự cột (lên/xuống)
  - Thay đổi số lượng hiển thị mỗi lần
  - Reset về cài đặt mặc định

### 3. Show More Functionality
- **Tính năng**: Load thêm dữ liệu thay vì phân trang
- **Cách hoạt động**:
  - Mỗi lần click "Show More" sẽ fetch thêm `pageSize` phần tử
  - Hiển thị loading spinner khi đang tải
  - Ẩn nút khi không còn dữ liệu để load

## Cấu trúc Table Columns

### Các cột có sẵn:
1. **checkbox** - Checkbox chọn
2. **title** - Tên hợp đồng + mô tả + tags
3. **contractNumber** - Mã hợp đồng
4. **status** - Trạng thái (với badge màu)
5. **contractType** - Loại hợp đồng
6. **totalValue** - Giá trị hợp đồng
7. **effectiveDate** - Ngày hiệu lực
8. **expiryDate** - Ngày hết hạn
9. **riskLevel** - Mức độ rủi ro + nhắc nhở
10. **parties** - Đối tác (ẩn mặc định)
11. **createdAt** - Ngày tạo (ẩn mặc định)
12. **actions** - Hành động (Xem, Menu)

### Cấu hình mặc định:
- **Hiển thị**: checkbox, title, contractNumber, status, contractType, totalValue, effectiveDate, expiryDate, riskLevel, actions
- **Ẩn**: parties, createdAt
- **Page Size**: 9 (có thể thay đổi: 5, 10, 20, 50, 100)

## Cách sử dụng

### 1. Truy cập Table Settings
- Chuyển sang chế độ List view (biểu tượng danh sách)
- Click vào biểu tượng bánh răng ⚙️ ở góc phải content header

### 2. Cấu hình Table
- **Hiển thị/ẩn cột**: Tick/untick checkbox bên cạnh tên cột
- **Sắp xếp cột**: Dùng nút mũi tên lên/xuống
- **Thay đổi số lượng**: Chọn từ dropdown "Số lượng hiển thị mỗi lần"
- **Reset**: Click "Đặt lại" để về cài đặt mặc định
- **Lưu**: Click "Lưu cài đặt" để áp dụng

### 3. Load thêm dữ liệu
- Khi có dữ liệu để load thêm, nút "Hiển thị thêm X hợp đồng" sẽ xuất hiện
- Click nút để load thêm `pageSize` phần tử
- Nút sẽ hiển thị loading spinner khi đang tải
- Nút sẽ ẩn khi không còn dữ liệu để load

## Technical Details

### State Management
```typescript
// Table configuration
const [tableColumns, setTableColumns] = useState<TableColumn[]>(...)
const [showTableSettings, setShowTableSettings] = useState<boolean>(false)

// Data management
const [allItems, setAllItems] = useState<ContractItem[]>([])
const [displayedItems, setDisplayedItems] = useState<ContractItem[]>([])
const [hasMoreData, setHasMoreData] = useState<boolean>(true)
const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
```

### API Integration
- Sử dụng `pageNumber` và `pageSize` để phân trang
- `pageNumber` được tính dựa trên `displayedItems.length / pageSize`
- Kiểm tra `totalElements` để xác định còn dữ liệu hay không

### Responsive Design
- Table có `overflow-x-auto` để scroll ngang trên mobile
- Các cột được render động dựa trên `visibleColumns`
- Cell content được format phù hợp với từng loại dữ liệu

## Cải tiến so với phiên bản cũ

### Trước:
- Table cố định với tất cả cột hiển thị
- Phân trang truyền thống (Trước/Sau)
- Không thể tùy chỉnh hiển thị

### Sau:
- Table có thể tùy chỉnh hoàn toàn
- Load more thay vì phân trang
- Cài đặt linh hoạt cho từng người dùng
- UX tốt hơn với loading states

## Lưu ý

- Cài đặt table chỉ áp dụng cho List view
- Grid view vẫn giữ nguyên giao diện cũ
- Cài đặt không được lưu persistent (sẽ reset khi reload trang)
- Có thể mở rộng thêm tính năng lưu cài đặt vào localStorage

## TODO - Có thể mở rộng

1. **Persistent Settings**: Lưu cài đặt vào localStorage
2. **Column Width**: Cho phép điều chỉnh độ rộng cột
3. **Sorting**: Thêm tính năng sắp xếp theo cột
4. **Export**: Export dữ liệu theo cột đã chọn
5. **Presets**: Tạo các preset cài đặt sẵn
