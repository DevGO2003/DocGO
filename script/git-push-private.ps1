# Git Push Private - Main Script
# Tự động tạo và chạy script PowerShell

param([string]$AdditionalBranch = "")

Write-Host "🚀 Git Push Private - AI-Powered Smart Merge" -ForegroundColor Cyan
Write-Host "📅 Thời gian: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan

# Kiểm tra Git repository
if (!(Test-Path ".git")) {
    Write-Host "❌ Lỗi: Đây không phải là Git repository!" -ForegroundColor Red
    exit 1
}

# Kiểm tra remote private
$remotes = git remote 2>$null
if (-not $remotes -or $remotes -notcontains "private") {
    Write-Host "❌ Lỗi: Không tìm thấy remote 'private'!" -ForegroundColor Red
    Write-Host "💡 Hãy thêm remote private trước:" -ForegroundColor Yellow
    Write-Host "   git remote add private <private-repo-url>" -ForegroundColor Yellow
    Write-Host "Debug - Remotes found:" -ForegroundColor Yellow
    Write-Host $remotes -ForegroundColor Yellow
    exit 1
}

# Tạo thư mục script nếu chưa có
if (!(Test-Path "script")) {
    New-Item -ItemType Directory -Path "script" -Force | Out-Null
}

# Kiểm tra script đã tồn tại
$scriptPath = "script/git-push-private-safe.ps1"
if (!(Test-Path $scriptPath)) {
    Write-Host "❌ Lỗi: Không tìm thấy script $scriptPath" -ForegroundColor Red
    Write-Host "💡 Hãy chạy lại lệnh /git-push-private để tạo script" -ForegroundColor Yellow
    exit 1
}

# Chạy script
Write-Host "🔄 Đang chạy script PowerShell..." -ForegroundColor Cyan
Write-Host ""

if ($AdditionalBranch) {
    & $scriptPath $AdditionalBranch
} else {
    & $scriptPath
}

# Kiểm tra kết quả
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Script hoàn thành thành công!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Script gặp lỗi. Vui lòng kiểm tra log trên." -ForegroundColor Red
    exit 1
}