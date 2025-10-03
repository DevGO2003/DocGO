# GitHub Create Pull Request Command

## Mục đích
Tạo pull request mới trong GitHub repository.

## Cách sử dụng
```bash
/github-create-pr <owner> <repo> <title> <head> <base> [body] [draft] [maintainer_can_modify]
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `<title>`: Tiêu đề pull request (bắt buộc)
- `<head>`: Head branch (bắt buộc)
- `<base>`: Base branch (bắt buộc)
- `[body]`: Nội dung pull request (tùy chọn)
- `[draft]`: Tạo draft PR (true/false) (tùy chọn)
- `[maintainer_can_modify]`: Maintainer có thể modify (true/false) (tùy chọn)

## Quy trình thực hiện

### 1. 🔍 Xác định repository
- Kiểm tra repository tồn tại
- Xác thực quyền tạo PR
- Hiển thị thông tin repository

### 2. ✅ Validate parameters
- Kiểm tra head và base branches tồn tại
- Validate PR title
- Kiểm tra branch permissions

### 3. 📝 Thực hiện tạo PR
- Gọi `mcp_Github_create_pull_request` với parameters
- Xử lý lỗi conflict nếu có
- Lấy kết quả tạo PR

### 4. 📊 Báo cáo kết quả
- Hiển thị PR đã tạo
- Phân tích PR details
- Gợi ý sử dụng PR

## Kết quả mong đợi
- ✅ **Pull Request** đã tạo thành công
- 📈 **PR details** analysis
- 🎯 **Gợi ý** sử dụng PR
- ✅ **Thông tin** repository và PR

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi conflict và permission

## Ví dụ sử dụng
```
/github-create-pr devgo2003 docgo-private "feat: add new feature" feature-branch main "Add new feature for better UX"
/github-create-pr devgo2003 docgo-private "fix: bug fix" hotfix-branch main "Fix critical bug" --draft
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **Permission denied**: Kiểm tra quyền tạo PR
- **Branch không tồn tại**: Kiểm tra head và base branches
- **Conflict**: Xử lý merge conflict

