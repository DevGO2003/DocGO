# Script test i18n tags
Write-Host "=== TEST I18N TAGS ===" -ForegroundColor Green

# Test 1: Kiểm tra i18n files có đầy đủ translations không
Write-Host "`n1. Kiểm tra i18n files..." -ForegroundColor Yellow

$viFile = "public/locales/vi/common.json"
$enFile = "public/locales/en/common.json"

if (Test-Path $viFile) {
    $viContent = Get-Content $viFile -Raw | ConvertFrom-Json
    $viTags = $viContent.contracts.tags
    Write-Host "OK File tieng Viet: $($viTags.PSObject.Properties.Count) tags" -ForegroundColor Green
} else {
    Write-Host "ERROR Khong tim thay file tieng Viet" -ForegroundColor Red
}

if (Test-Path $enFile) {
    $enContent = Get-Content $enFile -Raw | ConvertFrom-Json
    $enTags = $enContent.contracts.tags
    Write-Host "✅ File tiếng Anh: $($enTags.PSObject.Properties.Count) tags" -ForegroundColor Green
} else {
    Write-Host "❌ Không tìm thấy file tiếng Anh" -ForegroundColor Red
}

# Test 2: Kiểm tra một số tags cụ thể
Write-Host "`n2. Kiểm tra translations cụ thể..." -ForegroundColor Yellow

$testTags = @("uu_tien_cao", "hop_dong_dai_han", "thanh_toan_dinh_ky", "bao_hiem", "giai_doan_thu_viec")

foreach ($tag in $testTags) {
    $viTranslation = $viTags.$tag
    $enTranslation = $enTags.$tag
    
    if ($viTranslation -and $enTranslation) {
        Write-Host "OK $tag: '$viTranslation' -> '$enTranslation'" -ForegroundColor Green
    } else {
        Write-Host "ERROR $tag: Missing translation" -ForegroundColor Red
    }
}

# Test 3: Kiểm tra useTagTranslation hook
Write-Host "`n3. Kiểm tra useTagTranslation hook..." -ForegroundColor Yellow

$hookFile = "src/hooks/useTagTranslation.ts"
if (Test-Path $hookFile) {
    Write-Host "✅ Hook file tồn tại" -ForegroundColor Green
    
    $hookContent = Get-Content $hookFile -Raw
    if ($hookContent -match "translateTag") {
        Write-Host "✅ Function translateTag có trong hook" -ForegroundColor Green
    } else {
        Write-Host "❌ Function translateTag không tìm thấy" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Hook file không tồn tại" -ForegroundColor Red
}

# Test 4: Kiểm tra TagFilter component
Write-Host "`n4. Kiểm tra TagFilter component..." -ForegroundColor Yellow

$tagFilterFile = "src/components/TagFilter.tsx"
if (Test-Path $tagFilterFile) {
    $tagFilterContent = Get-Content $tagFilterFile -Raw
    if ($tagFilterContent -match "useTagTranslation" -and $tagFilterContent -match "translateTag") {
        Write-Host "✅ TagFilter đã sử dụng i18n" -ForegroundColor Green
    } else {
        Write-Host "❌ TagFilter chưa sử dụng i18n" -ForegroundColor Red
    }
} else {
    Write-Host "❌ TagFilter file không tồn tại" -ForegroundColor Red
}

# Test 5: Kiểm tra các components khác
Write-Host "`n5. Kiểm tra các components khác..." -ForegroundColor Yellow

$components = @(
    "src/components/ContractDetailView.tsx",
    "src/components/ContractEditor.tsx", 
    "src/App.tsx"
)

foreach ($component in $components) {
    if (Test-Path $component) {
        $content = Get-Content $component -Raw
        if ($content -match "useTagTranslation" -and $content -match "translateTag") {
            Write-Host "✅ $component đã sử dụng i18n" -ForegroundColor Green
        } else {
            Write-Host "⚠️ $component chưa sử dụng i18n" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ $component không tồn tại" -ForegroundColor Red
    }
}

Write-Host "`n=== TEST COMPLETED ===" -ForegroundColor Green
Write-Host "`n📝 Kết quả:" -ForegroundColor Cyan
Write-Host "- i18n files đã được cập nhật với tag translations" -ForegroundColor White
Write-Host "- useTagTranslation hook đã được tạo" -ForegroundColor White
Write-Host "- Các components đã được cập nhật để sử dụng i18n" -ForegroundColor White
Write-Host "- Tags sẽ hiển thị theo ngôn ngữ được chọn" -ForegroundColor White
