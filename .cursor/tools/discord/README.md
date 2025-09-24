# MCP Discord Server

Một máy chủ Model Context Protocol (MCP) để tích hợp Discord với các Mô hình Học Ngôn ngữ (LLMs).

## Tổng quan

Máy chủ MCP Discord cung cấp một bộ công cụ cho phép LLMs tương tác với Discord, bao gồm:

- Gửi tin nhắn đến các kênh Discord
- Đọc tin nhắn từ các kênh Discord
- Đăng ký các lệnh slash cho bot Discord
- Tạo các bộ lắng nghe tin nhắn với các trình xử lý phản hồi tùy chỉnh
- Quản lý các bộ lắng nghe tin nhắn

## Cài đặt

### Yêu cầu

- Node.js 18 trở lên
- Mã thông báo bot Discord (xem phần Tạo Bot Discord)

### Thiết lập

1. Clone kho lưu trữ:

   ```bash
   git clone https://github.com/yourusername/mcp-discord.git
   cd mcp-discord
   ```

2. Cài đặt các phụ thuộc:

   ```bash
   npm install
   ```

3. Xây dựng dự án:

   ```bash
   npm run build
   ```

4. Tạo tệp `.env` trong thư mục gốc với mã thông báo bot Discord của bạn:

   ```
   DISCORD_TOKEN=your_discord_bot_token
   LOG_LEVEL=info
   ```

5. Khởi động máy chủ:

   ```bash
   npm start
   ```

## Tạo Bot Discord

1. Truy cập [Discord Developer Portal](https://discord.com/developers/applications)
2. Nhấp vào "New Application" và đặt tên cho ứng dụng
3. Chuyển đến tab "Bot" và nhấp vào "Add Bot"
4. Dưới phần "TOKEN", nhấp vào "Copy" để sao chép mã thông báo bot của bạn
5. Bật các Intent Gateway Đặc quyền sau:
   - Server Members Intent
   - Message Content Intent
6. Chuyển đến tab "OAuth2", sau đó "URL Generator"
7. Chọn các phạm vi sau:
   - bot
   - applications.commands
8. Chọn các quyền bot sau:
   - Send Messages
   - Read Message History
   - Add Reactions
   - Use Slash Commands
9. Sao chép URL được tạo và mở nó trong trình duyệt của bạn để thêm bot vào máy chủ của bạn

## Cấu hình

Máy chủ có thể được cấu hình bằng cách sử dụng các biến môi trường hoặc bằng cách chỉnh sửa tệp `config.ts`:

| Biến                 | Mô tả                                           | Mặc định       |
|----------------------|-------------------------------------------------|----------------|
| `DISCORD_TOKEN`      | Mã thông báo bot Discord                        | -              |
| `LOG_LEVEL`          | Mức độ ghi log (error, warn, info, debug)       | info           |
| `CLEANUP_INTERVAL`   | Khoảng thời gian (ms) để dọn dẹp các client không hoạt động | 1800000 (30 phút) |
| `MAX_RETRIES`        | Số lần thử lại tối đa cho các hoạt động         | 3              |
| `RETRY_BASE_DELAY`   | Độ trễ cơ bản (ms) cho các hoạt động thử lại    | 1000           |

## Các công cụ có sẵn

### send-message

Gửi tin nhắn đến một kênh Discord.

**Tham số:**

- `server` (tùy chọn): Tên hoặc ID máy chủ (tùy chọn nếu bot chỉ ở trong một máy chủ)
- `channel`: Tên kênh (ví dụ: "general") hoặc ID
- `message`: Tin nhắn cần gửi

**Ví dụ:**

```json
{
  "server": "My Discord Server",
  "channel": "general",
  "message": "Hello from MCP Discord!"
}
```

### read-messages

Đọc các tin nhắn gần đây từ một kênh Discord.

**Tham số:**

- `server` (tùy chọn): Tên hoặc ID máy chủ (tùy chọn nếu bot chỉ ở trong một máy chủ)
- `channel`: Tên kênh (ví dụ: "general") hoặc ID
- `limit` (tùy chọn): Số lượng tin nhắn cần lấy (mặc định: 50, tối đa: 100)

**Ví dụ:**

```json
{
  "server": "My Discord Server",
  "channel": "general",
  "limit": 10
}
```

### register-commands

Đăng ký các lệnh slash cho bot Discord.

**Tham số:**

- `server` (tùy chọn): ID máy chủ để đăng ký lệnh (tùy chọn, nếu không cung cấp, lệnh sẽ được đăng ký toàn cầu)

**Ví dụ:**

```json
{
  "server": "123456789012345678"
}
```

### create-listener

Tạo một bộ lắng nghe tin nhắn mới với các từ khóa và trình xử lý phản hồi được xác định trước.

**Tham số:**

- `server` (tùy chọn): Tên hoặc ID máy chủ
- `channel` (tùy chọn): Tên hoặc ID kênh
- `keywords`: Mảng các từ khóa cần lắng nghe
- `handlerId`: ID của trình xử lý phản hồi cần sử dụng
- `handlerOptions` (tùy chọn): Các tùy chọn cho trình xử lý phản hồi
- `description` (tùy chọn): Mô tả cho bộ lắng nghe này

**Ví dụ:**

```json
{
  "server": "My Discord Server",
  "channel": "general",
  "keywords": ["hello", "hi"],
  "handlerId": "ack",
  "description": "Responds to greetings"
}
```

### remove-listener

Xóa một bộ lắng nghe tin nhắn hiện có.

**Tham số:**

- `listenerId`: ID của bộ lắng nghe cần xóa

**Ví dụ:**

```json
{
  "listenerId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### list-listeners

Liệt kê tất cả các bộ lắng nghe tin nhắn đang hoạt động.

**Tham số:** Không có

### list-handlers

Liệt kê tất cả các trình xử lý phản hồi có sẵn.

**Tham số:** Không có

## Trình xử lý phản hồi

Trình xử lý phản hồi xác định cách bot phản hồi các tin nhắn khớp với các từ khóa trong bộ lắng nghe. Máy chủ đi kèm với các trình xử lý sau:

### ack

Một trình xử lý xác nhận đơn giản phản hồi người dùng với một tin nhắn xác nhận đơn giản.

## Tạo trình xử lý phản hồi tùy chỉnh

Bạn có thể tạo các trình xử lý phản hồi tùy chỉnh bằng cách thêm các tệp mới vào thư mục `handlers` và triển khai giao diện `ResponseHandler`.
