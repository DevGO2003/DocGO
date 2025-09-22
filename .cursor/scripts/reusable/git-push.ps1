$ErrorActionPreference = 'Stop'

function Get-CurrentBranch {
  try {
    $b = git rev-parse --abbrev-ref HEAD 2>$null
    if ($LASTEXITCODE -eq 0 -and $b) { return $b }
    return $null
  } catch { return $null }
}

function Resolve-BranchName {
  $user = git config user.name 2>$null
  if (-not $user -or [string]::IsNullOrWhiteSpace($user)) { $user = $env:USERNAME }
  if ($user -match 'thai|thaiGO') { return 'thaiGO' }
  elseif ($user -match 'LocTruongLuan|Luan') { return 'LocTruongLuan' }
  else { return 'thaiGO' }
}

$branch = Get-CurrentBranch
if (-not $branch -or $branch -eq 'HEAD') {
  $branch = Resolve-BranchName
  git checkout -B $branch
}

git add -A
git commit -m "chore: push pending changes" --no-verify 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host 'No changes to commit' }

git push origin $branch
if ($LASTEXITCODE -ne 0) { throw "Failed to push to origin $branch" }

Write-Host "Pushed to origin/$branch successfully." -ForegroundColor Green


