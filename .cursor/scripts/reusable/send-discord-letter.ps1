param(
  [Parameter(Mandatory=$true)][string]$ToName,
  [Parameter(Mandatory=$true)][string]$Summary,
  [Parameter(Mandatory=$true)][string]$Next,
  [Parameter(Mandatory=$true)][string]$FromName,
  [Parameter(Mandatory=$true)][ValidateNotNullOrEmpty()][string]$Webhook
)
$ErrorActionPreference = 'Stop'

# Validate webhook looks like a Discord webhook URL
if (-not ($Webhook -match "^https?://discord.com/api/webhooks/")) {
  throw "Invalid Webhook URL. Provide a valid Discord webhook via -Webhook parameter."
}

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
  Invoke-RestMethod -Uri $Webhook -Method Post -ContentType 'application/json; charset=utf-8' -Body $utf8Bytes
  Write-Host "✅ Da gui Discord letter thanh cong." -ForegroundColor Green
} catch {
  Write-Host "❌ Gui Discord letter that bai: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

