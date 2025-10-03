# GitHub Get File Command

## Mục đích
Lấy nội dung file hoặc thư mục từ GitHub repository.

## Cách sử dụng
```bash
/github-get-file <owner> <repo> <path> [branch]
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `<path>`: Đường dẫn file hoặc thư mục (bắt buộc)
- `[branch]`: Branch để lấy file (tùy chọn, mặc định: main)

## Quy trình thực hiện

### 1. 🔍 Xác định repository
- Kiểm tra repository tồn tại
- Xác thực quyền đọc
- Hiển thị thông tin repository

### 2. ✅ Validate path
- Kiểm tra path hợp lệ
- Validate branch tồn tại
- Kiểm tra file/directory access

### 3. 📥 Lấy nội dung
- Gọi `mcp_Github_get_file_contents` với parameters
- Xử lý lỗi file không tồn tại
- Lấy kết quả content

### 4. 📊 Hiển thị kết quả
- Hiển thị nội dung file
- Phân tích cấu trúc directory
- Gợi ý sử dụng content

## Kết quả mong đợi
- 📄 **Nội dung** file hoặc directory
- 📈 **Cấu trúc** directory analysis
- 🎯 **Gợi ý** sử dụng content
- ✅ **Thông tin** repository và path

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi file không tồn tại

## Ví dụ sử dụng
```
/github-get-file devgo2003 docgo-private README.md
/github-get-file devgo2003 docgo-private src/ --branch feature-branch
/github-get-file devgo2003 docgo-private package.json
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **File không tồn tại**: Kiểm tra path và branch
- **Permission denied**: Kiểm tra quyền đọc repository
- **Branch không tồn tại**: Gợi ý branch khác
