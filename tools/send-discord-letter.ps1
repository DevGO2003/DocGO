# Requires: PowerShell 5.1+
param(
  [Parameter(Mandatory = $true, Position = 0)] [string]$SenderName,
  [Parameter(Mandatory = $true, Position = 1)] [string]$Summary,
  [Parameter(Mandatory = $true, Position = 2)] [string]$NextSuggestion,
  [Parameter(Mandatory = $true, Position = 3)] [string]$ReceiverName,
  [Parameter(Mandatory = $false)] [string]$Webhook
)

$ErrorActionPreference = "Stop"

function New-DiscordPayload {
  param(
    [string]$SenderName,
    [string]$Summary,
    [string]$NextSuggestion,
    [string]$ReceiverName
  )

  # Compose a concise message. Adjust formatting to your preference.
  $content = @"
📨 Thư gửi Discord
• Tên ta: $SenderName
• Tóm tắt: $Summary
• Đề xuất tiếp theo: $NextSuggestion
• Tên ngươi: $ReceiverName
"@

  return @{ content = $content }
}

try {
  if (-not $Webhook) {
    $Webhook = $env:DISCORD_WEBHOOK_URL
  }

  $payload = New-DiscordPayload -SenderName $SenderName -Summary $Summary -NextSuggestion $NextSuggestion -ReceiverName $ReceiverName
  $json = $payload | ConvertTo-Json -Depth 4

  if ([string]::IsNullOrWhiteSpace($Webhook)) {
    Write-Host "[send-discord-letter] No webhook provided. Dry-run output:" -ForegroundColor Yellow
    Write-Output $json
    exit 0
  }

  $response = Invoke-RestMethod -Method Post -Uri $Webhook -ContentType 'application/json' -Body $json
  Write-Host "[send-discord-letter] Sent successfully." -ForegroundColor Green
} catch {
  Write-Host "[send-discord-letter] Failed: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}


