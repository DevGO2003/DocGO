# Git Push

Push commits lên remote repository.

## Mô tả
- Tự động và không yêu cầu xác nhận.
- Xác định nhánh hiện tại; nếu không xác định được sẽ tự chọn theo danh tính dev:
  - Nếu user là “thaiGO” → dùng nhánh `thaiGO`
  - Nếu user là “LocTruongLuan” → dùng nhánh `LocTruongLuan`
  - Nếu nhánh chưa tồn tại → tự tạo mới (`git checkout -B <branch>`)
- Tự động add/commit trước khi push.

## Cách sử dụng
Gõ /git-push trong Agent input để chạy command này.

## Lệnh thực thi (PowerShell - Windows)
```powershell
$ErrorActionPreference = 'Stop'
# 1) Xác định nhánh làm việc
$branch = (git rev-parse --abbrev-ref HEAD 2>$null)
if (-not $branch -or $branch -eq 'HEAD') {
  $user = (git config user.name 2>$null); if (-not $user) { $user = $env:USERNAME }
  if ($user -match 'thai' -or $user -match 'thaiGO') { $branch = 'thaiGO' }
  elseif ($user -match 'LocTruongLuan' -or $user -match 'Luan') { $branch = 'LocTruongLuan' }
  else { $branch = 'thaiGO' }
  git checkout -B $branch
}

# 2) Stage & Commit tự động
git add -A
$null = git commit -m "chore: push pending changes" --no-verify 2>$null; if ($LASTEXITCODE -ne 0) { 'No changes to commit' | Out-Null }

# 3) Push lên origin cùng tên nhánh
git push origin $branch
```

## Lệnh thực thi (Bash)
```bash
set -e
# 1) Xác định nhánh làm việc
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
if [ -z "$branch" ] || [ "$branch" = "HEAD" ]; then
  user="$(git config user.name 2>/dev/null || echo "$USER")"
  if echo "$user" | grep -qi "thai"; then branch="thaiGO"
  elif echo "$user" | grep -qi "LocTruongLuan\|Luan"; then branch="LocTruongLuan"
  else branch="thaiGO"; fi
  git checkout -B "$branch"
fi

# 2) Stage & Commit tự động
git add -A
git commit -m "chore: push pending changes" --no-verify || true

# 3) Push lên origin cùng tên nhánh
git push origin "$branch"
```

## Tùy chọn khác
- Push branch cụ thể: git push origin <branch-name>
- Push và set upstream: git push -u origin <branch-name>
- Force push (cẩn thận): git push --force-with-lease

## Lưu ý
- Đảm bảo đã commit trước khi push
- Kiểm tra branch hiện tại với git-status
- Sử dụng git-pull để sync trước khi push
- Không force push trên main/master branch
