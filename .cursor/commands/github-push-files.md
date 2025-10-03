# GitHub Push Files Command

## Mục đích
Push nhiều files lên GitHub repository trong một commit.

## Cách sử dụng
```bash
/github-push-files <owner> <repo> <branch> <files> <message>
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `<branch>`: Branch để push files (bắt buộc)
- `<files>`: JSON array của files với path và content (bắt buộc)
- `<message>`: Commit message (bắt buộc)

## Quy trình thực hiện

### 1. 🔍 Xác định repository
- Kiểm tra repository tồn tại
- Xác thực quyền ghi
- Hiển thị thông tin repository

### 2. ✅ Validate files
- Kiểm tra JSON syntax của files array
- Validate file paths
- Kiểm tra content hợp lệ

### 3. 📝 Thực hiện push
- Gọi `mcp_Github_push_files` với parameters
- Xử lý lỗi conflict nếu có
- Lấy kết quả commit

### 4. 📊 Báo cáo kết quả
- Hiển thị files đã push
- Phân tích commit changes
- Gợi ý sử dụng files mới

## Kết quả mong đợi
- ✅ **Files** đã push thành công
- 📈 **Commit** changes analysis
- 🎯 **Gợi ý** sử dụng files mới
- ✅ **Thông tin** repository và branch

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi conflict và permission

## Ví dụ sử dụng
```
/github-push-files devgo2003 docgo-private main '[{"path": "src/app.js", "content": "console.log('Hello');"}]' "feat: add app.js"
/github-push-files devgo2003 docgo-private feature '[{"path": "README.md", "content": "# Project"}, {"path": "package.json", "content": "{}"}]' "feat: add project files"
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý tạo repository mới
- **Permission denied**: Kiểm tra quyền ghi repository
- **Branch không tồn tại**: Gợi ý tạo branch mới
- **Conflict**: Xử lý merge conflict

