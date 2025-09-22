# Delete All Scripts Command - Xóa tất cả file script không cần thiết

## Mục đích
Khi người dùng yêu cầu "xóa script" hoặc "delete scripts", command này sẽ:
- **Tự động tìm và xóa** tất cả file script trong thư mục `.cursor/scripts/temp/`
- **Giữ lại** các file cấu hình quan trọng (README, requirements, etc.)
- **Dọn dẹp workspace** để tránh file rác
- **Báo cáo chi tiết** về các file đã xóa

## Quy trình thực hiện

### 1. 🔍 Tìm kiếm file script
- **Quét thư mục** `.cursor/scripts/temp/` để tìm file script
- **Phân loại** file theo loại: Python (.py), JavaScript (.js), Batch (.bat), PowerShell (.ps1)
- **Kiểm tra** file nào cần giữ lại (README, requirements, config)

### 2. 🗑️ Xóa file script
- **Xóa từng file** script một cách an toàn
- **Báo cáo** tên file và lý do xóa
- **Đếm tổng số** file đã xóa

### 3. 📊 Báo cáo kết quả
- **Danh sách file** đã xóa
- **Tổng số file** đã xóa
- **File được giữ lại** (nếu có)
- **Trạng thái** workspace sau khi dọn dẹp

## ⚠️ QUY TẮC NGHIÊM NGẶT
- **CHỈ xóa** file script trong thư mục `.cursor/scripts/temp/`
- **KHÔNG xóa** file cấu hình quan trọng
- **KHÔNG xóa** file README hoặc documentation
- **KHÔNG xóa** file requirements hoặc package.json
- **BÁO CÁO** trước khi xóa file quan trọng

## File được xóa tự động
- ✅ `*.py` - Python scripts
- ✅ `*.js` - JavaScript scripts  
- ✅ `*.bat` - Batch scripts
- ✅ `*.ps1` - PowerShell scripts
- ✅ `*.sh` - Shell scripts

## File được giữ lại
- ❌ `README*.md` - Documentation
- ❌ `requirements*.txt` - Dependencies
- ❌ `package*.json` - Node.js config
- ❌ `*.config.*` - Configuration files
- ❌ `*.env*` - Environment files

## Ví dụ sử dụng
```
delete-all-scripts: Xóa tất cả file script
delete scripts: Dọn dẹp workspace
xóa script: Loại bỏ file không cần thiết
clean scripts: Làm sạch thư mục script
```

## Kết quả mong đợi
- 🗑️ **Xóa thành công** tất cả file script không cần thiết
- 📊 **Báo cáo chi tiết** về file đã xóa
- 🧹 **Workspace sạch sẽ** không còn file rác
- ✅ **Giữ lại** file cấu hình quan trọng
- 📈 **Thống kê** tổng số file đã dọn dẹp

## Lưu ý quan trọng
- Command này **KHÔNG thể hoàn tác** - file đã xóa sẽ mất vĩnh viễn
- **Kiểm tra kỹ** trước khi xóa file quan trọng
- **Backup** file cần thiết trước khi chạy command
- **Chỉ chạy** khi chắc chắn muốn dọn dẹp workspace
