# GitHub Create Branch Command

## Mục đích
Tạo branch mới trong GitHub repository.

## Cách sử dụng
```bash
/github-create-branch <owner> <repo> <branch> [from_branch]
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `<branch>`: Tên branch mới (bắt buộc)
- `[from_branch]`: Branch nguồn để tạo từ đó (tùy chọn, mặc định: default branch)

## Quy trình thực hiện

### 1. 🔍 Xác định repository
- Kiểm tra repository tồn tại
- Xác thực quyền tạo branch
- Hiển thị thông tin repository

### 2. ✅ Validate parameters
- Kiểm tra branch name hợp lệ
- Validate from_branch tồn tại
- Kiểm tra branch permissions

### 3. 🔄 Thực hiện tạo branch
- Gọi `mcp_Github_create_branch` với parameters
- Xử lý lỗi duplicate nếu có
- Lấy kết quả tạo branch

### 4. 📊 Báo cáo kết quả
- Hiển thị branch đã tạo
- Phân tích branch details
- Gợi ý sử dụng branch mới

## Kết quả mong đợi
- ✅ **Branch** đã tạo thành công
- 📈 **Branch details** analysis
- 🎯 **Gợi ý** sử dụng branch mới
- ✅ **Thông tin** repository và branch

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi duplicate branch

## Ví dụ sử dụng
```
/github-create-branch devgo2003 docgo-private feature-new-ui
/github-create-branch devgo2003 docgo-private hotfix-bug main
/github-create-branch devgo2003 docgo-private release-v1.0
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **Permission denied**: Kiểm tra quyền tạo branch
- **Branch đã tồn tại**: Gợi ý tên branch khác
- **From branch không tồn tại**: Kiểm tra from_branch name
