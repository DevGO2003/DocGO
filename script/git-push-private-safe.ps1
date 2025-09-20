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
    Write-Smart "Thuc hien Smart Backup..."
    
    # Dọn dẹp backup cũ trước khi tạo backup mới (giữ lại 5 backup gần nhất)
    if (Test-Path $BackupDir) {
        $oldBackups = Get-ChildItem -Path $BackupDir -Directory | Sort-Object Name -Descending | Select-Object -Skip 5
        foreach ($oldBackup in $oldBackups) {
            Remove-Item $oldBackup.FullName -Recurse -Force
            Write-Info "Da xoa backup cu: $($oldBackup.Name)"
        }
    }
    
    if (!(Test-Path $BackupPath)) { 
        New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
        Write-Info "Tao thu muc backup: $BackupPath"
    }
    
    # Sử dụng regex pattern mạnh hơn để loại trừ nested backup
    $envFiles = Get-ChildItem -Path . -Filter '.env*' -File -Recurse -ErrorAction SilentlyContinue | Where-Object { 
        $_.FullName -notmatch '\.git-backup' -and 
        $_.FullName -notmatch '\.git' -and
        $_.FullName -notmatch 'node_modules' -and
        $_.FullName -notmatch 'venv'
    }
    
    if ($envFiles.Count -eq 0) { 
        Write-Warning "Khong tim thay file .env nao de backup"
        return 
    }
    
    Write-Info "Tim thay $($envFiles.Count) file .env:"
    foreach ($file in $envFiles) { Write-Host "  - $($file.FullName)" }
    
    foreach ($file in $envFiles) {
        # Cải thiện path handling
        $relativeFilePath = $file.FullName.Replace($PWD.Path, '').TrimStart('\')
        $backupFile = Join-Path $BackupPath $relativeFilePath
        $backupDir = Split-Path $backupFile -Parent
        if (!(Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir -Force | Out-Null }
        Copy-Item $file.FullName $backupFile -Force
        Write-Success "Backup: $relativeFilePath -> $backupFile"
    }
    Write-Success "Smart Backup hoan thanh"
}

function Invoke-SecurityCheck {
    Write-Smart "Thuc hien Security Check..."
    $trackedEnvFiles = git ls-files | Where-Object { $_ -match '\.env' }
    if ($trackedEnvFiles.Count -eq 0) { 
        Write-Info "Khong co file .env nao dang duoc Git theo doi"
        return 
    }
    
    Write-Warning "Phat hien $($trackedEnvFiles.Count) file .env dang duoc Git theo doi:"
    foreach ($file in $trackedEnvFiles) { Write-Host "  - $file" }
    
    foreach ($file in $trackedEnvFiles) {
        git reset HEAD $file 2>$null
        if (Test-Path $file) {
            git rm --cached $file 2>$null
            Write-Success "Da bo theo doi: $file"
        } else {
            Write-Warning "File khong ton tai: $file"
        }
    }
    
    if ($trackedEnvFiles.Count -gt 0) {
        git add -A
        $status = git diff --cached --quiet
        if ($LASTEXITCODE -ne 0) {
            $commitMessage = "Security Check: Remove .env files from tracking - Removed $($trackedEnvFiles.Count) .env files from Git tracking"
            git commit -m $commitMessage
            Write-Success "Tao commit don dep Security Check"
        }
    }
    Write-Success "Security Check hoan thanh"
}

function Push-ToOrigin {
    Write-Smart "Push code len origin (khong env files)..."
    $currentBranch = Get-CurrentBranch
    git add -A
    $status = git diff --cached --quiet
    if ($LASTEXITCODE -eq 0) { 
        Write-Info "Khong co thay doi code nao de commit"
        return 
    }
    
    $commitMessage = "Code changes - Auto push to origin - Pushed by git-push-private-safe.ps1 - Branch: $currentBranch"
    git commit -m $commitMessage
    git push origin $currentBranch
    Write-Success "Push code len origin/$currentBranch thanh cong"
}

function Push-ToPrivate {
    param([string]$ParamBranch)
    Write-Smart "Push code + env len private..."
    $currentBranch = Get-CurrentBranch
    
    # Sử dụng cùng logic filter như trong backup
    $envFiles = Get-ChildItem -Path . -Filter '.env*' -File -Recurse -ErrorAction SilentlyContinue | Where-Object { 
        $_.FullName -notmatch '\.git-backup' -and 
        $_.FullName -notmatch '\.git' -and
        $_.FullName -notmatch 'node_modules' -and
        $_.FullName -notmatch 'venv'
    }
    
    if ($envFiles.Count -gt 0) {
        Write-Info "Force-add $($envFiles.Count) file .env:"
        foreach ($file in $envFiles) { 
            git add -f $file.FullName
            Write-Host "  - $($file.FullName)"
        }
        
        $commitMessage = "Environment files - Private sync - Added $($envFiles.Count) .env files to private repository - Branch: $currentBranch"
        git commit -m $commitMessage
        Write-Success "Commit env files thanh cong"
    }
    
    Write-Info "Push len private/$currentBranch..."
    git push private $currentBranch
    Write-Success "Push len private/$currentBranch thanh cong"
    
    if ($ParamBranch) {
        Write-Info "Push len private/$ParamBranch..."
        git push private "$currentBranch`:$ParamBranch"
        Write-Success "Push len private/$ParamBranch thanh cong"
    }
}

function Invoke-CleanupLocalHistory {
    Write-Smart "Cleanup local history..."
    git reset --soft HEAD~1
    git reset HEAD
    Write-Success "Da xoa commit env khoi local history va unstage file .env"
}

function Sync-FromPrivate {
    Write-Smart "Dong bo tu private..."
    $currentBranch = Get-CurrentBranch
    git fetch private
    Write-Info "Fetch tu private remote"
    git reset --soft "private/$currentBranch"
    Write-Success "Dong bo voi private/$currentBranch (giu file .env)"
}

function Prevent-EnvTracking {
    Write-Smart "Ngan env bi track o local..."
    $excludeFile = '.git\info\exclude'
    $excludeContent = Get-Content $excludeFile -ErrorAction SilentlyContinue
    if ($excludeContent -notmatch '\.env') {
        Add-Content $excludeFile "`n# Prevent .env files from being tracked"
        Add-Content $excludeFile ".env*"
        Add-Content $excludeFile "*.env"
        Write-Success "Da them .env patterns vao .git/info/exclude"
    } else {
        Write-Info "Patterns .env da ton tai trong .git/info/exclude"
    }
}

function Invoke-FinalSync {
    Write-Smart "Pull de dong bo hoan chinh..."
    $currentBranch = Get-CurrentBranch
    git pull private $currentBranch
    Write-Success "Dong bo hoan chinh voi private/$currentBranch"
}

function Invoke-SmartRollback {
    Write-Error "Kich hoat Smart Rollback..."
    if (Test-Path $BackupPath) {
        Write-Info "Khoi phuc tu backup: $BackupPath"
        $backupFiles = Get-ChildItem -Path $BackupPath -Recurse -File -ErrorAction SilentlyContinue
        foreach ($file in $backupFiles) {
            $relativeFilePath = $file.FullName.Replace($BackupPath, '').TrimStart('\')
            $targetFile = Join-Path $PWD.Path $relativeFilePath
            $targetDir = Split-Path $targetFile -Parent
            if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }
            Copy-Item $file.FullName $targetFile -Force
            Write-Success "Khoi phuc: $targetFile"
        }
        Write-Success "Smart Rollback hoan thanh"
    } else {
        Write-Error "Khong tim thay backup de rollback"
    }
}

function Main {
    param([string]$ParamBranch)
    $currentBranch = Get-CurrentBranch
    Write-Info "Bat dau Git Push Private - AI-Powered Smart Merge"
    Write-Info "Current branch: $currentBranch"
    if ($ParamBranch) { Write-Info "Parameter branch: $ParamBranch" }
    
    try {
        Write-Success "Buoc 1: Xac dinh nhanh hien tai ($currentBranch)"
        Invoke-SmartBackup
        Write-Success "Buoc 2: Smart Backup hoan thanh"
        Invoke-SecurityCheck
        Write-Success "Buoc 3: Security Check hoan thanh"
        Push-ToOrigin
        Write-Success "Buoc 4: Push code len origin hoan thanh"
        Push-ToPrivate $ParamBranch
        Write-Success "Buoc 5: Push code + env len private hoan thanh"
        Invoke-CleanupLocalHistory
        Write-Success "Buoc 6: Cleanup local history hoan thanh"
        Sync-FromPrivate
        Write-Success "Buoc 7: Dong bo tu private hoan thanh"
        Prevent-EnvTracking
        Write-Success "Buoc 8: Ngan env bi track hoan thanh"
        Invoke-FinalSync
        Write-Success "Buoc 9: Dong bo hoan chinh hoan thanh"
        
        Write-Success "Git Push Private hoan thanh thanh cong!"
        Write-Info "Tom tat:"
        Write-Info "  - Backup: $BackupPath"
        Write-Info "  - Origin: origin/$currentBranch"
        Write-Info "  - Private: private/$currentBranch"
        if ($ParamBranch) { Write-Info "  - Private param: private/$ParamBranch" }
        
    } catch {
        Write-Error "Script bi loi: $($_.Exception.Message)"
        Invoke-SmartRollback
        throw
    }
}

# Kiem tra Git repository
try { git rev-parse --git-dir | Out-Null } catch { Write-Error "Khong phai la Git repository"; exit 1 }

# Kiem tra remote private
try { git remote get-url private | Out-Null } catch { Write-Error "Remote private khong ton tai"; Write-Info "Hay them remote private: git remote add private <url>"; exit 1 }

Main $ParamBranch