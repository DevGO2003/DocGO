# GitHub Update Pull Request Branch Command

## Mục đích
Cập nhật pull request branch với thay đổi mới nhất từ base branch.

## Cách sử dụng
```bash
/github-update-pr-branch <owner> <repo> <pull_number> [expected_head_sha]
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `<pull_number>`: Số pull request cần cập nhật (bắt buộc)
- `[expected_head_sha]`: SHA mong đợi của HEAD ref (tùy chọn)

## Quy trình thực hiện

### 1. 🔍 Xác định pull request
- Kiểm tra repository và PR tồn tại
- Xác thực quyền cập nhật
- Hiển thị thông tin PR

### 2. ✅ Validate parameters
- Kiểm tra pull number hợp lệ
- Validate expected_head_sha (nếu có)
- Kiểm tra update permissions

### 3. 🔄 Thực hiện cập nhật branch
- Gọi `mcp_Github_update_pull_request_branch` với parameters
- Xử lý lỗi conflict nếu có
- Lấy kết quả update

### 4. 📊 Báo cáo kết quả
- Hiển thị PR branch đã cập nhật
- Phân tích update changes
- Gợi ý sử dụng PR mới

## Kết quả mong đợi
- ✅ **PR branch** đã cập nhật thành công
- 📈 **Update changes** analysis
- 🎯 **Gợi ý** sử dụng PR mới
- ✅ **Thông tin** repository và PR

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi conflict và permission

## Ví dụ sử dụng
```
/github-update-pr-branch devgo2003 docgo-private 123
/github-update-pr-branch devgo2003 docgo-private 456 abc123def456
/github-update-pr-branch devgo2003 docgo-private 789
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **PR không tồn tại**: Kiểm tra pull number
- **Permission denied**: Kiểm tra quyền cập nhật PR
- **Conflict**: Xử lý merge conflict
- **Invalid SHA**: Kiểm tra expected_head_sha format
