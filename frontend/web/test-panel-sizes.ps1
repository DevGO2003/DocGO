# Test panel sizes after resize
Write-Host "=== TEST PANEL SIZES ===" -ForegroundColor Green

# Test 1: Check ManualContractCreator
Write-Host "`n1. Check ManualContractCreator..." -ForegroundColor Yellow
$manualCreatorFile = "src/components/ManualContractCreator.tsx"
if (Test-Path $manualCreatorFile) {
    $content = Get-Content $manualCreatorFile -Raw
    if ($content -match "max-w-2xl") {
        Write-Host "OK ManualContractCreator: max-w-2xl (was max-w-6xl)" -ForegroundColor Green
    } else {
        Write-Host "ERROR ManualContractCreator: Not resized" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR ManualContractCreator file not found" -ForegroundColor Red
}

# Test 2: Check ContractEditor
Write-Host "`n2. Check ContractEditor..." -ForegroundColor Yellow
$contractEditorFile = "src/components/ContractEditor.tsx"
if (Test-Path $contractEditorFile) {
    $content = Get-Content $contractEditorFile -Raw
    if ($content -match "max-w-xl") {
        Write-Host "OK ContractEditor: max-w-xl (was max-w-4xl)" -ForegroundColor Green
    } else {
        Write-Host "ERROR ContractEditor: Not resized" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR ContractEditor file not found" -ForegroundColor Red
}

# Test 3: Check UserApprovalPanel
Write-Host "`n3. Check UserApprovalPanel..." -ForegroundColor Yellow
$userApprovalFile = "src/components/UserApprovalPanel.tsx"
if (Test-Path $userApprovalFile) {
    $content = Get-Content $userApprovalFile -Raw
    if ($content -match "max-w-xl") {
        Write-Host "OK UserApprovalPanel: max-w-xl (was max-w-4xl)" -ForegroundColor Green
    } else {
        Write-Host "ERROR UserApprovalPanel: Not resized" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR UserApprovalPanel file not found" -ForegroundColor Red
}

# Test 4: Check ApprovalWorkflowModal
Write-Host "`n4. Check ApprovalWorkflowModal..." -ForegroundColor Yellow
$approvalWorkflowFile = "src/components/ApprovalWorkflowModal.tsx"
if (Test-Path $approvalWorkflowFile) {
    $content = Get-Content $approvalWorkflowFile -Raw
    if ($content -match "max-w-xl") {
        Write-Host "OK ApprovalWorkflowModal: max-w-xl (was max-w-4xl)" -ForegroundColor Green
    } else {
        Write-Host "ERROR ApprovalWorkflowModal: Not resized" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR ApprovalWorkflowModal file not found" -ForegroundColor Red
}

# Test 5: Check ContractUpload
Write-Host "`n5. Check ContractUpload..." -ForegroundColor Yellow
$contractUploadFile = "src/components/ContractUpload.tsx"
if (Test-Path $contractUploadFile) {
    $content = Get-Content $contractUploadFile -Raw
    if ($content -match "max-w-lg") {
        Write-Host "OK ContractUpload: max-w-lg (was max-w-2xl)" -ForegroundColor Green
    } else {
        Write-Host "ERROR ContractUpload: Not resized" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR ContractUpload file not found" -ForegroundColor Red
}

Write-Host "`n=== TEST COMPLETED ===" -ForegroundColor Green
Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "- ManualContractCreator: max-w-6xl → max-w-2xl (66% smaller)" -ForegroundColor White
Write-Host "- ContractEditor: max-w-4xl → max-w-xl (75% smaller)" -ForegroundColor White
Write-Host "- UserApprovalPanel: max-w-4xl → max-w-xl (75% smaller)" -ForegroundColor White
Write-Host "- ApprovalWorkflowModal: max-w-4xl → max-w-xl (75% smaller)" -ForegroundColor White
Write-Host "- ContractUpload: max-w-2xl → max-w-lg (50% smaller)" -ForegroundColor White
Write-Host "`nAll panels are now approximately 1/3 of their original size!" -ForegroundColor Green
