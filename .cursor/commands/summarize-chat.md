# Summarize Chat Command - Tóm tắt cuộc trò chuyện

## Mục đích
Command này sẽ tóm tắt toàn bộ cuộc trò chuyện để:
- **Gom ý chính** và những file cần chú ý
- **Giảm context** đầu vào cho các command khác
- **Tăng hiệu quả** cho `/ask` và các command khác
- **Lưu trữ** thông tin quan trọng từ cuộc trò chuyện

## Quy trình thực hiện

### 1. 📊 Phân tích cuộc trò chuyện
- **Đếm số lượng** tin nhắn và thời gian
- **Xác định chủ đề** chính được thảo luận
- **Phân loại** các loại vấn đề (bug, feature, config, etc.)
- **Tóm tắt** các quyết định quan trọng

### 2. 📁 Danh sách file quan trọng
- **File đã được chỉnh sửa** trong cuộc trò chuyện
- **File được đề cập** nhiều lần
- **File có vấn đề** cần theo dõi
- **File mới được tạo** hoặc xóa

### 3. 🎯 Tóm tắt vấn đề chính
- **Vấn đề gốc** được báo cáo
- **Nguyên nhân** đã xác định
- **Giải pháp** đã thực hiện
- **Kết quả** hiện tại

### 4. 📋 Checklist theo dõi
- **Task đã hoàn thành** ✅
- **Task đang thực hiện** 🔄
- **Task chưa bắt đầu** ⏳
- **Vấn đề cần giải quyết** ⚠️

### 5. 🔗 Liên kết với command khác
- **Gợi ý** command tiếp theo phù hợp
- **Chuẩn bị context** cho `/ask` nếu cần
- **Lưu trữ** thông tin cho session sau

## Format tóm tắt

### 📊 Thống kê cuộc trò chuyện
```
⏱️ Thời gian: [start] - [end]
💬 Số tin nhắn: [count]
🎯 Chủ đề chính: [main topics]
👤 Người tham gia: [participants]
```

### 📁 File quan trọng
```
✅ Đã chỉnh sửa:
- file1.py (3 lần)
- file2.js (1 lần)

⚠️ Cần chú ý:
- file3.py (có lỗi)
- file4.md (cần cập nhật)

🆕 File mới:
- file5.py (tạo mới)
- file6.md (tạo mới)
```

### 🎯 Vấn đề chính
```
🔍 Vấn đề gốc: [description]
🔧 Nguyên nhân: [root cause]
✅ Giải pháp: [solution implemented]
📊 Kết quả: [current status]
```

### 📋 Checklist theo dõi
```
✅ Hoàn thành:
- [task1]
- [task2]

🔄 Đang thực hiện:
- [task3]

⏳ Chưa bắt đầu:
- [task4]

⚠️ Cần giải quyết:
- [issue1]
- [issue2]
```

### 🔗 Gợi ý command tiếp theo
```
💡 Command khuyến nghị:
- /ask: [reason] - để phân tích vấn đề còn lại
- /do-it: [reason] - để thực hiện task tiếp theo
- /docker-status: [reason] - để kiểm tra trạng thái
```

## Ví dụ sử dụng
```
summarize: Tóm tắt cuộc trò chuyện về lỗi Docker
summarize: Gom ý chính về việc fix API contracts
summarize: Tóm tắt session debug performance
```

## Kết quả mong đợi
- 📊 **Thống kê** cuộc trò chuyện
- 📁 **Danh sách file** quan trọng
- 🎯 **Tóm tắt vấn đề** chính
- 📋 **Checklist** theo dõi
- 🔗 **Gợi ý** command tiếp theo
- 💾 **Lưu trữ** thông tin cho session sau

## Lưu ý quan trọng
- **KHÔNG thay đổi** code hay file
- **CHỈ tóm tắt** và phân tích
- **Lưu trữ** thông tin quan trọng
- **Chuẩn bị** context cho command khác
- **Gợi ý** bước tiếp theo phù hợp

## Tích hợp với `/ask`
Khi sử dụng `/ask` sau `/summarize`:
- **Context đã được tóm tắt** và sẵn sàng
- **File quan trọng** đã được xác định
- **Vấn đề chính** đã được làm rõ
- **Hiệu quả** phân tích tăng cao

## Prompt mẫu cho AI Agent
```text
Bạn là trợ lý tóm tắt cuộc trò chuyện. Nhiệm vụ: TÓM TẮT và PHÂN TÍCH, KHÔNG thay đổi code.

Bối cảnh:
- Dự án: DocGO (microservices, API Standards, RestResponse, Swagger /docs)
- Mục tiêu: Gom ý chính, giảm context, tăng hiệu quả cho command khác

Yêu cầu thực hiện:
1) **Phân tích cuộc trò chuyện**:
   - Đếm số tin nhắn và thời gian
   - Xác định chủ đề chính
   - Phân loại loại vấn đề
   - Tóm tắt quyết định quan trọng

2) **Danh sách file quan trọng**:
   - File đã chỉnh sửa (số lần)
   - File cần chú ý (có vấn đề)
   - File mới được tạo/xóa
   - File được đề cập nhiều lần

3) **Tóm tắt vấn đề chính**:
   - Vấn đề gốc được báo cáo
   - Nguyên nhân đã xác định
   - Giải pháp đã thực hiện
   - Kết quả hiện tại

4) **Checklist theo dõi**:
   - Task hoàn thành ✅
   - Task đang thực hiện 🔄
   - Task chưa bắt đầu ⏳
   - Vấn đề cần giải quyết ⚠️

5) **Gợi ý command tiếp theo**:
   - Command phù hợp với tình huống
   - Lý do khuyến nghị
   - Chuẩn bị context sẵn sàng

Đầu ra bắt buộc:
- **Thống kê** cuộc trò chuyện
- **Danh sách file** quan trọng
- **Tóm tắt vấn đề** chính
- **Checklist** theo dõi
- **Gợi ý** command tiếp theo
- **Lưu trữ** thông tin quan trọng
```

















































