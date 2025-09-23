param(
  [Parameter(Mandatory=$true)][string]$ToName,
  [Parameter(Mandatory=$true)][string]$Summary,
  [Parameter(Mandatory=$true)][string]$Next,
  [Parameter(Mandatory=$true)][string]$FromName,
  [Parameter(Mandatory=$false)][string]$WebhookOverride
)
$ErrorActionPreference = 'Stop'
function Get-DiscordWebhook {
  param([string]$Override)
  if ($Override -and $Override.Trim().Length -gt 0) { return $Override }
  $envPath = Join-Path -Path (Join-Path -Path (Resolve-Path .).Path -ChildPath "tools/discord/env") -ChildPath ".env"
  if (Test-Path $envPath) {
    $lines = Get-Content $envPath | Where-Object { $_ -match "^\s*DISCORD_WEBHOOK_URL\s*=\s*" }
    if ($lines) {
      $val = $lines[0] -replace "^\s*DISCORD_WEBHOOK_URL\s*=\s*", ""
      return $val.Trim()
    }
  }
  throw "DISCORD_WEBHOOK_URL not found. Provide as 5th arg or set in tools/discord/env/.env"
}

$webhook = Get-DiscordWebhook -Override $WebhookOverride

# Load template from file with proper UTF-8 encoding
$templatePath = Join-Path -Path $PSScriptRoot -ChildPath "template-discord-letter.txt"
if (-not (Test-Path $templatePath)) {
  throw "Template file not found: $templatePath"
}

# Read file with UTF-8 encoding to preserve Vietnamese characters
$template = Get-Content $templatePath -Raw -Encoding UTF8

$now = Get-Date
$timeStr = $now.ToString("HH:mm:ss")
$dateStr = $now.ToString("yyyy-MM-dd")

# Replace placeholders
$content = $template -replace "{{TEN_TA}}", $ToName
$content = $content -replace "{{TOM_TAT}}", $Summary
$content = $content -replace "{{DE_XUAT}}", $Next
$content = $content -replace "{{TEN_NGUOI}}", $FromName
$content = $content -replace "{{TIME}}", $timeStr
$content = $content -replace "{{DATE}}", $dateStr

$payload = @{ content = $content }

try {
  $jsonBody = $payload | ConvertTo-Json -Depth 4 -Compress
  $utf8Bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonBody)
  Invoke-RestMethod -Uri $webhook -Method Post -ContentType 'application/json; charset=utf-8' -Body $utf8Bytes
  Write-Host "✅ Da gui Discord letter thanh cong." -ForegroundColor Green
} catch {
  Write-Host "❌ Gui Discord letter that bai: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

