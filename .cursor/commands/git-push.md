# Git Push

Push commits lên remote repository origin.

Mục tiêu: Tự động hóa việc push thay đổi lên `origin` đúng nhánh, với quy trình rõ ràng, an toàn và không yêu cầu tương tác thủ công.

Phần 1 - Lấy tham số
1) Lấy nhánh hiện tại bằng `git rev-parse --abbrev-ref HEAD`. Nếu đang ở `HEAD`/không xác định thì mặc định là `vibe-coding`. Tạo/chuyển bằng `git checkout -B <branch>` (Cho phép PowerShell).
2) Đọc những file chuẩn bị đang stage để tóm tắt nội dung tạo biến `<Nội dung commit>`.

Phần 2 - Thực hiện lần lượt các PowerShell (Mỗi số thứ tự là 1 dòng PowerShell duy nhất)
1) `git add -A`
2) `git commit -m "<Nội dung commit>" --no-verify` (bỏ qua nếu không có gì để commit)
3) `git push origin <branch>` (cùng tên nhánh). Lần đầu có thể dùng `-u`.

Phần 3 - Thông báo discord
1) Đọc và thực hiện .cursor\commands\send-discord-letter.md

Lưu ý/Best practices
- Không force push nhánh `main/master`.
- Nên `git pull --rebase` nếu nhánh diverge.
- Tránh đẩy secrets; chỉ đẩy `.env.example`.
- Khắc phục lỗi GH Push Protection, rebase dở dang… theo phần Troubleshooting.

Ví dụ nội dung commit tham khảo
- chore: cập nhật hướng dẫn và quy trình `@git-push.md`
- docs: mô tả Part 1/Part 2 và lưu ý an toàn khi push

Gợi ý xử lý lỗi thường gặp
- Commit rỗng: Không có thay đổi để commit → bước 2 có thể báo lỗi, tiếp tục bước 3 nếu cần.
- Nhánh chưa có upstream: Dùng `git push -u origin <branch>` ở lần đầu.
- Diverged: Thực hiện `git pull --rebase` sau đó lặp lại bước 2-3.

