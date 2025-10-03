# GitHub Create Issue Command

## Mục đích
Tạo issue mới trong GitHub repository.

## Cách sử dụng
```bash
/github-create-issue <owner> <repo> <title> [body] [assignees] [milestone] [labels]
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `<title>`: Tiêu đề issue (bắt buộc)
- `[body]`: Nội dung issue (tùy chọn)
- `[assignees]`: Danh sách assignees (array) (tùy chọn)
- `[milestone]`: Milestone number (tùy chọn)
- `[labels]`: Danh sách labels (array) (tùy chọn)

## Quy trình thực hiện

### 1. 🔍 Xác định repository
- Kiểm tra repository tồn tại
- Xác thực quyền tạo issue
- Hiển thị thông tin repository

### 2. ✅ Validate parameters
- Kiểm tra title hợp lệ
- Validate assignees tồn tại
- Kiểm tra labels hợp lệ

### 3. 📝 Thực hiện tạo issue
- Gọi `mcp_Github_create_issue` với parameters
- Xử lý lỗi validation nếu có
- Lấy kết quả tạo issue

### 4. 📊 Báo cáo kết quả
- Hiển thị issue đã tạo
- Phân tích issue details
- Gợi ý sử dụng issue

## Kết quả mong đợi
- ✅ **Issue** đã tạo thành công
- 📈 **Issue details** analysis
- 🎯 **Gợi ý** sử dụng issue
- ✅ **Thông tin** repository và issue

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi validation và permission

## Ví dụ sử dụng
```
/github-create-issue devgo2003 docgo-private "Bug: Login not working" "User cannot login with valid credentials" ["devgo2003"] ["bug", "high-priority"]
/github-create-issue devgo2003 docgo-private "Feature: Add dark mode" "Implement dark mode for better UX"
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **Permission denied**: Kiểm tra quyền tạo issue
- **Invalid assignees**: Kiểm tra usernames tồn tại
- **Invalid labels**: Kiểm tra labels tồn tại trong repository

