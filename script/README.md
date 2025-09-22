# Git Push Private - AI-Powered Smart Merge

## Overview

This script provides a smart way to push code to both public (origin) and private repositories while handling `.env` files securely. It includes AI-powered smart merge functionality to intelligently combine environment variables from different sources.

## Features

- **Smart Backup**: Automatically backs up all `.env` files before processing
- **Security Check**: Removes `.env` files from Git tracking to prevent accidental commits to public repos
- **AI-Powered Smart Merge**: Intelligently merges `.env` files based on context and priority rules
- **Bidirectional Sync**: Syncs changes between local and private repositories
- **Safe Cleanup**: Uses soft reset to preserve `.env` files in working directory
- **Smart Rollback**: Automatically restores files if errors occur

## Prerequisites

1. **Git Repository**: Must be in a Git repository
2. **Private Remote**: Add private remote with: `git remote add private <private-repo-url>`
3. **PowerShell**: Windows PowerShell or PowerShell Core
4. **Git**: Git command-line tool installed

## Usage

### Method 1: Using Cursor Command (Recommended)
```bash
# Push to private/<current-branch>
/git-push-private

# Push to private/<current-branch> and private/<additional-branch>
/git-push-private <additional-branch>
```

### Method 2: Using Batch File
```cmd
# Push to private/<current-branch>
script\git-push-private.bat

# Push to private/<current-branch> and private/<additional-branch>
script\git-push-private.bat <additional-branch>
```

### Method 3: Using PowerShell Directly
```powershell
# Push to private/<current-branch>
powershell -ExecutionPolicy Bypass -File script\git-push-private-safe.ps1

# Push to private/<current-branch> and private/<additional-branch>
powershell -ExecutionPolicy Bypass -File script\git-push-private-safe.ps1 <additional-branch>
```

## How It Works

### 1. Smart Backup
- Creates timestamped backup of all `.env` files in `.git-backup/env/`
- Ensures you can restore files if something goes wrong

### 2. Security Check
- Identifies any `.env` files currently tracked by Git
- Removes them from tracking and creates cleanup commit
- Prevents accidental exposure of sensitive data

### 3. Push to Origin
- Stages and commits all code changes (excluding `.env` files)
- Pushes to `origin/<current-branch>`

### 4. Push to Private with Smart Merge
- Force-adds `.env` files temporarily
- Performs AI-powered smart merge with remote `.env` files
- Pushes to `private/<current-branch>` and optionally `private/<additional-branch>`

### 5. Safe Cleanup
- Uses `git reset --soft` to remove `.env` commit from local history
- Unstages `.env` files but keeps them in working directory
- Updates `.git/info/exclude` to prevent future tracking

### 6. Sync from Private
- Fetches and syncs with private repository
- Ensures local repository is up-to-date

## AI-Powered Smart Merge Rules

The script intelligently merges `.env` files based on these priority rules:

### Database Configuration
- **Priority**: Remote
- **Keys**: `MONGODB_URI`, `DATABASE_URL`
- **Reason**: Database URLs should come from the remote environment

### API Keys and Secrets
- **Priority**: Local
- **Keys**: `API_KEY`, `SECRET`, `TOKEN`
- **Reason**: API keys should remain local for security

### Port and Host Configuration
- **Priority**: Local
- **Keys**: `SERVER_PORT`, `PORT`, `HOST`
- **Reason**: Port/host settings should match local environment

### Feature Flags
- **Priority**: Logic-based
- **Keys**: `DEBUG`, `ENABLE_*`, `DISABLE_*`
- **Logic**: `true` if either local or remote is `true`

### Default
- **Priority**: Local
- **Reason**: Preserve local configuration as default

## Backup and Recovery

### Automatic Backup
- All `.env` files are automatically backed up before processing
- Backup location: `.git-backup/env/<timestamp>/`

### Manual Recovery
If you need to restore `.env` files from backup:

```powershell
# Find latest backup
$latestBackup = Get-ChildItem .git-backup\env\ | Sort-Object Name -Descending | Select-Object -First 1

# Restore all .env files
Get-ChildItem $latestBackup.FullName -Recurse -Name ".env*" | ForEach-Object {
    $source = Join-Path $latestBackup.FullName $_
    $target = ".\" + $_
    $targetDir = Split-Path $target -Parent
    if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }
    Copy-Item $source $target -Force
    Write-Host "Restored: $_"
}
```

## Error Handling

### Smart Rollback
- If any step fails, the script automatically attempts to restore files from backup
- Ensures you never lose your `.env` files

### Verification Steps
- Each step includes verification to ensure files are preserved
- Final verification confirms all `.env` files exist in working directory

## Security Features

### .env File Protection
- `.env` files are never committed to public repositories
- Automatic removal from Git tracking
- Added to `.git/info/exclude` to prevent future tracking

### Safe Operations
- Uses `git reset --soft` instead of `--hard` to preserve files
- Never deletes files from working directory
- Always maintains backup before operations

## Troubleshooting

### Common Issues

1. **"Private remote not found"**
   - Solution: Add private remote with `git remote add private <private-repo-url>`

2. **"Execution policy error"**
   - Solution: Use the batch file wrapper or run with `-ExecutionPolicy Bypass`

3. **".env files missing after script"**
   - Solution: Use the manual recovery process above

4. **"Git push failed"**
   - Solution: Check network connection and repository permissions

### Getting Help

- Check the script output for detailed error messages
- Verify Git remotes with `git remote -v`
- Ensure you have proper permissions for both origin and private repositories

## File Structure

```
script/
├── git-push-private-safe.ps1    # Main PowerShell script
├── git-push-private.bat         # Batch wrapper
└── README.md                    # This documentation
```

## Version History

- **v1.0.0**: Initial release with AI-powered smart merge functionality
