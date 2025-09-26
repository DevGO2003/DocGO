# Browser Command - Sử dụng MCP Browser để duyệt web

## Mục đích
Command này cho phép sử dụng MCP Browser để:
- **Mở trang web** và lấy nội dung
- **Tìm kiếm thông tin** trên web
- **Lấy screenshot** của trang web
- **Thực hiện các hành động** trên web (click, scroll, fill form)
- **Lấy thông tin meta** của trang web

## Quy trình thực hiện

### 1. 🔍 Phân tích yêu cầu
- **Xác định URL** hoặc từ khóa tìm kiếm
- **Xác định hành động** cần thực hiện (navigate, search, screenshot, v.v.)
- **Xác định thông tin** cần lấy từ trang web

### 2. 🚀 Thực hiện hành động
- **Navigate**: Điều hướng đến URL cụ thể
- **Search**: Tìm kiếm thông tin trên web
- **Screenshot**: Chụp ảnh màn hình trang web
- **Extract**: Trích xuất nội dung, links, metadata

### 3. 📊 Xử lý kết quả
- **Phân tích nội dung** đã lấy được
- **Tóm tắt thông tin** quan trọng
- **Đề xuất hành động** tiếp theo nếu cần

## Các chức năng chính

### 🌐 **Navigate & Browse**
```bash
/browser navigate https://example.com
/browser search "React best practices 2024"
/browser screenshot https://github.com
```

### 🔍 **Search & Extract**
```bash
/browser search "DocGO documentation"
/browser extract-links https://docs.example.com
/browser extract-text https://blog.example.com
```

### 📸 **Screenshot & Visual**
```bash
/browser screenshot https://app.example.com
/browser fullpage-screenshot https://landing.example.com
```

### 🎯 **Interactive Actions**
```bash
/browser click "Login button"
/browser fill-form username="admin" password="secret"
/browser scroll down
/browser wait 3000
```

## Ví dụ sử dụng

### 📚 **Tìm kiếm tài liệu**
```bash
# Tìm tài liệu về một công nghệ
/browser search "Next.js 14 new features"

# Lấy thông tin từ trang chính thức
/browser navigate https://nextjs.org/docs
/browser extract-text
```

### 🔧 **Kiểm tra API Documentation**
```bash
# Kiểm tra API docs
/browser navigate https://api.example.com/docs
/browser screenshot
/browser extract-links

# Tìm endpoint cụ thể
/browser search "authentication endpoint"
```

### 🐛 **Debug & Troubleshooting**
```bash
# Kiểm tra status page
/browser navigate https://status.github.com
/browser screenshot

# Tìm giải pháp lỗi
/browser search "Docker container restart loop fix"
```

### 📊 **Market Research**
```bash
# Kiểm tra competitor
/browser navigate https://competitor.com
/browser fullpage-screenshot
/browser extract-text

# Tìm thông tin về pricing
/browser search "DocGO alternative pricing"
```

## Các tham số hỗ trợ

### 🌐 **URL & Navigation**
- `url`: URL cần truy cập
- `wait`: Thời gian chờ (ms) trước khi thực hiện hành động
- `timeout`: Thời gian timeout (ms) cho request

### 🔍 **Search Parameters**
- `query`: Từ khóa tìm kiếm
- `engine`: Search engine (google, bing, duckduckgo)
- `limit`: Số lượng kết quả tối đa

### 📸 **Screenshot Options**
- `fullpage`: Chụp toàn bộ trang (scroll)
- `quality`: Chất lượng ảnh (1-100)
- `format`: Định dạng ảnh (png, jpeg)

### 🎯 **Action Parameters**
- `selector`: CSS selector hoặc text để tìm element
- `coordinates`: Tọa độ x,y để click
- `text`: Text để fill vào form

## Xử lý lỗi thường gặp

### ⚠️ **Network Issues**
- **Timeout**: Tăng thời gian timeout hoặc thử lại
- **Connection refused**: Kiểm tra URL và kết nối mạng
- **SSL errors**: Sử dụng HTTP thay vì HTTPS nếu cần

### 🔒 **Access Issues**
- **403 Forbidden**: Trang web chặn bot, cần user-agent khác
- **Rate limiting**: Chờ một lúc rồi thử lại
- **CAPTCHA**: Cần can thiệp thủ công

### 📱 **Mobile/Responsive Issues**
- **Mobile layout**: Sử dụng user-agent mobile
- **Responsive breakpoints**: Chỉ định viewport size

## Best Practices

### ✅ **Nên làm**
- **Specify wait time** cho trang web load đầy đủ
- **Use specific selectors** thay vì generic text
- **Take screenshots** để debug khi cần
- **Extract structured data** thay vì raw HTML

### ❌ **Tránh**
- **Spam requests** - không gọi quá nhiều request liên tiếp
- **Heavy pages** - tránh trang web quá nặng
- **Dynamic content** - nội dung thay đổi liên tục
- **Personal data** - không lấy thông tin cá nhân

## Kết quả mong đợi

### 📊 **Thông tin trả về**
- **URL**: Địa chỉ trang đã truy cập
- **Title**: Tiêu đề trang web
- **Content**: Nội dung chính (text, HTML)
- **Links**: Danh sách links trong trang
- **Screenshots**: Ảnh chụp màn hình (nếu có)
- **Metadata**: Thông tin meta (description, keywords)

### 🎯 **Hành động tiếp theo**
- **Phân tích nội dung** và đưa ra insight
- **So sánh thông tin** với yêu cầu ban đầu
- **Đề xuất bước tiếp theo** nếu cần thêm thông tin

## Lưu ý quan trọng

- **Respect robots.txt**: Tuân thủ quy tắc của website
- **Rate limiting**: Không gọi quá nhiều request
- **Legal compliance**: Chỉ lấy thông tin công khai
- **Privacy**: Không lưu trữ thông tin cá nhân
- **Performance**: Tối ưu hóa thời gian chờ và timeout

## Ví dụ command hoàn chỉnh

```bash
# Tìm tài liệu về React
/browser search "React 18 new features documentation"

# Lấy thông tin từ trang chính thức
/browser navigate https://react.dev
/browser wait 2000
/browser extract-text
/browser screenshot

# Tìm API documentation
/browser navigate https://react.dev/reference
/browser extract-links
/browser fullpage-screenshot
```

---

**Mục tiêu**: Cung cấp khả năng duyệt web mạnh mẽ để hỗ trợ nghiên cứu, debug, và tìm kiếm thông tin cho dự án DocGO.
