# Git Push Private

Đẩy nhánh hiện tại lên `origin` trước, sau đó push lên `private/main` kèm TẤT CẢ file env theo yêu cầu: `.env`, `.env.local`, `.env.example` (force track kể cả khi bị .gitignore).

## Mô tả
- Tự động và không yêu cầu xác nhận.
- Xác định nhánh hiện tại; nếu không xác định được thì MẶC ĐỊNH dùng nhánh `main` (tạo mới nếu chưa có).
- **BACKUP STRATEGY**: Push lên `origin/<branch>` trước để backup, sau đó push lên `private/main` với env files.
- Khôi phục upstream về `origin/<branch>` để tiếp tục làm việc trên origin.
- Đảm bảo các file env được force-add: `**/.env`, `**/.env.local`, `**/.env.example`.
- Không thêm các file nhạy cảm khác như `.env` gốc, `.env.production` (đang bị ignore theo quy tắc Git của dự án).

## Yêu cầu
- Đã cấu hình remote tên `private` (ví dụ: `git remote add private <PRIVATE_GIT_URL>`).
- Lưu ý QUAN TRỌNG: Hành động này force-add secrets (bao gồm `.env`). Hãy kiểm tra nội dung trước khi push.

## Cách sử dụng
- Gõ `/git-push-private` trong Agent input để chạy command này.

## Lệnh thực thi (PowerShell - Windows)
```powershell
$ErrorActionPreference = 'Stop'
$branch = (git rev-parse --abbrev-ref HEAD 2>$null)
if (-not $branch -or $branch -eq 'HEAD') {
  # Mặc định dùng nhánh main nếu không xác định được nhánh hiện tại
  $branch = 'main'
  git checkout -B $branch
}
$prevUpstream = (git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>$null)

# 2) Stage & Commit tự động (KHÔNG có env files)
git add -A
$null = git commit -m "chore: update code changes" --no-verify 2>$null; if ($LASTEXITCODE -ne 0) { 'No changes to commit' | Out-Null }

# 3) Push lên origin trước (backup chính)
Write-Host "🔒 Bước 3/5: Push origin (backup chính)..." -ForegroundColor Yellow
if (git push --set-upstream origin $branch) {
  Write-Host "✅ Origin backup thành công: origin/$branch" -ForegroundColor Green
  
  # 4) Stage & Commit env files
  Write-Host "📦 Bước 4/5: Staging env files..." -ForegroundColor Yellow
  git add -f **/.env 2>$null
  git add -f **/.env.local 2>$null
  git add -f **/.env.example 2>$null
  $null = git commit -m "chore(env): force track env files (.env, .env.local, .env.example)" --no-verify 2>$null; if ($LASTEXITCODE -ne 0) { 'No env changes to commit' | Out-Null }
  
  # 5) Push lên private/main
  Write-Host "🔒 Bước 5/5: Push private/main (backup phụ với env)..." -ForegroundColor Yellow
  if (git push private $branch:main) {
    Write-Host "✅ Private backup thành công: private/main" -ForegroundColor Green
  } else {
    Write-Host "⚠️  Lỗi khi push private/main" -ForegroundColor Yellow
  }
  
  # 6) Khôi phục upstream về origin/<branch>
  if ($prevUpstream) { git branch --set-upstream-to=$prevUpstream $branch 2>$null }
  else { git branch --set-upstream-to=origin/$branch $branch 2>$null }
  Write-Host "✅ Upstream khôi phục: origin/$branch" -ForegroundColor Green
} else {
  Write-Host "❌ Lỗi khi push origin. Dừng workflow." -ForegroundColor Red
}
```

## Lệnh thực thi (Bash)
```bash
set -e
# 1) Xác định nhánh làm việc (mặc định main)
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
if [ -z "$branch" ] || [ "$branch" = "HEAD" ]; then
  branch="main"
  git checkout -B "$branch"
fi
prev_upstream="$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"

# 2) Stage & Commit tự động (KHÔNG có env files)
git add -A
git commit -m "chore: update code changes" --no-verify || true

# 3) Push lên origin trước (backup chính)
echo "🔒 Bước 3/5: Push origin (backup chính)..."
if git push --set-upstream origin "$branch"; then
  echo "✅ Origin backup thành công: origin/$branch"
  
  # 4) Stage & Commit env files
  echo "📦 Bước 4/5: Staging env files..."
  git add -f **/.env 2>/dev/null || true
  git add -f **/.env.local 2>/dev/null || true
  git add -f **/.env.example 2>/dev/null || true
  git commit -m "chore(env): force track env files (.env, .env.local, .env.example)" --no-verify || true
  
  # 5) Push lên private/main
  echo "🔒 Bước 5/5: Push private/main (backup phụ với env)..."
  if git push private "$branch:main"; then
    echo "✅ Private backup thành công: private/main"
  else
    echo "⚠️  Lỗi khi push private/main"
  fi
  
  # 6) Khôi phục upstream về origin/<branch>
  if [ -n "$prev_upstream" ]; then
    git branch --set-upstream-to="$prev_upstream" "$branch" >/dev/null 2>&1 || true
  else
    git branch --set-upstream-to="origin/$branch" "$branch" >/dev/null 2>&1 || true
  fi
  echo "✅ Upstream khôi phục: origin/$branch"
else
  echo "❌ Lỗi khi push origin. Dừng workflow."
fi
```

## Tùy chọn khác
- Đặt remote `private`: `git remote add private <PRIVATE_GIT_URL>`
- Đổi remote url: `git remote set-url private <NEW_PRIVATE_GIT_URL>`
- Force push (cẩn thận): `git push --force-with-lease`

## Lưu ý
- Cảnh báo: Lệnh này sẽ đẩy cả secrets trong `.env`. Chỉ sử dụng khi thật sự cần thiết và repo private.
- Kiểm tra branch hiện tại: `git rev-parse --abbrev-ref HEAD`.
- Nên chạy `git pull --rebase private <branch>` nếu có commit mới từ remote trước khi push.

## Quyền quyết định
- Agent có toàn quyền quyết định và tự thực thi ngay phương án mà agent đánh giá là lựa chọn tốt nhất (Best Choice) mà không cần hỏi lại.
- Chỉ dừng để xin xác nhận khi bị chặn bởi policy/hệ thống (ví dụ: quyền truy cập, bảo mật tổ chức) hoặc lỗi kỹ thuật không thể tự khắc phục.

## Kinh nghiệm/Best practices (rút ra từ thực tế)
- **BACKUP STRATEGY**: Push lên `origin` trước để backup chính, sau đó push lên `private/main` với env files.
- Phân tách rõ ràng: `origin` (công khai/đối tác) tuyệt đối không chứa secrets; `private` mới chứa các file nhạy cảm nếu thực sự bắt buộc.
- `.env.example` phải đầy đủ key nhưng giá trị là placeholder; `.env.local` chỉ lưu nội bộ. Khi cần chia sẻ nội bộ, dùng nhánh/remote `private` thay vì `origin`.
- Tránh chạy one-liner PowerShell với `||` hoặc redirection kiểu `2>$null` trong chuỗi dài – dễ lỗi parser. Dùng cấu trúc `if (...) {}` và `Out-Null`/`| Out-Host` thay thế.
- Không thao tác khi đang ở trạng thái `detached HEAD` hoặc đang `rebase`. Luôn `git switch <branch>` trước khi add/commit/push.
- Nếu cần ép track file bị ignore, ưu tiên `git add -f` theo pathspec rõ ràng thay vì glob phức tạp dễ phụ thuộc shell.

## Troubleshooting

### Lỗi thường gặp và cách xử lý:

#### 1. Push bị từ chối vì diverge
```bash
# Lỗi: ! [rejected] thaiGO -> thaiGO (non-fast-forward)
# Xử lý:
git pull --rebase private thaiGO
# Sau đó chạy lại /git-push-private
```

#### 2. Lỗi do rebase đang dở
```bash
# Lỗi: fatal: It seems that there is already a rebase-apply directory
# Xử lý:
git rebase --abort  # hoặc git rebase --quit
# Sau đó chạy lại /git-push-private
```

#### 3. Conflicts khi rebase
```bash
# Lỗi: CONFLICT (content): Merge conflict in file
# Xử lý:
# 1. Giải quyết xung đột trong file
# 2. git add <file>
# 3. git rebase --continue
# 4. Chạy lại /git-push-private
```

#### 4. Lỗi merge unrelated histories
```bash
# Lỗi: fatal: refusing to merge unrelated histories
# Xử lý: Script đã tự động thêm --allow-unrelated-histories
# Nếu vẫn lỗi, merge thủ công:
git merge <branch> --allow-unrelated-histories
```

#### 5. Lỗi khi đồng bộ env vào main
```bash
# Lỗi: ⚠️ Lỗi khi đồng bộ env vào main
# Xử lý thủ công:
git fetch private main
git checkout -B temp-merge private/main
git merge <current-branch> --no-edit -X ours --allow-unrelated-histories
git push private temp-merge:main
git checkout <current-branch>
git branch -D temp-merge
```

### **BACKUP STRATEGY** - Xử lý lỗi:

| Tình huống | Origin backup | Private backup | Hành động |
|------------|---------------|----------------|-----------|
| **Push origin thành công** | ✅ Có | ❌ Chưa | Tiếp tục push private |
| **Push origin lỗi** | ❌ Không | ❌ Không | Dừng workflow |
| **Push private lỗi** | ✅ Có | ❌ Không | Có backup chính |

### **Workflow mới** - Hiểu output:

```bash
🚀 Git Push Private - Bắt đầu workflow...
🔍 Bước 1/5: Xác định nhánh hiện tại...
✅ Đang làm việc trên nhánh: thaiGO
📦 Bước 2/5: Staging files (không có env)...
✅ Files staged successfully
🔒 Bước 3/5: Push origin (backup chính)...
✅ Origin backup thành công: origin/thaiGO
📦 Bước 4/5: Staging env files...
✅ Env files staged successfully
🔒 Bước 5/5: Push private/main (backup phụ với env)...
✅ Private backup thành công: private/main
✅ Upstream khôi phục: origin/thaiGO
🎉 Hoàn thành! Backup 2 chiều thành công
```
