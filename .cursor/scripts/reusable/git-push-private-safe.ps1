param(
  [Parameter(Mandatory = $false, Position = 0)] [string] $AdditionalPrivateBranch
)

$ErrorActionPreference = 'Stop'

function Write-Info($msg)  { Write-Host $msg -ForegroundColor Cyan }
function Write-Success($m){ Write-Host $m -ForegroundColor Green }
function Write-Warn($m)   { Write-Host $m -ForegroundColor Yellow }
function Write-ErrorMsg($m){ Write-Host $m -ForegroundColor Red }

function Assert-GitRepo {
  try { git rev-parse --is-inside-work-tree | Out-Null } catch { throw 'Not a Git repository.' }
}

function Ensure-Directory($path) {
  if (-not (Test-Path $path)) { New-Item -ItemType Directory -Path $path -Force | Out-Null }
}

function Get-CurrentBranch {
  try {
    $b = git rev-parse --abbrev-ref HEAD 2>$null
    if ($LASTEXITCODE -eq 0 -and $b) { return $b }
    return 'main'
  } catch { return 'main' }
}

function Has-Remote($name) {
  $url = ''
  try { $url = git remote get-url $name 2>$null } catch { }
  return -not [string]::IsNullOrWhiteSpace($url)
}

function Get-EnvFiles {
  # Return list of env-like files from workspace
  $patterns = @('.env', '.env.*', '*\.env', '*\.env.*')
  $files = @()
  foreach ($p in $patterns) {
    $files += Get-ChildItem -Recurse -File -Force -ErrorAction SilentlyContinue -Include $p | Where-Object { $_.Name -match '^\.env(\..+)?$' -or $_.Name -match '.+\.env(\..+)?$' }
  }
  # De-duplicate
  return $files | Select-Object -Unique
}

function SmartBackup-Env {
  $ts = Get-Date -Format 'yyyyMMdd-HHmmss'
  $backupRoot = Join-Path '.git-backup' 'env'
  $backupDir  = Join-Path $backupRoot $ts
  Ensure-Directory $backupDir
  $envFiles = Get-EnvFiles
  foreach ($f in $envFiles) {
    $rel = Resolve-Path -Relative $f.FullName
    $target = Join-Path $backupDir $rel
    Ensure-Directory (Split-Path $target -Parent)
    Copy-Item $f.FullName $target -Force
  }
  Write-Info "Smart Backup saved: $backupDir"
}

function SecurityCheck-UntrackEnv {
  Write-Info 'Security Check: ensure env files are not tracked by Git.'
  $tracked = & git ls-files -z | ForEach-Object { $_ -split "`0" } | Where-Object { $_ -match '(?:^|\\|/)\.env(?:\..+)?$' -or $_ -match '(?:^|\\|/).+\.env(?:\..+)?$' }
  if ($tracked -and $tracked.Count -gt 0) {
    foreach ($t in $tracked) { git rm --cached -- "$t" | Out-Null }
    git commit -m 'chore(security): remove env files from tracking' --no-verify | Out-Null
    Write-Info ('Security cleanup committed for: ' + ($tracked -join ', '))
  } else {
    Write-Info 'No tracked env files found.'
  }
}

function StageAndCommit-CodeOnly {
  git add -A
  git commit -m 'chore: push pending changes' --no-verify 2>$null
  if ($LASTEXITCODE -ne 0) { Write-Info 'No changes to commit for code-only.' }
}

function Push-Origin($branch) {
  if (-not (Has-Remote 'origin')) { Write-Warn 'Remote "origin" not found. Skipping push to origin.'; return }
  git push origin $branch
}

function ForceAdd-EnvFiles {
  $envFiles = Get-EnvFiles
  if (-not $envFiles -or $envFiles.Count -eq 0) { return @() }
  foreach ($f in $envFiles) { git add -f -- "$($f.FullName)" }
  return $envFiles
}

function Commit-EnvSnapshot($envFiles) {
  if (-not $envFiles -or $envFiles.Count -eq 0) { return $false }
  git commit -m 'chore(private): env snapshot' --no-verify 2>$null
  return $LASTEXITCODE -eq 0
}

function Push-Private($branch, $alsoBranch) {
  if (-not (Has-Remote 'private')) { throw 'Remote "private" not configured.' }
  $target1 = "refs/heads/private/$branch"
  git push private HEAD:$target1
  if ($alsoBranch -and -not [string]::IsNullOrWhiteSpace($alsoBranch)) {
    $target2 = "refs/heads/private/$alsoBranch"
    git push private HEAD:$target2
  }
}

function Cleanup-EnvCommit {
  # Remove last commit (env snapshot) softly and unstage env files
  git reset --soft HEAD~1
  git reset HEAD
}

function Sync-From-Private($branch) {
  if (-not (Has-Remote 'private')) { Write-Warn 'Remote "private" not found. Skip sync.'; return }
  git fetch private
  # Move to private/<branch> softly
  git reset --soft "private/private/$branch"
}

function Prevent-Env-Tracking-Local {
  $excludeFile = Join-Path '.git' 'info/exclude'
  Ensure-Directory (Split-Path $excludeFile -Parent)
  $lines = @(
    '**/.env'
    '**/.env.*'
    '**/*.env'
    '**/*.env.*'
  )
  if (Test-Path $excludeFile) { $existing = Get-Content $excludeFile -ErrorAction SilentlyContinue } else { $existing = @() }
  foreach ($l in $lines) {
    if (-not ($existing -contains $l)) { Add-Content -Path $excludeFile -Value $l }
  }
}

function Final-Pull-Private($branch) {
  if (-not (Has-Remote 'private')) { return }
  git pull private "private/$branch" 2>$null | Out-Null
}

try {
  Assert-GitRepo
  $branch = Get-CurrentBranch
  Write-Info "Current branch: $branch"

  # 2) Backup env
  SmartBackup-Env

  # 3) Security Check
  SecurityCheck-UntrackEnv

  # 4) Push code (origin)
  StageAndCommit-CodeOnly
  Push-Origin $branch

  # 5) Push code+env to private
  $envFiles = ForceAdd-EnvFiles
  $didEnvCommit = Commit-EnvSnapshot $envFiles
  if ($didEnvCommit) {
    Push-Private $branch $AdditionalPrivateBranch
    # 5.3) cleanup
    Cleanup-EnvCommit
  } else {
    Write-Info 'No env files to push to private.'
  }

  # 6) Sync from private
  Sync-From-Private $branch

  # 7) Prevent local env tracking
  Prevent-Env-Tracking-Local

  # 8) Final pull
  Final-Pull-Private $branch

  Write-Success 'git-push-private: Completed successfully.'
} catch {
  Write-ErrorMsg ("git-push-private: Failed - " + $_.Exception.Message)
  exit 1
}

# Git Push Private - AI-Powered Smart Merge (PowerShell)
# Tu dong tao boi Cursor AI Assistant
# Phien ban: 1.0.0

param(
    [string]$AdditionalBranch = "",
    [switch]$DryRun
)

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-DryRunNote {
    if ($DryRun) { Write-ColorOutput "[DryRun] Mô phỏng hành động, không thay đổi trạng thái thực tế" "Yellow" }
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
    
    # Quet danh sach file env TRUOC khi tao thu muc backup (tranh backup long)
    # Bo qua .git va .git-backup (ho tro ca \ va /, khong phan biet hoa thuong)
    # Va loai bo mot so thu muc build pho bien
    $envFiles = Get-ChildItem -Recurse -File -Force | Where-Object {
        ($_.Name -eq '.env' -or $_.Name -like '.env.*') -and
        ($_.FullName -notmatch '(?i)[\\/]\.git([\\/]|$)') -and
        ($_.FullName -notmatch '(?i)[\\/]\.git-backup([\\/]|$)') -and
        ($_.FullName -notmatch '(?i)[\\/]node_modules([\\/]|$)') -and
        ($_.FullName -notmatch '(?i)[\\/]dist([\\/]|$)') -and
        ($_.FullName -notmatch '(?i)[\\/]build([\\/]|$)') -and
        ($_.FullName -notmatch '(?i)[\\/]target([\\/]|$)')
    }

    # Chi tao thu muc backup sau khi da xac dinh danh sach file
    if (!(Test-Path ".git-backup/env")) {
        New-Item -ItemType Directory -Path ".git-backup/env" -Force | Out-Null
    }
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    $backupCount = 0
    
    $repoRoot = (git rev-parse --show-toplevel).Trim()
    foreach ($envFile in $envFiles) {
        $abs = [System.IO.Path]::GetFullPath($envFile.FullName)
        $repoRootFull = [System.IO.Path]::GetFullPath($repoRoot)
        if ($abs.StartsWith($repoRootFull, [System.StringComparison]::OrdinalIgnoreCase)) {
            $relPath = $abs.Substring($repoRootFull.Length)
        } else {
            $relPath = $envFile.Name
        }
        $relPath = $relPath -replace '^[\\/]+',''
        $sourcePath = $envFile.FullName
        $targetPath = Join-Path $backupDir $relPath
        
        # Guard bo sung: khong backup bat ky thu muc .git / .git-backup nao
        if ($sourcePath -match '(?i)[\\/]\.git([\\/]|$)' -or $sourcePath -match '(?i)[\\/]\.git-backup([\\/]|$)') {
            continue
        }

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
            if ($DryRun) {
                Write-ColorOutput "[DryRun] Would unstage and remove from tracking: $file" "Yellow"
            } else {
                git reset HEAD $file 2>$null
                git rm --cached $file 2>$null
                Write-ColorOutput "  Removed from tracking: $file" "Green"
            }
        }
        
        $changes = git status --porcelain
        if ($changes) {
            if ($DryRun) {
                Write-ColorOutput "[DryRun] Would create cleanup commit for .env removals" "Yellow"
            } else {
                git add -A
                git commit -m "Security: Remove .env files from Git tracking"
                Write-ColorOutput "Da tao commit don dep .env files" "Green"
            }
        }
    } else {
        Write-ColorOutput "Khong co file .env nao dang duoc Git theo doi" "Green"
    }
}

function Push-ToOrigin {
    param([string]$branch)
    
    Write-ColorOutput "Push code len origin/$branch..." "Cyan"
    Write-DryRunNote
    
    if ($DryRun) {
        Write-ColorOutput "[DryRun] Would: git add -A; commit if needed; git push origin $branch" "Yellow"
        return
    }
    git add -A
    $status = git status --porcelain
    if ($status) {
        $commitMessage = "Auto-commit: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        git commit -m $commitMessage
    } else {
        Write-ColorOutput "Khong co thay doi moi de commit. Van thuc hien push." "Yellow"
    }
    git push origin $branch
    if ($LASTEXITCODE -eq 0) { Write-ColorOutput "Push thanh cong len origin/$branch" "Green" } else { Write-ColorOutput "Loi khi push len origin/$branch" "Red"; exit 1 }
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
    Write-DryRunNote
    
    $envFiles = Get-ChildItem -Path . -Name ".env*" -Recurse -Force
    
    if ($DryRun) {
        Write-ColorOutput "[DryRun] Would: git fetch private" "Yellow"
    } else {
        git fetch private
    }
    $remoteRef = "private/$branch"
    
    foreach ($envFile in $envFiles) {
        Invoke-AIPoweredSmartMerge -localEnvPath $envFile -remoteRef $remoteRef -remotePath $envFile | Out-Null
        if ($DryRun) {
            Write-ColorOutput "[DryRun] Would force-add: $envFile" "Yellow"
        } else {
            git add -f $envFile
            Write-ColorOutput "  Force-added: $envFile" "Cyan"
        }
    }
    
    if ($DryRun) {
        Write-ColorOutput "[DryRun] Would create commit for .env changes (if any)" "Yellow"
    } else {
        $status = git diff --cached --name-only
        if ($status) {
            git commit -m "AI-Powered Smart Merge .env for private/$branch"
        } else {
            Write-ColorOutput "Khong co thay doi .env de commit cho private" "Yellow"
        }
    }
    
    if ($DryRun) {
        Write-ColorOutput "[DryRun] Would: git push private HEAD:$branch" "Yellow"
    } else {
        git push private HEAD:$branch
        if ($LASTEXITCODE -eq 0) { Write-ColorOutput "Push thanh cong len private/$branch" "Green" } else { Write-ColorOutput "Loi khi push len private/$branch" "Red"; exit 1 }
    }
}

function Cleanup-LocalHistory {
    Write-ColorOutput "Thuc hien Safe Cleanup..." "Cyan"
    Write-DryRunNote
    if ($DryRun) {
        Write-ColorOutput "[DryRun] Would: git reset --soft HEAD~1; git reset HEAD" "Yellow"
    } else {
        git reset --soft HEAD~1
        git reset HEAD
        Write-ColorOutput "Safe Cleanup hoan thanh - File .env van con trong working directory" "Green"
    }
}

function Sync-FromPrivate {
    param([string]$branch)
    
    Write-ColorOutput "Dong bo tu private/$branch..." "Cyan"
    Write-DryRunNote
    if ($DryRun) {
        Write-ColorOutput "[DryRun] Would: git fetch private; git reset --soft private/$branch" "Yellow"
    } else {
        git fetch private
        git reset --soft "private/$branch"
        Write-ColorOutput "Dong bo tu private/$branch hoan thanh" "Green"
    }
}

function Final-Pull-FromPrivate {
    param([string]$branch)
    Write-ColorOutput "Pull tu private/$branch de dong bo hoan chinh..." "Cyan"
    Write-DryRunNote
    if ($DryRun) {
        Write-ColorOutput "[DryRun] Would: git pull private $branch" "Yellow"
    } else {
        git pull private $branch 2>$null
    }
}

function Prevent-EnvTracking {
    Write-ColorOutput "Ngan .env bi track o local..." "Cyan"
    if ($DryRun) { Write-ColorOutput "[DryRun] Would update .git/info/exclude to ignore .env*" "Yellow"; return }
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