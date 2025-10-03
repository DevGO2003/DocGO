# GitHub List Issues Command

## Mục đích
Liệt kê issues trong GitHub repository với các tùy chọn lọc.

## Cách sử dụng
```bash
/github-list-issues <owner> <repo> [state] [labels] [sort] [direction] [page] [per_page] [since]
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `[state]`: Trạng thái issues (open, closed, all) (tùy chọn, mặc định: open)
- `[labels]`: Danh sách labels để lọc (array) (tùy chọn)
- `[sort]`: Sắp xếp theo (created, updated, comments) (tùy chọn, mặc định: created)
- `[direction]`: Hướng sắp xếp (asc, desc) (tùy chọn, mặc định: desc)
- `[page]`: Số trang (tùy chọn)
- `[per_page]`: Số issues mỗi trang (tùy chọn)
- `[since]`: Lọc từ thời gian (ISO 8601) (tùy chọn)

## Quy trình thực hiện

### 1. 🔍 Xác định repository
- Kiểm tra repository tồn tại
- Xác thực quyền đọc
- Hiển thị thông tin repository

### 2. ✅ Validate parameters
- Kiểm tra state hợp lệ
- Validate labels tồn tại
- Kiểm tra sort và direction

### 3. 📝 Lấy danh sách issues
- Gọi `mcp_Github_list_issues` với parameters
- Xử lý lỗi repository không tồn tại
- Lấy kết quả issues

### 4. 📊 Phân tích kết quả
- Hiển thị danh sách issues
- Phân tích issue patterns
- Gợi ý insights từ issues

## Kết quả mong đợi
- 📊 **Danh sách issues** của repository
- 📈 **Issue patterns** analysis
- 🎯 **Insights** từ issues
- ✅ **Thông tin** repository và filters

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi repository không tồn tại

## Ví dụ sử dụng
```
/github-list-issues devgo2003 docgo-private
/github-list-issues devgo2003 docgo-private --state closed --labels bug,high-priority
/github-list-issues devgo2003 docgo-private --sort updated --direction asc --page 2
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **Invalid state**: Kiểm tra state values (open, closed, all)
- **Invalid labels**: Kiểm tra labels tồn tại trong repository
- **Permission denied**: Kiểm tra quyền đọc repository

