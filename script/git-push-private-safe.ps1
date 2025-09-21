# Git Push Private - AI-Powered Smart Merge (PowerShell)
# Tac gia: DocGO Development Team
# Phien ban: 2.0.0
# Mo ta: Script an toan de push code va env files len private repository voi Smart Merge

param(
    [string]$AdditionalBranch = ""
)

# Cau hinh mau sac va logging
$ErrorActionPreference = "Stop"
$Host.UI.RawUI.ForegroundColor = "White"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    $originalColor = $Host.UI.RawUI.ForegroundColor
    $Host.UI.RawUI.ForegroundColor = $Color
    Write-Host $Message
    $Host.UI.RawUI.ForegroundColor = $originalColor
}

function Write-Step {
    param([string]$Step, [string]$Message)
    Write-ColorOutput "`n[STEP] $Step - $Message" "Cyan"
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "[SUCCESS] $Message" "Green"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "[WARNING] $Message" "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "[ERROR] $Message" "Red"
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "[INFO] $Message" "Blue"
}

# Kiem tra Git repository
function Test-GitRepository {
    Write-Step "INIT" "Kiem tra Git repository..."
    
    if (-not (Test-Path ".git")) {
        throw "Khong phai Git repository. Vui long chay script trong thu muc Git."
    }
    
    # Kiem tra remote private
    $remotes = git remote -v
    $hasPrivate = $false
    foreach ($line in $remotes) {
        if ($line -match "private\s+") {
            $hasPrivate = $true
            break
        }
    }
    if (-not $hasPrivate) {
        throw "Khong tim thay remote 'private'. Vui long them remote private truoc."
    }
    
    Write-Success "Git repository hop le"
}

# Lay ten branch hien tai
function Get-CurrentBranch {
    $currentBranch = git branch --show-current
    if (-not $currentBranch) {
        $currentBranch = "main"
        Write-Warning "Khong xac dinh duoc branch, su dung 'main'"
    }
    return $currentBranch
}

# Smart Backup - Backup tat ca file .env
function Backup-EnvFiles {
    Write-Step "BACKUP" "Tao backup file .env..."
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupDir = ".git-backup\env\$timestamp"
    
    # Tao thu muc backup
    if (-not (Test-Path ".git-backup")) {
        New-Item -ItemType Directory -Path ".git-backup" -Force | Out-Null
    }
    if (-not (Test-Path ".git-backup\env")) {
        New-Item -ItemType Directory -Path ".git-backup\env" -Force | Out-Null
    }
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    # Tim va backup tat ca file .env
    $envFiles = Get-ChildItem -Path . -Recurse -Name ".env*" -File | Where-Object { $_ -notlike "*\node_modules\*" -and $_ -notlike "*\venv\*" -and $_ -notlike "*\target\*" }
    
    if ($envFiles.Count -eq 0) {
        Write-Warning "Khong tim thay file .env nao"
        return $backupDir
    }
    
    foreach ($envFile in $envFiles) {
        $sourcePath = $envFile
        $targetPath = Join-Path $backupDir $envFile
        $targetDir = Split-Path $targetPath -Parent
        
        if (-not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        
        Copy-Item $sourcePath $targetPath -Force
        Write-Info "Backup: $envFile"
    }
    
    Write-Success "Backup hoan tat tai: $backupDir"
    return $backupDir
}

# Security Check - Loai bo .env khoi Git tracking
function Remove-EnvFromGit {
    Write-Step "SECURITY" "Loai bo .env khoi Git tracking..."
    
    # Tim file .env dang duoc track
    $trackedEnvFiles = git ls-files | Where-Object { $_ -like ".env*" }
    
    if ($trackedEnvFiles.Count -gt 0) {
        Write-Warning "Phat hien file .env dang duoc Git track:"
        foreach ($file in $trackedEnvFiles) {
            Write-Info "  - $file"
        }
        
        # Unstage va remove khoi tracking
        foreach ($file in $trackedEnvFiles) {
            git reset HEAD -- $file
            git rm --cached $file
            Write-Info "Removed from tracking: $file"
        }
        
        # Commit cleanup neu co thay doi
        if ((git status --porcelain | Where-Object { $_ -like "D  .env*" }).Count -gt 0) {
            git add -A
            git commit -m "chore: remove .env files from Git tracking (security)"
            Write-Success "Commit cleanup hoan tat"
        }
    } else {
        Write-Success "Khong co file .env nao dang duoc track"
    }
}

# Push code len origin (khong co .env)
function Push-ToOrigin {
    param([string]$Branch)
    
    Write-Step "ORIGIN" "Push code len origin/$Branch..."
    
    # Stage tat ca thay doi (tru .env)
    git add -A
    
    # Kiem tra co thay doi khong
    $status = git status --porcelain
    if (-not $status) {
        Write-Info "Khong co thay doi de commit"
        return
    }
    
    # Commit
    git commit -m "feat: update code (auto-commit by git-push-private)"
    
    # Push len origin
    git push origin $Branch
    Write-Success "Push len origin/$Branch hoan tat"
}

# Push code + env len private
function Push-ToPrivate {
    param(
        [string]$Branch,
        [string]$BackupDir
    )
    
    Write-Step "PRIVATE" "Push code + env len private/$Branch..."
    
    # Force-add .env files
    $envFiles = Get-ChildItem -Path . -Recurse -Name ".env*" -File | Where-Object { $_ -notlike "*\node_modules\*" -and $_ -notlike "*\venv\*" -and $_ -notlike "*\target\*" }
    
    if ($envFiles.Count -gt 0) {
        foreach ($envFile in $envFiles) {
            git add -f $envFile
            Write-Info "Force-added: $envFile"
        }
        
        # Commit .env files
        git commit -m "feat: add .env files (private only)"
        Write-Success "Commit .env files hoan tat"
    }
    
    # Push len private
    git push private $Branch
    Write-Success "Push len private/$Branch hoan tat"
}

# Safe Cleanup - Xoa commit .env khoi local history
function Safe-Cleanup {
    Write-Step "CLEANUP" "Don dep local history (an toan)..."
    
    # Soft reset de giu file .env trong working directory
    git reset --soft HEAD~1
    git reset HEAD
    Write-Success "Cleanup hoan tat - file .env duoc giu lai"
}

# Sync tu private
function Sync-FromPrivate {
    param([string]$Branch)
    
    Write-Step "SYNC" "Dong bo tu private/$Branch..."
    
    # Fetch tu private
    git fetch private
    
    # Soft reset de dong bo voi private
    git reset --soft "private/$Branch"
    Write-Success "Dong bo tu private/$Branch hoan tat"
}

# Ngan .env bi track o local
function Prevent-EnvTracking {
    Write-Step "PREVENT" "Ngan .env bi track o local..."
    
    $excludeFile = ".git\info\exclude"
    $excludeContent = @"
# Prevent .env files from being tracked
.env
.env.*
**/.env
**/.env.*
"@
    
    if (-not (Test-Path $excludeFile)) {
        New-Item -ItemType File -Path $excludeFile -Force | Out-Null
    }
    
    $currentContent = Get-Content $excludeFile -Raw
    if ($currentContent -notmatch "\.env") {
        Add-Content -Path $excludeFile -Value $excludeContent
        Write-Success "Da them .env vao .git/info/exclude"
    } else {
        Write-Info ".env da duoc exclude"
    }
}

# Smart Rollback - Khoi phuc tu backup neu co loi
function Smart-Rollback {
    param([string]$BackupDir)
    
    Write-Error "Co loi xay ra, thuc hien Smart Rollback..."
    
    if (Test-Path $BackupDir) {
        Write-Info "Khoi phuc file .env tu backup..."
        $envFiles = Get-ChildItem -Path $BackupDir -Recurse -Name ".env*" -File
        
        foreach ($envFile in $envFiles) {
            $sourcePath = Join-Path $BackupDir $envFile
            $targetPath = $envFile
            $targetDir = Split-Path $targetPath -Parent
            
            if (-not (Test-Path $targetDir)) {
                New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
            }
            
            Copy-Item $sourcePath $targetPath -Force
            Write-Info "Restored: $envFile"
        }
        Write-Success "Smart Rollback hoan tat"
    } else {
        Write-Warning "Khong tim thay backup de rollback"
    }
}

# Verification - Kiem tra file .env sau moi buoc
function Verify-EnvFiles {
    Write-Step "VERIFY" "Kiem tra file .env..."
    
    $envFiles = Get-ChildItem -Path . -Recurse -Name ".env*" -File | Where-Object { $_ -notlike "*\node_modules\*" -and $_ -notlike "*\venv\*" -and $_ -notlike "*\target\*" }
    
    if ($envFiles.Count -eq 0) {
        Write-Warning "Khong tim thay file .env nao"
        return $false
    }
    
    foreach ($envFile in $envFiles) {
        if (Test-Path $envFile) {
            $size = (Get-Item $envFile).Length
            Write-Success "OK $envFile ($size bytes)"
        } else {
            Write-Error "FAIL $envFile khong ton tai"
            return $false
        }
    }
    
    return $true
}

# Main execution
try {
    Write-ColorOutput "`nGit Push Private - AI-Powered Smart Merge" "Magenta"
    Write-ColorOutput "=========================================" "Magenta"
    
    # 1. Kiem tra Git repository
    Test-GitRepository
    
    # 2. Lay ten branch hien tai
    $currentBranch = Get-CurrentBranch
    Write-Info "Branch hien tai: $currentBranch"
    
    # 3. Backup .env files
    $backupDir = Backup-EnvFiles
    
    # 4. Security Check
    Remove-EnvFromGit
    
    # 5. Push code len origin
    Push-ToOrigin -Branch $currentBranch
    
    # 6. Push code + env len private
    Push-ToPrivate -Branch $currentBranch -BackupDir $backupDir
    
    # 7. Safe Cleanup
    Safe-Cleanup
    
    # 8. Sync tu private
    Sync-FromPrivate -Branch $currentBranch
    
    # 9. Ngan .env tracking
    Prevent-EnvTracking
    
    # 10. Verification
    if (-not (Verify-EnvFiles)) {
        throw "File .env bi mat sau qua trinh xu ly"
    }
    
    # 11. Xu ly additional branch neu co
    if ($AdditionalBranch -and $AdditionalBranch -ne $currentBranch) {
        Write-Step "ADDITIONAL" "Push vao private/$AdditionalBranch..."
        Push-ToPrivate -Branch $AdditionalBranch -BackupDir $backupDir
        Write-Success "Push vao private/$AdditionalBranch hoan tat"
    }
    
    Write-ColorOutput "`nHOAN TAT!" "Green"
    Write-ColorOutput "=========" "Green"
    Write-Success "Code da duoc push len origin/$currentBranch"
    Write-Success "Code + .env da duoc push len private/$currentBranch"
    if ($AdditionalBranch) {
        Write-Success "Code + .env da duoc push len private/$AdditionalBranch"
    }
    Write-Success "File .env duoc giu lai trong working directory"
    Write-Success "Local repository da duoc dong bo voi private"
    
    # Hien thi trang thai cuoi
    Write-ColorOutput "`nTrang thai cuoi:" "Cyan"
    git status --short
    
} catch {
    Write-Error "Loi: $($_.Exception.Message)"
    
    # Smart Rollback
    if ($backupDir) {
        Smart-Rollback -BackupDir $backupDir
    }
    
    Write-ColorOutput "`nHuong dan khoi phuc:" "Yellow"
    Write-ColorOutput "Neu file .env bi mat, chay lenh sau de khoi phuc:" "Yellow"
    Write-ColorOutput "`$latestBackup = Get-ChildItem .git-backup\env\ | Sort-Object Name -Descending | Select-Object -First 1" "Gray"
    Write-ColorOutput "Get-ChildItem `$latestBackup.FullName -Recurse -Name '.env*' | ForEach-Object { Copy-Item (Join-Path `$latestBackup.FullName `$_) .\`$_ -Force }" "Gray"
    
    exit 1
}

Write-ColorOutput "`nScript hoan tat thanh cong!" "Green"