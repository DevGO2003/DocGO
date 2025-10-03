# Browser Select Option Command

## Mục đích
Chọn option trong dropdown trên trang web.

## Cách sử dụng
```bash
/browser-select <element> <ref> <values>
```

## Tham số
- `<element>`: Mô tả element cần select (bắt buộc)
- `<ref>`: Reference chính xác của element từ page snapshot (bắt buộc)
- `<values>`: Danh sách values cần select (array) (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định element
- Kiểm tra element tồn tại
- Xác thực quyền select
- Hiển thị thông tin element

### 2. ✅ Validate parameters
- Kiểm tra element reference hợp lệ
- Validate values array
- Kiểm tra element accessibility

### 3. 📋 Thực hiện select
- Gọi `mcp_Browser_browser_select_option` với parameters
- Xử lý lỗi element không tồn tại
- Lấy kết quả select

### 4. 📊 Phân tích kết quả
- Hiển thị options đã select
- Phân tích select results
- Gợi ý sử dụng element

## Kết quả mong đợi
- 📋 **Options** đã select thành công
- 📈 **Select results** analysis
- 🎯 **Gợi ý** sử dụng element
- ✅ **Thông tin** element và values

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP Browser Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi element không tồn tại

## Ví dụ sử dụng
```
/browser-select "Country dropdown" "select-country" ["Vietnam"]
/browser-select "Language dropdown" "select-language" ["English", "Vietnamese"]
/browser-select "Category dropdown" "select-category" ["Technology"]
```

## Troubleshooting
- **Element không tồn tại**: Kiểm tra element reference
- **Select failed**: Kiểm tra element accessibility
- **Permission denied**: Kiểm tra select permissions

