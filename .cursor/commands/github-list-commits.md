# GitHub List Commits Command

## Mục đích
Liệt kê commits của branch trong GitHub repository.

## Cách sử dụng
```bash
/github-list-commits <owner> <repo> [sha] [page] [perPage]
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `[sha]`: SHA của commit hoặc branch (tùy chọn, mặc định: default branch)
- `[page]`: Số trang (tùy chọn)
- `[perPage]`: Số commits mỗi trang (tùy chọn)

## Quy trình thực hiện

### 1. 🔍 Xác định repository
- Kiểm tra repository tồn tại
- Xác thực quyền đọc
- Hiển thị thông tin repository

### 2. ✅ Validate parameters
- Kiểm tra sha hợp lệ (nếu có)
- Validate pagination parameters
- Kiểm tra branch tồn tại

### 3. 📝 Lấy danh sách commits
- Gọi `mcp_Github_list_commits` với parameters
- Xử lý lỗi branch không tồn tại
- Lấy kết quả commits

### 4. 📊 Phân tích kết quả
- Hiển thị danh sách commits
- Phân tích commit patterns
- Gợi ý insights từ commits

## Kết quả mong đợi
- 📊 **Danh sách commits** của branch
- 📈 **Commit patterns** analysis
- 🎯 **Insights** từ commits
- ✅ **Thông tin** repository và branch

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi branch không tồn tại

## Ví dụ sử dụng
```
/github-list-commits devgo2003 docgo-private
/github-list-commits devgo2003 docgo-private main --page 2 --perPage 20
/github-list-commits devgo2003 docgo-private abc123def456
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **Branch không tồn tại**: Kiểm tra branch name
- **SHA không hợp lệ**: Kiểm tra commit SHA
- **Permission denied**: Kiểm tra quyền đọc repository
