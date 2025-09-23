<#
  Git Push Private - AI-Powered Smart Merge (PowerShell)
  Single, PowerShell-safe implementation
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Write-Info([string]$msg) { Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warn([string]$msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err([string]$msg)  { Write-Host "[ERROR] $msg" -ForegroundColor Red }

function Invoke-Git([string]$gitArgs) {
  Write-Info "git $gitArgs"
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = 'git'
  $psi.Arguments = $gitArgs
  $psi.WorkingDirectory = (Get-Location).Path
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.UseShellExecute = $false
  $p = [System.Diagnostics.Process]::Start($psi)
  $stdout = $p.StandardOutput.ReadToEnd()
  $stderr = $p.StandardError.ReadToEnd()
  $p.WaitForExit()
  if ($p.ExitCode -ne 0) {
    if ($stderr) { Write-Err $stderr.Trim() }
    throw "git command failed: git $args"
  }
  if ($stdout) { return $stdout.TrimEnd() } else { return '' }
}

function Ensure-GitRepo {
  try { Invoke-Git 'rev-parse --is-inside-work-tree' | Out-Null } catch { throw 'Not a Git repository.' }
}

function Get-CurrentBranch {
  try {
    $b = Invoke-Git 'branch --show-current'
    if ([string]::IsNullOrWhiteSpace($b)) { return 'main' }
    return $b
  } catch { return 'main' }
}

function Ensure-Remote([string]$name) { try { Invoke-Git "remote get-url $name" | Out-Null } catch { throw "Remote '$name' not configured." } }

function SmartBackup-Env {
  $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  $backupRoot = Join-Path '.git-backup' 'env'
  $backupDir = Join-Path $backupRoot $timestamp
  New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

  $repoRoot = (git rev-parse --show-toplevel).Trim()
  $envFiles = Get-ChildItem -Recurse -File -Force | Where-Object { $_.Name -like '.env' -or $_.Name -like '.env.*' }
  foreach ($f in $envFiles) {
    $abs  = [System.IO.Path]::GetFullPath($f.FullName)
    $root = [System.IO.Path]::GetFullPath($repoRoot)
    $rel  = if ($abs.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) { ($abs.Substring($root.Length) -replace '^[\\/]+','') } else { $f.Name }
    $target = Join-Path $backupDir $rel
    $dir = Split-Path $target -Parent
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    Copy-Item -LiteralPath $f.FullName -Destination $target -Force
  }
  Write-Info "Smart Backup saved at: $backupDir"
}

function Security-UntrackEnv {
  $raw = Invoke-Git 'ls-files -z'
  $items = @(); if ($raw) { $items = $raw -split "`0" | Where-Object { $_ } }
  $trackedEnv = @()
  foreach ($p in $items) { if ($p -match '\\.env($|\.)') { $trackedEnv += $p } }
  if ($trackedEnv.Count -gt 0) {
    foreach ($p in $trackedEnv) { Invoke-Git ("rm --cached -- `"$p`"") | Out-Null }
    try { Invoke-Git 'commit -m "chore(security): remove env files from tracking" --no-verify' | Out-Null } catch { Write-Warn 'No changes to commit during security cleanup.' }
    Write-Info ("Removed {0} tracked env file(s) from index" -f $trackedEnv.Count)
  } else { Write-Info 'No tracked env files found.' }
}

function Commit-All-Code {
  Invoke-Git 'add -A' | Out-Null
  try { Invoke-Git 'commit -m "chore: sync code before private push" --no-verify' | Out-Null } catch { Write-Warn 'Nothing to commit for code sync.' }
}

function Read-EnvToMap([string[]]$lines) {
  $map = @{}
  foreach ($line in $lines) {
    if ($null -eq $line) { continue }
    $trim = $line.Trim()
    if ($trim -eq '' -or $trim.StartsWith('#')) { continue }
    $idx = $trim.IndexOf('='); if ($idx -lt 1) { continue }
    $key = $trim.Substring(0, $idx).Trim(); $val = $trim.Substring($idx + 1)
    $map[$key] = $val
  }
  return $map
}

function Bool-FromString([string]$s) { if ($null -eq $s) { return $false } return ($s.Trim().ToLower() -in @('1','true','yes','on')) }

function Smart-MergeMaps($localMap, $remoteMap) {
  $allKeys = @(); $allKeys += $localMap.Keys; $allKeys += $remoteMap.Keys; $allKeys = $allKeys | Sort-Object -Unique
  $result = @{}
  foreach ($k in $allKeys) {
    $l = if ($localMap.ContainsKey($k)) { $localMap[$k] } else { $null }
    $r = if ($remoteMap.ContainsKey($k)) { $remoteMap[$k] } else { $null }
    if ($k -in @('MONGODB_URI','DATABASE_URL')) { $result[$k] = if ($r) { $r } else { $l }; continue }
    if ($k -match 'API_KEY|SECRET')          { $result[$k] = if ($l) { $l } else { $r }; continue }
    if ($k -match 'PORT|HOST|SERVER_PORT')   { $result[$k] = if ($l) { $l } else { $r }; continue }
    if ($k -eq 'DEBUG') { $result[$k] = if ( (Bool-FromString $l) -or (Bool-FromString $r) ) { 'true' } else { if ($l) { $l } else { $r } }; continue }
    $result[$k] = if ($l) { $l } else { $r }
  }
  return $result
}

function Map-ToEnvLines($map) { ($map.Keys | Sort-Object | ForEach-Object { "$_=$($map[$_])" }) }

function Get-RemoteFileLines([string]$remoteTrackingRef, [string]$relPath) {
  try {
    $spec = "${remoteTrackingRef}:`"$relPath`""
    (Invoke-Git ("show $spec")) -split "`n"
  } catch { @() }
}

function Smart-Merge-And-Stage([string]$remoteTrackingRef, [System.IO.FileInfo]$file, [string]$repoRoot) {
  $rel = ([System.IO.Path]::GetFullPath($file.FullName)).Substring(([System.IO.Path]::GetFullPath($repoRoot)).Length) -replace '^[\\/]+',''
  $localLines = Get-Content -LiteralPath $file.FullName -ErrorAction SilentlyContinue
  $remoteLines = Get-RemoteFileLines -remoteTrackingRef $remoteTrackingRef -relPath $rel
  $localMap = Read-EnvToMap $localLines; $remoteMap = Read-EnvToMap $remoteLines
  $merged = Smart-MergeMaps $localMap $remoteMap
  $mergedLines = Map-ToEnvLines $merged
  $content = ($mergedLines -join "`n") + "`n"
  Set-Content -LiteralPath $file.FullName -Value $content -Encoding UTF8
  Invoke-Git ("add -f -- `"$($file.FullName)`"") | Out-Null
}

function Push-Env-To-Private([string]$branchName) {
  $repoRoot = (git rev-parse --show-toplevel).Trim()
  try { Invoke-Git "fetch private" | Out-Null } catch { }
  $remoteTracking = "private/private/$branchName"
  $envFiles = Get-ChildItem -Recurse -File -Force | Where-Object { $_.Name -like '.env' -or $_.Name -like '.env.*' }
  if (!$envFiles -or $envFiles.Count -eq 0) { Write-Warn 'No env files found to push to private.'; return $false }
  foreach ($f in $envFiles) { Smart-Merge-And-Stage -remoteTrackingRef $remoteTracking -file $f -repoRoot $repoRoot }
  $didCommit = $true
  try { Invoke-Git ("commit -m ""chore(env): smart merge for private/$branchName"" --no-verify") | Out-Null } catch { $didCommit = $false; Write-Warn 'Nothing to commit for env smart merge.' }
  Invoke-Git ("push private HEAD:refs/heads/private/$branchName") | Out-Null
  return $didCommit
}

function Enforce-LocalExcludeEnv {
  $excludePath = Join-Path '.git' 'info/exclude'
  if (!(Test-Path $excludePath)) { New-Item -ItemType File -Path $excludePath -Force | Out-Null }
  $patterns = @('**/.env','**/.env.*','**/*.env','**/*.env.*')
  $existing = Get-Content -LiteralPath $excludePath -ErrorAction SilentlyContinue
  foreach ($pat in $patterns) { if ($existing -notcontains $pat) { Add-Content -LiteralPath $excludePath -Value $pat } }
}

function Main {
  Ensure-GitRepo
  Ensure-Remote 'origin'
  Ensure-Remote 'private'
  $current = Get-CurrentBranch
  Write-Info "Current branch: $current"
  $extra = $null; if ($args.Count -ge 1 -and -not [string]::IsNullOrWhiteSpace($args[0])) { $extra = $args[0] }

  SmartBackup-Env
  Security-UntrackEnv

  Invoke-Git ("pull --rebase origin $current") | Out-Null
  Commit-All-Code
  Invoke-Git ("push origin $current") | Out-Null

  $didEnvCommit = Push-Env-To-Private -branchName $current
  if ($extra) { Push-Env-To-Private -branchName $extra | Out-Null }

  if ($didEnvCommit) { try { Invoke-Git 'reset --soft HEAD~1' | Out-Null } catch { } }
  try { Invoke-Git 'reset HEAD' | Out-Null } catch { }

  try { Invoke-Git 'fetch private' | Out-Null } catch { }
  try { Invoke-Git ("reset --soft private/private/$current") | Out-Null } catch { Write-Warn 'Soft reset to private failed or not needed.' }

  Enforce-LocalExcludeEnv
  try { Invoke-Git ("pull private private/$current") | Out-Null } catch { Write-Warn 'Pull from private skipped/failed.' }

  Write-Host "Done. Private sync completed for private/$current" -ForegroundColor Green
}

try { Main @args } catch { Write-Err $_.Exception.Message; exit 1 }

 
