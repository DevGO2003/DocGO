# Git Push Private - Main Script
# Tu dong tao va chay script PowerShell

param([string]$AdditionalBranch = "")

Write-Host "Git Push Private - AI-Powered Smart Merge" -ForegroundColor Cyan
Write-Host "Thoi gian: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan

# Kiem tra Git repository
if (!(Test-Path ".git")) {
    Write-Host "Loi: Day khong phai la Git repository!" -ForegroundColor Red
    exit 1
}

# Kiem tra remote private
$remotes = git remote 2>$null
if (-not $remotes -or $remotes -notcontains "private") {
    Write-Host "Loi: Khong tim thay remote 'private'!" -ForegroundColor Red
    Write-Host "Hay them remote private truoc:" -ForegroundColor Yellow
    Write-Host "   git remote add private <private-repo-url>" -ForegroundColor Yellow
    Write-Host "Debug - Remotes found:" -ForegroundColor Yellow
    Write-Host $remotes -ForegroundColor Yellow
    exit 1
}

# Tao thu muc script neu chua co
if (!(Test-Path "script")) {
    New-Item -ItemType Directory -Path "script" -Force | Out-Null
}

# Kiem tra script da ton tai
$scriptPath = "script/git-push-private-safe.ps1"
if (!(Test-Path $scriptPath)) {
    Write-Host "Loi: Khong tim thay script $scriptPath" -ForegroundColor Red
    Write-Host "Hay chay lai lenh /git-push-private de tao script" -ForegroundColor Yellow
    exit 1
}

# Chay script
Write-Host "Dang chay script PowerShell..." -ForegroundColor Cyan
Write-Host ""

if ($AdditionalBranch) {
    & $scriptPath $AdditionalBranch
} else {
    & $scriptPath
}

# Kiem tra ket qua
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Script hoan thanh thanh cong!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Script gap loi. Vui long kiem tra log tren." -ForegroundColor Red
    exit 1
}