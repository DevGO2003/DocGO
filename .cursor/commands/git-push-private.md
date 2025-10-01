# Git Push Private Command

## Mục đích

Gửi tất cả commits (bao gồm cả file nhạy cảm như .env*, mcp.json, token, key, …) lên remote private

## Cách sử dụng
```bash
/git-push-private <destination-branch>
```
  1) Nếu không có tham số: mặc định push nhánh hiện tại.
  2) Nếu có tham số <destination-branch>: ngoài việc push nhánh hiện tại, đồng thời push sang <destination-branch>.

## Trước khi thực hiện:
  1) Đọc '@10_powershell-terminal-standards.mdc' trong repo

## Lệnh dưới đây sẽ bổ sung vào Cursor TODO, lưu ý Phần nào trước thì phải thực thiện xong trước rồi mới qua Phần tiếp theo, ko được làm song song các Phần:
  Phần 1: Thiết lập biến môi trường, hãy tìm kiếm file bằng quét repo chứ đừng sài powershell
  1) <origin>: đọc REMOTE_ORIGIN từ ".cursor/tools/github/env/.env"
  2) <private>: đọc REMOTE_PRIVATE từ ".cursor/tools/github/env/.env"
  3) <destination-branch>: tham số thứ nhất, nếu không có tham số: mặc định nhánh hiện tại
  4) <current-branch>: đọc từ file ".git/HEAD" (format: "ref: refs/heads/<branch-name>"), nếu không xác định: mặc định tạo vibe-coding
  5) <message>: đọc những file chuẩn bị đang stage để tóm tắt nội dung
  6) <restore>: file trong đường dẫn ".cursor\commands\git-restore-env-local.md"
  7) <backup>: file trong đường dẫn ".cursor\commands\git-backup-env.md"
  8) <mcp-discord>: file trong đường dẫn ".cursor\commands\send-discord-message.md"
  9) <push-origin>: file trong đường dẫn ".cursor\commands\git-push.md"

  Phần 2 - Đọc và thực hiện <push-origin>

  Phần 3 - Thực hiện lần lượt các PowerShell (Mỗi số thứ tự là 1 dòng PowerShell duy nhất, không tạo file powershell ps1):
  1) Quét toàn bộ repo để tìm các file nhạy cảm (.env*, mcp.json, ...) và đảm bảo chúng được add vào stage:
     - Sử dụng lệnh như sau (PowerShell):
       - `git add -A`
    2) Sau đó, với mỗi file nhạy cảm tìm được (ví dụ: qua lệnh `Get-ChildItem -Recurse -Include .env*,mcp.json,token*,key*`), thực hiện `git add <file>`
    3) **QUAN TRỌNG**: Force add thư mục backup để đảm bảo backup được push lên private:
       - `git add -f .git-backup/` (force add toàn bộ thư mục backup)
       - Lưu ý: Thư mục .git-backup thường bị .gitignore nên cần dùng -f để force add
  2) `git status -s` sau đó tóm tắt thay đổi và gắn vào biến <message>
  3) `git commit -m "[private-push] <message>" --no-verify`
  5) Kiểm tra nếu local không có commit mới so với remote <private>: chuyển tới Phần 3.
  6) Khi push các file nhạy cảm (.env*, token, ...), nếu các file này đã bị .gitignore thì cần dùng `git add -f <file>` (hoặc `git add --force <file>`) để ép add vào stage, hoặc đảm bảo .gitignore không chặn các file này.
     - Để push lên remote private:
       - Bình thường: `git push <private> <current-branch>`
       - Nếu là lần đầu push nhánh này: `git push -u <private> <current-branch>`
       - Nếu có tham số `<destination-branch>`: thực hiện cả 2 lệnh sau để đảm bảo push lên cả hai branch:
           + `git push <private> <current-branch>`
           + `git push <private> <current-branch>:<destination-branch>` (nếu branch chưa tồn tại sẽ tự tạo mới)
         - Nếu muốn theo dõi (tracking branch) cho `<destination-branch>`: `git push -u <private> <current-branch>:<destination-branch>`
      - Nếu cần ghi đè (overwrite) branch trên remote (ví dụ: khi cần force update file nhạy cảm hoặc branch local đã rebase): dùng lệnh sau để force push:
          + `git push <private> <current-branch> --force`
          + (tuỳ chọn) `git push <private> <current-branch>:<destination-branch> --force`
        (lưu ý: --force sẽ ghi đè lịch sử nhánh trên remote, hãy sử dụng khi chắc chắn)
     - Nếu gặp conflict phức tạp hoặc nhiều file, lập Cursor TODO ghi lại các file/nội dung conflict để giải quyết dần.
     - Khi push env, hệ thống merge giá trị theo rule:
         + Database → ưu tiên remote (DATABASE_URL, MONGODB_URI).
         + API key, Secret → ưu tiên local (API_KEY, SECRET).
         + Port/Host → ưu tiên local (SERVER_PORT).
         + Debug flag → hợp nhất logic (true nếu một bên true).
     - Nếu quá khó giải quyết, có thể cân nhắc (hạn chế) dùng `git push --no-rebase` để merge, nhưng mặc định nên rebase để tránh merge commit thừa.
  7) Sau khi push xong, thực hiện các bước sau để đảm bảo lấy về bản mới nhất của tất cả file nhạy cảm (không chỉ .env* mà còn mcp.json và backup):
     - Đầu tiên, chạy: `git fetch <private>`
     - Sau đó, dùng lệnh (ưu tiên git restore thay cho git checkout để tránh warning):
       - `git restore --source <private>/<current-branch> -- .env* mcp.json token* key* .git-backup/ || true`
     - Nếu có nhiều file nhạy cảm khác, lặp lại lệnh trên cho từng file cần thiết hoặc bổ sung pattern tương ứng.
     - **QUAN TRỌNG**: Thư mục .git-backup cũng cần được sync từ remote để đảm bảo backup mới nhất.
     - Lưu ý: Nếu file nhạy cảm chưa từng tồn tại trên remote, lệnh trên sẽ báo lỗi "pathspec did not match any files", nhưng nhờ `|| true` nên script không bị dừng.
     - Đảm bảo sau khi thực hiện, các giá trị của toàn bộ file nhạy cảm local đã được cập nhật theo remote.

  Phần 4 - Đọc và thực hiện <mcp-discord> với tham số message: <message>