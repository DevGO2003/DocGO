# Git Push Private - AI-Powered Smart Merge (PowerShell)
# Tu dong tao boi Cursor AI Assistant
# Phien ban: 1.0.0

param(
    [string]$AdditionalBranch = ""
)

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Test-GitRepository {
    Write-ColorOutput "Kiem tra Git repository..." "Cyan"
    if (!(Test-Path ".git")) {
        Write-ColorOutput "Khong phai Git repository!" "Red"
        exit 1
    }
    Write-ColorOutput "Day la Git repository hop le" "Green"
}

function Test-PrivateRemote {
    Write-ColorOutput "Kiem tra remote 'private'..." "Cyan"
    $privateRemote = git remote get-url private 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "Remote 'private' chua duoc cau hinh!" "Red"
        Write-ColorOutput "Chay: git remote add private <private-repo-url>" "Yellow"
        exit 1
    }
    Write-ColorOutput "Remote 'private': $privateRemote" "Green"
}

function Get-CurrentBranch {
    Write-ColorOutput "Xac dinh nhanh hien tai..." "Cyan"
    $currentBranch = git branch --show-current
    if ([string]::IsNullOrEmpty($currentBranch)) {
        $currentBranch = "main"
        Write-ColorOutput "Khong xac dinh duoc nhanh, su dung mac dinh: main" "Yellow"
    } else {
        Write-ColorOutput "Nhanh hien tai: $currentBranch" "Green"
    }
    return $currentBranch
}

function Backup-EnvFiles {
    Write-ColorOutput "Thuc hien Smart Backup cho file .env..." "Cyan"
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupDir = ".git-backup/env/$timestamp"
    
    if (!(Test-Path ".git-backup/env")) {
        New-Item -ItemType Directory -Path ".git-backup/env" -Force | Out-Null
    }
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    # Chỉ backup .env ngoài các thư mục nội bộ (.git, .git-backup, node_modules, dist, build, target)
    $envFiles = Get-ChildItem -Recurse -File -Force | Where-Object {
        ($_.Name -eq '.env' -or $_.Name -like '.env.*') -and
        ($_.FullName -notmatch "\\.git(\\|$)") -and
        ($_.FullName -notmatch "\\.git-backup(\\|$)") -and
        ($_.FullName -notmatch "node_modules(\\|$)") -and
        ($_.FullName -notmatch "dist(\\|$)") -and
        ($_.FullName -notmatch "build(\\|$)") -and
        ($_.FullName -notmatch "target(\\|$)")
    }
    $backupCount = 0
    
    foreach ($envFile in $envFiles) {
        $repoRoot = (git rev-parse --show-toplevel).Trim()
        $abs = $envFile.FullName
        if ($abs.StartsWith($repoRoot)) { $relPath = $abs.Substring($repoRoot.Length) } else { $relPath = $abs }
        $relPath = $relPath -replace '^[\\/]+',''
        $relPath = $relPath -replace '\\','/'
        $sourcePath = $envFile.FullName
        $targetPath = Join-Path $backupDir $relPath
        
        $targetDir = Split-Path $targetPath -Parent
        if (!(Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        
        Copy-Item $sourcePath $targetPath -Force
        $backupCount++
        Write-ColorOutput "  Backed up: $relPath" "Cyan"
    }
    
    Write-ColorOutput "Smart Backup hoan thanh: $backupCount file .env da duoc backup vao $backupDir" "Green"
    return $backupDir
}

function Remove-EnvFromGitTracking {
    Write-ColorOutput "Thuc hien Security Check - Loai bo .env khoi Git tracking..." "Cyan"
    
    $trackedEnvFiles = git ls-files | Where-Object { $_ -like ".env*" }
    
    if ($trackedEnvFiles.Count -gt 0) {
        Write-ColorOutput "Phat hien $($trackedEnvFiles.Count) file .env dang duoc Git theo doi:" "Yellow"
        foreach ($file in $trackedEnvFiles) {
            Write-ColorOutput "  $file" "Yellow"
        }
        
        foreach ($file in $trackedEnvFiles) {
            git reset HEAD $file 2>$null
            git rm --cached $file 2>$null
            Write-ColorOutput "  Removed from tracking: $file" "Green"
        }
        
        $changes = git status --porcelain
        if ($changes) {
            git add -A
            git commit -m "Security: Remove .env files from Git tracking"
            Write-ColorOutput "Da tao commit don dep .env files" "Green"
        }
    } else {
        Write-ColorOutput "Khong co file .env nao dang duoc Git theo doi" "Green"
    }
}

function Push-ToOrigin {
    param([string]$branch)
    
    Write-ColorOutput "Push code len origin/$branch..." "Cyan"
    
    git add -A
    $status = git status --porcelain
    if ($status) {
        $commitMessage = "Auto-commit: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        git commit -m $commitMessage
    } else {
        Write-ColorOutput "Khong co thay doi moi de commit. Van thuc hien push." "Yellow"
    }
    
    git push origin $branch
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "Push thanh cong len origin/$branch" "Green"
    } else {
        Write-ColorOutput "Loi khi push len origin/$branch" "Red"
        exit 1
    }
}

function Get-RemoteFileContent {
    param(
        [string]$remoteRef,
        [string]$path
    )
    $spec = "$remoteRef`:$path"
    $content = git show $spec 2>$null
    if ($LASTEXITCODE -ne 0) { return $null }
    return $content
}

function Invoke-AIPoweredSmartMerge {
    param(
        [string]$localEnvPath,
        [string]$remoteRef,
        [string]$remotePath
    )
    
    Write-ColorOutput ("Thuc hien AI-Powered Smart Merge: {0} vs {1}:{2}" -f $localEnvPath, $remoteRef, $remotePath) "Cyan"
    
    if (!(Test-Path $localEnvPath)) {
        Write-ColorOutput "File .env local khong ton tai: $localEnvPath" "Yellow"
        return $false
    }
    
    $localContent = Get-Content $localEnvPath -Raw -ErrorAction SilentlyContinue
    $remoteContent = Get-RemoteFileContent -remoteRef $remoteRef -path $remotePath
    
    $localLines = @()
    $remoteLines = @()
    if ($localContent) { $localLines = $localContent -split "`n" | Where-Object { $_.Trim() -ne "" -and !$_.StartsWith("#") } }
    if ($remoteContent) { $remoteLines = $remoteContent -split "`n" | Where-Object { $_.Trim() -ne "" -and !$_.StartsWith("#") } }
    
    $mergedLines = @{}
    $conflictCount = 0
    
    foreach ($line in $remoteLines) {
        if ($line -match "^([^=]+)=(.*)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            $mergedLines[$key] = @{
                Value = $value
                Source = "remote"
            }
        }
    }
    
    foreach ($line in $localLines) {
        if ($line -match "^([^=]+)=(.*)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            
            if ($mergedLines.ContainsKey($key)) {
                $conflictCount++
                $remoteValue = $mergedLines[$key].Value
                
                $decision = "local"
                if ($key -match "DATABASE_URL|MONGODB_URI|DB_") { $decision = "remote" }
                elseif ($key -match "API_KEY|SECRET|TOKEN") { $decision = "local" }
                elseif ($key -match "PORT|HOST|SERVER_") { $decision = "local" }
                elseif ($key -match "^DEBUG$|ENABLE_|DISABLE_") {
                    if ($value -eq "true" -or $remoteValue -eq "true") { $value = "true"; $decision = "merged" } else { $decision = "remote" }
                }
                switch ($decision) {
                    "local" { $mergedLines[$key].Value = $value; $mergedLines[$key].Source = "local" }
                    "remote" { }
                    "merged" { $mergedLines[$key].Value = $value; $mergedLines[$key].Source = "merged" }
                }
                Write-ColorOutput "  Conflict resolved for $key : $($mergedLines[$key].Source)" "Cyan"
            } else {
                $mergedLines[$key] = @{ Value = $value; Source = "local" }
            }
        }
    }
    
    $mergedContent = @()
    $mergedContent += "# AI-Powered Smart Merge - Generated on $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    $mergedContent += ""
    foreach ($key in ($mergedLines.Keys | Sort-Object)) {
        $item = $mergedLines[$key]
        $mergedContent += "$key=$($item.Value)  # Source: $($item.Source)"
    }
    $mergedContent -join "`n" | Out-File -FilePath $localEnvPath -Encoding UTF8
    
    Write-ColorOutput "Smart Merge hoan thanh: $conflictCount conflicts resolved" "Green"
    return $true
}

function Push-ToPrivate {
    param(
        [string]$branch,
        [string]$backupDir
    )
    
    Write-ColorOutput "Push code + .env len private/$branch..." "Cyan"
    
    $envFiles = Get-ChildItem -Path . -Name ".env*" -Recurse -Force
    
    git fetch private
    $remoteRef = "private/$branch"
    
    foreach ($envFile in $envFiles) {
        Invoke-AIPoweredSmartMerge -localEnvPath $envFile -remoteRef $remoteRef -remotePath $envFile | Out-Null
        git add -f $envFile
        Write-ColorOutput "  Force-added: $envFile" "Cyan"
    }
    
    $status = git diff --cached --name-only
    if ($status) {
        git commit -m "AI-Powered Smart Merge .env for private/$branch"
    } else {
        Write-ColorOutput "Khong co thay doi .env de commit cho private" "Yellow"
    }
    
    git push private HEAD:$branch
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "Push thanh cong len private/$branch" "Green"
    } else {
        Write-ColorOutput "Loi khi push len private/$branch" "Red"
        exit 1
    }
}

function Cleanup-LocalHistory {
    Write-ColorOutput "Thuc hien Safe Cleanup..." "Cyan"
    
    git reset --soft HEAD~1
    git reset HEAD
    
    Write-ColorOutput "Safe Cleanup hoan thanh - File .env van con trong working directory" "Green"
}

function Sync-FromPrivate {
    param([string]$branch)
    
    Write-ColorOutput "Dong bo tu private/$branch..." "Cyan"
    
    git fetch private
    git reset --soft "private/$branch"
    
    Write-ColorOutput "Dong bo tu private/$branch hoan thanh" "Green"
}

function Final-Pull-FromPrivate {
    param([string]$branch)
    Write-ColorOutput "Pull tu private/$branch de dong bo hoan chinh..." "Cyan"
    git pull private $branch 2>$null
}

function Prevent-EnvTracking {
    Write-ColorOutput "Ngan .env bi track o local..." "Cyan"
    
    $excludeFile = ".git/info/exclude"
    $envPatterns = @(
        "# Prevent .env files from being tracked",
        ".env*",
        "**/.env*"
    )
    
    foreach ($pattern in $envPatterns) {
        $content = Get-Content $excludeFile -ErrorAction SilentlyContinue
        if ($content -notcontains $pattern) {
            Add-Content $excludeFile $pattern
            Write-ColorOutput "  Added to exclude: $pattern" "Cyan"
        }
    }
    
    Write-ColorOutput "Da ngan .env files bi track o local" "Green"
}

function Invoke-SmartRollback {
    param([string]$backupDir)
    
    Write-ColorOutput "Thuc hien Smart Rollback..." "Cyan"
    
    if (Test-Path $backupDir) {
        $envFiles = Get-ChildItem -Path $backupDir -Name ".env*" -Recurse
        foreach ($envFile in $envFiles) {
            $sourcePath = Join-Path $backupDir $envFile
            $targetPath = $envFile
            Copy-Item $sourcePath $targetPath -Force
            Write-ColorOutput "  Restored: $envFile" "Cyan"
        }
        Write-ColorOutput "Smart Rollback hoan thanh" "Green"
    } else {
        Write-ColorOutput "Khong tim thay backup directory" "Yellow"
    }
}

function Verify-EnvFiles {
    Write-ColorOutput "Kiem tra file .env sau khi thuc thi..." "Cyan"
    
    $envFiles = Get-ChildItem -Path . -Name ".env*" -Recurse -Force
    if ($envFiles.Count -gt 0) {
        Write-ColorOutput "Tim thay $($envFiles.Count) file .env:" "Green"
        foreach ($file in $envFiles) {
            Write-ColorOutput "  $file" "Cyan"
        }
    } else {
        Write-ColorOutput "Khong tim thay file .env nao!" "Yellow"
        return $false
    }
    return $true
}

# MAIN EXECUTION
try {
    Write-ColorOutput "Bat dau Git Push Private - AI-Powered Smart Merge" "Cyan"
    Write-ColorOutput "=================================================" "Cyan"
    
    Test-GitRepository
    Test-PrivateRemote
    $currentBranch = Get-CurrentBranch
    $backupDir = Backup-EnvFiles
    Remove-EnvFromGitTracking
    Push-ToOrigin -branch $currentBranch
    Push-ToPrivate -branch $currentBranch -backupDir $backupDir
    
    if (![string]::IsNullOrEmpty($AdditionalBranch)) {
        Write-ColorOutput "Push them vao private/$AdditionalBranch..." "Cyan"
        Push-ToPrivate -branch $AdditionalBranch -backupDir $backupDir
    }
    
    Cleanup-LocalHistory
    Sync-FromPrivate -branch $currentBranch
    Prevent-EnvTracking
    Final-Pull-FromPrivate -branch $currentBranch
    
    if (!(Verify-EnvFiles)) {
        Write-ColorOutput "File .env bi mat, thuc hien Smart Rollback..." "Yellow"
        Invoke-SmartRollback -backupDir $backupDir
    }
    
    Write-ColorOutput "=================================================" "Cyan"
    Write-ColorOutput "Git Push Private hoan thanh thanh cong!" "Green"
    Write-ColorOutput "Ket qua:" "Cyan"
    Write-ColorOutput "  Nhanh hien tai: $currentBranch" "Cyan"
    Write-ColorOutput "  Da push len: origin/$currentBranch (code only)" "Cyan"
    Write-ColorOutput "  Da push len: private/$currentBranch (code + .env)" "Cyan"
    if (![string]::IsNullOrEmpty($AdditionalBranch)) {
        Write-ColorOutput "  Da push len: private/$AdditionalBranch (code + .env)" "Cyan"
    }
    Write-ColorOutput "  Backup .env: $backupDir" "Cyan"
    Write-ColorOutput "  File .env duoc bao ve khoi Git tracking" "Cyan"
    
} catch {
    Write-ColorOutput "Loi xay ra: $($_.Exception.Message)" "Red"
    Write-ColorOutput "Thuc hien Smart Rollback..." "Yellow"
    
    if ($backupDir) {
        Invoke-SmartRollback -backupDir $backupDir
    }
    
    exit 1
}