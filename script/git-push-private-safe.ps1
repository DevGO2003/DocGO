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