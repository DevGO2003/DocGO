# Git Push Private - AI-Powered Smart Merge (PowerShell - Safe Version)
param([string]$ParamBranch = '')

$ErrorActionPreference = 'Stop'

function Write-Info { param([string]$Message) Write-Host "[INFO] $Message" -ForegroundColor Blue }
function Write-Success { param([string]$Message) Write-Host "[SUCCESS] $Message" -ForegroundColor Green }
function Write-Warning { param([string]$Message) Write-Host "[WARNING] $Message" -ForegroundColor Yellow }
function Write-Error { param([string]$Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }
function Write-Smart { param([string]$Message) Write-Host "[SMART] $Message" -ForegroundColor Magenta }

$BackupDir = '.git-backup\env'
$Timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$BackupPath = Join-Path $BackupDir $Timestamp

function Get-CurrentBranch {
    try { 
        $branch = git branch --show-current 2>$null
        if ($branch) { return $branch.Trim() }
    } catch {}
    return 'main'
}

function Invoke-SmartBackup {
    Write-Smart "Thực hiện Smart Backup..."
    if (!(Test-Path $BackupPath)) { 
        New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
        Write-Info "Tạo thư mục backup: $BackupPath"
    }
    
    $envFiles = Get-ChildItem -Path . -Filter '.env*' -File -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notlike "*\.git-backup\*" }
    if ($envFiles.Count -eq 0) { 
        Write-Warning "Không tìm thấy file .env nào để backup"
        return 
    }
    
    Write-Info "Tìm thấy $($envFiles.Count) file .env:"
    foreach ($file in $envFiles) { Write-Host "  - $($file.FullName)" }
    
    foreach ($file in $envFiles) {
        $relativeFilePath = $file.Name
        $backupFile = Join-Path $BackupPath $relativeFilePath
        $backupDir = Split-Path $backupFile -Parent
        if (!(Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir -Force | Out-Null }
        Copy-Item $file.FullName $backupFile -Force
        Write-Success "Backup: $relativeFilePath -> $backupFile"
    }
    Write-Success "Smart Backup hoàn thành"
}

function Invoke-SecurityCheck {
    Write-Smart "Thực hiện Security Check..."
    $trackedEnvFiles = git ls-files | Where-Object { $_ -match '\.env' }
    if ($trackedEnvFiles.Count -eq 0) { 
        Write-Info "Không có file .env nào đang được Git theo dõi"
        return 
    }
    
    Write-Warning "Phát hiện $($trackedEnvFiles.Count) file .env đang được Git theo dõi:"
    foreach ($file in $trackedEnvFiles) { Write-Host "  - $file" }
    
    foreach ($file in $trackedEnvFiles) {
        git reset HEAD $file 2>$null
        if (Test-Path $file) {
            git rm --cached $file 2>$null
            Write-Success "Đã bỏ theo dõi: $file"
        } else {
            Write-Warning "File không tồn tại: $file"
        }
    }
    
    if ($trackedEnvFiles.Count -gt 0) {
        git add -A
        $status = git diff --cached --quiet
        if ($LASTEXITCODE -ne 0) {
            $commitMessage = "Security Check: Remove .env files from tracking - Removed $($trackedEnvFiles.Count) .env files from Git tracking"
            git commit -m $commitMessage
            Write-Success "Tạo commit dọn dẹp Security Check"
        }
    }
    Write-Success "Security Check hoàn thành"
}

function Push-ToOrigin {
    Write-Smart "Push code lên origin (không env files)..."
    $currentBranch = Get-CurrentBranch
    git add -A
    $status = git diff --cached --quiet
    if ($LASTEXITCODE -eq 0) { 
        Write-Info "Không có thay đổi code nào để commit"
        return 
    }
    
    $commitMessage = "Code changes - Auto push to origin - Pushed by git-push-private-safe.ps1 - Branch: $currentBranch"
    git commit -m $commitMessage
    git push origin $currentBranch
    Write-Success "Push code lên origin/$currentBranch thành công"
}

function Push-ToPrivate {
    param([string]$ParamBranch)
    Write-Smart "Push code + env lên private..."
    $currentBranch = Get-CurrentBranch
    
    $envFiles = Get-ChildItem -Path . -Filter '.env*' -File -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notlike "*\.git-backup\*" }
    if ($envFiles.Count -gt 0) {
        Write-Info "Force-add $($envFiles.Count) file .env:"
        foreach ($file in $envFiles) { 
            git add -f $file.FullName
            Write-Host "  - $($file.FullName)"
        }
        
        $commitMessage = "Environment files - Private sync - Added $($envFiles.Count) .env files to private repository - Branch: $currentBranch"
        git commit -m $commitMessage
        Write-Success "Commit env files thành công"
    }
    
    Write-Info "Push lên private/$currentBranch..."
    git push private $currentBranch
    Write-Success "Push lên private/$currentBranch thành công"
    
    if ($ParamBranch) {
        Write-Info "Push lên private/$ParamBranch..."
        git push private "${currentBranch}:${ParamBranch}"
        Write-Success "Push lên private/$ParamBranch thành công"
    }
}

function Invoke-CleanupLocalHistory {
    Write-Smart "Cleanup local history..."
    git reset --soft HEAD~1
    git reset HEAD
    Write-Success "Đã xóa commit env khỏi local history và unstage file .env"
}

function Sync-FromPrivate {
    Write-Smart "Đồng bộ từ private..."
    $currentBranch = Get-CurrentBranch
    git fetch private
    Write-Info "Fetch từ private remote"
    git reset --soft "private/$currentBranch"
    Write-Success "Đồng bộ với private/$currentBranch (giữ file .env)"
}

function Prevent-EnvTracking {
    Write-Smart "Ngăn env bị track ở local..."
    $excludeFile = '.git\info\exclude'
    $excludeContent = Get-Content $excludeFile -ErrorAction SilentlyContinue
    if ($excludeContent -notmatch '\.env') {
        Add-Content $excludeFile "
# Prevent .env files from being tracked"
        Add-Content $excludeFile ".env*"
        Add-Content $excludeFile "*.env"
        Write-Success "Đã thêm .env patterns vào .git/info/exclude"
    } else {
        Write-Info "Patterns .env đã tồn tại trong .git/info/exclude"
    }
}

function Invoke-FinalSync {
    Write-Smart "Pull để đồng bộ hoàn chỉnh..."
    $currentBranch = Get-CurrentBranch
    git pull private $currentBranch
    Write-Success "Đồng bộ hoàn chỉnh với private/$currentBranch"
}

function Invoke-SmartRollback {
    Write-Error "Kích hoạt Smart Rollback..."
    if (Test-Path $BackupPath) {
        Write-Info "Khôi phục từ backup: $BackupPath"
        $backupFiles = Get-ChildItem -Path $BackupPath -Recurse -File -ErrorAction SilentlyContinue
        foreach ($file in $backupFiles) {
            $relativeFilePath = $file.Name
            $targetFile = Join-Path $PWD.Path $relativeFilePath
            $targetDir = Split-Path $targetFile -Parent
            if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }
            Copy-Item $file.FullName $targetFile -Force
            Write-Success "Khôi phục: $targetFile"
        }
        Write-Success "Smart Rollback hoàn thành"
    } else {
        Write-Error "Không tìm thấy backup để rollback"
    }
}

function Main {
    param([string]$ParamBranch)
    $currentBranch = Get-CurrentBranch
    Write-Info "Bắt đầu Git Push Private - AI-Powered Smart Merge"
    Write-Info "Current branch: $currentBranch"
    if ($ParamBranch) { Write-Info "Parameter branch: $ParamBranch" }
    
    try {
        Write-Success "Bước 1: Xác định nhánh hiện tại ($currentBranch)"
        Invoke-SmartBackup
        Write-Success "Bước 2: Smart Backup hoàn thành"
        Invoke-SecurityCheck
        Write-Success "Bước 3: Security Check hoàn thành"
        Push-ToOrigin
        Write-Success "Bước 4: Push code lên origin hoàn thành"
        Push-ToPrivate $ParamBranch
        Write-Success "Bước 5: Push code + env lên private hoàn thành"
        Invoke-CleanupLocalHistory
        Write-Success "Bước 6: Cleanup local history hoàn thành"
        Sync-FromPrivate
        Write-Success "Bước 7: Đồng bộ từ private hoàn thành"
        Prevent-EnvTracking
        Write-Success "Bước 8: Ngăn env bị track hoàn thành"
        Invoke-FinalSync
        Write-Success "Bước 9: Đồng bộ hoàn chỉnh hoàn thành"
        
        Write-Success "Git Push Private hoàn thành thành công!"
        Write-Info "Tóm tắt:"
        Write-Info "  - Backup: $BackupPath"
        Write-Info "  - Origin: origin/$currentBranch"
        Write-Info "  - Private: private/$currentBranch"
        if ($ParamBranch) { Write-Info "  - Private param: private/$ParamBranch" }
        
    } catch {
        Write-Error "Script bị lỗi: $($_.Exception.Message)"
        Invoke-SmartRollback
        throw
    }
}

# Kiểm tra Git repository
try { git rev-parse --git-dir | Out-Null } catch { Write-Error "Không phải là Git repository"; exit 1 }

# Kiểm tra remote private
try { git remote get-url private | Out-Null } catch { Write-Error "Remote private không tồn tại"; Write-Info "Hãy thêm remote private: git remote add private <url>"; exit 1 }

Main $ParamBranch
