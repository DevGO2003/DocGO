# Git Push

Push commits lên remote repository origin.

Lập Curosr TODO:
  Phần 1 - Lấy tham số

  1) Chạy `git add -A` để stage toàn bộ thay đổi.

  2) Commit với `git commit -m "<Nội dung commit>" --no-verify` (bỏ qua nếu không có gì để commit).

  3) Luôn luôn đồng bộ với remote trước khi push:
     - Chạy `git pull --rebase origin <branch>`
     - Nếu có conflict khi rebase:
       - Sửa file bị conflict
       - `git add <file>`
       - `git rebase --continue`
       - Nếu rebase quá phức tạp (quá nhiều conflict hoặc khó giải quyết):
         - Lập Cursor TODO để liệt kê các file bị conflict và nội dung conflict.
         - Đưa các phần nội dung bị conflict vào TODO để giải quyết dần.
         - Có thể cân nhắc (nhưng hạn chế thôi nhé) dùng `git pull --no-rebase` để merge, nhưng mặc định nên rebase để tránh merge commit thừa.

  4) Kiểm tra nếu local không có commit mới so với remote origin (tức là không có gì để push):
     - Nếu không có gì mới, bỏ qua các bước push, chuyển tới bước cuối gửi thông báo Discord: "Không có gì để push".

  5) Nếu có commit mới, đẩy lên remote với `git push origin <branch>` (lần đầu có thể thêm `-u`).
  4) Đẩy lên remote với `git push origin <branch>` (lần đầu có thể thêm `-u`).

  Phần 2 - Thực hiện lần lượt các PowerShell (Mỗi số thứ tự là 1 dòng PowerShell duy nhất)
  1) `git add -A`
  2) `git commit -m "<Nội dung commit>" --no-verify` (bỏ qua nếu không có gì để commit)
  3) `git pull --rebase origin <branch>`
  4) Nếu có conflict:
     - Sửa file bị conflict
     - `git add <file>`
     - `git rebase --continue`
     - Nếu conflict phức tạp:
       - Lập Cursor TODO, ghi lại các file/nội dung conflict để xử lý dần.
  5) `git push origin <branch>` (cùng tên nhánh). Lần đầu có thể dùng `-u`.

  Phần 3 - Thông báo discord
  1) Đọc và thực hiện .cursor\commands\send-discord-letter.md

  Gợi ý xử lý lỗi thường gặp:
  - Commit rỗng: Không có thay đổi để commit → bước 2 có thể báo lỗi, tiếp tục bước 3 nếu cần.
  - Nhánh chưa có upstream: Dùng `git push -u origin <branch>` ở lần đầu.
  - Diverged: Thực hiện `git pull --rebase` sau đó lặp lại bước 2-3.
  - Rebase conflict:
    - Sửa file bị conflict
    - `git add <file>`
    - `git rebase --continue`
    - Nếu conflict phức tạp, lập Cursor TODO để ghi lại các file/nội dung conflict và giải quyết dần.
  1) `git add -A`
  2) `git commit -m "<Nội dung commit>" --no-verify` (bỏ qua nếu không có gì để commit)
  3) `git pull --rebase origin <branch>`
  4) Nếu có conflict:
     - Sửa file bị conflict
     - `git add <file>`
     - `git rebase --continue`
  5) `git push origin <branch>` (cùng tên nhánh). Lần đầu có thể dùng `-u`.

  Phần 3 - Thông báo discord
  1) Đọc và thực hiện .cursor\commands\send-discord-letter.md

  Gợi ý xử lý lỗi thường gặp:
  - Commit rỗng: Không có thay đổi để commit → bước 2 có thể báo lỗi, tiếp tục bước 3 nếu cần.
  - Nhánh chưa có upstream: Dùng `git push -u origin <branch>` ở lần đầu.
  - Diverged: Thực hiện `git pull --rebase` sau đó lặp lại bước 2-3.
  - Rebase conflict:
    - Sửa file bị conflict
    - `git add <file>`
    - `git rebase --continue`

Ví dụ nội dung commit tham khảo
- chore: cập nhật hướng dẫn và quy trình `@git-push.md`
- docs: mô tả Part 1/Part 2 và lưu ý an toàn khi push
