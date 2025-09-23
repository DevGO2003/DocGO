# Send Discord Letter Command

## Mục đích
Gửi thư báo cáo công việc đã hoàn thành đến Discord.

## Cách sử dụng
```bash
/send-discord-letter
```

## Cách hoạt động
- Command này sẽ tự động chạy file PowerShell `.cursor/scripts/reusable/send-discord-letter.ps1`.
- Tham số webhook bạn đọc ở `tools/discord/env/.env` key `DISCORD_WEBHOOK_URL`.
- Tự động truyền tham số còn lại phù hợp dựa trên context hiện tại.