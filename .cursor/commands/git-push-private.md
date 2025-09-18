# Git Push Private

Đẩy nhánh hiện tại lên remote `private`, kèm TẤT CẢ file env theo yêu cầu: `.env`, `.env.local`, `.env.example` (force track kể cả khi bị .gitignore).

## Mô tả
- Tự động và không yêu cầu xác nhận.
- Xác định nhánh hiện tại; nếu không xác định được sẽ tự chọn theo danh tính dev:
  - Nếu user là “thaiGO” → dùng nhánh `thaiGO`
  - Nếu user là “LocTruongLuan” → dùng nhánh `LocTruongLuan`
  - Nếu nhánh chưa tồn tại → tự tạo mới (`git checkout -B <branch>`)
- Push lên remote `private` cùng tên nhánh, sau đó khôi phục upstream về `origin/<branch>` để tiếp tục làm việc trên origin.
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
# 1) Xác định nhánh làm việc
$branch = (git rev-parse --abbrev-ref HEAD 2>$null)
if (-not $branch -or $branch -eq 'HEAD') {
  $user = (git config user.name 2>$null); if (-not $user) { $user = $env:USERNAME }
  if ($user -match 'thai' -or $user -match 'thaiGO') { $branch = 'thaiGO' }
  elseif ($user -match 'LocTruongLuan' -or $user -match 'Luan') { $branch = 'LocTruongLuan' }
  else { $branch = 'thaiGO' }
  git checkout -B $branch
}
$prevUpstream = (git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>$null)

# 2) Stage & Commit tự động
git add -A
git add -f **/.env 2>$null
git add -f **/.env.local 2>$null
git add -f **/.env.example 2>$null
$null = git commit -m "chore(env): force track env files (.env, .env.local, .env.example)" --no-verify 2>$null; if ($LASTEXITCODE -ne 0) { 'No changes to commit' | Out-Null }

# 3) Push lên remote private cùng tên nhánh
if (git push --set-upstream private $branch) {
  # 4) Khôi phục upstream về origin/<branch>
  if ($prevUpstream) { git branch --set-upstream-to=$prevUpstream $branch 2>$null }
  else { git branch --set-upstream-to=origin/$branch $branch 2>$null }
}
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
prev_upstream="$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"

# 2) Stage & Commit tự động
git add -A
git add -f **/.env 2>/dev/null || true
git add -f **/.env.local 2>/dev/null || true
git add -f **/.env.example 2>/dev/null || true
git commit -m "chore(env): force track env files (.env, .env.local, .env.example)" --no-verify || true

# 3) Push lên remote private cùng tên nhánh
if git push --set-upstream private "$branch"; then
  # 4) Khôi phục upstream về origin/<branch>
  if [ -n "$prev_upstream" ]; then
    git branch --set-upstream-to="$prev_upstream" "$branch" >/dev/null 2>&1 || true
  else
    git branch --set-upstream-to="origin/$branch" "$branch" >/dev/null 2>&1 || true
  fi
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
