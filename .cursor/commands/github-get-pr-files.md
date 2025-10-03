# GitHub Get Pull Request Files Command

## Mục đích
Lấy danh sách files đã thay đổi trong pull request.

## Cách sử dụng
```bash
/github-get-pr-files <owner> <repo> <pull_number>
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `<pull_number>`: Số pull request cần lấy files (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định pull request
- Kiểm tra repository và PR tồn tại
- Xác thực quyền đọc
- Hiển thị thông tin PR

### 2. ✅ Validate parameters
- Kiểm tra pull number hợp lệ
- Validate repository access
- Kiểm tra PR permissions

### 3. 📝 Lấy danh sách files
- Gọi `mcp_Github_get_pull_request_files` với parameters
- Xử lý lỗi PR không tồn tại
- Lấy kết quả files

### 4. 📊 Phân tích kết quả
- Hiển thị danh sách files đã thay đổi
- Phân tích file changes
- Gợi ý sử dụng files

## Kết quả mong đợi
- 📊 **Danh sách files** đã thay đổi
- 📈 **File changes** analysis
- 🎯 **Gợi ý** sử dụng files
- ✅ **Thông tin** repository và PR

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi PR không tồn tại

## Ví dụ sử dụng
```
/github-get-pr-files devgo2003 docgo-private 123
/github-get-pr-files devgo2003 docgo-private 456
/github-get-pr-files devgo2003 docgo-private 789
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **PR không tồn tại**: Kiểm tra pull number
- **Permission denied**: Kiểm tra quyền đọc repository
- **Invalid pull number**: Kiểm tra pull number format
