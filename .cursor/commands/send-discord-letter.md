# Send Discord Letter Command

## Mục đích
Gửi thư báo cáo công việc đã hoàn thành đến Discord.

## Cách sử dụng
```bash
/send-discord-letter
```

## Cách hoạt động
- Command này sẽ tự động chạy file PowerShell `.cursor/scripts/reusable/send-discord-letter.ps1`
- Tự động truyền tham số phù hợp dựa trên context hiện tại, chi tiết webhook sẽ nằm ở bên dưới.
- Script tự động đọc webhook từ file `.env` cục bộ:
  - Đường dẫn: `tools/discord/env/.env`
  - Key: `DISCORD_WEBHOOK_URL`
  - **Lưu ý**: Webhook URL phải được cấu hình trong file `tools\discord\env\.env`
