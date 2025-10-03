# GitHub Get Pull Request Command

## Mục đích
Lấy thông tin chi tiết của pull request trong GitHub repository.

## Cách sử dụng
```bash
/github-get-pr <owner> <repo> <pull_number>
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `<pull_number>`: Số pull request cần lấy (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định pull request
- Kiểm tra repository và PR tồn tại
- Xác thực quyền đọc
- Hiển thị thông tin repository

### 2. ✅ Validate parameters
- Kiểm tra pull number hợp lệ
- Validate repository access
- Kiểm tra PR permissions

### 3. 📝 Lấy thông tin PR
- Gọi `mcp_Github_get_pull_request` với parameters
- Xử lý lỗi PR không tồn tại
- Lấy kết quả PR details

### 4. 📊 Phân tích kết quả
- Hiển thị thông tin PR chi tiết
- Phân tích PR content
- Gợi ý sử dụng PR

## Kết quả mong đợi
- 📊 **Thông tin PR** chi tiết
- 📈 **PR content** analysis
- 🎯 **Gợi ý** sử dụng PR
- ✅ **Thông tin** repository và PR

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi PR không tồn tại

## Ví dụ sử dụng
```
/github-get-pr devgo2003 docgo-private 123
/github-get-pr devgo2003 docgo-private 456
/github-get-pr devgo2003 docgo-private 789
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **PR không tồn tại**: Kiểm tra pull number
- **Permission denied**: Kiểm tra quyền đọc repository
- **Invalid pull number**: Kiểm tra pull number format
