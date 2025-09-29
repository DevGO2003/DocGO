# Simple test i18n tags
Write-Host "=== TEST I18N TAGS ===" -ForegroundColor Green

# Test 1: Check i18n files
Write-Host "`n1. Check i18n files..." -ForegroundColor Yellow

$viFile = "public/locales/vi/common.json"
$enFile = "public/locales/en/common.json"

if (Test-Path $viFile) {
    $viContent = Get-Content $viFile -Raw -Encoding UTF8 | ConvertFrom-Json
    $viTags = $viContent.contracts.tags
    Write-Host "OK Vietnamese file: $($viTags.PSObject.Properties.Count) tags" -ForegroundColor Green
} else {
    Write-Host "ERROR Vietnamese file not found" -ForegroundColor Red
}

if (Test-Path $enFile) {
    $enContent = Get-Content $enFile -Raw -Encoding UTF8 | ConvertFrom-Json
    $enTags = $enContent.contracts.tags
    Write-Host "OK English file: $($enTags.PSObject.Properties.Count) tags" -ForegroundColor Green
} else {
    Write-Host "ERROR English file not found" -ForegroundColor Red
}

# Test 2: Check specific tags
Write-Host "`n2. Check specific translations..." -ForegroundColor Yellow

$testTags = @("ưu_tiên_cao", "hợp_đồng_dài_hạn", "thanh_toán_định_kỳ")

foreach ($tag in $testTags) {
    $viTranslation = $viTags.$tag
    $enTranslation = $enTags.$tag
    
    if ($viTranslation -and $enTranslation) {
        Write-Host "OK ${tag}: '$viTranslation' -> '$enTranslation'" -ForegroundColor Green
    } else {
        Write-Host "ERROR ${tag}: Missing translation" -ForegroundColor Red
    }
}

# Test 3: Check hook file
Write-Host "`n3. Check useTagTranslation hook..." -ForegroundColor Yellow

$hookFile = "src/hooks/useTagTranslation.ts"
if (Test-Path $hookFile) {
    Write-Host "OK Hook file exists" -ForegroundColor Green
} else {
    Write-Host "ERROR Hook file not found" -ForegroundColor Red
}

# Test 4: Check TagFilter component
Write-Host "`n4. Check TagFilter component..." -ForegroundColor Yellow

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

Write-Host "`n=== TEST COMPLETED ===" -ForegroundColor Green
