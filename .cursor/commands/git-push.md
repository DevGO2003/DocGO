# Git Push

Push commits lên remote repository origin.

Lập Curosr TODO:
  Phần 1 - Lấy tham số
  1) Lấy nhánh hiện tại bằng `git rev-parse --abbrev-ref HEAD`. Nếu đang ở `HEAD`/không xác định thì mặc định là `vibe-coding`. Tạo/chuyển bằng `git checkout -B <branch>` (Cho phép PowerShell).
  2) Đọc những file chuẩn bị đang stage để tóm tắt nội dung tạo biến `<Nội dung commit>`.

  Phần 2 - Thực hiện lần lượt các PowerShell (Mỗi số thứ tự là 1 dòng PowerShell duy nhất):

  1) `git add -A`
     - Stage toàn bộ thay đổi (bao gồm file mới, sửa, xóa).

  2) `git commit -m "<Nội dung commit>" --no-verify`
     - Commit với nội dung đã tóm tắt ở phần 1.
     - Nếu không có gì để commit (commit rỗng), bỏ qua bước này và chuyển sang bước tiếp theo.

  3) `git pull --rebase origin <branch>`
     - Luôn đồng bộ với remote trước khi push để tránh xung đột.
     - Nếu có conflict khi rebase:
       - Sửa file bị conflict.
       - `git add <file>`
       - `git rebase --continue`
       - Nếu conflict phức tạp hoặc nhiều file, lập Cursor TODO ghi lại các file/nội dung conflict để giải quyết dần.
       - Nếu quá khó giải quyết, có thể cân nhắc (hạn chế) dùng `git pull --no-rebase` để merge, nhưng mặc định nên rebase để tránh merge commit thừa.

  4) Kiểm tra nếu local không có commit mới so với remote origin:
     - Nếu không có gì mới để push, bỏ qua bước push, chuyển tới bước gửi thông báo Discord: "Không có gì để push".

  5) `git push origin <branch>`
     - Đẩy commit mới lên remote. Nếu là lần đầu push nhánh này, dùng thêm `-u` (`git push -u origin <branch>`).

  6) Nếu khi push bị chặn do phát hiện secret (ví dụ: lộ file .env, token, key,...):
     - Lưu các file .env, .env.local (không lưu các file loại env trong thư mục git-backup nếu không cần thiết, tránh tạo các bản lưu env phụ không cần thiết.) vào thư mục `/git-backup/env/hh-mm-dd-MM-yyyy` ở gốc dự án, kèm metadata vị trí file. 
     - Dọn lịch sử để loại bỏ secret rồi force-push:
       - Dùng `git filter-repo` (khuyến nghị) hoặc BFG để xóa mọi dấu vết file chứa secret khỏi toàn bộ lịch sử git.
       - Thêm placeholder vào `env/.env.example`, giữ `.env` local và thêm vào `.gitignore`.
       - Sau khi làm sạch lịch sử, force-push: `git push --force origin <branch>`
       - Đưa các phần nội dung bị conflict vào Cursor TODO để giải quyết dần.

  7) Sau khi dọn lịch sử git (ví dụ: dùng git filter-repo hoặc BFG để xóa secret), lấy hướng dẫn gửi thông báo từ .cursor\commands\send-discord-letter.md. Nếu đã cấu hình, thực thi lệnh gửi thông báo lên Discord để thông báo cho team biết lịch sử repo đã được làm sạch và mọi người cần clone lại repo nếu cần thiết.
  