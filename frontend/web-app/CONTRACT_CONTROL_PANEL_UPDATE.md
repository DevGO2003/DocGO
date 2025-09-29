# Cập nhật Control Panel cho trang Contracts

## Tổng quan
Đã tách nút "Làm mới" và "Tạo hợp đồng" ra thành một control panel riêng biệt, thêm nút "Chỉnh sửa" và cải thiện khả năng chọn nhiều hợp đồng.

## Các thay đổi chính

### 1. Tạo Component ContractControlPanel
- **File**: `src/components/contracts/ContractControlPanel.tsx`
- **Chức năng**: 
  - Nút "Làm mới" danh sách
  - Nút "Tạo hợp đồng" 
  - Nút "Chỉnh sửa" (chưa có xử lý)
  - Nút "Gửi duyệt" (chưa có xử lý)
  - Nút "Xóa" (chưa có xử lý)
  - Hiển thị khi có hợp đồng được chọn

### 2. Cập nhật trang Contracts
- **File**: `src/app/contracts/page.tsx`
- **Thay đổi**:
  - Import và sử dụng `ContractControlPanel`
  - Thêm các handler functions cho control panel
  - Tách header cũ thành page header đơn giản
  - Thêm control panel riêng biệt

### 3. Cải thiện khả năng chọn nhiều
- **Grid View**: Thêm nút "Chọn tất cả" / "Bỏ chọn tất cả" ở đầu danh sách
- **List View**: Cải thiện checkbox header với text mô tả
- **Selection Actions**: Chuyển vào control panel thay vì hiển thị inline

## Cấu trúc mới

```
Contracts Page
├── Page Header (tiêu đề và mô tả)
├── Control Panel (nút hành động chính)
├── Filters (tìm kiếm, lọc, tags)
├── Content Header (view mode, số lượng)
└── Content (grid/list view với selection)
```

## Handler Functions

### `handleCreateContract()`
- Chuyển hướng đến `/import-document`

### `handleEditSelected()`
- Nếu chọn 1: chuyển đến `/contracts/{id}/edit`
- Nếu chọn nhiều: hiển thị thông báo "đang phát triển"

### `handleDeleteSelected()`
- Xác nhận trước khi xóa
- Hiển thị thông báo "đang phát triển"

### `handleSendForApproval()`
- Xác nhận trước khi gửi duyệt
- Hiển thị thông báo "đang phát triển"

## Tính năng chọn nhiều

### Grid View
- Checkbox ở góc trên trái mỗi card
- Nút "Chọn tất cả" / "Bỏ chọn tất cả" ở đầu danh sách
- Hiển thị số lượng đã chọn trong content header

### List View  
- Checkbox ở cột đầu tiên
- Header checkbox với text mô tả
- Hiển thị số lượng đã chọn trong content header

## Control Panel Logic

### Khi không có selection
- Hiển thị: "Làm mới" + "Tạo hợp đồng"

### Khi có selection
- Hiển thị thêm:
  - Số lượng đã chọn
  - Nút "Bỏ chọn tất cả"
  - Nút "Chỉnh sửa"
  - Nút "Gửi duyệt" 
  - Nút "Xóa"

## TODO - Cần implement

1. **Chỉnh sửa hàng loạt**: Tạo trang bulk edit
2. **Xóa hàng loạt**: Implement API delete multiple
3. **Gửi duyệt hàng loạt**: Implement workflow approval
4. **Edit single contract**: Tạo trang edit contract

## Cách sử dụng

1. Truy cập `http://localhost:3000/contracts`
2. Sử dụng control panel để thực hiện các hành động
3. Chọn nhiều hợp đồng bằng checkbox
4. Sử dụng các nút trong control panel để thao tác hàng loạt

## Lưu ý

- Các chức năng chỉnh sửa, xóa, gửi duyệt hiện tại chỉ hiển thị thông báo "đang phát triển"
- Cần implement các API endpoints tương ứng
- Cần tạo các trang edit và bulk operations
