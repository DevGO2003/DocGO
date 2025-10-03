# GitHub Get Issue Command

## Mục đích
Lấy thông tin chi tiết của issue trong GitHub repository.

## Cách sử dụng
```bash
/github-get-issue <owner> <repo> <issue_number>
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `<issue_number>`: Số issue cần lấy (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định issue
- Kiểm tra repository và issue tồn tại
- Xác thực quyền đọc
- Hiển thị thông tin repository

### 2. ✅ Validate parameters
- Kiểm tra issue number hợp lệ
- Validate repository access
- Kiểm tra issue permissions

### 3. 📝 Lấy thông tin issue
- Gọi `mcp_Github_get_issue` với parameters
- Xử lý lỗi issue không tồn tại
- Lấy kết quả issue details

### 4. 📊 Phân tích kết quả
- Hiển thị thông tin issue chi tiết
- Phân tích issue content
- Gợi ý sử dụng issue

## Kết quả mong đợi
- 📊 **Thông tin issue** chi tiết
- 📈 **Issue content** analysis
- 🎯 **Gợi ý** sử dụng issue
- ✅ **Thông tin** repository và issue

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi issue không tồn tại

## Ví dụ sử dụng
```
/github-get-issue devgo2003 docgo-private 123
/github-get-issue devgo2003 docgo-private 456
/github-get-issue devgo2003 docgo-private 789
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **Issue không tồn tại**: Kiểm tra issue number
- **Permission denied**: Kiểm tra quyền đọc repository
- **Invalid issue number**: Kiểm tra issue number format

