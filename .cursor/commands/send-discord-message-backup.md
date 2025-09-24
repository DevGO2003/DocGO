# Send Discord Message Command

## Mục đích

Gửi thư đến Discord.

## Cách sử dụng

```bash
/send-discord-message
```

## Lệnh dưới đây sẽ bổ sung vào Cursor TODO, lưu ý Phần nào trước thì phải thực thiện xong trước rồi mới qua Phần tiếp theo, ko được làm song song các Phần:

Phần 1: Thiết lập biến môi trường, hãy tìm kiếm file bằng quét repo chứ đừng sài powershell

1. <server>: đọc DISCORD_SERVER_ID từ ".cursor/tools/discord/env/.env"
2. <channel>: đọc DISCORD_CHANNEL_ID từ ".cursor/tools/discord/env/.env"
3. <message>: tóm tắt kết quả câu trả lời trước đó của Cursor AI
4. <you>: xưng hô của Cursor trong Cursor saved memories.
5. <me>: xưng hô của Cursor trong người dùng saved memories.
6. <time>: thời gian hiện tại, định dạng hh:mm:ss | dd-MM-yyyy (cho phép sài powershell để lấy time: powershell -NoProfile -Command "Get-Date -Format 'HH:mm:ss | dd-MM-yyyy'" )
7. <suggetion>: đề xuất cho nội dung công việc tiếp theo từ tóm tắt.
8. # <content>:
   # :mailbox: [THƯ] - Gửi đến <me>


    :clipboard: **Công việc đã hoàn thành**
    <message>

    :bulb: **Đề xuất tiếp theo**
    <suggetion>

    ----------------------------------------
    Trân trọng,
    <you> :crossed_swords:

    :alarm_clock: <time>
    ========================================

9. <webhook>: đọc DISCORD_WEBHOOK_URL từ ".cursor/tools/discord/env/.env"
   Phần 2:
1. Kiểm tra Discord MCP đã hoạt động, nếu không hoạt động thì đợi 2s rồi thử lại (tối đa 3 lần). Nếu thành công thì chuyển sang bước 2. Nếu sau 3 lần vẫn không hoạt động thì chuyển sang bước 3.
1. Gửi tin nhắn bằng Discord MCP với các tham số <server>, <channel>, message: <content>
1. Nếu Discord MCP vẫn chưa sẵn sàng sau 3 lần thử, sử dụng webhook để gửi tin nhắn với lệnh powershell sau:
   Invoke-RestMethod -Uri $webhook -Method Post -ContentType "application/json" -Body (@{ content = <content> } | ConvertTo-Json -Compress)