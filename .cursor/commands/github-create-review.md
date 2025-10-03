# GitHub Create Pull Request Review Command

## Mục đích
Tạo review cho pull request trong GitHub repository.

## Cách sử dụng
```bash
/github-create-review <owner> <repo> <pull_number> <body> <event> [commit_id] [comments]
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `<pull_number>`: Số pull request cần review (bắt buộc)
- `<body>`: Nội dung review (bắt buộc)
- `<event>`: Loại review (APPROVE, REQUEST_CHANGES, COMMENT) (bắt buộc)
- `[commit_id]`: SHA của commit cần review (tùy chọn)
- `[comments]`: Danh sách comments (array) (tùy chọn)

## Quy trình thực hiện

### 1. 🔍 Xác định pull request
- Kiểm tra repository và PR tồn tại
- Xác thực quyền review
- Hiển thị thông tin PR

### 2. ✅ Validate parameters
- Kiểm tra pull number hợp lệ
- Validate event type
- Kiểm tra review permissions

### 3. 📝 Thực hiện tạo review
- Gọi `mcp_Github_create_pull_request_review` với parameters
- Xử lý lỗi validation nếu có
- Lấy kết quả review

### 4. 📊 Báo cáo kết quả
- Hiển thị review đã tạo
- Phân tích review content
- Gợi ý sử dụng review

## Kết quả mong đợi
- ✅ **Review** đã tạo thành công
- 📈 **Review content** analysis
- 🎯 **Gợi ý** sử dụng review
- ✅ **Thông tin** repository và PR

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi validation và permission

## Ví dụ sử dụng
```
/github-create-review devgo2003 docgo-private 123 "Looks good!" APPROVE
/github-create-review devgo2003 docgo-private 456 "Need changes" REQUEST_CHANGES
/github-create-review devgo2003 docgo-private 789 "Great work!" COMMENT
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **PR không tồn tại**: Kiểm tra pull number
- **Permission denied**: Kiểm tra quyền review
- **Invalid event**: Kiểm tra event values (APPROVE, REQUEST_CHANGES, COMMENT)

