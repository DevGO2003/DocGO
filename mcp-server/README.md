# MongoDB MCP Server cho DocGO

## 📋 Tổng quan

Thư mục này chứa MongoDB MCP Server để giao tiếp với MongoDB Atlas thông qua Model Context Protocol (MCP). Đây là giải pháp thay thế cho việc MongoDB Atlas không cung cấp MCP adapter chính thức.

## 🚀 Cài đặt

### Phương pháp 1: Docker (Khuyến nghị)

MCP Server đã được tích hợp vào Docker Compose local:

```bash
# Chạy MCP Server cùng với các services khác
docker-compose -f docker-compose.local.yml up mongodb-mcp-server

# Hoặc chạy tất cả services
docker-compose -f docker-compose.local.yml up
```

MCP Server sẽ chạy tại: `http://localhost:8005`

### Phương pháp 2: Cài đặt trực tiếp

```bash
# Cài đặt global
npm install -g mongodb-mcp-server

# Hoặc sử dụng npx (khuyến nghị)
npx -y mongodb-mcp-server@latest
```

### 2. Cấu hình Cursor

Copy nội dung file `cursor-mcp-config.json` vào file cấu hình MCP của Cursor:

**Windows**: `%APPDATA%\Cursor\User\globalStorage\cursor.mcp\settings.json`
**macOS**: `~/Library/Application Support/Cursor/User/globalStorage/cursor.mcp/settings.json`
**Linux**: `~/.config/Cursor/User/globalStorage/cursor.mcp/settings.json`

## ⚙️ Cấu hình

### Connection String

MongoDB MCP Server đã được cấu hình với connection string của DocGO:

```
mongodb+srv://root:sapassword@devgo-docgo-cluster0.hsudzga.mongodb.net/?retryWrites=true&w=majority&appName=devgo-docgo-cluster0
```

### Các tùy chọn cấu hình

- `--readOnly`: Chế độ chỉ đọc (an toàn)
- `--loggers mcp,disk`: Ghi log vào MCP client và file
- `--indexCheck`: Kiểm tra index khi query

## 🛠️ Các công cụ hỗ trợ

### MongoDB Database Tools
- `connect` - Kết nối đến MongoDB instance
- `find` - Chạy query find trên collection
- `aggregate` - Chạy aggregation pipeline
- `count` - Đếm số documents trong collection
- `list-databases` - Liệt kê tất cả databases
- `list-collections` - Liệt kê tất cả collections
- `collection-schema` - Mô tả schema của collection
- `collection-storage-size` - Lấy kích thước collection (MB)
- `db-stats` - Thống kê database

### MongoDB Atlas Tools
- `atlas-list-orgs` - Liệt kê organizations
- `atlas-list-projects` - Liệt kê projects
- `atlas-list-clusters` - Liệt kê clusters
- `atlas-inspect-cluster` - Kiểm tra cluster cụ thể
- `atlas-connect-cluster` - Kết nối đến Atlas cluster

## 📄 Resources hỗ trợ

- `config://config` - Cấu hình server
- `debug://mongodb` - Thông tin debug kết nối MongoDB
- `exported-data://{exportName}` - Dữ liệu đã export

## 🔧 Sử dụng

### 1. Khởi động MCP Server

```bash
# Sử dụng npx (khuyến nghị)
npx -y mongodb-mcp-server@latest --readOnly

# Hoặc với connection string
npx -y mongodb-mcp-server@latest --readOnly --connectionString "mongodb+srv://root:sapassword@devgo-docgo-cluster0.hsudzga.mongodb.net/?retryWrites=true&w=majority&appName=devgo-docgo-cluster0"
```

### 2. Sử dụng trong Cursor

Sau khi cấu hình, bạn có thể sử dụng các lệnh MongoDB trực tiếp trong Cursor:

```
# Liệt kê databases
@MongoDB list-databases

# Liệt kê collections trong database
@MongoDB list-collections --database docgo_contract_service

# Tìm documents trong collection
@MongoDB find --database docgo_contract_service --collection contracts --limit 10

# Chạy aggregation
@MongoDB aggregate --database docgo_contract_service --collection contracts --pipeline '[{"$group": {"_id": "$status", "count": {"$sum": 1}}}]'
```

## 🔒 Bảo mật

- **Read-Only Mode**: Mặc định chạy ở chế độ chỉ đọc để đảm bảo an toàn
- **Environment Variables**: Sử dụng biến môi trường cho thông tin nhạy cảm
- **Connection String**: Được mã hóa trong cấu hình

## 📚 Tài liệu tham khảo

- [MongoDB MCP Server GitHub](https://github.com/mongodb-js/mongodb-mcp-server)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Cursor MCP Guide](https://docs.cursor.com/context/model-context-protocol)

## 🐛 Troubleshooting

### Lỗi kết nối
1. Kiểm tra connection string có đúng không
2. Kiểm tra network có thể truy cập MongoDB Atlas không
3. Kiểm tra credentials có hợp lệ không

### Lỗi cấu hình
1. Kiểm tra file cấu hình MCP có đúng format JSON không
2. Kiểm tra đường dẫn file cấu hình có đúng không
3. Restart Cursor sau khi thay đổi cấu hình

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Logs của MCP Server
2. Cấu hình connection string
3. Quyền truy cập MongoDB Atlas
4. Tài liệu chính thức của MongoDB MCP Server
