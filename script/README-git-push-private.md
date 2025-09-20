# Git Push Private - AI-Powered Smart Merge

## Tổng quan
Script PowerShell tự động push code lên cả `origin` (không .env) và `private` (có .env) với tính năng Smart Merge và backup an toàn.

## Cách sử dụng

### 1. Sử dụng lệnh Cursor (Khuyến nghị)
```bash
# Push vào private/<current-branch>
/git-push-private

# Push vào private/<current-branch> và private/<param>
/git-push-private <param>
```

### 2. Sử dụng trực tiếp PowerShell
```powershell
# Push vào private/<current-branch>
powershell -ExecutionPolicy Bypass -File script/git-push-private.ps1

# Push vào private/<current-branch> và private/<param>
powershell -ExecutionPolicy Bypass -File script/git-push-private.ps1 <param>
```

## Tính năng chính

### 🔒 Security Check
- Tự động phát hiện và loại bỏ file .env khỏi Git tracking
- Đảm bảo origin repository luôn sạch sẽ

### 💾 Smart Backup
- Tự động backup tất cả file .env trước khi xử lý
- Backup được lưu trong `.git-backup/env/<timestamp>/`
- Có thể khôi phục nếu có lỗi xảy ra

### 🤖 AI-Powered Smart Merge
- Tự động merge file .env giữa local và remote
- Quy tắc ưu tiên thông minh:
  - Database config: Ưu tiên Remote
  - API Keys: Ưu tiên Local
  - Server config: Ưu tiên Local
  - Feature flags: Logic merge

### 🛡️ Safe Cleanup
- Sử dụng `git reset --soft` để giữ file .env
- Không bao giờ mất file .env trong working directory
- Tự động rollback nếu có lỗi

## Luồng thực thi

1. **Xác định nhánh hiện tại**
2. **Smart Backup** - Backup tất cả file .env
3. **Security Check** - Loại bỏ .env khỏi Git tracking
4. **Push Origin** - Push code (không .env) lên origin
5. **Push Private** - Push code + .env lên private
6. **Safe Cleanup** - Dọn dẹp local history (giữ .env)
7. **Sync from Private** - Đồng bộ local từ private
8. **Prevent Tracking** - Ngăn .env bị track ở local
9. **Final Pull** - Pull cuối cùng để đồng bộ hoàn chỉnh

## Khôi phục file .env nếu bị mất

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

### Bash (Linux/Mac)
```bash
# Tìm backup mới nhất
latest_backup=$(ls -t .git-backup/env/ | head -1)

# Khôi phục tất cả file .env
find .git-backup/env/$latest_backup -name ".env*" | while read file; do
    target=$(echo $file | sed "s|.git-backup/env/$latest_backup/||")
    mkdir -p $(dirname "$target")
    cp "$file" "$target"
    echo "Restored: $target"
done
```

## Yêu cầu hệ thống

- Windows PowerShell 5.0+
- Git repository với remote `private`
- Quyền truy cập vào remote repositories

## Lưu ý quan trọng

- ⚠️ **KHÔNG BAO GIỜ** sử dụng `git reset --hard` trong quá trình cleanup
- ✅ **LUÔN SỬ DỤNG** `git reset --soft` để giữ file .env
- 💾 **BACKUP TỰ ĐỘNG** được tạo trước mỗi lần thực thi
- 🔍 **KIỂM TRA** file .env sau khi thực thi script

## Xử lý lỗi

Nếu script gặp lỗi:
1. Kiểm tra log để xác định bước lỗi
2. Sử dụng Smart Rollback để khôi phục
3. Kiểm tra file .env có bị mất không
4. Chạy lại script sau khi sửa lỗi

## Cấu trúc file

```
script/
├── git-push-private.ps1          # Script chính
├── git-push-private-safe.ps1     # Script thực thi
└── README-git-push-private.md    # Hướng dẫn này
```
