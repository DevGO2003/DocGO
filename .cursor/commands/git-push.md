# Git Push

## Mục đích
Gửi tất cả commits lên remote origin

## ⚠️ QUY TẮC QUAN TRỌNG
- **LUÔN LUÔN push lên `origin` remote** (không bao giờ chuyển sang `private`)
- **Nếu branch không tồn tại trên origin**: Tạo mới trước khi pull
- **Không được fallback sang private** khi gặp lỗi branch không tồn tại
- **Mục đích**: Đảm bảo code được push đúng repository công khai

## Cách sử dụng
```bash
/git-push <destination-branch>
```
  1) Nếu không có tham số: mặc định push nhánh hiện tại.
  2) Nếu có tham số <destination-branch>: ngoài việc push nhánh hiện tại, đồng thời push sang <destination-branch>.

## Trước khi thực hiện:
  1) Đọc '@10_powershell-terminal-standards.mdc' trong repo

## Lệnh dưới đây sẽ bổ sung vào Cursor TODO, lưu ý Phần nào trước thì phải thực thiện xong trước rồi mới qua Phần tiếp theo, ko được làm song song các Phần: 
  Phần 1: Thiết lập biến môi trường, hãy tìm kiếm file bằng quét repo chứ đừng sài powershell
  1) <origin>: đọc REMOTE_ORIGIN từ ".cursor/tools/github/env/.env"
  2) <destination-branch>: tham số thứ nhất, nếu không có tham số: mặc định nhánh hiện tại
  3) <current-branch>: đọc từ file ".git/HEAD" (format: "ref: refs/heads/<branch-name>"), nếu không xác định: mặc định tạo vibe-coding
  4) <message>: đọc những file chuẩn bị đang stage để tóm tắt nội dung
  5) <restore>: file trong đường dẫn ".cursor\commands\git-restore-env-local.md"
  6) <backup>: file trong đường dẫn ".cursor\commands\git-backup-env.md"
  7) <mcp-discord>: file trong đường dẫn ".cursor\commands\send-discord-message.md"

  Phần 2 - Thực hiện lần lượt các PowerShell (Mỗi số thứ tự là 1 dòng PowerShell duy nhất, không tạo file powershell ps1):
  1) `git add -A`
  2) `git status -s` sau đó tóm tắt thay đổi và gắn vào biến <message>
  3) `git commit -m "[origin-push] <message>" --no-verify`
  4) `git fetch <origin>`
  5) **KIỂM TRA VÀ TẠO BRANCH TRÊN ORIGIN** (QUAN TRỌNG: Luôn push lên origin, không bao giờ chuyển sang private):
     - `git ls-remote <origin> | grep <current-branch>`
     - **Nếu branch không tồn tại trên origin**: 
       - `git push -u <origin> <current-branch>` (tạo branch mới trên origin)
       - Sau khi tạo thành công: tiếp tục bước 6
     - **Nếu branch đã tồn tại**: tiếp tục bước 6
     - **Nếu lỗi quyền truy cập origin**: Dừng và báo lỗi, KHÔNG chuyển sang private
  6) `git pull --rebase <origin> <current-branch>`
     - Nếu có conflict khi rebase:
       - Sửa file bị conflict.
       - `git add <file>`
       - `git rebase --continue`
       - Nếu conflict phức tạp hoặc nhiều file, lập Cursor TODO ghi lại các file/nội dung conflict để giải quyết dần.
       - Nếu quá khó giải quyết, có thể cân nhắc (hạn chế) dùng `git pull --no-rebase` để merge, nhưng mặc định nên rebase để tránh merge commit thừa.
  7) Kiểm tra nếu local không có commit mới so với remote <origin>: chuyển tới Phần 3.
  8) `git push <origin> <current-branch>`
     - Nếu là lần đầu push nhánh này, dùng thêm `-u` (`git push -u <origin> <current-branch>`).
     - Nếu có tham số `<destination-branch>`:  
       - Push cả hai:
         - `git push <origin> <current-branch>`
         - `git push <origin> <current-branch>:<destination-branch>`
       - Nếu `<destination-branch>` chưa tồn tại, lệnh trên sẽ tạo mới.
       - Nếu muốn theo dõi (tracking branch):  
         - `git push -u <origin> <current-branch>`
         - `git push -u <origin> <current-branch>:<destination-branch>`

  9) Nếu khi push bị chặn do phát hiện secret (ví dụ: lộ file .env, token, key,...):
     - Đọc và thực hiện <backup>
     - Dọn lịch sử để loại bỏ secret bằng `git filter-repo` (khuyến nghị):
       - Cài đặt (nếu chưa có): `python -m pip install --upgrade git-filter-repo`
       - Xóa hoàn toàn các file nhạy cảm khỏi lịch sử (ví dụ):
         - PowerShell (chạy tại root repo):
           - `git filter-repo --force --invert-paths --path .cursor/mcp.json --path .cursor/tools/github/env/.env --path .cursor/tools/discord/env/.env --path backend/user-management-service/env/.env`
       - Nếu cần xóa cả giá trị hardcode trong 1 file cụ thể theo regex (ví dụ GOOGLE_* trong docker-compose.yml), cân nhắc tạm thời xóa file đó khỏi lịch sử rồi commit lại phiên bản sạch hiện tại:
           - `git filter-repo --force --invert-paths --path docker-compose.yml`
           - Add lại file sạch hiện tại và commit
     - Sau đó force-push:  
       `git push --force <origin> <current-branch>`  
       Nếu có `<destination-branch>`:  
       `git push --force <origin> <current-branch>:<destination-branch>`
     - Sau khi push thành công, đọc và thực hiện <restore>.

  Phần 3 - Đọc và thực hiện <mcp-discord> với tham số message: <message>
