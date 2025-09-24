# Git Backup ENV Local

Push commits lên remote repository origin.

Lập Curosr TODO, lưu ý Phần nào trước thì phải thực thiện xong trước rồi mới qua Phần tiếp theo, ko được làm song song các Phần:  
  Phần 1 - Lấy tham số
  1) Lấy thời gian mới nhất trong thư mục `.git-backup/env` (theo định dạng hh-mm-dd-MM-yyyy) để làm tên thư mục backup env sẽ phục hồi, ví dụ: `.git-backup/env/<Thời gian mới nhất>`

  Phần 2 - Thực hiện lần lượt các PowerShell (Mỗi số thứ tự là 1 dòng PowerShell duy nhất, không tạo file powershell ps1):
  1) - Backup tất cả các file env từ project vào thư mục `/.git-backup/env/<Thời gian mới nhất>`.
    - Xác định các file env cần backup, ví dụ: `.env`, `.env.local` trong project.
    - Ngoài ra, backup cả file `.cursor/mcp.json` nếu tồn tại.
    - Với mỗi file env và file `.cursor/mcp.json`:
        - Tạo một bản sao và đặt tên thành `BackupName` (có thể thêm prefix để phân biệt module hoặc thư mục).
        - Lưu file này vào thư mục `/.git-backup/env/<Thời gian mới nhất>`.
    - Cập nhật hoặc tạo mới file `metadata.json` trong thư mục backup, chứa thông tin mapping giữa `BackupName` và `OriginalPath`.
        - `BackupName`: tên file đã lưu trong thư mục backup.
        - `OriginalPath`: đường dẫn và tên file gốc trong project.
    - Nhờ vậy, khi cần khôi phục (restore), ta có thể biết rõ file nào trong backup tương ứng với file gốc nào trong project.
    - Ví dụ metadata:
        ```json
        [
            {
            "BackupName": "backend_authentication-identity-service_env_.env",
            "OriginalPath": "backend/authentication-identity-service/env/.env"
            },
            {
            "BackupName": "frontend_env_.env.local",
            "OriginalPath": "frontend/env/.env.local"
            },
            {
            "BackupName": "cursor_mcp.json",
            "OriginalPath": ".cursor/mcp.json"
            }
        ]
        ```
        - File gốc `backend/authentication-identity-service/env/.env` → được lưu thành `backend_authentication-identity-service_env_.env` trong backup.
        - File gốc `frontend/env/.env.local` → được lưu thành `frontend_env_.env.local` trong backup.
        - File gốc `.cursor/mcp.json` → được lưu thành `cursor_mcp.json` trong backup.