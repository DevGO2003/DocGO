$ErrorActionPreference = 'Stop'

# ===== AI-POWERED SMART MERGE FUNCTIONS =====

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
    Get-ChildItem -Path . -Recurse -Include ".env*" -File | Where-Object { $_.FullName -notlike "*\.git-backup*" } | ForEach-Object {
        $targetPath = Join-Path $backupDir $_.Name
        Copy-Item $_.FullName $targetPath -Force
        $backupMetadata.Files += @{
            Name = $_.Name
            Path = $_.FullName
            LastModified = $_.LastWriteTime
            Size = $_.Length
            Content = Get-Content $_.FullName -Raw
        }
        Write-Host ('Backed up: ' + $($_.Name)) -ForegroundColor Cyan
    }
    $backupMetadata | ConvertTo-Json -Depth 4 | Out-File "$backupDir/metadata.json" -Encoding UTF8
    return $backupDir
}

function Get-ConflictType { param($key,$localValue,$remoteValue)
    if ($key -match "MONGODB_URI|DATABASE_URL|DB_") { return "DatabaseConfig" }
    elseif ($key -match "API_KEY|SECRET|TOKEN|PASSWORD") { return "SecurityConfig" }
    elseif ($key -match "PORT|HOST|URL|SERVER_") { return "NetworkConfig" }
    elseif ($key -match "DEBUG|ENABLE_|FEATURE_|FLAG_") { return "FeatureFlag" }
    else { return "GeneralConfig" }
}

function Get-ConflictSeverity { param($key,$localValue,$remoteValue)
    if ($key -match "API_KEY|SECRET|TOKEN|PASSWORD") { return "High" }
    elseif ($key -match "MONGODB_URI|DATABASE_URL|DB_") { return "Medium" }
    elseif ($key -match "PORT|HOST|URL|SERVER_") { return "Low" }
    else { return "Low" }
}

function Analyze-EnvContent { param($localContent,$remoteContent,$fileName)
    Write-Host ('AI Content Analysis for: ' + $fileName) -ForegroundColor Magenta
    $analysis = @{
        LocalKeys=@(); RemoteKeys=@(); CommonKeys=@(); UniqueLocalKeys=@(); UniqueRemoteKeys=@(); Conflicts=@(); ContentPatterns=@{}; Recommendations=@()
    }
    $localKeys = ($localContent -split "`n" | Where-Object { $_ -match "^[A-Z_]+=" } | ForEach-Object { $_.Split('=')[0] }) | Sort-Object -Unique
    $remoteKeys = ($remoteContent -split "`n" | Where-Object { $_ -match "^[A-Z_]+=" } | ForEach-Object { $_.Split('=')[0] }) | Sort-Object -Unique
    $analysis.LocalKeys=$localKeys; $analysis.RemoteKeys=$remoteKeys
    $analysis.CommonKeys = $localKeys | Where-Object { $_ -in $remoteKeys }
    $analysis.UniqueLocalKeys = $localKeys | Where-Object { $_ -notin $remoteKeys }
    $analysis.UniqueRemoteKeys = $remoteKeys | Where-Object { $_ -notin $localKeys }
    foreach($key in $analysis.CommonKeys){
        $localValue = ($localContent -split "`n" | Where-Object { $_ -match "^$key=" }) -replace "^$key=",""
        $remoteValue = ($remoteContent -split "`n" | Where-Object { $_ -match "^$key=" }) -replace "^$key=",""
        if ($localValue -ne $remoteValue){
            $analysis.Conflicts += @{ Key=$key; LocalValue=$localValue; RemoteValue=$remoteValue; ConflictType=(Get-ConflictType $key $localValue $remoteValue); Severity=(Get-ConflictSeverity $key $localValue $remoteValue) }
        }
    }
    $analysis.ContentPatterns = @{
        LocalHasSecrets = [bool]($localContent -match "SECRET|PASSWORD|TOKEN|KEY")
        RemoteHasSecrets = [bool]($remoteContent -match "SECRET|PASSWORD|TOKEN|KEY")
        LocalHasDatabase = [bool]($localContent -match "MONGODB|DATABASE|DB_")
        RemoteHasDatabase = [bool]($remoteContent -match "MONGODB|DATABASE|DB_")
        LocalHasPorts = [bool]($localContent -match "PORT|HOST")
        RemoteHasPorts = [bool]($remoteContent -match "PORT|HOST")
    }
    Write-Host ("  Analysis: $($analysis.Conflicts.Count) conflicts, $($analysis.UniqueLocalKeys.Count) local-only, $($analysis.UniqueRemoteKeys.Count) remote-only") -ForegroundColor Cyan
    return $analysis
}

function Resolve-EnvConflict-Advanced { param($conflict,$analysis,$context)
    $decision = @{ Action=""; Reason=""; Value=""; Confidence=0; Context=@{} }
    if ($conflict.Key -match "MONGODB_URI|DATABASE_URL|DB_"){
        if ($analysis.ContentPatterns.LocalHasDatabase -and $analysis.ContentPatterns.RemoteHasDatabase){
            $decision.Action="UseRemote"; $decision.Reason="Cả local và remote đều có database config, ưu tiên remote (đầy đủ hơn)"; $decision.Value=$conflict.RemoteValue; $decision.Confidence=95
        } else { $decision.Action="UseRemote"; $decision.Reason="Database config từ remote thường đầy đủ và chính xác hơn"; $decision.Value=$conflict.RemoteValue; $decision.Confidence=90 }
    } elseif ($conflict.Key -match "API_KEY|SECRET|TOKEN|PASSWORD"){
        if ($analysis.ContentPatterns.LocalHasSecrets -and -not $analysis.ContentPatterns.RemoteHasSecrets){
            $decision.Action="UseLocal"; $decision.Reason="Local có secrets, remote không có - ưu tiên local (bảo mật hơn)"; $decision.Value=$conflict.LocalValue; $decision.Confidence=98
        } else { $decision.Action="UseLocal"; $decision.Reason="API keys local thường là production keys"; $decision.Value=$conflict.LocalValue; $decision.Confidence=95 }
    } elseif ($conflict.Key -match "PORT|HOST|URL|SERVER_"){
        if ($analysis.ContentPatterns.LocalHasPorts -and $analysis.ContentPatterns.RemoteHasPorts){
            $decision.Action="UseLocal"; $decision.Reason="Cả local và remote đều có port config, ưu tiên local (môi trường hiện tại)"; $decision.Value=$conflict.LocalValue; $decision.Confidence=90
        } else { $decision.Action="UseLocal"; $decision.Reason="Port/Host config phù hợp với môi trường hiện tại"; $decision.Value=$conflict.LocalValue; $decision.Confidence=85 }
    } elseif ($conflict.Key -match "DEBUG|ENABLE_|FEATURE_|FLAG_"){
        $decision.Action="MergeLogic"; $decision.Reason="Feature flags cần logic merge với context analysis"; $decision.Value = if ($conflict.LocalValue -eq "true" -or $conflict.RemoteValue -eq "true") { "true" } else { "false" }; $decision.Confidence=85
    } else {
        $decision.Action="UseRemote"; $decision.Reason="Remote config được ưu tiên mặc định với context analysis"; $decision.Value=$conflict.RemoteValue; $decision.Confidence=70
    }
    $decision.Context = @{ Analysis=$analysis; ConflictSeverity=$conflict.Severity; Timestamp=(Get-Date -Format "yyyy-MM-dd HH:mm:ss") }
    return $decision
}

function Test-MergedEnv { param($envFile)
    $validation = @{ IsValid=$true; Errors=@(); Warnings=@(); Score=100 }
    $content = Get-Content $envFile -Raw
    $requiredKeys = @("SPRING_PROFILES_ACTIVE","SERVER_PORT")
    foreach($key in $requiredKeys){ if ($content -notmatch "^$key=") { $validation.Errors += "Missing required key: $key"; $validation.IsValid = $false; $validation.Score -= 20 } }
    if ($content -match "SERVER_PORT=(\d+)"){
        $port = [int]$matches[1]
        if ($port -lt 1000 -or $port -gt 65535){ $validation.Warnings += "Invalid port number: $port"; $validation.Score -= 10 }
    }
    return $validation
}

function Invoke-SmartMerge { param($localFile,$remoteFile,$outputFile,$fileName)
    Write-Host ('AI-Powered Smart Merge for: ' + $fileName) -ForegroundColor Cyan
    $analysis = Analyze-EnvContent $localFile $remoteFile $fileName
    $mergedContent = @()
    $allKeys = ($localFile -split "`n" | Where-Object { $_ -match "^[A-Z_]+=" } | ForEach-Object { $_.Split('=')[0] }) +
               ($remoteFile -split "`n" | Where-Object { $_ -match "^[A-Z_]+=" } | ForEach-Object { $_.Split('=')[0] }) | Sort-Object -Unique
    foreach($key in $allKeys){
        $localLine = ($localFile -split "`n") | Where-Object { $_ -match "^$key=" }
        $remoteLine = ($remoteFile -split "`n") | Where-Object { $_ -match "^$key=" }
        if ($localLine -and $remoteLine){
            $localValue = $localLine -replace "^$key=",""
            $remoteValue = $remoteLine -replace "^$key=",""
            if ($localValue -ne $remoteValue){
                $conflict = @{ Key=$key; LocalValue=$localValue; RemoteValue=$remoteValue; Severity=(Get-ConflictSeverity $key $localValue $remoteValue) }
                $decision = Resolve-EnvConflict-Advanced $conflict $analysis @{}
                Write-Host ("  Decision for $($key): $($decision.Action) - $($decision.Reason) (Confidence: $($decision.Confidence)%)") -ForegroundColor Yellow
                $mergedContent += "$key=$($decision.Value)"
            } else { $mergedContent += $localLine }
        } elseif ($localLine){ $mergedContent += $localLine }
        elseif ($remoteLine){ $mergedContent += $remoteLine }
    }
    $tempFile = "$outputFile.temp"
    $mergedContent | Out-File $tempFile -Encoding UTF8
    $validation = Test-MergedEnv $tempFile
    if (-not $validation.IsValid){
        Write-Host 'Validation failed, retrying with fallback strategy...' -ForegroundColor Yellow
        $mergedContent = @()
        foreach($key in $allKeys){
            $localLine = ($localFile -split "`n") | Where-Object { $_ -match "^$key=" }
            $remoteLine = ($remoteFile -split "`n") | Where-Object { $_ -match "^$key=" }
            if ($localLine){ $mergedContent += $localLine }
            elseif ($remoteLine){ $mergedContent += $remoteLine }
        }
        $mergedContent | Out-File $tempFile -Encoding UTF8
        $validation = Test-MergedEnv $tempFile
        if (-not $validation.IsValid){ Write-Host 'Retry failed, using original local content' -ForegroundColor Red; ($localFile) | Out-File $tempFile -Encoding UTF8 }
        else { Write-Host 'Retry successful with fallback strategy' -ForegroundColor Green }
    }
    Move-Item $tempFile $outputFile -Force
    Write-Host ('Smart merge completed: ' + $outputFile) -ForegroundColor Green
}

function Invoke-SmartRollback { param($backupDir,$reason)
    Write-Host ('Smart Rollback initiated: ' + $reason) -ForegroundColor Yellow
    Get-ChildItem $backupDir -Filter "*.env*" | ForEach-Object { Copy-Item $_.FullName $_.Name -Force; Write-Host ('  Restored: ' + $($_.Name)) -ForegroundColor Cyan }
    Write-Host 'Smart Rollback completed' -ForegroundColor Green
}

# ===== MAIN WORKFLOW =====

Write-Host 'Git Push Private - AI-Powered Smart Merge' -ForegroundColor Green

$currentBranch = (git rev-parse --abbrev-ref HEAD 2>$null)
if (-not $currentBranch -or $currentBranch -eq 'HEAD') { $currentBranch = 'main'; git checkout -B $currentBranch | Out-Null }

$privateTargetBranch = $args[0]
if (-not $privateTargetBranch) { $privateTargetBranch = 'main'; Write-Host 'No arg - using private/main' -ForegroundColor Cyan }
else { Write-Host ("Using private/$privateTargetBranch as target") -ForegroundColor Cyan }

$prevUpstream = (git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>$null)

Write-Host 'Step 1/6: Creating AI-Powered Backup...' -ForegroundColor Yellow
$backupDir = New-SmartBackup $currentBranch

Write-Host 'Step 2/6: Staging code changes...' -ForegroundColor Yellow
git add -A
# Unstage env files safely (enumerate staged list)
$stagedFiles = (git diff --name-only --cached)
if ($LASTEXITCODE -ne 0) { $stagedFiles = @() }
$envPatterns = @(".env",".env.local",".env.example")
foreach ($f in $stagedFiles) {
    foreach ($p in $envPatterns) {
        if ($f -like ("*" + $p)) { & git restore --staged -- "$f" | Out-Null }
    }
}
Write-Host 'Excluded env files from origin commit' -ForegroundColor Cyan
$null = git commit -m "chore: update code changes (exclude env)" --no-verify 2>$null; if ($LASTEXITCODE -ne 0) { 'No changes to commit' | Out-Null }

Write-Host 'Step 3/6: Push origin (primary backup)...' -ForegroundColor Yellow
if (git push --set-upstream origin $currentBranch) {
    Write-Host ("Origin backup ok: origin/$currentBranch") -ForegroundColor Green

    Write-Host ("Step 4/8: Pass 1 - Merge $currentBranch -> private/$privateTargetBranch...") -ForegroundColor Yellow
    git fetch private $privateTargetBranch 2>$null
    $envFiles = Get-ChildItem -Path . -Recurse -Include ".env*" -File | Where-Object { $_.FullName -notlike "*\.git-backup*" }
    $mergeSuccess = $true
    foreach ($envFile in $envFiles) {
        try {
            $localContent = Get-Content $envFile.FullName -Raw
            $remoteContent = git show "private/$privateTargetBranch`:$($envFile.FullName)" 2>$null
            if ($remoteContent) {
                $tempFile = "$($envFile.FullName).merged"
                Invoke-SmartMerge $localContent $remoteContent $tempFile $envFile.Name
                $validation = Test-MergedEnv $tempFile
                if ($validation.IsValid) { Move-Item $tempFile $envFile.FullName -Force; Write-Host ("Merged: $($envFile.Name)") -ForegroundColor Green }
                else { Write-Host ("Validation failed for $($envFile.Name)") -ForegroundColor Red; $mergeSuccess = $false; break }
            } else { Write-Host ("No remote version for: $($envFile.Name)") -ForegroundColor Cyan }
        } catch { Write-Host ("Error merging $($envFile.Name): $($_.Exception.Message)") -ForegroundColor Red; $mergeSuccess = $false; break }
    }
    if (-not $mergeSuccess) { Write-Host 'Rolling back due to merge failure...' -ForegroundColor Yellow; Invoke-SmartRollback $backupDir 'Merge validation failed'; Write-Host 'Workflow stopped due to merge failure' -ForegroundColor Red; exit 1 }

    Write-Host 'Step 5/8: Staging merged env files...' -ForegroundColor Yellow
    # Stage merged env files individually
    $envToAdd = Get-ChildItem -Path . -Recurse -Include ".env*" -File | Where-Object { $_.FullName -notlike "*\.git-backup*" }
    foreach ($e in $envToAdd) { & git add -f -- "$($e.FullName)" | Out-Null }
    $null = git commit -m "chore(env): AI-powered smart merge env files (.env, .env.local, .env.example)" --no-verify 2>$null; if ($LASTEXITCODE -ne 0) { 'No env changes to commit' | Out-Null }

    Write-Host ("Step 6/8: Push private/$privateTargetBranch (secondary backup incl. env)...") -ForegroundColor Yellow
    if (git push private $currentBranch`:$privateTargetBranch) {
        Write-Host ("Private backup ok: private/$privateTargetBranch") -ForegroundColor Green

        Write-Host ("Step 7/8: Pass 2 - Merge private/$privateTargetBranch -> $currentBranch...") -ForegroundColor Yellow
        git fetch private $privateTargetBranch 2>$null
        $mergeSuccess2 = $true
        foreach ($envFile in $envFiles) {
            try {
                $currentContent = Get-Content $envFile.FullName -Raw
                $privateContent = git show "private/$privateTargetBranch`:$($envFile.FullName)" 2>$null
                if ($privateContent) {
                    $tempFile = "$($envFile.FullName).merged2"
                    Invoke-SmartMerge $currentContent $privateContent $tempFile $envFile.Name
                    $validation2 = Test-MergedEnv $tempFile
                    if ($validation2.IsValid) { Move-Item $tempFile $envFile.FullName -Force; Write-Host ("Bidirectional merged: $($envFile.Name)") -ForegroundColor Green }
                    else { Write-Host ("Validation failed for $($envFile.Name) in bidirectional merge") -ForegroundColor Red; $mergeSuccess2 = $false; break }
                } else { Write-Host ("No private version for: $($envFile.Name)") -ForegroundColor Cyan }
            } catch { Write-Host ("Error in bidirectional merge $($envFile.Name): $($_.Exception.Message)") -ForegroundColor Red; $mergeSuccess2 = $false; break }
        }
        if (-not $mergeSuccess2) { Write-Host 'Rolling back due to bidirectional merge failure...' -ForegroundColor Yellow; Invoke-SmartRollback $backupDir 'Bidirectional merge validation failed'; Write-Host 'Workflow stopped due to bidirectional merge failure' -ForegroundColor Red; exit 1 }

        Write-Host 'Step 8/8: Staging bidirectional merged env files...' -ForegroundColor Yellow
        $envToAdd2 = Get-ChildItem -Path . -Recurse -Include ".env*" -File | Where-Object { $_.FullName -notlike "*\.git-backup*" }
        foreach ($e2 in $envToAdd2) { & git add -f -- "$($e2.FullName)" | Out-Null }
        $null = git commit -m "chore(env): bidirectional sync from private/$privateTargetBranch" --no-verify 2>$null; if ($LASTEXITCODE -ne 0) { 'No env changes to commit' | Out-Null }
        Write-Host 'Bidirectional sync completed!' -ForegroundColor Green
    } else { Write-Host ("Warning: error when push private/$privateTargetBranch") -ForegroundColor Yellow }

    if ($prevUpstream) { git branch --set-upstream-to=$prevUpstream $currentBranch 2>$null } else { git branch --set-upstream-to=origin/$currentBranch $currentBranch 2>$null }
    Write-Host ("Upstream restored: origin/$currentBranch") -ForegroundColor Green
    Write-Host 'AI-Powered Smart Merge completed!' -ForegroundColor Green
} else { Write-Host 'Error pushing to origin. Stop workflow.' -ForegroundColor Red }


