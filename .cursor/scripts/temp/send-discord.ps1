# Send Discord notification (ASCII only)
$ErrorActionPreference = 'Stop'

try {
	# Three levels up from .cursor/scripts/temp to workspace root
	$envPath = Join-Path -Path $PSScriptRoot -ChildPath '../../../tools/discord/env/.env'
	$envPath = [System.IO.Path]::GetFullPath($envPath)
	if (-not (Test-Path -LiteralPath $envPath)) { throw "ENV_MISSING: $envPath" }

	$line = Get-Content -LiteralPath $envPath | Where-Object { $_ -like 'DISCORD_WEBHOOK_URL=*' } | Select-Object -First 1
	if (-not $line) { throw 'WEBHOOK_MISSING' }
	$webhook = ($line -split '=',2)[1].Trim()
	if ([string]::IsNullOrWhiteSpace($webhook)) { throw 'WEBHOOK_EMPTY' }

	$content = 'Push OK: vibe-coding -> origin/vibe-coding'
	$body = @{ content = $content } | ConvertTo-Json -Compress
	Invoke-RestMethod -Uri $webhook -Method Post -ContentType 'application/json; charset=utf-8' -Body $body | Out-Null
	'RESULT=SENT'
}
catch {
	'RESULT=ERROR: ' + $_.Exception.Message
	exit 1
}
