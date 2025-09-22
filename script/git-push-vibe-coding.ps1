# Git Push to vibe_coding branch with .env files
# Script nhanh để push lên nhánh vibe_coding với file .env

param(
    [string]$BranchName = "vibe_coding"
)

# Colors for output
function Write-Step { param($Message) Write-Host "STEP: $Message" -ForegroundColor Cyan }
function Write-Success { param($Message) Write-Host "SUCCESS: $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "WARNING: $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "ERROR: $Message" -ForegroundColor Red }
function Write-Info { param($Message) Write-Host "INFO: $Message" -ForegroundColor Blue }

Write-Host "Git Push to $BranchName branch with .env files" -ForegroundColor Magenta
Write-Host "===============================================" -ForegroundColor Magenta

# Step 1: Get current branch
$CurrentBranch = git branch --show-current
if (-not $CurrentBranch) {
    $CurrentBranch = "main"
}
Write-Info "Current branch: $CurrentBranch"
Write-Info "Target branch: $BranchName"

# Step 2: Smart Backup
Write-Step "Step 1: Smart Backup - Backing up .env files"
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupDir = ".git-backup\env\$Timestamp"

try {
    if (!(Test-Path ".git-backup\env")) {
        New-Item -ItemType Directory -Path ".git-backup\env" -Force | Out-Null
    }
    
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    
    $EnvFiles = Get-ChildItem -Path . -Recurse -Name ".env*" -File
    $BackupCount = 0
    
    foreach ($EnvFile in $EnvFiles) {
        $SourcePath = $EnvFile
        $TargetPath = Join-Path $BackupDir $EnvFile
        $TargetDir = Split-Path $TargetPath -Parent
        
        if (!(Test-Path $TargetDir)) {
            New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
        }
        
        Copy-Item $SourcePath $TargetPath -Force
        Write-Info "Backed up: $EnvFile"
        $BackupCount++
    }
    
    Write-Success "Smart Backup completed: $BackupCount .env files backed up to $BackupDir"
} catch {
    Write-Error "Smart Backup failed: $_"
    exit 1
}

# Step 3: Security Check
Write-Step "Step 2: Security Check - Checking for tracked .env files"
try {
    $TrackedEnvFiles = git ls-files | Where-Object { $_ -like "*.env*" }
    
    if ($TrackedEnvFiles) {
        Write-Warning "Found tracked .env files, removing from tracking..."
        foreach ($File in $TrackedEnvFiles) {
            git rm --cached $File
            Write-Info "Removed from tracking: $File"
        }
        git commit -m "Remove .env files from tracking - $Timestamp"
        Write-Success "Removed tracked .env files"
    } else {
        Write-Success "No tracked .env files found"
    }
} catch {
    Write-Error "Security Check failed: $_"
    exit 1
}

# Step 4: Push code to origin (without .env)
Write-Step "Step 3: Pushing code to origin (without .env files)"
try {
    # Check if there are any changes to commit
    $Status = git status --porcelain
    if ($Status) {
        git add .
        git commit -m "Update code changes - $Timestamp"
        Write-Success "Committed code changes"
    } else {
        Write-Info "No code changes to commit"
    }
    
    # Push to origin
    git push origin $CurrentBranch
    Write-Success "Pushed code to origin/$CurrentBranch"
} catch {
    Write-Error "Failed to push to origin: $_"
    exit 1
}

# Step 5: Force-add .env files and push to vibe_coding
Write-Step "Step 4: Force-adding .env files and pushing to $BranchName"
try {
    # Force-add .env files
    $EnvFiles = Get-ChildItem -Path . -Recurse -Name ".env*" -File
    foreach ($EnvFile in $EnvFiles) {
        git add -f $EnvFile
        Write-Info "Force-added: $EnvFile"
    }
    
    # Commit .env files
    git commit -m "Add .env files for $BranchName - $Timestamp"
    Write-Success "Committed .env files"
    
    # Push to vibe_coding branch
    git push origin HEAD:$BranchName
    Write-Success "Pushed code + .env to origin/$BranchName"
    
} catch {
    Write-Error "Failed to push to $BranchName : $_"
    exit 1
}

# Step 6: Safe Cleanup
Write-Step "Step 5: Safe Cleanup - Cleaning local history"
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

# Step 7: Prevent .env tracking in local
Write-Step "Step 6: Preventing .env tracking in local"
try {
    # Add .env patterns to .git/info/exclude
    $ExcludeFile = ".git/info/exclude"
    $EnvPatterns = @(
        "# DocGO - Prevent .env files from being tracked",
        ".env",
        ".env.*",
        "**/.env",
        "**/.env.*",
        "**/env/"
    )
    
    foreach ($Pattern in $EnvPatterns) {
        $Content = Get-Content $ExcludeFile -ErrorAction SilentlyContinue
        if ($Content -notcontains $Pattern) {
            Add-Content -Path $ExcludeFile -Value $Pattern
            Write-Info "Added to exclude: $Pattern"
        }
    }
    
    Write-Success "Added .env patterns to .git/info/exclude"
} catch {
    Write-Warning "Failed to update .git/info/exclude: $_"
}

# Final verification
Write-Step "Step 7: Final verification"
try {
    $EnvFiles = Get-ChildItem -Path . -Recurse -Name ".env*" -File
    Write-Success "Final verification: $($EnvFiles.Count) .env files exist in working directory"
    
    # Check if vibe_coding branch exists on remote
    $RemoteBranches = git branch -r | Where-Object { $_ -like "*$BranchName*" }
    if ($RemoteBranches) {
        Write-Success "Branch $BranchName exists on remote: $RemoteBranches"
    } else {
        Write-Warning "Branch $BranchName not found on remote"
    }
    
} catch {
    Write-Warning "Final verification failed: $_"
}

Write-Host ""
Write-Host "Git Push to $BranchName completed successfully!" -ForegroundColor Green
Write-Host "Backup location: $BackupDir" -ForegroundColor Cyan
Write-Host ".env files are safe in working directory" -ForegroundColor Green
Write-Host ".env files are excluded from future tracking" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Magenta
Write-Host "1. Check remote branch: git branch -r | grep $BranchName" -ForegroundColor White
Write-Host "2. Switch to branch: git checkout -b $BranchName origin/$BranchName" -ForegroundColor White
Write-Host "3. Verify .env files: ls -la **/.env*" -ForegroundColor White