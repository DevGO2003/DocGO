# GitHub List Pull Requests Command

## Mục đích
Liệt kê pull requests trong GitHub repository với các tùy chọn lọc.

## Cách sử dụng
```bash
/github-list-prs <owner> <repo> [state] [head] [base] [sort] [direction] [per_page] [page]
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `[state]`: Trạng thái PRs (open, closed, all) (tùy chọn, mặc định: open)
- `[head]`: Lọc theo head user hoặc head organization và branch name (tùy chọn)
- `[base]`: Lọc theo base branch name (tùy chọn)
- `[sort]`: Sắp xếp theo (created, updated, popularity, long-running) (tùy chọn, mặc định: created)
- `[direction]`: Hướng sắp xếp (asc, desc) (tùy chọn, mặc định: desc)
- `[per_page]`: Số PRs mỗi trang (tùy chọn, mặc định: 30, tối đa: 100)
- `[page]`: Số trang (tùy chọn, mặc định: 1)

## Quy trình thực hiện

### 1. 🔍 Xác định repository
- Kiểm tra repository tồn tại
- Xác thực quyền đọc
- Hiển thị thông tin repository

### 2. ✅ Validate parameters
- Kiểm tra state hợp lệ
- Validate head và base branches
- Kiểm tra sort và direction

### 3. 📝 Lấy danh sách PRs
- Gọi `mcp_Github_list_pull_requests` với parameters
- Xử lý lỗi repository không tồn tại
- Lấy kết quả PRs

### 4. 📊 Phân tích kết quả
- Hiển thị danh sách PRs
- Phân tích PR patterns
- Gợi ý insights từ PRs

## Kết quả mong đợi
- 📊 **Danh sách PRs** của repository
- 📈 **PR patterns** analysis
- 🎯 **Insights** từ PRs
- ✅ **Thông tin** repository và filters

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi repository không tồn tại

## Ví dụ sử dụng
```
/github-list-prs devgo2003 docgo-private
/github-list-prs devgo2003 docgo-private --state closed --base main
/github-list-prs devgo2003 docgo-private --sort updated --direction asc --page 2
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **Invalid state**: Kiểm tra state values (open, closed, all)
- **Invalid branches**: Kiểm tra head và base branches
- **Permission denied**: Kiểm tra quyền đọc repository
