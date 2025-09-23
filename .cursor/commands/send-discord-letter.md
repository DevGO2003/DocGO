# Send Discord Letter Command

## Mục đích
Gửi thư đến Discord.

## Cách sử dụng
```bash
/send-discord-letter
```

---

## Template thư

```
========================================
:mailbox: [THƯ] - Gửi đến Quý ngài {{TEN_TA}}
========================================

:clipboard: **Công việc đã hoàn thành**  
{{TOM_TAT}}

:bulb: **Đề xuất tiếp theo**  
{{DE_XUAT}}

----------------------------------------
Trân trọng,  
{{TEN_NGUOI}} :crossed_swords:

:alarm_clock: {{TIME}} | {{DATE}}
========================================
```

## Yêu cầu môi trường
- Biến `DISCORD_WEBHOOK_URL` nằm trong file `tools/discord/env/.env` theo định dạng: `DISCORD_WEBHOOK_URL=<discord webhook>`

## Hướng dẫn gửi nhanh bằng PowerShell (ví dụ)

Lệnh dưới đây sẽ bổ sung vào Curosr TODO:
Lập Curosr TODO:
  Phần 1 - Lấy tham số

  1) Sử dụng Cursor để quét repo, tìm kiếm file `.cursor\tools\discord\env\.env` và đọc giá trị `DISCORD_WEBHOOK_URL` từ file này (không dùng PowerShell để đọc file mà hãy dùng Cursor AI).

  2) Tạo nội dung thư theo template ở trên

  Phần 2 - Thực hiện lần lượt các PowerShell (Mỗi số thứ tự là 1 dòng PowerShell duy nhất)

  1) Gửi tin nhắn đến Discord bằng webhook, bắt buộc sử dụng cấu cấu trúc template :

  ```powershell
  $envPath = "tools/discord/env/.env"
  $webhook = (Get-Content $envPath | Where-Object { $_ -match '^DISCORD_WEBHOOK_URL=' } | ForEach-Object { $_.Split('=')[1] })

  # Điền các trường tên và nội dung
  $tenTa = "<TEN_TA>"
  $tenNguoi = "<TEN_NGUOI>"
  $tomTat = "<TOM_TAT>"
  $deXuat = "<DE_XUAT>"

  $time = Get-Date -Format "HH:mm:ss"
  $date = Get-Date -Format "yyyy-MM-dd"

  $message = @"
  ========================================
  :mailbox: [THƯ] - Gửi đến Quý ngài $tenTa
  ========================================

  :clipboard: **Công việc đã hoàn thành**  
  $tomTat

  :bulb: **Đề xuất tiếp theo**  
  $deXuat

  ----------------------------------------
  Trân trọng,  
  $tenNguoi :crossed_swords:

  :alarm_clock: $time | $date
  ========================================
  "@

  Invoke-RestMethod -Uri $webhook -Method Post -ContentType "application/json" -Body (@{ content = $message } | ConvertTo-Json -Compress)
  ```

  Lưu ý:
  - Quote đầy đủ đường dẫn có khoảng trắng
  - Không gộp quá nhiều lệnh phức tạp trong một dòng; chạy từng bước nếu cần
  - Gửi nội dung thì sử dụng JSON UTF-8 bytes

## Ví dụ sau khi thực hiện TODO xong bạn sẽ có được đoạn Powershell để dán, chạy trực tiếp như sau:
  $ $envPath = "tools/discord/env/.env"; $webhook = (Get-Content $envPath | Where-Object { $_ -match '^DISCORD_WEBHOOK_URL=' } | ForEach-Object { $_.Split('=')[1].Trim() }); $tenTa = "Thái Gõ"; $tenNguoi = "Moe Moe"; $tomTat = "Đã đọc webhook từ .env, nạp quy tắc PowerShell, cập nhật file send-discord-letter.md với template và hướng dẫn."; $deXuat = "Chuẩn hóa tham số lệnh /send-discord-letter và ẩn webhook bằng env; bổ sung logging và retry."; $time = Get-Date -Format "HH:mm:ss"; $date = Get-Date -Format "yyyy-MM-dd"; $message = "========================================`n:mailbox: [THƯ] - Gửi đến Quý ngài $tenTa`n========================================`n`n:clipboard: **Công việc đã hoàn thành**  `n$tomTat`n`n:bulb: **Đề xuất tiếp theo**  `n$deXuat`n`n----------------------------------------`nTrân trọng,  `n$tenNguoi :crossed_swords:`n`n:alarm_clock: $time | $date`n========================================"; $json = @{ content = $message } | ConvertTo-Json -Compress -Depth 4; $bytes = [System.Text.Encoding]::UTF8.GetBytes($json); Invoke-RestMethod -Uri $webhook -Method Post -ContentType "application/json; charset=utf-8" -Body $bytes
