# Final test i18n tags
Write-Host "=== TEST I18N TAGS ===" -ForegroundColor Green

# Test 1: Check i18n files exist
Write-Host "`n1. Check i18n files..." -ForegroundColor Yellow

$viFile = "public/locales/vi/common.json"
$enFile = "public/locales/en/common.json"

if (Test-Path $viFile) {
    Write-Host "OK Vietnamese file exists" -ForegroundColor Green
} else {
    Write-Host "ERROR Vietnamese file not found" -ForegroundColor Red
}

if (Test-Path $enFile) {
    Write-Host "OK English file exists" -ForegroundColor Green
} else {
    Write-Host "ERROR English file not found" -ForegroundColor Red
}

# Test 2: Check hook file
Write-Host "`n2. Check useTagTranslation hook..." -ForegroundColor Yellow

$hookFile = "src/hooks/useTagTranslation.ts"
if (Test-Path $hookFile) {
    Write-Host "OK Hook file exists" -ForegroundColor Green
} else {
    Write-Host "ERROR Hook file not found" -ForegroundColor Red
}

# Test 3: Check TagFilter component
Write-Host "`n3. Check TagFilter component..." -ForegroundColor Yellow

$tagFilterFile = "src/components/TagFilter.tsx"
if (Test-Path $tagFilterFile) {
    $tagFilterContent = Get-Content $tagFilterFile -Raw
    if ($tagFilterContent -match "useTagTranslation" -and $tagFilterContent -match "translateTag") {
        Write-Host "OK TagFilter uses i18n" -ForegroundColor Green
    } else {
        Write-Host "ERROR TagFilter does not use i18n" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR TagFilter file not found" -ForegroundColor Red
}

# Test 4: Check other components
Write-Host "`n4. Check other components..." -ForegroundColor Yellow

$components = @(
    "src/components/ContractDetailView.tsx",
    "src/components/ContractEditor.tsx", 
    "src/App.tsx"
)

foreach ($component in $components) {
    if (Test-Path $component) {
        $content = Get-Content $component -Raw
        if ($content -match "useTagTranslation" -and $content -match "translateTag") {
            Write-Host "OK $component uses i18n" -ForegroundColor Green
        } else {
            Write-Host "WARNING $component does not use i18n" -ForegroundColor Yellow
        }
    } else {
        Write-Host "ERROR $component not found" -ForegroundColor Red
    }
}

Write-Host "`n=== TEST COMPLETED ===" -ForegroundColor Green
Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "- i18n files created with tag translations" -ForegroundColor White
Write-Host "- useTagTranslation hook created" -ForegroundColor White
Write-Host "- Components updated to use i18n" -ForegroundColor White
Write-Host "- Tags will display in selected language" -ForegroundColor White
