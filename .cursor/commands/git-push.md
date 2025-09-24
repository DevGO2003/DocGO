# Git Push

## Mục đích
Gửi tất cả commits lên remote origin

## Cách sử dụng
```bash
/git-push
```

## Trước khi thực hiện:
  1) Đọc '@10_powershell-terminal-standards.mdc' trong repo

## Lệnh dưới đây sẽ bổ sung vào Cursor TODO, lưu ý Phần nào trước thì phải thực thiện xong trước rồi mới qua Phần tiếp theo, ko được làm song song các Phần: 
  Phần 1: Thiết lập biến môi trường, hãy tìm kiếm file bằng quét repo chứ đừng sài powershell
  1) <origin>: đọc REMOTE_ORIGIN từ ".cursor/tools/github/env/.env"
  2) <destination-branch>: tham số thứ nhất, nếu không có tham số: mặc định nhánh hiện tại
  3) <current-branch>: nhánh hiện tại, nếu không xác định: mặc định tạo vibe-coding
  4) <message>: đọc những file chuẩn bị đang stage để tóm tắt nội dung
  5) <restore>: file trong đường dẫn ".cursor\commands\git-restore-env-local.md"
  6) <backup>: file trong đường dẫn ".cursor\commands\git-backup-env.md"
  7) <mcp-discord>: file trong đường dẫn ".cursor\commands\send-discord-message.md"

  Phần 2 - Thực hiện lần lượt các PowerShell (Mỗi số thứ tự là 1 dòng PowerShell duy nhất, không tạo file powershell ps1):
  1) `git add -A`
  2) `git status -s` sau đó tóm tắt thay đổi và gắn vào biến <message>
  3) `git commit -m "<message>" --no-verify`
  4) `git pull --rebase <origin> <current-branch>`
     - Nếu có conflict khi rebase:
       - Sửa file bị conflict.
       - `git add <file>`
       - `git rebase --continue`
       - Nếu conflict phức tạp hoặc nhiều file, lập Cursor TODO ghi lại các file/nội dung conflict để giải quyết dần.
       - Nếu quá khó giải quyết, có thể cân nhắc (hạn chế) dùng `git pull --no-rebase` để merge, nhưng mặc định nên rebase để tránh merge commit thừa.
  5) Kiểm tra nếu local không có commit mới so với remote <origin>: chuyển tới Phần 3.
  6) `git push <origin> <current-branch>`
     - Đẩy commit mới lên remote. Nếu là lần đầu push nhánh này, dùng thêm `-u` (`git push -u <origin> <branch>`).
  7) Nếu khi push bị chặn do phát hiện secret (ví dụ: lộ file .env, token, key,...):
     - Đọc và thực hiện <backup>
     - Dọn lịch sử để loại bỏ secret rồi force-push:
       - Dùng `git filter-repo` (khuyến nghị) hoặc BFG để xóa mọi dấu vết file chứa secret khỏi toàn bộ lịch sử git.
       - Sau khi làm sạch lịch sử, force-push: `git push --force <origin> <branch>`
       - Đưa các phần nội dung bị conflict vào Cursor TODO để giải quyết dần.
     - Sau khi push thành công, đọc và thực hiện <restore>.

  Phần 3 - Đọc và thực hiện <mcp-discord> với tham số message: <message>