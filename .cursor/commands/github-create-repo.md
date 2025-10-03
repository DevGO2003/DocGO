# GitHub Create Repository Command

## Mục đích
Tạo repository mới trên GitHub.

## Cách sử dụng
```bash
/github-create-repo <name> [description] [private] [autoInit]
```

## Tham số
- `<name>`: Tên repository (bắt buộc)
- `[description]`: Mô tả repository (tùy chọn)
- `[private]`: Repository private (true/false) (tùy chọn)
- `[autoInit]`: Khởi tạo với README.md (true/false) (tùy chọn)

## Quy trình thực hiện

### 1. 🔍 Xác định repository name
- Kiểm tra tên repository hợp lệ
- Validate repository name rules
- Hiển thị thông tin repository

### 2. ✅ Validate parameters
- Kiểm tra description hợp lệ
- Validate private setting
- Kiểm tra autoInit option

### 3. 🔄 Thực hiện tạo repository
- Gọi `mcp_Github_create_repository` với parameters
- Xử lý lỗi duplicate nếu có
- Lấy kết quả tạo repository

### 4. 📊 Báo cáo kết quả
- Hiển thị repository đã tạo
- Phân tích cấu trúc repository
- Gợi ý sử dụng repository

## Kết quả mong đợi
- ✅ **Repository** đã tạo thành công
- 📈 **Cấu trúc** repository mới
- 🎯 **Gợi ý** sử dụng repository
- ✅ **Thông tin** repository và settings

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi duplicate repository

## Ví dụ sử dụng
```
/github-create-repo docgo-new-service "DocGO New Service" --private --autoInit
/github-create-repo test-repo "Test Repository" --public
/github-create-repo my-project
```

## Troubleshooting
- **Repository đã tồn tại**: Gợi ý tên khác
- **Invalid name**: Kiểm tra GitHub repository naming rules
- **Permission denied**: Kiểm tra quyền tạo repository
- **Rate limit**: Chờ và thử lại
