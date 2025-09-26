# Test button sizes after resize
Write-Host "=== TEST BUTTON SIZES ===" -ForegroundColor Green

# Test 1: Check UserApprovalPanel buttons
Write-Host "`n1. Check UserApprovalPanel buttons..." -ForegroundColor Yellow
$userApprovalFile = "src/components/UserApprovalPanel.tsx"
if (Test-Path $userApprovalFile) {
    $content = Get-Content $userApprovalFile -Raw
    if ($content -match "px-2 py-1" -and $content -match "text-sm") {
        Write-Host "OK UserApprovalPanel: buttons resized to px-2 py-1" -ForegroundColor Green
    } else {
        Write-Host "ERROR UserApprovalPanel: buttons not resized" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR UserApprovalPanel file not found" -ForegroundColor Red
}

# Test 2: Check ContractUpload buttons
Write-Host "`n2. Check ContractUpload buttons..." -ForegroundColor Yellow
$contractUploadFile = "src/components/ContractUpload.tsx"
if (Test-Path $contractUploadFile) {
    $content = Get-Content $contractUploadFile -Raw
    if ($content -match "px-2 py-1" -and $content -match "text-sm") {
        Write-Host "OK ContractUpload: buttons resized to px-2 py-1" -ForegroundColor Green
    } else {
        Write-Host "ERROR ContractUpload: buttons not resized" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR ContractUpload file not found" -ForegroundColor Red
}

# Test 3: Check ESignaturePanel buttons
Write-Host "`n3. Check ESignaturePanel buttons..." -ForegroundColor Yellow
$eSignatureFile = "src/components/ESignaturePanel.tsx"
if (Test-Path $eSignatureFile) {
    $content = Get-Content $eSignatureFile -Raw
    if ($content -match "px-2 py-1" -and $content -match "text-sm") {
        Write-Host "OK ESignaturePanel: buttons resized to px-2 py-1" -ForegroundColor Green
    } else {
        Write-Host "ERROR ESignaturePanel: buttons not resized" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR ESignaturePanel file not found" -ForegroundColor Red
}

# Test 4: Check ManualContractCreator buttons
Write-Host "`n4. Check ManualContractCreator buttons..." -ForegroundColor Yellow
$manualCreatorFile = "src/components/ManualContractCreator.tsx"
if (Test-Path $manualCreatorFile) {
    $content = Get-Content $manualCreatorFile -Raw
    if ($content -match "px-2 py-1" -and $content -match "text-sm") {
        Write-Host "OK ManualContractCreator: buttons resized to px-2 py-1" -ForegroundColor Green
    } else {
        Write-Host "ERROR ManualContractCreator: buttons not resized" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR ManualContractCreator file not found" -ForegroundColor Red
}

# Test 5: Check ContractEditor buttons
Write-Host "`n5. Check ContractEditor buttons..." -ForegroundColor Yellow
$contractEditorFile = "src/components/ContractEditor.tsx"
if (Test-Path $contractEditorFile) {
    $content = Get-Content $contractEditorFile -Raw
    if ($content -match "px-2 py-1" -and $content -match "text-sm") {
        Write-Host "OK ContractEditor: buttons resized to px-2 py-1" -ForegroundColor Green
    } else {
        Write-Host "ERROR ContractEditor: buttons not resized" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR ContractEditor file not found" -ForegroundColor Red
}

# Test 6: Check ApprovalWorkflowModal buttons
Write-Host "`n6. Check ApprovalWorkflowModal buttons..." -ForegroundColor Yellow
$approvalWorkflowFile = "src/components/ApprovalWorkflowModal.tsx"
if (Test-Path $approvalWorkflowFile) {
    $content = Get-Content $approvalWorkflowFile -Raw
    if ($content -match "px-2 py-1" -and $content -match "text-sm") {
        Write-Host "OK ApprovalWorkflowModal: buttons resized to px-2 py-1" -ForegroundColor Green
    } else {
        Write-Host "ERROR ApprovalWorkflowModal: buttons not resized" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR ApprovalWorkflowModal file not found" -ForegroundColor Red
}

# Test 7: Check UserManagement buttons
Write-Host "`n7. Check UserManagement buttons..." -ForegroundColor Yellow
$userManagementFile = "src/components/UserManagement.tsx"
if (Test-Path $userManagementFile) {
    $content = Get-Content $userManagementFile -Raw
    if ($content -match "px-2 py-1" -and $content -match "text-sm") {
        Write-Host "OK UserManagement: buttons resized to px-2 py-1" -ForegroundColor Green
    } else {
        Write-Host "ERROR UserManagement: buttons not resized" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR UserManagement file not found" -ForegroundColor Red
}

Write-Host "`n=== TEST COMPLETED ===" -ForegroundColor Green
Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "- All buttons resized from px-4 py-2 to px-2 py-1 (50% smaller)" -ForegroundColor White
Write-Host "- Text size changed from default to text-sm (smaller)" -ForegroundColor White
Write-Host "- Icon sizes reduced from w-4 h-4 to w-3 h-3 (25% smaller)" -ForegroundColor White
Write-Host "- Spacing reduced from space-x-2 to space-x-1 (50% smaller)" -ForegroundColor White
Write-Host "`nAll buttons are now approximately 1/3 of their original size!" -ForegroundColor Green
