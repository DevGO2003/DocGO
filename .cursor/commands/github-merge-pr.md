# GitHub Merge Pull Request Command

## Mục đích
Merge pull request trong GitHub repository.

## Cách sử dụng
```bash
/github-merge-pr <owner> <repo> <pull_number> [commit_title] [commit_message] [merge_method]
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `<pull_number>`: Số pull request cần merge (bắt buộc)
- `[commit_title]`: Tiêu đề commit message (tùy chọn)
- `[commit_message]`: Nội dung commit message (tùy chọn)
- `[merge_method]`: Phương thức merge (merge, squash, rebase) (tùy chọn, mặc định: merge)

## Quy trình thực hiện

### 1. 🔍 Xác định pull request
- Kiểm tra repository và PR tồn tại
- Xác thực quyền merge
- Hiển thị thông tin PR

### 2. ✅ Validate parameters
- Kiểm tra pull number hợp lệ
- Validate merge method
- Kiểm tra merge permissions

### 3. 🔄 Thực hiện merge
- Gọi `mcp_Github_merge_pull_request` với parameters
- Xử lý lỗi conflict nếu có
- Lấy kết quả merge

### 4. 📊 Báo cáo kết quả
- Hiển thị PR đã merge
- Phân tích merge changes
- Gợi ý sử dụng branch mới

## Kết quả mong đợi
- ✅ **PR** đã merge thành công
- 📈 **Merge changes** analysis
- 🎯 **Gợi ý** sử dụng branch mới
- ✅ **Thông tin** repository và PR

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi conflict và permission

## Ví dụ sử dụng
```
/github-merge-pr devgo2003 docgo-private 123
/github-merge-pr devgo2003 docgo-private 456 "Merge feature" "Add new feature" squash
/github-merge-pr devgo2003 docgo-private 789 "Merge hotfix" "Fix critical bug" rebase
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **PR không tồn tại**: Kiểm tra pull number
- **Permission denied**: Kiểm tra quyền merge
- **Conflict**: Xử lý merge conflict
- **Invalid merge method**: Kiểm tra merge method values
