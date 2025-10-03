# GitHub Create File Command

## Mục đích
Tạo hoặc cập nhật file trên GitHub repository.

## Cách sử dụng
```bash
/github-create-file <owner> <repo> <path> <content> <message> <branch> [sha]
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `<path>`: Đường dẫn file trong repository (bắt buộc)
- `<content>`: Nội dung file (bắt buộc)
- `<message>`: Commit message (bắt buộc)
- `<branch>`: Branch để tạo/cập nhật file (bắt buộc)
- `[sha]`: SHA của file đang được thay thế (tùy chọn, chỉ khi cập nhật)

## Quy trình thực hiện

### 1. 🔍 Xác định repository
- Kiểm tra repository tồn tại
- Xác thực quyền ghi
- Hiển thị thông tin repository

### 2. ✅ Validate parameters
- Kiểm tra content hợp lệ
- Validate commit message
- Kiểm tra branch tồn tại

### 3. 📝 Thực hiện tạo/cập nhật
- Gọi `mcp_Github_create_or_update_file` với parameters
- Xử lý lỗi conflict nếu có
- Lấy kết quả commit

### 4. 📊 Báo cáo kết quả
- Hiển thị file đã tạo/cập nhật
- Phân tích commit changes
- Gợi ý sử dụng file mới

## Kết quả mong đợi
- ✅ **File** đã tạo/cập nhật thành công
- 📈 **Commit** changes analysis
- 🎯 **Gợi ý** sử dụng file mới
- ✅ **Thông tin** repository và branch

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi conflict và permission

## Ví dụ sử dụng
```
/github-create-file devgo2003 docgo-private README.md "# DocGO Project" "feat: add README" main
/github-create-file devgo2003 docgo-private src/config.js "const config = {};" "feat: add config" feature-branch
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý tạo repository mới
- **Permission denied**: Kiểm tra quyền ghi repository
- **Branch không tồn tại**: Gợi ý tạo branch mới
- **Conflict**: Xử lý merge conflict
