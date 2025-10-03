# GitHub Get Pull Request Status Command

## Mục đích
Lấy trạng thái status checks của pull request.

## Cách sử dụng
```bash
/github-get-pr-status <owner> <repo> <pull_number>
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `<pull_number>`: Số pull request cần lấy status (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định pull request
- Kiểm tra repository và PR tồn tại
- Xác thực quyền đọc
- Hiển thị thông tin PR

### 2. ✅ Validate parameters
- Kiểm tra pull number hợp lệ
- Validate repository access
- Kiểm tra PR permissions

### 3. 📝 Lấy trạng thái status
- Gọi `mcp_Github_get_pull_request_status` với parameters
- Xử lý lỗi PR không tồn tại
- Lấy kết quả status

### 4. 📊 Phân tích kết quả
- Hiển thị trạng thái status checks
- Phân tích status results
- Gợi ý sử dụng status

## Kết quả mong đợi
- 📊 **Trạng thái status checks** của PR
- 📈 **Status results** analysis
- 🎯 **Gợi ý** sử dụng status
- ✅ **Thông tin** repository và PR

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi PR không tồn tại

## Ví dụ sử dụng
```
/github-get-pr-status devgo2003 docgo-private 123
/github-get-pr-status devgo2003 docgo-private 456
/github-get-pr-status devgo2003 docgo-private 789
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **PR không tồn tại**: Kiểm tra pull number
- **Permission denied**: Kiểm tra quyền đọc repository
- **Invalid pull number**: Kiểm tra pull number format

