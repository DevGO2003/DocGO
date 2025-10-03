# GitHub Update Issue Command

## Mục đích
Cập nhật issue trong GitHub repository.

## Cách sử dụng
```bash
/github-update-issue <owner> <repo> <issue_number> [title] [body] [state] [assignees] [milestone] [labels]
```

## Tham số
- `<owner>`: Repository owner (username hoặc organization) (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `<issue_number>`: Số issue cần cập nhật (bắt buộc)
- `[title]`: Tiêu đề mới (tùy chọn)
- `[body]`: Nội dung mới (tùy chọn)
- `[state]`: Trạng thái mới (open, closed) (tùy chọn)
- `[assignees]`: Danh sách assignees mới (array) (tùy chọn)
- `[milestone]`: Milestone number mới (tùy chọn)
- `[labels]`: Danh sách labels mới (array) (tùy chọn)

## Quy trình thực hiện

### 1. 🔍 Xác định issue
- Kiểm tra repository và issue tồn tại
- Xác thực quyền cập nhật
- Hiển thị thông tin issue hiện tại

### 2. ✅ Validate parameters
- Kiểm tra issue number hợp lệ
- Validate assignees tồn tại
- Kiểm tra labels hợp lệ

### 3. 📝 Thực hiện cập nhật
- Gọi `mcp_Github_update_issue` với parameters
- Xử lý lỗi validation nếu có
- Lấy kết quả cập nhật

### 4. 📊 Báo cáo kết quả
- Hiển thị issue đã cập nhật
- Phân tích thay đổi
- Gợi ý sử dụng issue

## Kết quả mong đợi
- ✅ **Issue** đã cập nhật thành công
- 📈 **Thay đổi** trong issue
- 🎯 **Gợi ý** sử dụng issue
- ✅ **Thông tin** repository và issue

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi validation và permission

## Ví dụ sử dụng
```
/github-update-issue devgo2003 docgo-private 123 "Updated title" "Updated description"
/github-update-issue devgo2003 docgo-private 456 --state closed --labels resolved
/github-update-issue devgo2003 docgo-private 789 --assignees devgo2003 --milestone 1
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **Issue không tồn tại**: Kiểm tra issue number
- **Permission denied**: Kiểm tra quyền cập nhật issue
- **Invalid assignees**: Kiểm tra usernames tồn tại
- **Invalid labels**: Kiểm tra labels tồn tại trong repository

