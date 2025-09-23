# Git Restore Env

Khôi phục file env từ remote `private` khi bị mất do workflow `/git-push-private`.

## Mô tả
- Tự động pull file env từ `private/<branch>` về nhánh hiện tại
- Khôi phục các file: `.env`, `.env.local`, `.env.example`
- Giữ nguyên upstream hiện tại (không thay đổi workflow)

## Yêu cầu
- Đã cấu hình remote tên `private`
- Nhánh hiện tại đã được push lên `private` trước đó

## Cách sử dụng
- Gõ `/git-restore-env` trong Agent input để chạy command này

## Lệnh thực thi (PowerShell - Windows)
```powershell
$ErrorActionPreference = 'Stop'

# Progress indicator và logging
Write-Host "🔄 Git Restore Env - Khôi phục file env..." -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

# 1) Xác định nhánh hiện tại
Write-Host "🔍 Bước 1/4: Xác định nhánh hiện tại..." -ForegroundColor Yellow
$branch = (git rev-parse --abbrev-ref HEAD 2>$null)
if (-not $branch -or $branch -eq 'HEAD') {
  Write-Host "❌ Không xác định được nhánh hiện tại!" -ForegroundColor Red
  exit 1
}
Write-Host "✅ Đang làm việc trên nhánh: $branch" -ForegroundColor Green

# 2) Kiểm tra remote private
Write-Host "🔍 Bước 2/4: Kiểm tra remote private..." -ForegroundColor Yellow
$privateRemote = git remote get-url private 2>$null
if (-not $privateRemote) {
  Write-Host "❌ Remote 'private' chưa được cấu hình!" -ForegroundColor Red
  exit 1
}
Write-Host "✅ Remote private: $privateRemote" -ForegroundColor Green

# 3) Kiểm tra nhánh có trên private không
Write-Host "🔍 Bước 3/4: Kiểm tra nhánh trên private..." -ForegroundColor Yellow
$privateBranch = git ls-remote --heads private $branch 2>$null
if (-not $privateBranch) {
  Write-Host "❌ Nhánh $branch không tồn tại trên private!" -ForegroundColor Red
  Write-Host "💡 Hãy chạy /git-push-private trước" -ForegroundColor Yellow
  exit 1
}
Write-Host "✅ Nhánh $branch tồn tại trên private" -ForegroundColor Green

# 4) Pull file env từ private
Write-Host "📥 Bước 4/4: Pull file env từ private..." -ForegroundColor Yellow
try {
  # Lưu upstream hiện tại
  $currentUpstream = (git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>$null)
  
  # Tạm thời set upstream về private
  git branch --set-upstream-to=private/$branch $branch 2>$null
  
  # Pull file env từ private
  git pull private $branch --no-edit 2>$null
  
  # Khôi phục upstream về origin
  if ($currentUpstream) {
    git branch --set-upstream-to=$currentUpstream $branch 2>$null
    Write-Host "✅ Upstream khôi phục: $currentUpstream" -ForegroundColor Green
  } else {
    git branch --set-upstream-to=origin/$branch $branch 2>$null
    Write-Host "✅ Upstream set: origin/$branch" -ForegroundColor Green
  }
  
  Write-Host "✅ File env đã được khôi phục từ private/$branch" -ForegroundColor Green
} catch {
  Write-Host "❌ Lỗi khi pull file env: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host "🔄 Thử thủ công: git pull private $branch" -ForegroundColor Yellow
  exit 1
}

# Kết quả cuối cùng
Write-Host "=" * 50 -ForegroundColor Gray
Write-Host "🎉 Hoàn thành! File env đã được khôi phục:" -ForegroundColor Green
Write-Host "  ✅ Từ private/$branch" -ForegroundColor Green
Write-Host "  ✅ Upstream: $currentUpstream" -ForegroundColor Green
Write-Host "  ✅ Workflow bình thường được duy trì" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Gray
```

## Lệnh thực thi (Bash)
```bash
set -e

# Progress indicator và logging
echo "🔄 Git Restore Env - Khôi phục file env..."
echo "=================================================="

# 1) Xác định nhánh hiện tại
echo "🔍 Bước 1/4: Xác định nhánh hiện tại..."
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
if [ -z "$branch" ] || [ "$branch" = "HEAD" ]; then
  echo "❌ Không xác định được nhánh hiện tại!"
  exit 1
fi
echo "✅ Đang làm việc trên nhánh: $branch"

# 2) Kiểm tra remote private
echo "🔍 Bước 2/4: Kiểm tra remote private..."
private_remote="$(git remote get-url private 2>/dev/null || true)"
if [ -z "$private_remote" ]; then
  echo "❌ Remote 'private' chưa được cấu hình!"
  exit 1
fi
echo "✅ Remote private: $private_remote"

# 3) Kiểm tra nhánh có trên private không
echo "🔍 Bước 3/4: Kiểm tra nhánh trên private..."
private_branch="$(git ls-remote --heads private $branch 2>/dev/null || true)"
if [ -z "$private_branch" ]; then
  echo "❌ Nhánh $branch không tồn tại trên private!"
  echo "💡 Hãy chạy /git-push-private trước"
  exit 1
fi
echo "✅ Nhánh $branch tồn tại trên private"

# 4) Pull file env từ private
echo "📥 Bước 4/4: Pull file env từ private..."
if current_upstream="$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"; then
  # Lưu upstream hiện tại
  echo "✅ Upstream hiện tại: $current_upstream"
else
  current_upstream=""
  echo "⚠️  Chưa có upstream"
fi

# Tạm thời set upstream về private
git branch --set-upstream-to=private/$branch $branch >/dev/null 2>&1 || true

# Pull file env từ private
if git pull private $branch --no-edit >/dev/null 2>&1; then
  echo "✅ Pull file env thành công"
else
  echo "❌ Lỗi khi pull file env"
  echo "🔄 Thử thủ công: git pull private $branch"
  exit 1
fi

# Khôi phục upstream về origin
if [ -n "$current_upstream" ]; then
  if git branch --set-upstream-to="$current_upstream" $branch >/dev/null 2>&1; then
    echo "✅ Upstream khôi phục: $current_upstream"
  else
    echo "⚠️  Lỗi khi khôi phục upstream"
  fi
else
  if git branch --set-upstream-to="origin/$branch" $branch >/dev/null 2>&1; then
    echo "✅ Upstream set: origin/$branch"
  else
    echo "⚠️  Lỗi khi set upstream"
  fi
fi

# Kết quả cuối cùng
echo "=================================================="
echo "🎉 Hoàn thành! File env đã được khôi phục:"
echo "  ✅ Từ private/$branch"
echo "  ✅ Upstream: $current_upstream"
echo "  ✅ Workflow bình thường được duy trì"
echo "=================================================="
```

## Troubleshooting

### Lỗi thường gặp:

#### 1. Remote private chưa được cấu hình
```bash
# Lỗi: ❌ Remote 'private' chưa được cấu hình!
# Xử lý:
git remote add private <PRIVATE_GIT_URL>
```

#### 2. Nhánh không tồn tại trên private
```bash
# Lỗi: ❌ Nhánh thaiGO1 không tồn tại trên private!
# Xử lý:
/git-push-private  # Chạy trước để tạo nhánh trên private
```

#### 3. Lỗi khi pull file env
```bash
# Lỗi: ❌ Lỗi khi pull file env
# Xử lý thủ công:
git pull private thaiGO1
```

## Lưu ý
- Script này chỉ khôi phục file env, không thay đổi code khác
- Upstream được khôi phục về trạng thái ban đầu
- Workflow bình thường không bị ảnh hưởng
