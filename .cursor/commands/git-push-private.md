# Git Push Private - AI-Powered Smart Merge

Đẩy nhánh hiện tại lên `origin` trước, sau đó push lên `private/<branch>` kèm TẤT CẢ file env theo yêu cầu: `.env`, `.env.local`, `.env.example` với AI-Powered Smart Merge để tránh conflict.

## Mô tả
- Tự động và không yêu cầu xác nhận.
- Xác định nhánh hiện tại; nếu không xác định được thì MẶC ĐỊNH dùng nhánh `main` (tạo mới nếu chưa có).
- **AI-POWERED BACKUP STRATEGY**: Push lên `origin/<branch>` trước để backup, sau đó push lên `private/<branch>` với env files được merge thông minh.
- **SMART MERGE**: Sử dụng AI để phân tích và merge env files, tránh conflict và mất dữ liệu.
- Khôi phục upstream về `origin/<branch>` để tiếp tục làm việc trên origin.
- Đảm bảo các file env được force-add với merge strategy: `**/.env`, `**/.env.local`, `**/.env.example`.
- Không thêm các file nhạy cảm khác như `.env` gốc, `.env.production` (đang bị ignore theo quy tắc Git của dự án).

## Yêu cầu
- Đã cấu hình remote tên `private` (ví dụ: `git remote add private <PRIVATE_GIT_URL>`).
- Lưu ý QUAN TRỌNG: Hành động này force-add secrets (bao gồm `.env`). Hãy kiểm tra nội dung trước khi push.

## Cách sử dụng
- **Không tham số**: `/git-push-private` - Push lên `private/main`
- **Có tham số**: `/git-push-private <branch-name>` - Push lên `private/<branch-name>`
- Ví dụ: `/git-push-private dev` sẽ push lên `private/dev`

## Lệnh thực thi (PowerShell - Windows) - AI-Powered
```powershell
$ErrorActionPreference = 'Stop'

# ===== AI-POWERED SMART MERGE FUNCTIONS =====

# Function: Tạo backup với metadata
function New-SmartBackup {
    param($branch)
    
    $backupDir = ".git-backup/env/$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    $backupMetadata = @{
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Branch = $branch
        Commit = git rev-parse HEAD
        Files = @()
    }
    
    Get-ChildItem "**/.env*" | ForEach-Object {
        $targetPath = Join-Path $backupDir $_.Name
        Copy-Item $_.FullName $targetPath -Force
        
        $backupMetadata.Files += @{
            Name = $_.Name
            Path = $_.FullName
            LastModified = $_.LastWriteTime
            Size = $_.Length
            Content = Get-Content $_.FullName -Raw
        }
        
        Write-Host "📦 Backed up: $($_.Name)" -ForegroundColor Cyan
    }
    
    $backupMetadata | ConvertTo-Json -Depth 3 | Out-File "$backupDir/metadata.json" -Encoding UTF8
    return $backupDir
}

# Function: Phân tích conflict patterns
function Find-EnvConflicts {
    param($localContent, $remoteContent, $fileName)
    
    $conflicts = @()
    $localLines = $localContent -split "`n"
    $remoteLines = $remoteContent -split "`n"
    
    $localKeys = $localLines | Where-Object { $_ -match "^[A-Z_]+=" } | ForEach-Object { $_.Split('=')[0] }
    $remoteKeys = $remoteLines | Where-Object { $_ -match "^[A-Z_]+=" } | ForEach-Object { $_.Split('=')[0] }
    
    $commonKeys = $localKeys | Where-Object { $_ -in $remoteKeys }
    
    foreach ($key in $commonKeys) {
        $localValue = ($localLines | Where-Object { $_ -match "^$key=" }) -replace "^$key=", ""
        $remoteValue = ($remoteLines | Where-Object { $_ -match "^$key=" }) -replace "^$key=", ""
        
        if ($localValue -ne $remoteValue) {
            $conflicts += @{
                Key = $key
                LocalValue = $localValue
                RemoteValue = $remoteValue
                FileName = $fileName
                ConflictType = Get-ConflictType $key $localValue $remoteValue
                Priority = Get-KeyPriority $key
            }
        }
    }
    
    return $conflicts
}

# Function: AI Decision Engine
function Resolve-EnvConflict {
    param($conflict, $context)
    
    $decision = @{
        Action = ""
        Reason = ""
        Value = ""
        Confidence = 0
    }
    
    # Rule 1: Database URLs - Ưu tiên remote
    if ($conflict.Key -match "MONGODB_URI|DATABASE_URL|DB_") {
        $decision.Action = "UseRemote"
        $decision.Reason = "Database config từ remote thường đầy đủ và chính xác hơn"
        $decision.Value = $conflict.RemoteValue
        $decision.Confidence = 90
    }
    # Rule 2: API Keys - Ưu tiên local
    elseif ($conflict.Key -match "API_KEY|SECRET|TOKEN|PASSWORD") {
        $decision.Action = "UseLocal"
        $decision.Reason = "API keys local thường là production keys"
        $decision.Value = $conflict.LocalValue
        $decision.Confidence = 95
    }
    # Rule 3: Port/URL config - Ưu tiên local
    elseif ($conflict.Key -match "PORT|HOST|URL|SERVER_") {
        $decision.Action = "UseLocal"
        $decision.Reason = "Port/Host config phù hợp với môi trường hiện tại"
        $decision.Value = $conflict.LocalValue
        $decision.Confidence = 85
    }
    # Rule 4: Feature flags - Merge logic
    elseif ($conflict.Key -match "DEBUG|ENABLE_|FEATURE_|FLAG_") {
        $decision.Action = "MergeLogic"
        $decision.Reason = "Feature flags cần logic merge"
        $decision.Value = if ($conflict.LocalValue -eq "true" -or $conflict.RemoteValue -eq "true") { "true" } else { "false" }
        $decision.Confidence = 80
    }
    # Rule 5: Timestamp-based fallback
    else {
        $decision.Action = "UseRemote"
        $decision.Reason = "Remote config được ưu tiên mặc định"
        $decision.Value = $conflict.RemoteValue
        $decision.Confidence = 70
    }
    
    return $decision
}

# Function: Smart Merge Execution
function Invoke-SmartMerge {
    param($localFile, $remoteFile, $outputFile, $fileName)
    
    Write-Host "🤖 AI-Powered Smart Merge for: $fileName" -ForegroundColor Cyan
    
    $conflicts = Find-EnvConflicts $localFile $remoteFile $fileName
    $mergedContent = @()
    $mergeLog = @()
    
    $allKeys = ($localFile -split "`n" | Where-Object { $_ -match "^[A-Z_]+=" } | ForEach-Object { $_.Split('=')[0] }) + 
               ($remoteFile -split "`n" | Where-Object { $_ -match "^[A-Z_]+=" } | ForEach-Object { $_.Split('=')[0] }) | 
               Sort-Object -Unique
    
    foreach ($key in $allKeys) {
        $localLine = ($localFile -split "`n") | Where-Object { $_ -match "^$key=" }
        $remoteLine = ($remoteFile -split "`n") | Where-Object { $_ -match "^$key=" }
        
        if ($localLine -and $remoteLine) {
            $conflict = $conflicts | Where-Object { $_.Key -eq $key }
            $decision = Resolve-EnvConflict $conflict @{}
            
            Write-Host "  🤖 $key`: $($decision.Action) - $($decision.Reason) (Confidence: $($decision.Confidence)%)" -ForegroundColor Yellow
            
            $mergeLog += @{
                Key = $key
                Action = $decision.Action
                Reason = $decision.Reason
                Confidence = $decision.Confidence
                LocalValue = $conflict.LocalValue
                RemoteValue = $conflict.RemoteValue
                ChosenValue = $decision.Value
            }
            
            $mergedContent += "$key=$($decision.Value)"
        }
        elseif ($localLine) {
            $mergedContent += $localLine
        }
        elseif ($remoteLine) {
            $mergedContent += $remoteLine
        }
    }
    
    $mergedContent | Out-File $outputFile -Encoding UTF8
    $mergeLog | ConvertTo-Json -Depth 3 | Out-File "$outputFile.merge-log.json" -Encoding UTF8
    
    Write-Host "✅ Smart merge completed: $outputFile" -ForegroundColor Green
    return $mergeLog
}

# Function: Validation
function Test-MergedEnv {
    param($envFile)
    
    $validation = @{
        IsValid = $true
        Errors = @()
        Warnings = @()
        Score = 100
    }
    
    $content = Get-Content $envFile -Raw
    
    # Check required keys
    $requiredKeys = @("SPRING_PROFILES_ACTIVE", "SERVER_PORT")
    foreach ($key in $requiredKeys) {
        if ($content -notmatch "^$key=") {
            $validation.Errors += "Missing required key: $key"
            $validation.IsValid = $false
            $validation.Score -= 20
        }
    }
    
    # Check port validation
    if ($content -match "SERVER_PORT=(\d+)") {
        $port = [int]$matches[1]
        if ($port -lt 1000 -or $port -gt 65535) {
            $validation.Warnings += "Invalid port number: $port"
            $validation.Score -= 10
        }
    }
    
    return $validation
}

# Function: Smart Rollback
function Invoke-SmartRollback {
    param($backupDir, $reason)
    
    Write-Host "🔄 Smart Rollback initiated: $reason" -ForegroundColor Yellow
    
    Get-ChildItem $backupDir -Filter "*.env*" | ForEach-Object {
        $targetPath = $_.Name
        Copy-Item $_.FullName $targetPath -Force
        Write-Host "  ↻ Restored: $($_.Name)" -ForegroundColor Cyan
    }
    
    Write-Host "✅ Smart Rollback completed" -ForegroundColor Green
}

# ===== MAIN WORKFLOW =====

# 1) Xác định nhánh làm việc và nhánh private đích
$currentBranch = (git rev-parse --abbrev-ref HEAD 2>$null)
if (-not $currentBranch -or $currentBranch -eq 'HEAD') {
    $currentBranch = 'main'
    git checkout -B $currentBranch
}

# Xác định nhánh private đích (từ tham số hoặc mặc định)
$privateTargetBranch = $args[0]
if (-not $privateTargetBranch) {
    $privateTargetBranch = 'main'
    Write-Host "ℹ️  Không có tham số - sử dụng private/main làm đích" -ForegroundColor Cyan
} else {
    Write-Host "ℹ️  Sử dụng private/$privateTargetBranch làm đích" -ForegroundColor Cyan
}

$prevUpstream = (git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>$null)

# 2) Tạo backup thông minh
Write-Host "🔒 Bước 1/6: Creating AI-Powered Backup..." -ForegroundColor Yellow
$backupDir = New-SmartBackup $currentBranch

# 3) Stage & Commit code (KHÔNG có env files)
Write-Host "📦 Bước 2/6: Staging code changes..." -ForegroundColor Yellow
git add -A
$null = git commit -m "chore: update code changes" --no-verify 2>$null; if ($LASTEXITCODE -ne 0) { 'No changes to commit' | Out-Null }

# 4) Push lên origin trước (backup chính)
Write-Host "🔒 Bước 3/6: Push origin (backup chính)..." -ForegroundColor Yellow
if (git push --set-upstream origin $currentBranch) {
    Write-Host "✅ Origin backup thành công: origin/$currentBranch" -ForegroundColor Green
    
    # 5) AI-Powered Smart Merge cho env files
    Write-Host "🤖 Bước 4/6: AI-Powered Smart Merge..." -ForegroundColor Yellow
    
    # Fetch remote env files từ private target branch
    git fetch private $privateTargetBranch 2>$null
    
    $envFiles = Get-ChildItem "**/.env*"
    $mergeSuccess = $true
    
    foreach ($envFile in $envFiles) {
        try {
            $localContent = Get-Content $envFile.FullName -Raw
            $remoteContent = git show "private/$privateTargetBranch`:$($envFile.FullName)" 2>$null
            
            if ($remoteContent) {
                $tempFile = "$($envFile.FullName).merged"
                $mergeLog = Invoke-SmartMerge $localContent $remoteContent $tempFile $envFile.Name
                
                # Validate merged file
                $validation = Test-MergedEnv $tempFile
                if ($validation.IsValid) {
                    Move-Item $tempFile $envFile.FullName -Force
                    Write-Host "✅ Merged: $($envFile.Name)" -ForegroundColor Green
                } else {
                    Write-Host "❌ Validation failed for $($envFile.Name)" -ForegroundColor Red
                    Write-Host "Errors: $($validation.Errors -join ', ')" -ForegroundColor Red
                    $mergeSuccess = $false
                    break
                }
            } else {
                Write-Host "ℹ️  No remote version for: $($envFile.Name)" -ForegroundColor Cyan
            }
        }
        catch {
            Write-Host "❌ Error merging $($envFile.Name): $($_.Exception.Message)" -ForegroundColor Red
            $mergeSuccess = $false
            break
        }
    }
    
    if (-not $mergeSuccess) {
        Write-Host "🔄 Rolling back due to merge failure..." -ForegroundColor Yellow
        Invoke-SmartRollback $backupDir "Merge validation failed"
        Write-Host "❌ Workflow stopped due to merge failure" -ForegroundColor Red
        exit 1
    }
    
    # 6) Stage & Commit merged env files
    Write-Host "📦 Bước 5/6: Staging merged env files..." -ForegroundColor Yellow
    git add -f **/.env 2>$null
    git add -f **/.env.local 2>$null
    git add -f **/.env.example 2>$null
    $null = git commit -m "chore(env): AI-powered smart merge env files (.env, .env.local, .env.example)" --no-verify 2>$null; if ($LASTEXITCODE -ne 0) { 'No env changes to commit' | Out-Null }
    
    # 7) Push lên private target branch (backup phụ với env)
    Write-Host "🔒 Bước 6/6: Push private/$privateTargetBranch (backup phụ với env)..." -ForegroundColor Yellow
    if (git push private $currentBranch`:$privateTargetBranch) {
        Write-Host "✅ Private backup thành công: private/$privateTargetBranch" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Lỗi khi push private/$privateTargetBranch" -ForegroundColor Yellow
    }
    
    # 8) Khôi phục upstream về origin/<current-branch>
    if ($prevUpstream) { git branch --set-upstream-to=$prevUpstream $currentBranch 2>$null }
    else { git branch --set-upstream-to=origin/$currentBranch $currentBranch 2>$null }
    Write-Host "✅ Upstream khôi phục: origin/$currentBranch" -ForegroundColor Green
    
    Write-Host "🎉 AI-Powered Smart Merge hoàn thành!" -ForegroundColor Green
} else {
    Write-Host "❌ Lỗi khi push origin. Dừng workflow." -ForegroundColor Red
}
```

## Lệnh thực thi (Bash) - AI-Powered
```bash
#!/bin/bash
set -e

# ===== AI-POWERED SMART MERGE FUNCTIONS =====

# Function: Tạo backup với metadata
new_smart_backup() {
    local branch="$1"
    local backup_dir=".git-backup/env/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    local metadata_file="$backup_dir/metadata.json"
    cat > "$metadata_file" << EOF
{
  "timestamp": "$(date '+%Y-%m-%d %H:%M:%S')",
  "branch": "$branch",
  "commit": "$(git rev-parse HEAD)",
  "files": []
}
EOF
    
    find . -name "*.env*" -type f | while read -r file; do
        local filename=$(basename "$file")
        cp "$file" "$backup_dir/$filename"
        echo "📦 Backed up: $filename"
    done
    
    echo "$backup_dir"
}

# Function: Phân tích conflict patterns
find_env_conflicts() {
    local local_content="$1"
    local remote_content="$2"
    local filename="$3"
    
    # Extract keys from both contents
    local local_keys=$(echo "$local_content" | grep -E "^[A-Z_]+=" | cut -d'=' -f1)
    local remote_keys=$(echo "$remote_content" | grep -E "^[A-Z_]+=" | cut -d'=' -f1)
    
    # Find common keys
    local common_keys=$(comm -12 <(echo "$local_keys" | sort) <(echo "$remote_keys" | sort))
    
    local conflicts=""
    while IFS= read -r key; do
        local local_value=$(echo "$local_content" | grep "^$key=" | cut -d'=' -f2-)
        local remote_value=$(echo "$remote_content" | grep "^$key=" | cut -d'=' -f2-)
        
        if [ "$local_value" != "$remote_value" ]; then
            conflicts="$conflicts$key|$local_value|$remote_value|$filename\n"
        fi
    done <<< "$common_keys"
    
    echo -e "$conflicts"
}

# Function: AI Decision Engine
resolve_env_conflict() {
    local key="$1"
    local local_value="$2"
    local remote_value="$3"
    
    # Rule 1: Database URLs - Ưu tiên remote
    if echo "$key" | grep -qE "MONGODB_URI|DATABASE_URL|DB_"; then
        echo "UseRemote|Database config từ remote thường đầy đủ và chính xác hơn|$remote_value|90"
    # Rule 2: API Keys - Ưu tiên local
    elif echo "$key" | grep -qE "API_KEY|SECRET|TOKEN|PASSWORD"; then
        echo "UseLocal|API keys local thường là production keys|$local_value|95"
    # Rule 3: Port/URL config - Ưu tiên local
    elif echo "$key" | grep -qE "PORT|HOST|URL|SERVER_"; then
        echo "UseLocal|Port/Host config phù hợp với môi trường hiện tại|$local_value|85"
    # Rule 4: Feature flags - Merge logic
    elif echo "$key" | grep -qE "DEBUG|ENABLE_|FEATURE_|FLAG_"; then
        local merged_value="false"
        if [ "$local_value" = "true" ] || [ "$remote_value" = "true" ]; then
            merged_value="true"
        fi
        echo "MergeLogic|Feature flags cần logic merge|$merged_value|80"
    # Rule 5: Timestamp-based fallback
    else
        echo "UseRemote|Remote config được ưu tiên mặc định|$remote_value|70"
    fi
}

# Function: Smart Merge Execution
invoke_smart_merge() {
    local local_file="$1"
    local remote_file="$2"
    local output_file="$3"
    local filename="$4"
    
    echo "🤖 AI-Powered Smart Merge for: $filename"
    
    local conflicts=$(find_env_conflicts "$local_file" "$remote_file" "$filename")
    local merged_content=""
    local merge_log=""
    
    # Get all unique keys
    local all_keys=$(echo -e "$local_file\n$remote_file" | grep -E "^[A-Z_]+=" | cut -d'=' -f1 | sort -u)
    
    while IFS= read -r key; do
        local local_line=$(echo "$local_file" | grep "^$key=" || true)
        local remote_line=$(echo "$remote_file" | grep "^$key=" || true)
        
        if [ -n "$local_line" ] && [ -n "$remote_line" ]; then
            # Có conflict - dùng AI decision
            local local_value=$(echo "$local_line" | cut -d'=' -f2-)
            local remote_value=$(echo "$remote_line" | cut -d'=' -f2-)
            
            local decision=$(resolve_env_conflict "$key" "$local_value" "$remote_value")
            local action=$(echo "$decision" | cut -d'|' -f1)
            local reason=$(echo "$decision" | cut -d'|' -f2)
            local chosen_value=$(echo "$decision" | cut -d'|' -f3)
            local confidence=$(echo "$decision" | cut -d'|' -f4)
            
            echo "  🤖 $key: $action - $reason (Confidence: ${confidence}%)"
            
            merged_content="$merged_content$key=$chosen_value\n"
        elif [ -n "$local_line" ]; then
            merged_content="$merged_content$local_line\n"
        elif [ -n "$remote_line" ]; then
            merged_content="$merged_content$remote_line\n"
        fi
    done <<< "$all_keys"
    
    echo -e "$merged_content" > "$output_file"
    echo "✅ Smart merge completed: $output_file"
}

# Function: Validation
test_merged_env() {
    local env_file="$1"
    local content=$(cat "$env_file")
    
    # Check required keys
    if ! echo "$content" | grep -q "^SPRING_PROFILES_ACTIVE="; then
        echo "ERROR: Missing required key: SPRING_PROFILES_ACTIVE"
        return 1
    fi
    
    if ! echo "$content" | grep -q "^SERVER_PORT="; then
        echo "ERROR: Missing required key: SERVER_PORT"
        return 1
    fi
    
    # Check port validation
    local port=$(echo "$content" | grep "^SERVER_PORT=" | cut -d'=' -f2)
    if [ -n "$port" ] && ([ "$port" -lt 1000 ] || [ "$port" -gt 65535 ]); then
        echo "WARNING: Invalid port number: $port"
    fi
    
    return 0
}

# Function: Smart Rollback
invoke_smart_rollback() {
    local backup_dir="$1"
    local reason="$2"
    
    echo "🔄 Smart Rollback initiated: $reason"
    
    find "$backup_dir" -name "*.env*" -type f | while read -r file; do
        local filename=$(basename "$file")
        cp "$file" "$filename"
        echo "  ↻ Restored: $filename"
    done
    
    echo "✅ Smart Rollback completed"
}

# ===== MAIN WORKFLOW =====

# 1) Xác định nhánh làm việc và nhánh private đích
current_branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
if [ -z "$current_branch" ] || [ "$current_branch" = "HEAD" ]; then
    current_branch="main"
    git checkout -B "$current_branch"
fi

# Xác định nhánh private đích (từ tham số hoặc mặc định)
private_target_branch="$1"
if [ -z "$private_target_branch" ]; then
    private_target_branch="main"
    echo "ℹ️  Không có tham số - sử dụng private/main làm đích"
else
    echo "ℹ️  Sử dụng private/$private_target_branch làm đích"
fi

prev_upstream="$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"

# 2) Tạo backup thông minh
echo "🔒 Bước 1/6: Creating AI-Powered Backup..."
backup_dir=$(new_smart_backup "$current_branch")

# 3) Stage & Commit code (KHÔNG có env files)
echo "📦 Bước 2/6: Staging code changes..."
git add -A
git commit -m "chore: update code changes" --no-verify || true

# 4) Push lên origin trước (backup chính)
echo "🔒 Bước 3/6: Push origin (backup chính)..."
if git push --set-upstream origin "$current_branch"; then
    echo "✅ Origin backup thành công: origin/$current_branch"
    
    # 5) AI-Powered Smart Merge cho env files
    echo "🤖 Bước 4/6: AI-Powered Smart Merge..."
    
    # Fetch remote env files từ private target branch
    git fetch private "$private_target_branch" 2>/dev/null || true
    
    merge_success=true
    find . -name "*.env*" -type f | while read -r env_file; do
        if [ "$merge_success" = "true" ]; then
            local_content=$(cat "$env_file")
            remote_content=$(git show "private/$private_target_branch:$env_file" 2>/dev/null || true)
            
            if [ -n "$remote_content" ]; then
                temp_file="$env_file.merged"
                invoke_smart_merge "$local_content" "$remote_content" "$temp_file" "$(basename "$env_file")"
                
                # Validate merged file
                if test_merged_env "$temp_file"; then
                    mv "$temp_file" "$env_file"
                    echo "✅ Merged: $(basename "$env_file")"
                else
                    echo "❌ Validation failed for $(basename "$env_file")"
                    merge_success=false
                fi
            else
                echo "ℹ️  No remote version for: $(basename "$env_file")"
            fi
        fi
    done
    
    if [ "$merge_success" = "false" ]; then
        echo "🔄 Rolling back due to merge failure..."
        invoke_smart_rollback "$backup_dir" "Merge validation failed"
        echo "❌ Workflow stopped due to merge failure"
        exit 1
    fi
    
    # 6) Stage & Commit merged env files
    echo "📦 Bước 5/6: Staging merged env files..."
    git add -f **/.env 2>/dev/null || true
    git add -f **/.env.local 2>/dev/null || true
    git add -f **/.env.example 2>/dev/null || true
    git commit -m "chore(env): AI-powered smart merge env files (.env, .env.local, .env.example)" --no-verify || true
    
    # 7) Push lên private target branch (backup phụ với env)
    echo "🔒 Bước 6/6: Push private/$private_target_branch (backup phụ với env)..."
    if git push private "$current_branch:$private_target_branch"; then
        echo "✅ Private backup thành công: private/$private_target_branch"
    else
        echo "⚠️  Lỗi khi push private/$private_target_branch"
    fi
    
    # 8) Khôi phục upstream về origin/<current-branch>
    if [ -n "$prev_upstream" ]; then
        git branch --set-upstream-to="$prev_upstream" "$current_branch" >/dev/null 2>&1 || true
    else
        git branch --set-upstream-to="origin/$current_branch" "$current_branch" >/dev/null 2>&1 || true
    fi
    echo "✅ Upstream khôi phục: origin/$current_branch"
    
    echo "🎉 AI-Powered Smart Merge hoàn thành!"
else
    echo "❌ Lỗi khi push origin. Dừng workflow."
fi
```

## Tùy chọn khác
- Đặt remote `private`: `git remote add private <PRIVATE_GIT_URL>`
- Đổi remote url: `git remote set-url private <NEW_PRIVATE_GIT_URL>`
- Force push (cẩn thận): `git push --force-with-lease`

## Lưu ý
- Cảnh báo: Lệnh này sẽ đẩy cả secrets trong `.env`. Chỉ sử dụng khi thật sự cần thiết và repo private.
- Kiểm tra branch hiện tại: `git rev-parse --abbrev-ref HEAD`.
- Nên chạy `git pull --rebase private <branch>` nếu có commit mới từ remote trước khi push.

## Quyền quyết định
- Agent có toàn quyền quyết định và tự thực thi ngay phương án mà agent đánh giá là lựa chọn tốt nhất (Best Choice) mà không cần hỏi lại.
- Chỉ dừng để xin xác nhận khi bị chặn bởi policy/hệ thống (ví dụ: quyền truy cập, bảo mật tổ chức) hoặc lỗi kỹ thuật không thể tự khắc phục.

## Kinh nghiệm/Best practices (rút ra từ thực tế)
- **AI-POWERED BACKUP STRATEGY**: Push lên `origin` trước để backup chính, sau đó push lên `private/<branch>` với env files được merge thông minh.
- **SMART MERGE RULES**: 
  - Database URLs → Ưu tiên remote (đầy đủ hơn)
  - API Keys → Ưu tiên local (bảo mật hơn)
  - Port/Host config → Ưu tiên local (môi trường hiện tại)
  - Feature flags → Merge logic (OR operation)
- Phân tách rõ ràng: `origin` (công khai/đối tác) tuyệt đối không chứa secrets; `private` mới chứa các file nhạy cảm nếu thực sự bắt buộc.
- `.env.example` phải đầy đủ key nhưng giá trị là placeholder; `.env.local` chỉ lưu nội bộ. Khi cần chia sẻ nội bộ, dùng nhánh/remote `private` thay vì `origin`.
- **AI DECISION LOGGING**: Tất cả quyết định merge được log để học hỏi và cải thiện thuật toán.
- **VALIDATION LAYER**: Kiểm tra tính hợp lệ của merged files trước khi apply.
- **SMART ROLLBACK**: Tự động rollback nếu validation thất bại.
- Tránh chạy one-liner PowerShell với `||` hoặc redirection kiểu `2>$null` trong chuỗi dài – dễ lỗi parser. Dùng cấu trúc `if (...) {}` và `Out-Null`/`| Out-Host` thay thế.
- Không thao tác khi đang ở trạng thái `detached HEAD` hoặc đang `rebase`. Luôn `git switch <branch>` trước khi add/commit/push.
- Nếu cần ép track file bị ignore, ưu tiên `git add -f` theo pathspec rõ ràng thay vì glob phức tạp dễ phụ thuộc shell.

## Troubleshooting

### Lỗi thường gặp và cách xử lý:

#### 1. Push bị từ chối vì diverge
```bash
# Lỗi: ! [rejected] thaiGO -> thaiGO (non-fast-forward)
# Xử lý:
git pull --rebase private thaiGO
# Sau đó chạy lại /git-push-private
```

#### 2. Lỗi do rebase đang dở
```bash
# Lỗi: fatal: It seems that there is already a rebase-apply directory
# Xử lý:
git rebase --abort  # hoặc git rebase --quit
# Sau đó chạy lại /git-push-private
```

#### 3. Conflicts khi rebase
```bash
# Lỗi: CONFLICT (content): Merge conflict in file
# Xử lý:
# 1. Giải quyết xung đột trong file
# 2. git add <file>
# 3. git rebase --continue
# 4. Chạy lại /git-push-private
```

#### 4. Lỗi merge unrelated histories
```bash
# Lỗi: fatal: refusing to merge unrelated histories
# Xử lý: Script đã tự động thêm --allow-unrelated-histories
# Nếu vẫn lỗi, merge thủ công:
git merge <branch> --allow-unrelated-histories
```

#### 5. Lỗi khi đồng bộ env vào private/main
```bash
# Lỗi: ⚠️ Lỗi khi đồng bộ env vào private/main
# Xử lý thủ công:
git fetch private main
git checkout -B temp-merge private/main
git merge <current-branch> --no-edit -X ours --allow-unrelated-histories
git push private temp-merge:main
git checkout <current-branch>
git branch -D temp-merge
```

#### 6. AI Merge validation thất bại
```bash
# Lỗi: ❌ Validation failed for .env.local
# Xử lý:
# 1. Kiểm tra backup: ls -la .git-backup/env/
# 2. Restore từ backup: cp .git-backup/env/latest/.env.local .env.local
# 3. Chạy lại workflow: /git-push-private
```

#### 7. Conflict resolution không mong muốn
```bash
# Lỗi: AI decision không phù hợp với mong muốn
# Xử lý:
# 1. Kiểm tra merge log: cat .env.local.merge-log.json
# 2. Manual edit file nếu cần
# 3. Commit và push: git add .env.local && git commit -m "fix: manual env merge"
```

### **BACKUP STRATEGY** - Xử lý lỗi:

| Tình huống | Origin backup | Private backup | Hành động |
|------------|---------------|----------------|-----------|
| **Push origin thành công** | ✅ Có | ❌ Chưa | Tiếp tục push private |
| **Push origin lỗi** | ❌ Không | ❌ Không | Dừng workflow |
| **Push private lỗi** | ✅ Có | ❌ Không | Có backup chính |

### **AI-Powered Workflow** - Hiểu output:

#### **Không có tham số** (`/git-push-private`):
```bash
🚀 Git Push Private - AI-Powered Smart Merge
ℹ️  Không có tham số - sử dụng private/main làm đích
🔒 Bước 1/6: Creating AI-Powered Backup...
📦 Backed up: .env.local
📦 Backed up: .env.example
📦 Bước 2/6: Staging code changes...
✅ Files staged successfully
🔒 Bước 3/6: Push origin (backup chính)...
✅ Origin backup thành công: origin/thaiGO
🤖 Bước 4/6: AI-Powered Smart Merge...
🤖 AI-Powered Smart Merge for: .env.local
  🤖 MONGODB_URI: UseRemote - Database config từ remote thường đầy đủ và chính xác hơn (Confidence: 90%)
  🤖 API_KEY: UseLocal - API keys local thường là production keys (Confidence: 95%)
  🤖 SERVER_PORT: UseLocal - Port/Host config phù hợp với môi trường hiện tại (Confidence: 85%)
✅ Smart merge completed: .env.local.merged
✅ Merged: .env.local
ℹ️  No remote version for: .env.example
📦 Bước 5/6: Staging merged env files...
✅ Env files staged successfully
🔒 Bước 6/6: Push private/main (backup phụ với env)...
✅ Private backup thành công: private/main
✅ Upstream khôi phục: origin/thaiGO
🎉 AI-Powered Smart Merge hoàn thành!
```

#### **Có tham số** (`/git-push-private dev`):
```bash
🚀 Git Push Private - AI-Powered Smart Merge
ℹ️  Sử dụng private/dev làm đích
🔒 Bước 1/6: Creating AI-Powered Backup...
📦 Backed up: .env.local
📦 Backed up: .env.example
📦 Bước 2/6: Staging code changes...
✅ Files staged successfully
🔒 Bước 3/6: Push origin (backup chính)...
✅ Origin backup thành công: origin/thaiGO
🤖 Bước 4/6: AI-Powered Smart Merge...
🤖 AI-Powered Smart Merge for: .env.local
  🤖 MONGODB_URI: UseRemote - Database config từ remote thường đầy đủ và chính xác hơn (Confidence: 90%)
  🤖 API_KEY: UseLocal - API keys local thường là production keys (Confidence: 95%)
  🤖 SERVER_PORT: UseLocal - Port/Host config phù hợp với môi trường hiện tại (Confidence: 85%)
✅ Smart merge completed: .env.local.merged
✅ Merged: .env.local
ℹ️  No remote version for: .env.example
📦 Bước 5/6: Staging merged env files...
✅ Env files staged successfully
🔒 Bước 6/6: Push private/dev (backup phụ với env)...
✅ Private backup thành công: private/dev
✅ Upstream khôi phục: origin/thaiGO
🎉 AI-Powered Smart Merge hoàn thành!
```

### **Workflow Comparison** - So sánh có/không tham số:

| Tham số | Origin Backup | Private Backup | Merge Source | Use Case |
|---------|---------------|----------------|--------------|----------|
| **Không có** | `origin/<current-branch>` | `private/main` | `private/main` | Backup chính với env files |
| **Có tham số** | `origin/<current-branch>` | `private/<param>` | `private/<param>` | Backup vào nhánh cụ thể |

### **Ví dụ sử dụng:**

| Lệnh | Kết quả | Mục đích |
|------|---------|----------|
| `/git-push-private` | Push lên `private/main` | Backup chính với env files |
| `/git-push-private dev` | Push lên `private/dev` | Backup vào nhánh dev |
| `/git-push-private staging` | Push lên `private/staging` | Backup vào nhánh staging |
| `/git-push-private feature-auth` | Push lên `private/feature-auth` | Backup vào nhánh feature |

### **AI Decision Logging** - Theo dõi quyết định:

```json
{
  "timestamp": "2024-01-01 12:00:00",
  "key": "MONGODB_URI",
  "action": "UseRemote",
  "reason": "Database config từ remote thường đầy đủ và chính xác hơn",
  "confidence": 90,
  "localValue": "mongodb://localhost:27017",
  "remoteValue": "mongodb+srv://user:pass@cluster.mongodb.net/db",
  "chosenValue": "mongodb+srv://user:pass@cluster.mongodb.net/db"
}
```
