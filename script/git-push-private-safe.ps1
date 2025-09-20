# Git Push Private - AI-Powered Smart Merge (PowerShell)
# Tự động tạo bởi Cursor AI Assistant

param([string]$AdditionalBranch = "")

# Cấu hình màu sắc
$ErrorColor = "Red"
$SuccessColor = "Green"
$WarningColor = "Yellow"
$InfoColor = "Cyan"

function Write-ColorMessage {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Test-ErrorAndRollback {
    param([string]$Step, [string]$BackupPath)
    if ($LASTEXITCODE -ne 0) {
        Write-ColorMessage "❌ Lỗi tại bước: $Step" $ErrorColor
        Write-ColorMessage "🔄 Đang thực hiện Smart Rollback..." $WarningColor
        
        if (Test-Path $BackupPath) {
            Get-ChildItem $BackupPath -Recurse -Name ".env*" | ForEach-Object {
                $source = Join-Path $BackupPath $_
                $target = ".\" + $_
                $targetDir = Split-Path $target -Parent
                if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }
                Copy-Item $source $target -Force
                Write-ColorMessage "✅ Khôi phục: $_" $SuccessColor
            }
        }
        
        Write-ColorMessage "❌ Script đã dừng do lỗi. Vui lòng kiểm tra và thử lại." $ErrorColor
        exit 1
    }
}

# Bắt đầu script
Write-ColorMessage "🚀 Bắt đầu Git Push Private - AI-Powered Smart Merge" $InfoColor

# 1. Xác định nhánh hiện tại
$currentBranch = git branch --show-current
if (-not $currentBranch) { $currentBranch = "main" }
Write-ColorMessage "📍 Nhánh hiện tại: $currentBranch" $InfoColor

# 2. Smart Backup
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = ".git-backup/env/$timestamp"
Write-ColorMessage "💾 Đang thực hiện Smart Backup..." $InfoColor

if (!(Test-Path ".git-backup")) { New-Item -ItemType Directory -Path ".git-backup" -Force | Out-Null }
if (!(Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir -Force | Out-Null }

Get-ChildItem -Path . -Recurse -Name ".env*" | ForEach-Object {
    $source = $_
    $target = Join-Path $backupDir $_
    $targetDir = Split-Path $target -Parent
    if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }
    Copy-Item $source $target -Force
    Write-ColorMessage "  📁 Backup: $_" $InfoColor
}

Write-ColorMessage "✅ Smart Backup hoàn thành: $backupDir" $SuccessColor

# 3. Security Check
Write-ColorMessage "🔒 Đang thực hiện Security Check..." $InfoColor

$envFiles = git ls-files | Where-Object { $_ -match "\.env" }
if ($envFiles) {
    Write-ColorMessage "⚠️ Phát hiện file .env đang được Git theo dõi:" $WarningColor
    $envFiles | ForEach-Object { 
        git reset HEAD $_
        git rm --cached $_
        Write-ColorMessage "  🗑️ Removed from tracking: $_" $InfoColor
    }
    git add .
    git commit -m "Security: Remove .env files from Git tracking" 2>$null
}

# 4. Push code lên origin
Write-ColorMessage "📤 Đang push code lên origin..." $InfoColor
git add .
git commit -m "Auto-commit before push to origin" 2>$null

# Kiểm tra nếu cần pull trước
Write-ColorMessage "🔄 Kiểm tra trạng thái remote..." $InfoColor
git fetch origin
$behind = git rev-list --count HEAD..origin/$currentBranch 2>$null
$ahead = git rev-list --count origin/$currentBranch..HEAD 2>$null

if ($behind -gt 0) {
    Write-ColorMessage "⚠️ Branch đang behind $behind commits. Đang pull..." $WarningColor
    git pull origin $currentBranch --no-edit
    Test-ErrorAndRollback "Pull from origin" $backupDir
}

git push origin $currentBranch
Test-ErrorAndRollback "Push to origin" $backupDir

# 5. Push code + env lên private
Write-ColorMessage "🔐 Đang push code + env lên private..." $InfoColor

Get-ChildItem -Path . -Recurse -Name ".env*" | ForEach-Object {
    git add -f $_
    Write-ColorMessage "  ➕ Force-added: $_" $InfoColor
}

git commit -m "Add .env files for private repository"
git push private $currentBranch
Test-ErrorAndRollback "Push to private/$currentBranch" $backupDir

if ($AdditionalBranch) {
    Write-ColorMessage "🔄 Đang push vào private/$AdditionalBranch..." $InfoColor
    git push private $AdditionalBranch
    Test-ErrorAndRollback "Push to private/$AdditionalBranch" $backupDir
}

# 6. Safe Cleanup
Write-ColorMessage "🧹 Đang thực hiện Safe Cleanup..." $InfoColor
git reset --soft HEAD~1
git reset HEAD
Write-ColorMessage "✅ Safe Cleanup hoàn thành (giữ file .env)" $SuccessColor

# 7. Đồng bộ từ private
Write-ColorMessage "⬇️ Đang đồng bộ local từ private..." $InfoColor
git fetch private
git reset --soft "private/$currentBranch"
Test-ErrorAndRollback "Sync from private" $backupDir

# 8. Ngăn env bị track
Write-ColorMessage "🛡️ Đang ngăn .env bị track ở local..." $InfoColor
$excludeFile = ".git/info/exclude"
if (!(Test-Path $excludeFile)) { New-Item -ItemType File -Path $excludeFile -Force | Out-Null }

$envPatterns = @("# Prevent .env files from being tracked", ".env", ".env.*", "**/.env", "**/.env.*")
$envPatterns | ForEach-Object {
    if (!(Get-Content $excludeFile -ErrorAction SilentlyContinue | Where-Object { $_ -eq $_ })) {
        Add-Content -Path $excludeFile -Value $_
    }
}

# 9. Pull cuối cùng
Write-ColorMessage "🔄 Đang pull để đồng bộ hoàn chỉnh..." $InfoColor
git pull private $currentBranch
Test-ErrorAndRollback "Final pull from private" $backupDir

# Kiểm tra file .env
Write-ColorMessage "🔍 Kiểm tra file .env cuối cùng..." $InfoColor
$envFiles = Get-ChildItem -Path . -Recurse -Name ".env*"
if ($envFiles) {
    Write-ColorMessage "✅ File .env được giữ lại:" $SuccessColor
    $envFiles | ForEach-Object { Write-ColorMessage "  📄 $_" $SuccessColor }
} else {
    Write-ColorMessage "⚠️ Không tìm thấy file .env! Đang khôi phục..." $WarningColor
    if (Test-Path $backupDir) {
        Get-ChildItem $backupDir -Recurse -Name ".env*" | ForEach-Object {
            $source = Join-Path $backupDir $_
            $target = ".\" + $_
            $targetDir = Split-Path $target -Parent
            if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }
            Copy-Item $source $target -Force
            Write-ColorMessage "  ✅ Khôi phục: $_" $SuccessColor
        }
    }
}

# Kết thúc
Write-ColorMessage "" $InfoColor
Write-ColorMessage "🎉 Git Push Private - AI-Powered Smart Merge hoàn thành!" $SuccessColor
Write-ColorMessage "📊 Tóm tắt:" $InfoColor
Write-ColorMessage "  • Nhánh hiện tại: $currentBranch" $InfoColor
if ($AdditionalBranch) { Write-ColorMessage "  • Nhánh bổ sung: $AdditionalBranch" $InfoColor }
Write-ColorMessage "  • Backup .env: $backupDir" $InfoColor
Write-ColorMessage "  • Origin: ✅ Đã push (không .env)" $SuccessColor
Write-ColorMessage "  • Private: ✅ Đã push (có .env)" $SuccessColor
Write-ColorMessage "  • Local: ✅ Đã đồng bộ" $SuccessColor
Write-ColorMessage "" $InfoColor
Write-ColorMessage "💡 Lưu ý: File .env được giữ lại trong working directory và không bị Git theo dõi" $InfoColor