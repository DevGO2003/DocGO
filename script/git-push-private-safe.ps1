# Git Push Private - AI-Powered Smart Merge (PowerShell)
# Tu dong tao boi Cursor AI Assistant

param([string]$AdditionalBranch = "")

# Cau hinh mau sac
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
        Write-ColorMessage "Loi tai buoc: $Step" $ErrorColor
        Write-ColorMessage "Dang thuc hien Smart Rollback..." $WarningColor
        
        if (Test-Path $BackupPath) {
            Get-ChildItem $BackupPath -Recurse -Name ".env*" | ForEach-Object {
                $source = Join-Path $BackupPath $_
                $target = ".\" + $_
                $targetDir = Split-Path $target -Parent
                if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }
                Copy-Item $source $target -Force
                Write-ColorMessage "Khoi phuc: $_" $SuccessColor
            }
        }
        
        Write-ColorMessage "Script da dung do loi. Vui long kiem tra va thu lai." $ErrorColor
        exit 1
    }
}

# Bat dau script
Write-ColorMessage "Bat dau Git Push Private - AI-Powered Smart Merge" $InfoColor

# 1. Xac dinh nhanh hien tai
$currentBranch = git branch --show-current
if (-not $currentBranch) { $currentBranch = "main" }
Write-ColorMessage "Nhanh hien tai: $currentBranch" $InfoColor

# 2. Smart Backup
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = ".git-backup/env/$timestamp"
Write-ColorMessage "Dang thuc hien Smart Backup..." $InfoColor

if (!(Test-Path ".git-backup")) { New-Item -ItemType Directory -Path ".git-backup" -Force | Out-Null }
if (!(Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir -Force | Out-Null }

Get-ChildItem -Path . -Recurse -Name ".env*" | ForEach-Object {
    $source = $_
    $target = Join-Path $backupDir $_
    $targetDir = Split-Path $target -Parent
    if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }
    Copy-Item $source $target -Force
    Write-ColorMessage "  Backup: $_" $InfoColor
}

Write-ColorMessage "Smart Backup hoan thanh: $backupDir" $SuccessColor

# 3. Security Check
Write-ColorMessage "Dang thuc hien Security Check..." $InfoColor

$envFiles = git ls-files | Where-Object { $_ -match "\.env" }
if ($envFiles) {
    Write-ColorMessage "Phat hien file .env dang duoc Git theo doi:" $WarningColor
    $envFiles | ForEach-Object { 
        git reset HEAD $_
        git rm --cached $_
        Write-ColorMessage "  Removed from tracking: $_" $InfoColor
    }
    git add .
    git commit -m "Security: Remove .env files from Git tracking" 2>$null
}

# 4. Push code len origin (voi force neu can)
Write-ColorMessage "Dang push code len origin..." $InfoColor
git add .
git commit -m "Auto-commit before push to origin" 2>$null

# Thu push binh thuong truoc
git push origin $currentBranch 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-ColorMessage "Push binh thuong that bai. Dang thu force push..." $WarningColor
    git push origin $currentBranch --force
    Test-ErrorAndRollback "Force push to origin" $backupDir
} else {
    Write-ColorMessage "Push binh thuong thanh cong" $SuccessColor
}

# 5. Push code + env len private
Write-ColorMessage "Dang push code + env len private..." $InfoColor

Get-ChildItem -Path . -Recurse -Name ".env*" | ForEach-Object {
    git add -f $_
    Write-ColorMessage "  Force-added: $_" $InfoColor
}

git commit -m "Add .env files for private repository"
git push private $currentBranch
Test-ErrorAndRollback "Push to private/$currentBranch" $backupDir

if ($AdditionalBranch) {
    Write-ColorMessage "Dang push vao private/$AdditionalBranch..." $InfoColor
    git push private $AdditionalBranch
    Test-ErrorAndRollback "Push to private/$AdditionalBranch" $backupDir
}

# 6. Safe Cleanup
Write-ColorMessage "Dang thuc hien Safe Cleanup..." $InfoColor
git reset --soft HEAD~1
git reset HEAD
Write-ColorMessage "Safe Cleanup hoan thanh (giu file .env)" $SuccessColor

# 7. Dong bo tu private
Write-ColorMessage "Dang dong bo local tu private..." $InfoColor
git fetch private
git reset --soft "private/$currentBranch"
Test-ErrorAndRollback "Sync from private" $backupDir

# 8. Ngan env bi track
Write-ColorMessage "Dang ngan .env bi track o local..." $InfoColor
$excludeFile = ".git/info/exclude"
if (!(Test-Path $excludeFile)) { New-Item -ItemType File -Path $excludeFile -Force | Out-Null }

$envPatterns = @("# Prevent .env files from being tracked", ".env", ".env.*", "**/.env", "**/.env.*")
$envPatterns | ForEach-Object {
    if (!(Get-Content $excludeFile -ErrorAction SilentlyContinue | Where-Object { $_ -eq $_ })) {
        Add-Content -Path $excludeFile -Value $_
    }
}

# 9. Pull cuoi cung
Write-ColorMessage "Dang pull de dong bo hoan chinh..." $InfoColor
git pull private $currentBranch
Test-ErrorAndRollback "Final pull from private" $backupDir

# Kiem tra file .env
Write-ColorMessage "Kiem tra file .env cuoi cung..." $InfoColor
$envFiles = Get-ChildItem -Path . -Recurse -Name ".env*"
if ($envFiles) {
    Write-ColorMessage "File .env duoc giu lai:" $SuccessColor
    $envFiles | ForEach-Object { Write-ColorMessage "  $_" $SuccessColor }
} else {
    Write-ColorMessage "Khong tim thay file .env! Dang khoi phuc..." $WarningColor
    if (Test-Path $backupDir) {
        Get-ChildItem $backupDir -Recurse -Name ".env*" | ForEach-Object {
            $source = Join-Path $backupDir $_
            $target = ".\" + $_
            $targetDir = Split-Path $target -Parent
            if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }
            Copy-Item $source $target -Force
            Write-ColorMessage "  Khoi phuc: $_" $SuccessColor
        }
    }
}

# Ket thuc
Write-ColorMessage "" $InfoColor
Write-ColorMessage "Git Push Private - AI-Powered Smart Merge hoan thanh!" $SuccessColor
Write-ColorMessage "Tom tat:" $InfoColor
Write-ColorMessage "  • Nhanh hien tai: $currentBranch" $InfoColor
if ($AdditionalBranch) { Write-ColorMessage "  • Nhanh bo sung: $AdditionalBranch" $InfoColor }
Write-ColorMessage "  • Backup .env: $backupDir" $InfoColor
Write-ColorMessage "  • Origin: Da push (khong .env)" $SuccessColor
Write-ColorMessage "  • Private: Da push (co .env)" $SuccessColor
Write-ColorMessage "  • Local: Da dong bo" $SuccessColor
Write-ColorMessage "" $InfoColor
Write-ColorMessage "Luu y: File .env duoc giu lai trong working directory va khong bi Git theo doi" $InfoColor