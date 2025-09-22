param(
  [Parameter(Mandatory = $true, Position = 0)] [string]$SenderName,
  [Parameter(Mandatory = $true, Position = 1)] [string]$Summary,
  [Parameter(Mandatory = $true, Position = 2)] [string]$NextSuggestion,
  [Parameter(Mandatory = $true, Position = 3)] [string]$ReceiverName,
  [Parameter(Mandatory = $false, Position = 4)] [string]$Webhook
)

$ErrorActionPreference = 'Stop'

function New-DiscordPayload {
  param(
    [string]$SenderName,
    [string]$Summary,
    [string]$NextSuggestion,
    [string]$ReceiverName
  )

  $time = Get-Date
  $content = @"
[THU] :mailbox: Thu gui Discord
[CONG VIEC] :clipboard: $Summary
[DE XUAT] :bulb: $NextSuggestion
—
Chu ky: $ReceiverName :crossed_swords:
[THOI GIAN] :clock1: $($time.ToString('HH:mm:ss')) | [NGAY] :calendar: $($time.ToString('yyyy-MM-dd'))
Nguoi gui: $SenderName
"@

  return @{ content = $content }
}

try {
  if (-not $Webhook) { $Webhook = $env:DISCORD_WEBHOOK_URL }

  $payload = New-DiscordPayload -SenderName $SenderName -Summary $Summary -NextSuggestion $NextSuggestion -ReceiverName $ReceiverName
  $json = $payload | ConvertTo-Json -Depth 4

  if ([string]::IsNullOrWhiteSpace($Webhook)) {
    Write-Host '[send-discord-letter] No webhook provided. Dry-run output:' -ForegroundColor Yellow
    Write-Output $json
    exit 0
  }

  Invoke-RestMethod -Method Post -Uri $Webhook -ContentType 'application/json' -Body $json | Out-Null
  Write-Host '[send-discord-letter] Sent successfully.' -ForegroundColor Green
} catch {
  Write-Host "[send-discord-letter] Failed: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

# Requires: PowerShell 5+
# Script gửi thư Discord cho Yasuo phong linh
param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$TenTa,
    
    [Parameter(Mandatory=$true, Position=1)]
    [string]$TomTatNoiDung,
    
    [Parameter(Mandatory=$true, Position=2)]
    [string]$DeXuatYeuCau,
    
    [Parameter(Mandatory=$true, Position=3)]
    [string]$TenNguoi,
    
    [Parameter(Mandatory=$false)]
    [string]$WebhookUrl = 'https://discord.com/api/webhooks/1419599183152681023/iA2aTGkV8PoMYlNriaw6bchzLfkmtWcw-HSjOX-8MXIj6C8QnCA7RbEwEH3NezxoanA4'
)

try {
    $now = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $dateOnly = Get-Date -Format 'dd/MM/yyyy'

    # Tao noi dung thu voi format dep
    $content = @"
========================================
[THU] :mailbox: Thu gui $TenTa
========================================

Kinh gui Quy ngai $TenTa,

[CONG VIEC] :clipboard: Tom tat cong viec da hoan thanh:
$TomTatNoiDung

[DE XUAT] :bulb: De xuat yeu cau tiep theo:
$DeXuatYeuCau

----------------------------------------
Tran trong,
$TenNguoi :crossed_swords:

[THOI GIAN] :clock1: $now  
[NGAY] :calendar: $dateOnly
========================================
"@

    # Tạo payload Discord
    $payload = @{ 
        content = $content
        username = "Yasuo Bot"
        avatar_url = "https://cdn.discordapp.com/attachments/1234567890/yasuo-avatar.png"
    }
    $json = $payload | ConvertTo-Json -Compress

    # Gửi request đến Discord webhook
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method Post -ContentType 'application/json; charset=utf-8' -Body $json
    
    Write-Host "Da gui thu Discord thanh cong!" -ForegroundColor Green
    Write-Host "Nguoi nhan: $TenTa" -ForegroundColor Cyan
    Write-Host "Thoi gian: $now" -ForegroundColor Yellow
    
    return $true
}
catch {
    Write-Error "Gui Discord that bai: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $body = $reader.ReadToEnd()
            Write-Error "Chi tiet loi: $body"
        } catch {
            Write-Error "Khong the doc chi tiet loi"
        }
    }
    
    Write-Host "Co the thu:" -ForegroundColor Yellow
    Write-Host "   - Kiem tra ket noi internet" -ForegroundColor Gray
    Write-Host "   - Xac minh webhook URL" -ForegroundColor Gray
    Write-Host "   - Kiem tra quyen Discord webhook" -ForegroundColor Gray
    
    return $false
}

