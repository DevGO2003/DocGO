# GitHub Fork Repository Command

## Mục đích
Fork repository GitHub sang account hoặc organization khác.

## Cách sử dụng
```bash
/github-fork <owner> <repo> [organization]
```

## Tham số
- `<owner>`: Repository owner hiện tại (bắt buộc)
- `<repo>`: Repository name (bắt buộc)
- `[organization]`: Organization để fork tới (tùy chọn, mặc định: personal account)

## Quy trình thực hiện

### 1. 🔍 Xác định repository
- Kiểm tra repository tồn tại
- Xác thực quyền fork
- Hiển thị thông tin repository

### 2. ✅ Validate parameters
- Kiểm tra organization tồn tại (nếu có)
- Validate fork permissions
- Kiểm tra repository accessibility

### 3. 🔄 Thực hiện fork
- Gọi `mcp_Github_fork_repository` với parameters
- Xử lý lỗi permission nếu có
- Lấy kết quả fork

### 4. 📊 Báo cáo kết quả
- Hiển thị repository đã fork
- Phân tích fork details
- Gợi ý sử dụng repository mới

## Kết quả mong đợi
- ✅ **Repository** đã fork thành công
- 📈 **Fork details** analysis
- 🎯 **Gợi ý** sử dụng repository mới
- ✅ **Thông tin** repository và fork

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi permission và accessibility

## Ví dụ sử dụng
```
/github-fork devgo2003 docgo-private
/github-fork devgo2003 docgo-private my-organization
/github-fork microsoft vscode
```

## Troubleshooting
- **Repository không tồn tại**: Gợi ý repository khác
- **Permission denied**: Kiểm tra quyền fork repository
- **Organization không tồn tại**: Kiểm tra organization name
- **Already forked**: Thông báo repository đã được fork
