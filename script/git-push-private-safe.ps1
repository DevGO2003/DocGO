Param(
    [Parameter(Position=0, Mandatory=$false)] [string]$AdditionalPrivateBranch
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Write-Info($msg) { Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warn($msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[ERROR] $msg" -ForegroundColor Red }

function Ensure-InRepo {
    if (-not (Test-Path ".git")) {
        throw "This directory is not a Git repository (missing .git)."
    }
}

function Get-CurrentBranch {
    try {
        $branch = (git rev-parse --abbrev-ref HEAD).Trim()
        if ([string]::IsNullOrWhiteSpace($branch) -or $branch -eq 'HEAD') { return 'main' }
        return $branch
    } catch { return 'main' }
}

function Ensure-RemoteExists($remoteName) {
    $remotes = (git remote).Split("`n") | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
    if (-not ($remotes -contains $remoteName)) {
        throw "Missing required remote '$remoteName'. Please add it: git remote add $remoteName <url>"
    }
}

function Get-EnvFiles {
    $excludeDirs = @(".git", ".git-backup")
    return Get-ChildItem -Path . -Recurse -Force -File -Include ".env", ".env.*" |
        Where-Object { $path = $_.FullName; -not ($excludeDirs | ForEach-Object { $path -like (Join-Path (Resolve-Path .) $_) + '*' }) }
}

function Smart-Backup {
    $envFiles = Get-EnvFiles
    if (-not $envFiles -or $envFiles.Count -eq 0) { Write-Info "No .env files found to backup."; return }
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupRoot = ".git-backup/env/$timestamp"
    Write-Info "Backing up .env files to $backupRoot"
    foreach ($file in $envFiles) {
        $relative = Resolve-Path -Relative $file.FullName
        $target   = Join-Path $backupRoot $relative
        $dir      = Split-Path $target -Parent
        if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
        Copy-Item -Path $file.FullName -Destination $target -Force
    }
}

function Security-Check-Untrack-Env {
    Write-Info "Security Check: ensuring .env files are not tracked in origin history"
    $lsOutput = & git ls-files -- ".env" ".env.*" 2>$null
    $trackedEnv = @()
    if ($lsOutput -ne $null -and $lsOutput -ne '') {
        $trackedEnv = $lsOutput.ToString().Split("`n") | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
    }
    if ($trackedEnv.Count -gt 0) {
        Write-Warn ("Found tracked env files: " + ($trackedEnv -join ', '))
        foreach ($f in $trackedEnv) {
            git reset HEAD -- "$f" | Out-Null
            git rm --cached --force -- "$f" | Out-Null
        }
        if ((git status --porcelain).Trim().Length -gt 0) {
            git commit -m "chore(security): remove .env files from tracking" | Out-Null
            Write-Info "Committed cleanup of tracked .env files."
        }
    } else {
        Write-Info "No tracked .env files detected."
    }
}

function Stage-And-Commit-Code {
    Write-Info "Staging and committing code changes (excluding .env)"
    git add -A
    git reset HEAD -- ".env" ".env.*" 2>$null | Out-Null
    if ((git status --porcelain).Trim().Length -gt 0) {
        git commit -m "chore: sync code changes" | Out-Null
        Write-Info "Code changes committed."
    } else {
        Write-Info "No code changes to commit."
    }
}

function Push-Origin($branch) {
    Write-Info "Pushing code to origin/$branch"
    git push origin $branch
}

function Parse-DotEnv([string]$content) {
    $result = @{}
    $lines = $content -split "`n"
    foreach ($line in $lines) {
        $trim = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($trim)) { continue }
        if ($trim.StartsWith('#')) { continue }
        $eqIndex = $trim.IndexOf('=')
        if ($eqIndex -le 0) { continue }
        $key = $trim.Substring(0, $eqIndex).Trim()
        $val = $trim.Substring($eqIndex + 1).Trim()
        $result[$key] = $val
    }
    return $result
}

function Env-TrueLike($v) {
    if ($null -eq $v) { return $false }
    $t = $v.ToString().Trim().ToLowerInvariant()
    return ($t -in @('1','true','yes','on','y'))
}

function Merge-Env-Maps($localMap, $remoteMap) {
    $merged = @{}
    $allKeys = New-Object System.Collections.Generic.HashSet[string]
    foreach ($k in $localMap.Keys) { [void]$allKeys.Add($k) }
    foreach ($k in $remoteMap.Keys) { [void]$allKeys.Add($k) }

    foreach ($key in $allKeys) {
        $l = $localMap[$key]
        $r = $remoteMap[$key]
        $lowerKey = $key.ToLowerInvariant()

        if ($lowerKey -in @('mongodb_uri','database_url')) {
            $merged[$key] = if ($r) { $r } else { $l }
            continue
        }
        if ($lowerKey -match 'api_key' -or $lowerKey -match 'secret') {
            $merged[$key] = if ($l) { $l } else { $r }
            continue
        }
        if ($lowerKey -eq 'server_port' -or $lowerKey -eq 'port' -or $lowerKey.EndsWith('_port') -or $lowerKey.EndsWith('_host')) {
            $merged[$key] = if ($l) { $l } else { $r }
            continue
        }
        if ($lowerKey -eq 'debug' -or $lowerKey.EndsWith('_feature') -or $lowerKey.EndsWith('_enabled')) {
            $merged[$key] = if ((Env-TrueLike $l) -or (Env-TrueLike $r)) { 'true' } else { if ($l) { $l } else { $r } }
            continue
        }
        $merged[$key] = if ($l) { $l } else { $r }
    }
    return $merged
}

function Render-Env-Content($map) {
    $sb = New-Object System.Text.StringBuilder
    foreach ($key in ($map.Keys | Sort-Object)) {
        $null = $sb.AppendLine("$key=$($map[$key])")
    }
    return $sb.ToString()
}

function Try-Get-Remote-File($remoteBranch, [string]$path) {
    try {
        $content = git show "private/${remoteBranch}:${path}" 2>$null
        return $content
    } catch { return $null }
}

function Branch-Exists-On-Remote($remote, $branch) {
    $refs = git ls-remote --heads $remote "refs/heads/$branch" | Out-String
    return -not [string]::IsNullOrWhiteSpace($refs)
}

function Smart-Merge-Env($branch) {
    Write-Info "Smart merging .env files against private/$branch"
    $envFiles = Get-EnvFiles
    if (-not $envFiles -or $envFiles.Count -eq 0) { Write-Info "No .env files found for merge."; return }

    $remoteHasBranch = Branch-Exists-On-Remote -remote 'private' -branch $branch

    foreach ($file in $envFiles) {
        $relative = Resolve-Path -Relative $file.FullName
        $localContent = Get-Content -Raw -Path $file.FullName -ErrorAction SilentlyContinue
        if ($null -eq $localContent) { $localContent = '' }
        $localMap = Parse-DotEnv $localContent

        $remoteContent = ''
        if ($remoteHasBranch) { $remoteContent = Try-Get-Remote-File -remoteBranch $branch -path $relative }
        if ($null -eq $remoteContent) { $remoteContent = '' }
        $remoteMap = Parse-DotEnv $remoteContent

        $merged = Merge-Env-Maps -localMap $localMap -remoteMap $remoteMap

        if ($localMap.Count -gt 0 -or $remoteMap.Count -gt 0) {
            if ($merged.Count -eq 0) {
                Write-Warn "Merged env for $relative is empty, falling back to local content."
                $merged = $localMap
            }
        }

        $rendered = Render-Env-Content -map $merged
        Set-Content -Path $file.FullName -Value $rendered -Encoding UTF8
        Write-Info "Merged .env -> $relative (keys: $($merged.Keys.Count))"
    }
}

function Force-Add-And-Commit-Env {
    Write-Info "Force-adding .env files and creating a temporary env commit"
    $envFiles = Get-EnvFiles
    if (-not $envFiles -or $envFiles.Count -eq 0) { Write-Info "No .env files to add."; return $false }
    foreach ($f in $envFiles) { git add -f -- "$($f.FullName)" | Out-Null }
    if ((git diff --cached --name-only).Trim().Length -gt 0) {
        git commit -m "chore(env): temporary env commit for private sync" | Out-Null
        return $true
    }
    Write-Info "No staged .env changes to commit."
    return $false
}

function Push-Private($branch) {
    Write-Info "Pushing to private/$branch"
    git push private HEAD:"refs/heads/$branch"
}

function Safe-Cleanup($didEnvCommit) {
    if ($didEnvCommit) {
        Write-Info "Cleaning up local history (soft reset of env commit)"
        git reset --soft HEAD~1
        git reset HEAD -- .
    } else {
        Write-Info "Skipped cleanup: no env commit was created."
    }
}

function Sync-From-Private($branch) {
    Write-Info "Syncing local (soft) from private/$branch"
    git fetch private $branch
    git reset --soft "private/$branch"
}

function Ensure-Local-Exclude {
    $excludeFile = ".git/info/exclude"
    if (-not (Test-Path (Split-Path $excludeFile -Parent))) { return }
    $lines = @()
    if (Test-Path $excludeFile) { $lines = Get-Content $excludeFile -Raw -ErrorAction SilentlyContinue -Encoding UTF8 -Split "`n" }
    $needles = @(
        ".env",
        ".env.*"
    )
    $changed = $false
    foreach ($n in $needles) {
        if (-not ($lines | Where-Object { $_.Trim() -eq $n })) {
            Add-Content -Path $excludeFile -Value $n
            $changed = $true
        }
    }
    if ($changed) { Write-Info "Updated .git/info/exclude to prevent tracking of env files." } else { Write-Info "Local exclude already prevents env tracking." }
}

function Final-Pull($branch) {
    Write-Info "Final pull from private $branch"
    git pull private $branch --no-edit
}

function Smart-Rollback($backupTimestamp) {
    try {
        if (-not $backupTimestamp) { return }
        $backupRoot = ".git-backup/env/$backupTimestamp"
        if (-not (Test-Path $backupRoot)) { return }
        Write-Warn "Rolling back .env files from backup $backupTimestamp"
        $files = Get-ChildItem $backupRoot -Recurse -File
        foreach ($b in $files) {
            $relative = $b.FullName.Substring($backupRoot.Length).TrimStart('\\','/')
            $target = Join-Path (Get-Location) $relative
            $dir = Split-Path $target -Parent
            if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
            Copy-Item -Path $b.FullName -Destination $target -Force
        }
        Write-Info "Rollback completed."
    } catch {
        Write-Err "Rollback failed: $($_.Exception.Message)"
    }
}

# Main orchestration
Ensure-InRepo
Ensure-RemoteExists 'origin'
Ensure-RemoteExists 'private'
$currentBranch = Get-CurrentBranch
Write-Info "Current branch: $currentBranch"

$backupTimestamp = Get-Date -Format "yyyyMMdd-HHmmss"
try {
    Smart-Backup
    Security-Check-Untrack-Env
    Stage-And-Commit-Code
    Push-Origin $currentBranch

    Smart-Merge-Env $currentBranch
    $didEnvCommit = Force-Add-And-Commit-Env
    if ($didEnvCommit) {
        Push-Private $currentBranch
        if ($AdditionalPrivateBranch) {
            Write-Info "Also syncing to private/$AdditionalPrivateBranch"
            Smart-Merge-Env $AdditionalPrivateBranch
            $null = Force-Add-And-Commit-Env
            Push-Private $AdditionalPrivateBranch
        }
    } else {
        Write-Info "No env commit created; skipping push to private."
    }

    Safe-Cleanup $didEnvCommit
    Sync-From-Private $currentBranch
    Ensure-Local-Exclude
    Final-Pull $currentBranch

    Write-Host "\nAll done." -ForegroundColor Green
} catch {
    Write-Err $_.Exception.Message
    Write-Warn "Attempting Smart Rollback of .env files"
    Smart-Rollback $backupTimestamp
    exit 1
}

Param(
    [Parameter(Position=0)]
    [string]$AdditionalPrivateBranch
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warn($msg){ Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg){ Write-Host "[ERROR] $msg" -ForegroundColor Red }

function Ensure-GitRepo {
    if (-not (Test-Path .git)) { throw "Not a Git repository (missing .git)." }
}

function Get-CurrentBranch {
    try {
        $branch = (git rev-parse --abbrev-ref HEAD).Trim()
        if ([string]::IsNullOrWhiteSpace($branch) -or $branch -eq "HEAD") { return "main" }
        return $branch
    } catch {
        return "main"
    }
}

function Ensure-Remote([string]$remoteName){
    $remotes = git remote | Out-String
    if ($remotes -notmatch "(?m)^$remoteName$") {
        throw "Remote '$remoteName' not found. Please add it first (e.g., git remote add private <url>)."
    }
}

function New-Utf8File([string]$path,[string]$content){
    $dir = Split-Path $path -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
}

function Smart-Backup-Env {
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupRoot = Join-Path ".git-backup/env" $timestamp
    Write-Info "Backing up .env files to $backupRoot"
    Get-ChildItem -Path . -Recurse -Force -Include ".env*" | ForEach-Object {
        $rel = Resolve-Path $_.FullName -Relative
        $target = Join-Path $backupRoot $rel
        $targetDir = Split-Path $target -Parent
        if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Force -Path $targetDir | Out-Null }
        Copy-Item $_.FullName $target -Force
    }
    return $backupRoot
}

function Security-Check-Clean-EnvTracking {
    Write-Info "Security Check: ensuring .env files are not tracked by origin"
    $tracked = (& git ls-files -z) -split "`0" | Where-Object { $_ -match "(^|/)\.env.*$" }
    if ($tracked -and $tracked.Count -gt 0) {
        Write-Warn "Found tracked env files:`n$($tracked -join "`n")"
        foreach($f in $tracked){ git reset HEAD -- "$f" 2>$null | Out-Null }
        git rm --cached --force --quiet -- $tracked | Out-Null
        git commit -m "chore(security): remove .env files from tracking" --quiet | Out-Null
        Write-Info "Committed cleanup for tracked env files."
    } else {
        Write-Info "No tracked env files detected."
    }
}

function Commit-And-Push-Origin-Code {
    Write-Info "Staging all changes (code only)"
    git add -A
    # Remove any staged .env* just in case
    Get-ChildItem -Recurse -Force -Include ".env*" | ForEach-Object { git reset --quiet HEAD -- $_.FullName 2>$null }
    if (git diff --cached --quiet) {
        Write-Info "No staged code changes to commit."
    } else {
        git commit -m "chore: sync code to origin" | Out-Null
        Write-Info "Committed code changes."
    }
    $branch = Get-CurrentBranch
    Write-Info "Pushing to origin/$branch"
    git push origin $branch
}

function Parse-DotEnv([string[]]$lines){
    $result = @{}
    foreach($line in $lines){
        if ($null -eq $line) { continue }
        $trim = $line.Trim()
        if ($trim -eq '' -or $trim.StartsWith('#')) { continue }
        $idx = $trim.IndexOf('=')
        if ($idx -lt 1) { continue }
        $key = $trim.Substring(0,$idx).Trim()
        $val = $trim.Substring($idx+1).Trim()
        $result[$key] = $val
    }
    return $result
}

function Serialize-DotEnv([hashtable]$map){
    $keys = $map.Keys | Sort-Object
    return ($keys | ForEach-Object { "$_=$($map[$_])" }) -join "`n"
}

function Env-Key-Decision([string]$key,[string]$local,[string]$remote){
    $k = $key.ToUpperInvariant()
    if ($k -in @('MONGODB_URI','DATABASE_URL')) { return $remote }
    if ($k -match '(API_KEY|SECRET|TOKEN)') { return $local }
    if ($k -match '(SERVER_PORT|PORT|HOST)') { return $local }
    if ($k -in @('DEBUG','FEATURE_FLAG','ENABLE_FEATURE','TRACE')) {
        $ltemp = if ($null -ne $local) { $local } else { '' }
        $rtemp = if ($null -ne $remote) { $remote } else { '' }
        $l = ($ltemp.ToString()).ToLower()
        $r = ($rtemp.ToString()).ToLower()
        if ($l -eq 'true' -or $r -eq 'true') { return 'true' } else { return 'false' }
    }
    # Default: prefer local if present, else remote
    if ($null -ne $local -and $local -ne '') { return $local }
    return $remote
}

function Smart-Merge-Env-File([string]$path,[string]$remoteRef){
    $localExists = Test-Path $path
    $remoteBlobPath = $path -replace '\\','/'
    $remoteExists = $false
    try { & git cat-file -e "${remoteRef}:$remoteBlobPath" 2>$null; $remoteExists = $true } catch { $remoteExists = $false }

    $localLines = @()
    $remoteLines = @()
    if ($localExists) { $localLines = Get-Content -Raw -Encoding UTF8 $path -ErrorAction SilentlyContinue -TotalCount 100000 -ReadCount 0 -ErrorAction Continue -Force | Out-String -Stream }
    if ($remoteExists) { $remoteLines = (& git show "${remoteRef}:$remoteBlobPath") -split "`r?`n" }

    $localMap = Parse-DotEnv $localLines
    $remoteMap = Parse-DotEnv $remoteLines

    $allKeys = @{}
    foreach($k in $localMap.Keys){ $allKeys[$k] = $true }
    foreach($k in $remoteMap.Keys){ $allKeys[$k] = $true }

    $merged = @{}
    foreach($k in $allKeys.Keys){
        $lv = $localMap[$k]
        $rv = $remoteMap[$k]
        $merged[$k] = Env-Key-Decision $k $lv $rv
    }

    $content = Serialize-DotEnv $merged
    if (-not (Test-Path (Split-Path $path -Parent))) { New-Item -ItemType Directory -Force -Path (Split-Path $path -Parent) | Out-Null }
    New-Utf8File -path $path -content $content
}

function Smart-Merge-All-Env([string]$remoteRef){
    Write-Info "Smart merging env files against $remoteRef"
    $envFiles = Get-ChildItem -Path . -Recurse -Force -Include ".env*"
    if (-not $envFiles) { Write-Warn "No .env files found locally to merge."; return }
    foreach($f in $envFiles){
        Smart-Merge-Env-File -path (Resolve-Path $f.FullName -Relative) -remoteRef $remoteRef
    }
}

function Add-Env-To-Index {
    Get-ChildItem -Recurse -Force -Include ".env*" | ForEach-Object { git add -f -- $_.FullName }
}

function Safe-Cleanup-Local {
    Write-Info "Cleaning up local env commit (soft reset)"
    try { git reset --soft HEAD~1 | Out-Null } catch { Write-Warn "No env commit to reset (HEAD~1 not available)" }
    try { git reset HEAD -- . | Out-Null } catch { }
}

function Ensure-Exclude-Env {
    $excludePath = ".git/info/exclude"
    if (-not (Test-Path (Split-Path $excludePath -Parent))) { return }
    $patterns = @(
        ".env",
        ".env.*",
        "**/.env",
        "**/.env.*"
    )
    $existing = @()
    if (Test-Path $excludePath) { $existing = Get-Content $excludePath -ErrorAction SilentlyContinue }
    foreach($p in $patterns){ if ($existing -notcontains $p) { Add-Content -Path $excludePath -Value $p } }
}

function Sync-From-Private([string]$branch){
    Write-Info "Fetching from private"
    git fetch private --prune
    Write-Info "Soft reset to private/$branch"
    git reset --soft "private/$branch"
    Write-Info "Pulling from private $branch to ensure full sync"
    try { git pull private $branch --no-edit } catch { Write-Warn "Pull resulted in no changes or merge not needed." }
}

function Restore-Env-From-Backup([string]$backupRoot){
    Write-Warn "Restoring env files from backup: $backupRoot"
    if (-not (Test-Path $backupRoot)) { Write-Warn "Backup not found: $backupRoot"; return }
    Get-ChildItem -Path $backupRoot -Recurse -Force | Where-Object { -not $_.PSIsContainer } | ForEach-Object {
        $rel = Resolve-Path $_.FullName -Relative
        $rel = $rel.Substring($backupRoot.Length).TrimStart('\','/')
        $target = Join-Path "." $rel
        $targetDir = Split-Path $target -Parent
        if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Force -Path $targetDir | Out-Null }
        Copy-Item $_.FullName $target -Force
    }
}

function Main {
    Ensure-GitRepo
    Ensure-Remote -remoteName "private"

    $branch = Get-CurrentBranch
    Write-Info "Current branch: $branch"

    $backup = Smart-Backup-Env

    try {
        Security-Check-Clean-EnvTracking
        Commit-And-Push-Origin-Code

        Write-Info "Preparing smart-merge against private/$branch"
        git fetch private --prune
        $remoteRef = "private/$branch"

        Smart-Merge-All-Env -remoteRef $remoteRef
        Add-Env-To-Index

        if (git diff --cached --quiet) {
            Write-Info "No env changes to commit for private sync."
        } else {
            git commit -m "chore(private): smart-merge env files"
        }

        Write-Info "Pushing env snapshot to private/$branch"
        git push private HEAD:$branch

        if ($AdditionalPrivateBranch) {
            Write-Info "Also pushing env snapshot to private/$AdditionalPrivateBranch"
            git push private HEAD:$AdditionalPrivateBranch
        }

        Safe-Cleanup-Local
        Ensure-Exclude-Env
        Sync-From-Private -branch $branch

        Write-Host "\nAll done." -ForegroundColor Green
    } catch {
        Write-Err $_.Exception.Message
        Write-Err "An error occurred. Attempting Smart Rollback of env files."
        Restore-Env-From-Backup -backupRoot $backup
        throw
    }
}

Main

# Git Push Private - Safe Version (PowerShell)
# Version: 1.0.0
# Author: DocGO Development Team

param(
    [string]$AdditionalBranch = ""
)

# Color functions for better output
function Write-Success { param($Message) Write-Host "[SUCCESS] $Message" -ForegroundColor Green }
function Write-Info { param($Message) Write-Host "[INFO] $Message" -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host "[WARNING] $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }
function Write-Step { param($Message) Write-Host "[STEP] $Message" -ForegroundColor Blue }

# Global variables
$ErrorActionPreference = "Stop"
$BackupTimestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupDir = ".git-backup\env\$BackupTimestamp"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# Change to project root
Set-Location $ProjectRoot

Write-Info "Starting Git Push Private with Smart Merge..."
Write-Info "Project Root: $ProjectRoot"
Write-Info "Backup Directory: $BackupDir"

# Step 1: Determine current branch
Write-Step "Step 1: Determining current branch"
try {
    $CurrentBranch = git branch --show-current
    if (-not $CurrentBranch) {
        $CurrentBranch = "main"
        Write-Warning "No current branch detected, defaulting to 'main'"
    }
    Write-Success "Current branch: $CurrentBranch"
} catch {
    Write-Error "Failed to determine current branch: $_"
    exit 1
}

# Step 2: Smart Backup - Backup all .env files
Write-Step "Step 2: Smart Backup - Backing up .env files"
try {
    # Create backup directory
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    
    # Find and backup all .env files
    $EnvFiles = Get-ChildItem -Path . -Recurse -Name ".env*" -File
    $BackupCount = 0
    
    foreach ($EnvFile in $EnvFiles) {
        $SourcePath = Join-Path $ProjectRoot $EnvFile
        $BackupPath = Join-Path $BackupDir $EnvFile
        
        # Create directory structure in backup
        $BackupDirPath = Split-Path $BackupPath -Parent
        if (!(Test-Path $BackupDirPath)) {
            New-Item -ItemType Directory -Path $BackupDirPath -Force | Out-Null
        }
        
        Copy-Item $SourcePath $BackupPath -Force
        $BackupCount++
        Write-Info "Backed up: $EnvFile"
    }
    
    Write-Success "Smart Backup completed: $BackupCount .env files backed up to $BackupDir"
} catch {
    Write-Error "Smart Backup failed: $_"
    exit 1
}

# Step 3: Security Check - Remove .env files from Git tracking
Write-Step "Step 3: Security Check - Removing .env files from Git tracking"
try {
    $TrackedEnvFiles = @()
    
    # Check for tracked .env files
    $GitStatus = git status --porcelain
    foreach ($Line in $GitStatus) {
        if ($Line -match "^\s*[AM]\s+(.+\.env.*)$") {
            $TrackedEnvFiles += $Matches[1]
        }
    }
    
    if ($TrackedEnvFiles.Count -gt 0) {
        Write-Warning "Found tracked .env files, removing from Git tracking..."
        
        foreach ($File in $TrackedEnvFiles) {
            git rm --cached $File 2>$null
            Write-Info "Removed from tracking: $File"
        }
        
        # Create cleanup commit
        git add -A
        git commit -m "Security: Remove .env files from Git tracking" 2>$null
        Write-Success "Created cleanup commit for .env files"
    } else {
        Write-Success "No tracked .env files found"
    }
} catch {
    Write-Warning "Security Check warning: $_"
}

# Step 4: Push code to origin (without .env files)
Write-Step "Step 4: Pushing code to origin (without .env files)"
try {
    # Stage all changes except .env files
    git add -A
    
    # Check if there are changes to commit
    $Status = git status --porcelain
    if ($Status) {
        git commit -m "Update code changes - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        Write-Success "Committed code changes"
    } else {
        Write-Info "No code changes to commit"
    }
    
    # Push to origin
    git push origin $CurrentBranch
    Write-Success "Pushed code to origin/$CurrentBranch"
} catch {
    Write-Error "Failed to push to origin: $_"
    # Smart Rollback
    Write-Warning "Initiating Smart Rollback..."
    try {
        # Restore .env files from backup
        if (Test-Path $BackupDir) {
            Get-ChildItem $BackupDir -Recurse -Name ".env*" | ForEach-Object {
                $Source = Join-Path $BackupDir $_
                $Target = ".\" + $_
                $TargetDir = Split-Path $Target -Parent
                if (!(Test-Path $TargetDir)) { New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null }
                Copy-Item $Source $Target -Force
                Write-Info "Rollback restored: $_"
            }
        }
        Write-Success "Smart Rollback completed"
    } catch {
        Write-Error "Smart Rollback failed: $_"
    }
    exit 1
}

# Step 5: Push code + .env to private
Write-Step "Step 5: Push code + .env to private"

# Check if private remote exists
try {
    $PrivateRemote = git remote get-url private 2>$null
    if (-not $PrivateRemote) {
        Write-Warning "Private remote not found. Please add it with: git remote add private [private-repo-url]"
        Write-Info "Skipping private push..."
        exit 0
    }
    Write-Info "Private remote found: $PrivateRemote"
} catch {
    Write-Warning "Private remote not configured. Skipping private push..."
    Write-Info "To configure private remote: git remote add private [private-repo-url]"
    exit 0
}

# Step 5.1: Force-add .env files
Write-Step "Step 5.1: Force-adding .env files"
try {
    # Force add all .env files
    $EnvFiles = Get-ChildItem -Path . -Recurse -Name ".env*" -File
    foreach ($EnvFile in $EnvFiles) {
        git add -f $EnvFile
        Write-Info "Force-added: $EnvFile"
    }
    
    # Create commit for .env files
    git commit -m "Add .env files for private repository - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    Write-Success "Created .env commit"
} catch {
    Write-Error "Failed to force-add .env files: $_"
    exit 1
}

# Step 5.2: Bidirectional Sync with AI-Powered Smart Merge
Write-Step "Step 5.2: Bidirectional Sync with AI-Powered Smart Merge"

# Function for AI-Powered Smart Merge
function Invoke-SmartMerge {
    param(
        [string]$BranchName,
        [string]$Description
    )
    
    Write-Info "Performing Smart Merge for $Description"
    
    try {
        # Fetch from private
        git fetch private $BranchName 2>$null
        
        # Check if branch exists on private
        $BranchExists = git show-ref --verify --quiet "refs/remotes/private/$BranchName" 2>$null
        if ($BranchExists) {
            Write-Info "Branch private/$BranchName exists, performing smart merge..."
            
            # Get .env files from both local and remote
            $LocalEnvFiles = Get-ChildItem -Path . -Recurse -Name ".env*" -File
            $RemoteEnvFiles = @()
            
            # Checkout remote branch temporarily to get .env files
            $CurrentCommit = git rev-parse HEAD
            git stash push -m "temp-stash-for-smart-merge" 2>$null
            
            try {
                git checkout "private/$BranchName" 2>$null
                $RemoteEnvFiles = Get-ChildItem -Path . -Recurse -Name ".env*" -File
            } finally {
                git checkout $CurrentCommit 2>$null
                git stash pop 2>$null
            }
            
            # Perform smart merge for each .env file
            foreach ($EnvFile in $LocalEnvFiles) {
                if ($RemoteEnvFiles -contains $EnvFile) {
                    Write-Info "Smart merging: $EnvFile"
                    
                    # Get local content
                    $LocalContent = Get-Content $EnvFile -Raw -ErrorAction SilentlyContinue
                    
                    # Get remote content
                    $RemoteContent = git show "private/${BranchName}:${EnvFile}" 2>$null
                    
                    if ($RemoteContent) {
                        # Perform AI-Powered Smart Merge
                        $MergedContent = Invoke-AISmartMerge -LocalContent $LocalContent -RemoteContent $RemoteContent -FileName $EnvFile
                        
                        # Write merged content
                        Set-Content -Path $EnvFile -Value $MergedContent -NoNewline
                        Write-Success "Smart merged: $EnvFile"
                    }
                }
            }
        } else {
            Write-Info "Branch private/$BranchName does not exist, will create new branch"
        }
        
        # Push to private
        git push private HEAD:$BranchName
        Write-Success "Pushed to private/$BranchName"
        
    } catch {
        Write-Error "Smart Merge failed for $BranchName : $_"
        throw
    }
}

# Function for AI-Powered Smart Merge logic
function Invoke-AISmartMerge {
    param(
        [string]$LocalContent,
        [string]$RemoteContent,
        [string]$FileName
    )
    
    Write-Info "Performing AI-Powered Smart Merge for $FileName"
    
    # Parse .env files
    $LocalLines = $LocalContent -split "`n" | Where-Object { $_.Trim() -ne "" -and !$_.StartsWith("#") }
    $RemoteLines = $RemoteContent -split "`n" | Where-Object { $_.Trim() -ne "" -and !$_.StartsWith("#") }
    
    # Create dictionaries for key-value pairs
    $LocalDict = @{}
    $RemoteDict = @{}
    
    foreach ($Line in $LocalLines) {
        if ($Line -match "^([^=]+)=(.*)$") {
            $LocalDict[$Matches[1].Trim()] = $Matches[2].Trim()
        }
    }
    
    foreach ($Line in $RemoteLines) {
        if ($Line -match "^([^=]+)=(.*)$") {
            $RemoteDict[$Matches[1].Trim()] = $Matches[2].Trim()
        }
    }
    
    # Smart merge logic
    $MergedDict = @{}
    $AllKeys = ($LocalDict.Keys + $RemoteDict.Keys) | Sort-Object -Unique
    
    foreach ($Key in $AllKeys) {
        $LocalValue = $LocalDict[$Key]
        $RemoteValue = $RemoteDict[$Key]
        
        if ($LocalValue -and $RemoteValue) {
            # Both exist - apply smart merge rules
            $MergedValue = switch -Regex ($Key) {
                "MONGODB_URI|DATABASE_URL" { 
                    Write-Info "Priority: Remote for $Key (Database)"
                    $RemoteValue 
                }
                "API_KEY|SECRET|TOKEN" { 
                    Write-Info "Priority: Local for $Key (API Key)"
                    $LocalValue 
                }
                "SERVER_PORT|PORT|HOST" { 
                    Write-Info "Priority: Local for $Key (Port/Host)"
                    $LocalValue 
                }
                "DEBUG|ENABLE_|DISABLE_" { 
                    Write-Info "Logic merge for $Key (Flag)"
                    if ($LocalValue -eq "true" -or $RemoteValue -eq "true") { "true" } else { $LocalValue }
                }
                default { 
                    Write-Info "Default: Local for $Key"
                    $LocalValue 
                }
            }
            $MergedDict[$Key] = $MergedValue
        } elseif ($LocalValue) {
            $MergedDict[$Key] = $LocalValue
        } elseif ($RemoteValue) {
            $MergedDict[$Key] = $RemoteValue
        }
    }
    
    # Reconstruct .env file
    $MergedContent = ""
    foreach ($Key in ($MergedDict.Keys | Sort-Object)) {
        $MergedContent += "$Key=$($MergedDict[$Key])`n"
    }
    
    return $MergedContent
}

# Perform Smart Merge for current branch
try {
    Invoke-SmartMerge -BranchName $CurrentBranch -Description "current branch"
} catch {
    Write-Error "Failed to push to private/$CurrentBranch : $_"
    exit 1
}

# Perform Smart Merge for additional branch if specified
if ($AdditionalBranch) {
    try {
        Invoke-SmartMerge -BranchName $AdditionalBranch -Description "additional branch"
    } catch {
        Write-Error "Failed to push to private/$AdditionalBranch : $_"
        exit 1
    }
}

# Step 5.3: Cleanup local history (Safe Cleanup)
Write-Step "Step 5.3: Safe Cleanup - Cleaning local history"
try {
    # Remove the .env commit from local history (soft reset)
    git reset --soft HEAD~1
    Write-Success "Removed .env commit from local history (soft reset)"
    
    # Unstage .env files
    $EnvFiles = Get-ChildItem -Path . -Recurse -Name ".env*" -File
    foreach ($EnvFile in $EnvFiles) {
        git reset HEAD $EnvFile 2>$null
    }
    Write-Success "Unstaged .env files"
    
    # Verify .env files still exist in working directory
    $EnvFiles = Get-ChildItem -Path . -Recurse -Name ".env*" -File
    Write-Success "Verified .env files still exist in working directory: $($EnvFiles.Count) files"
    
} catch {
    Write-Error "Safe Cleanup failed: $_"
    exit 1
}

# Step 6: Sync local from private
Write-Step "Step 6: Syncing local from private"
try {
    # Fetch from private
    git fetch private $CurrentBranch
    
    # Soft reset to private branch to sync
    git reset --soft "private/$CurrentBranch"
    Write-Success "Synced local from private/$CurrentBranch (soft reset)"
    
} catch {
    Write-Warning "Failed to sync from private: $_"
}

# Step 7: Prevent .env tracking in local
Write-Step "Step 7: Preventing .env tracking in local"
try {
    # Add .env patterns to .git/info/exclude
    $ExcludeFile = ".git/info/exclude"
    $EnvPatterns = @(
        "# DocGO - Prevent .env files from being tracked",
        ".env",
        ".env.*",
        "**/.env",
        "**/.env.*",
        "**/env/",
        "**/env/*"
    )
    
    $ExistingContent = Get-Content $ExcludeFile -ErrorAction SilentlyContinue
    $NewContent = $ExistingContent + $EnvPatterns | Sort-Object -Unique
    
    Set-Content -Path $ExcludeFile -Value $NewContent
    Write-Success "Added .env patterns to .git/info/exclude"
    
} catch {
    Write-Warning "Failed to update .git/info/exclude: $_"
}

# Step 8: Final pull to ensure complete sync
Write-Step "Step 8: Final pull for complete sync"
try {
    git pull private $CurrentBranch 2>$null
    Write-Success "Final pull completed"
} catch {
    Write-Warning "Final pull warning: $_"
}

# Final verification
Write-Step "Final verification"
try {
    # Check .env files exist
    $EnvFiles = Get-ChildItem -Path . -Recurse -Name ".env*" -File
    Write-Success "Final verification: $($EnvFiles.Count) .env files found in working directory"
    
    # Check git status
    $GitStatus = git status --porcelain
    if ($GitStatus) {
        Write-Info "Git status shows uncommitted changes (expected for .env files)"
    } else {
        Write-Success "Git status is clean"
    }
    
} catch {
    Write-Warning "Final verification warning: $_"
}

Write-Success "Git Push Private with Smart Merge completed successfully!"
Write-Info "Summary:"
Write-Info "  - Current branch: $CurrentBranch"
Write-Info "  - Pushed to origin: origin/$CurrentBranch"
Write-Info "  - Pushed to private: private/$CurrentBranch"
if ($AdditionalBranch) {
    Write-Info "  - Additional push: private/$AdditionalBranch"
}
Write-Info "  - Backup created: $BackupDir"
Write-Info "  - .env files preserved in working directory"
Write-Info ""
Write-Info "To restore .env files if needed:"
Write-Info "  Use the backup directory: $BackupDir"