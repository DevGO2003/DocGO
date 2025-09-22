Param(
  [Parameter(Mandatory = $true)] [string] $TenTa,
  [Parameter(Mandatory = $true)] [string] $TomTat,
  [Parameter(Mandatory = $true)] [string] $DeXuat,
  [Parameter(Mandatory = $true)] [string] $TenNguoi,
  [Parameter(Mandatory = $false)] [string] $WebhookUrl
)

function Get-DiscordWebhookUrl {
  Param([string] $Provided)

  if (-not [string]::IsNullOrWhiteSpace($Provided)) { return $Provided }

  if (-not [string]::IsNullOrWhiteSpace($env:DISCORD_WEBHOOK_URL)) {
    return $env:DISCORD_WEBHOOK_URL
  }

  $envFile = Join-Path -Path (Join-Path -Path $PSScriptRoot -ChildPath "..\..\..\tools\discord\env") -ChildPath ".env"
  if (Test-Path -LiteralPath $envFile) {
    try {
      $lines = Get-Content -LiteralPath $envFile -ErrorAction Stop
      foreach ($line in $lines) {
        if ($line -match "^\s*DISCORD_WEBHOOK_URL\s*=\s*(.*)\s*$") {
          $url = $Matches[1].Trim().Trim('"').Trim("'")
          if (-not [string]::IsNullOrWhiteSpace($url)) { return $url }
        }
      }
    }
    catch { }
  }

  return $null
}

try {
  $webhook = Get-DiscordWebhookUrl -Provided $WebhookUrl
  if ([string]::IsNullOrWhiteSpace($webhook)) {
    Write-Host "Khong tim thay DISCORD_WEBHOOK_URL. Truyen tham so thu 5 hoac dat ENV/TOOLS .env" -ForegroundColor Red
    Write-Host "Goi vi du:" -ForegroundColor Yellow
    Write-Host "powershell -ExecutionPolicy Bypass -File .cursor/scripts/reusable/send-discord-letter.ps1 \"Thai Go\" \"Tom tat cong viec\" \"De xuat tiep theo\" \"Yasuo phong linh\" \"https://discord.com/api/webhooks/...\"" -ForegroundColor Yellow
    exit 1
  }

  $now = Get-Date
  $timeStr = $now.ToString('HH:mm:ss')
  $dateStr = $now.ToString('dd/MM/yyyy')

  $templatePath = Join-Path -Path $PSScriptRoot -ChildPath "template-discord-letter.txt"
  if (-not (Test-Path -LiteralPath $templatePath)) {
    Write-Host "Khong tim thay file template: $templatePath" -ForegroundColor Red
    exit 1
  }

  $template = Get-Content -LiteralPath $templatePath -Raw -Encoding UTF8
  $content = $template.Replace("{{TEN_TA}}", $TenTa).Replace("{{TOM_TAT}}", $TomTat).Replace("{{DE_XUAT}}", $DeXuat).Replace("{{TEN_NGUOI}}", $TenNguoi).Replace("{{TIME}}", $timeStr).Replace("{{DATE}}", $dateStr)

  $payload = @{ content = $content }
  $json = $payload | ConvertTo-Json -Compress

  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  $bodyBytes = $utf8NoBom.GetBytes($json)

  $response = Invoke-RestMethod -Uri $webhook -Method Post -ContentType 'application/json; charset=utf-8' -Body $bodyBytes -ErrorAction Stop

  Write-Host "Da gui thu Discord thanh cong cho Quy ngai $TenTa" -ForegroundColor Green
}
catch {
  Write-Host "Loi khi gui thu Discord:" -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  Write-Host "Kiem tra webhook URL va mang. Thu lai voi tham so webhook ro rang." -ForegroundColor Yellow
  exit 1
}

