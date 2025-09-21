/# Git Push Private Scripts

## Tổng quan

Thư mục này chứa các script PowerShell để thực hiện git push private với tính năng Smart Merge an toàn.

## Scripts có sẵn

### 1. `git-push-private-safe.ps1`

Script chính để push code và file .env lên private repository với các tính năng:

- **Smart Backup**: Tự động backup file .env trước khi xử lý
- **Security Check**: Loại bỏ file .env khỏi Git tracking ở origin
- **AI-Powered Smart Merge**: Hợp nhất file .env thông minh
- **Safe Cleanup**: Dọn dẹp an toàn mà không mất file .env
- **Bidirectional Sync**: Đồng bộ hai chiều với private repository

## Cách sử dụng

### Sử dụng lệnh Cursor (Khuyến nghị)
```bash
# Push vào private/<current-branch>
/git-push-private

# Push vào private/<current-branch> và private/<additional-branch>
/git-push-private <additional-branch>
```

### Sử dụng trực tiếp PowerShell
```powershell
# Push vào private/<current-branch>
powershell -ExecutionPolicy Bypass -File script/git-push-private-safe.ps1

# Push vào private/<current-branch> và private/<additional-branch>
powershell -ExecutionPolicy Bypass -File script/git-push-private-safe.ps1 <additional-branch>
```

## Luồng thực thi

1. **Kiểm tra Git repository** - Xác minh đây là Git repo và có remote 'private'
2. **Smart Backup** - Backup tất cả file .env vào `.git-backup/env/`
3. **Security Check** - Loại bỏ file .env khỏi Git tracking
4. **Push to Origin** - Push code (không có .env) lên origin
5. **Push to Private** - Push code + .env lên private repository
6. **Safe Cleanup** - Dọn dẹp local history mà không mất file .env
7. **Sync from Private** - Đồng bộ local từ private repository
8. **Prevent Tracking** - Ngăn file .env bị track ở local
9. **Verification** - Kiểm tra file .env còn tồn tại

## Tính năng an toàn

- **Không bao giờ mất file .env**: Sử dụng `git reset --soft` thay vì `--hard`
- **Backup tự động**: Tạo backup trước mỗi lần thực thi
- **Smart Rollback**: Tự động khôi phục nếu có lỗi
- **Verification**: Kiểm tra file .env sau mỗi bước
- **Error handling**: Xử lý lỗi và rollback an toàn

## Khôi phục file .env nếu bị mất

Nếu file .env bị mất do lỗi script, sử dụng lệnh sau để khôi phục:

### PowerShell (Windows)
```powershell
# Tìm backup mới nhất
$latestBackup = Get-ChildItem .git-backup\env\ | Sort-Object Name -Descending | Select-Object -First 1

# Khôi phục tất cả file .env
Get-ChildItem $latestBackup.FullName -Recurse -Name ".env*" | ForEach-Object {
    $source = Join-Path $latestBackup.FullName $_
    $target = ".\" + $_
    $targetDir = Split-Path $target -Parent
    if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }
    Copy-Item $source $target -Force
    Write-Host "Restored: $_"
}
```

## Lưu ý quan trọng

- Script hoạt động trên PowerShell (Windows)
- Đảm bảo có quyền truy cập vào remote 'private'
- Các file .env sẽ được backup tự động trước khi xử lý
- Smart Merge đảm bảo không mất dữ liệu quan trọng
- Script tự động tạo file `git-push-private-safe.ps1` trong thư mục `script/`

## Troubleshooting

### Lỗi "Khong tim thay remote 'private'"
- Kiểm tra remote: `git remote -v`
- Thêm remote private: `git remote add private <private-repo-url>`

### Lỗi "Khong phai Git repository"
- Đảm bảo đang chạy script trong thư mục Git repository
- Kiểm tra có file `.git` trong thư mục hiện tại

### File .env bị mất
- Sử dụng lệnh khôi phục ở trên
- Kiểm tra thư mục `.git-backup/env/` để tìm backup

## Cấu trúc thư mục

```
script/
├── README.md                           # Hướng dẫn sử dụng
├── git-push-private-safe.ps1          # Script chính
└── .git-backup/                       # Thư mục backup (tự động tạo)
    └── env/
        └── YYYYMMDD-HHMMSS/           # Backup theo thời gian
            └── [các file .env backup]
```
