# GitHub Add Issue Comment Command

## Mục đích
Thêm comment vào issue trong GitHub repository.

## Cách sử dụng
```bash
/github-add-comment <owner> <repo> <issue_number> <body>
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `<issue_number>`: Số issue cần comment (bắt buộc)
- `<body>`: Nội dung comment (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định issue
- Kiểm tra repository và issue tồn tại
- Xác thực quyền comment
- Hiển thị thông tin issue

### 2. ✅ Validate parameters
- Kiểm tra issue number hợp lệ
- Validate comment body
- Kiểm tra comment permissions

### 3. 📝 Thực hiện thêm comment
- Gọi `mcp_Github_add_issue_comment` với parameters
- Xử lý lỗi validation nếu có
- Lấy kết quả comment

### 4. 📊 Báo cáo kết quả
- Hiển thị comment đã thêm
- Phân tích comment content
- Gợi ý sử dụng comment

## Kết quả mong đợi
- ✅ **Comment** đã thêm thành công
- 📈 **Comment content** analysis
- 🎯 **Gợi ý** sử dụng comment
- ✅ **Thông tin** repository và issue

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi validation và permission

## Ví dụ sử dụng
```
/github-add-comment devgo2003 docgo-private 123 "This is a comment on issue #123"
/github-add-comment devgo2003 docgo-private 456 "Fixed in commit abc123"
/github-add-comment devgo2003 docgo-private 789 "Need more information to reproduce"
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **Issue không tồn tại**: Kiểm tra issue number
- **Permission denied**: Kiểm tra quyền comment
- **Invalid comment body**: Kiểm tra comment content

