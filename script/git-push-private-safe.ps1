# Git Push Private - AI-Powered Smart Merge (PowerShell)
# Tự động tạo bởi Cursor AI Assistant

param(
    [string]$AdditionalBranch = ""
)

# Cấu hình
$ErrorActionPreference = "Stop"
$currentBranch = git branch --show-current
if (-not $currentBranch) {
    $currentBranch = "main"
}

Write-Host "Git Push Private - Smart Merge" -ForegroundColor Green
Write-Host "Current branch: $currentBranch" -ForegroundColor Yellow
if ($AdditionalBranch) {
    Write-Host "Additional branch: $AdditionalBranch" -ForegroundColor Yellow
}

# Kiểm tra Git repository
if (-not (Test-Path ".git")) {
    Write-Error "Khong phai Git repository"
    exit 1
}

# Kiểm tra remote private
$remotes = git remote
if ($remotes -notcontains "private") {
    Write-Error "Khong tim thay remote 'private'"
    exit 1
}

try {
    # 1. Smart Backup - Backup tất cả file .env
    Write-Host "Smart Backup: Backup file .env..." -ForegroundColor Cyan
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupDir = ".git-backup/env/$timestamp"
    
    if (-not (Test-Path ".git-backup")) {
        New-Item -ItemType Directory -Path ".git-backup" -Force | Out-Null
    }
    if (-not (Test-Path ".git-backup/env")) {
        New-Item -ItemType Directory -Path ".git-backup/env" -Force | Out-Null
    }
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    # Backup tất cả file .env
    Get-ChildItem -Recurse -Name ".env*" | ForEach-Object {
        $source = $_
        $target = Join-Path $backupDir $_
        $targetDir = Split-Path $target -Parent
        if (-not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        Copy-Item $source $target -Force
        Write-Host "  Backed up: $_" -ForegroundColor Green
    }
    
    # 2. Security Check - Kiểm tra và xóa .env khỏi Git tracking
    Write-Host "Security Check: Kiem tra .env files..." -ForegroundColor Cyan
    $envFiles = git ls-files | Where-Object { $_ -match "\.env" }
    if ($envFiles) {
        Write-Host "  Tim thay .env files dang duoc track:" -ForegroundColor Yellow
        $envFiles | ForEach-Object { Write-Host "    - $_" -ForegroundColor Yellow }
        
        # Unstage và remove từ tracking
        git reset HEAD $envFiles
        git rm --cached $envFiles
        git commit -m "Security: Remove .env files from Git tracking"
        Write-Host "  Da xoa .env files khoi Git tracking" -ForegroundColor Green
    } else {
        Write-Host "  Khong co .env files nao dang duoc track" -ForegroundColor Green
    }
    
    # 3. Push code lên origin (không env)
    Write-Host "Push code len origin..." -ForegroundColor Cyan
    git add .
    git commit -m "Code changes - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git push origin $currentBranch
    Write-Host "  Code da duoc push len origin/$currentBranch" -ForegroundColor Green
    
    # 4. Push code + env lên private
    Write-Host "Push code + env len private..." -ForegroundColor Cyan
    
    # 4.1. Force-add env files
    $envFiles = Get-ChildItem -Recurse -Name ".env*"
    if ($envFiles) {
        git add -f $envFiles
        git commit -m "Environment files - Private sync - Added $($envFiles.Count) .env files to private repository - Branch: $currentBranch"
        Write-Host "  Da force-add $($envFiles.Count) .env files" -ForegroundColor Green
    }
    
    # 4.2. Push lên private/<current-branch>
    git push private $currentBranch
    Write-Host "  Da push len private/$currentBranch" -ForegroundColor Green
    
    # 4.3. Push lên private/<additional-branch> nếu có
    if ($AdditionalBranch) {
        git push private "${currentBranch}:${AdditionalBranch}"
        Write-Host "  Da push len private/$AdditionalBranch" -ForegroundColor Green
    }
    
    # 4.4. Cleanup local history (Safe)
    Write-Host "Safe Cleanup: Don dep local history..." -ForegroundColor Cyan
    if ($envFiles) {
        git reset --soft HEAD~1
        git reset HEAD
        Write-Host "  Da cleanup local history (giu .env files)" -ForegroundColor Green
    }
    
    # 5. Đồng bộ lại local từ private
    Write-Host "Sync tu private..." -ForegroundColor Cyan
    git fetch private
    git reset --soft "private/$currentBranch"
    Write-Host "  Da dong bo local tu private/$currentBranch" -ForegroundColor Green
    
    # 6. Ngăn env bị track ở local
    Write-Host "Prevent .env tracking..." -ForegroundColor Cyan
    $excludeFile = ".git/info/exclude"
    $envPatterns = @("*.env", "*.env.*", ".env*")
    
    foreach ($pattern in $envPatterns) {
        $content = Get-Content $excludeFile -ErrorAction SilentlyContinue
        if (-not $content -or $content -notcontains $pattern) {
            Add-Content $excludeFile $pattern
            Write-Host "  Da them pattern: $pattern" -ForegroundColor Green
        }
    }
    
    # 7. Pull để đồng bộ hoàn chỉnh
    Write-Host "Final sync..." -ForegroundColor Cyan
    git pull private $currentBranch
    Write-Host "  Da hoan tat dong bo" -ForegroundColor Green
    
    Write-Host "Git Push Private hoan thanh thanh cong!" -ForegroundColor Green
    Write-Host "Tom tat:" -ForegroundColor Yellow
    Write-Host "  - Backup: $backupDir" -ForegroundColor White
    Write-Host "  - Origin: origin/$currentBranch" -ForegroundColor White
    Write-Host "  - Private: private/$currentBranch" -ForegroundColor White
    if ($AdditionalBranch) {
        Write-Host "  - Additional: private/$AdditionalBranch" -ForegroundColor White
    }
    Write-Host "  - .env files: Preserved in working directory" -ForegroundColor White
    
} catch {
    Write-Error "Loi: $($_.Exception.Message)"
    Write-Host "Smart Rollback: Khoi phuc tu backup..." -ForegroundColor Yellow
    
    # Smart Rollback
    if (Test-Path $backupDir) {
        Get-ChildItem $backupDir -Recurse -Name ".env*" | ForEach-Object {
            $source = Join-Path $backupDir $_
            $target = $_
            $targetDir = Split-Path $target -Parent
            if (-not (Test-Path $targetDir)) {
                New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
            }
            Copy-Item $source $target -Force
            Write-Host "  Restored: $_" -ForegroundColor Green
        }
        Write-Host "Rollback hoan thanh" -ForegroundColor Green
    }
    
    exit 1
}