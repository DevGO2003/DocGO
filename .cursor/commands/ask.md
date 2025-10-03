# Ask Command - Phân tích vấn đề

## Mục đích
Khi người dùng gặp vấn đề, command này sẽ:
- **TỰ ĐỘNG tóm tắt** cuộc trò chuyện trước khi phân tích
- **KHÔNG thực hiện** bất kỳ thay đổi code nào
- **Chỉ phân tích** và đưa ra giải pháp
- **Điều tra nguyên nhân** gốc rễ
- **Đề xuất phương án** khả thi với ưu/nhược điểm

## Quy trình thực hiện

### 0. 📊 TÓM TẮT CUỘC TRÒ CHUYỆN (BẮT BUỘC ĐẦU TIÊN)
- **Tự động thực hiện** `/summarize-chat` trước khi phân tích
- **Gom ý chính** và file quan trọng từ cuộc trò chuyện
- **Xác định context** và vấn đề đã được thảo luận
- **Chuẩn bị thông tin** đầy đủ cho việc điều tra
- **Tăng hiệu quả** phân tích vấn đề

### 1. 🔍 Điều tra nguyên nhân (BẮT BUỘC)
- **Sử dụng thông tin** từ bước tóm tắt cuộc trò chuyện
- **Đọc Docker logs chi tiết** để xác định lỗi container
- **Phân tích error messages** và stack traces
- **Kiểm tra network requests** và responses
- **Xác định file/function** gây ra vấn đề
- **Tìm hiểu context** và dependencies
- **KHÔNG đưa ra phương án** cho đến khi điều tra xong

### 2. 📍 Xác định vị trí vấn đề
- File cụ thể gây lỗi
- Dòng code có vấn đề
- Component/Service liên quan
- **Xác nhận nguyên nhân** trước khi đề xuất fix

### 3. 💡 Đề xuất phương án (CHỈ SAU KHI ĐIỀU TRA XONG)

| # | Tên phương pháp | Chi tiết thực hiện | ✅ Ưu điểm | ⚠️ Nhược điểm | 🎯 Độ khó & Thời gian & Chi phí |
|--|-----------------|-------------------|------------|---------------|--------------------------------|
| **1** | Sửa trực tiếp | Thực hiện thay đổi code ngay tại vị trí lỗi, không refactor | ✅ Nhanh chóng: Giải quyết vấn đề trong thời gian ngắn✅ Ít thay đổi: Không ảnh hưởng đến các phần khác của hệ thống✅ Rủi ro thấp: Chỉ sửa đúng phần có vấn đề | ⚠️ Có thể gây side effect: Thay đổi nhỏ có thể ảnh hưởng đến logic khác⚠️ Không giải quyết gốc rễ: Chỉ xử lý triệu chứng, không cải thiện kiến trúc⚠️ Khó maintain: Code có thể trở nên phức tạp theo thời gian | 🟢 Dễ - < 1h - Thấp |
 cải thiện chất lượng, tách biệt concerns | ✅ Code sạch hơn: Cải thiện readability và maintainability✅ Dễ maintain: Cấu trúc rõ ràng, dễ debug và mở rộng✅ Giảm technical debt: Loại bỏ code smell và anti-patterns | ⚠️ Cần test kỹ: Phải đảm bảo không break existing functionality⚠️ Có thể break existing: Thay đổi cấu trúc có thể ảnh hưởng đến integration⚠️ Thời gian dài: Cần phân tích và thiết kế lại | 🟡 Trung b| **2** | Refactor code | Tái cấu trúc code đểình - 2-4h - Trung bình |
| **3** | Thay đổi architecture | Thiết kế lại kiến trúc hệ thống để giải quyết vấn đề triệt để | ✅ Giải quyết triệt để: Xử lý nguyên nhân gốc rễ của vấn đề✅ Scalable: Kiến trúc mới có thể mở rộng tốt hơn✅ Future-proof: Phù hợp với yêu cầu phát triển dài hạn | ⚠️ Thay đổi lớn: Ảnh hưởng đến toàn bộ hệ thống⚠️ Cần migration: Phải chuyển đổi dữ liệu và logic hiện tại⚠️ Rủi ro cao: Có thể gây downtime và mất dữ liệu | 🔴 Khó - > 1 ngày - Cao |
| **4** | Workaround tạm thời | Tạo giải pháp tạm thời để bypass vấn đề, không sửa code chính | ✅ Giải quyết ngay: Khôi phục service trong thời gian ngắn nhất✅ Không ảnh hưởng code: Không thay đổi logic hiện tại✅ Rủi ro thấp: Không có tác động đến hệ thống chính | ⚠️ Không bền vững: Chỉ là giải pháp tạm thời, vấn đề vẫn tồn tại⚠️ Cần fix sau: Phải có kế hoạch giải quyết triệt để⚠️ Có thể gây confusion: Team có thể quên rằng đây chỉ là workaround | 🟢 Dễ - < 30 phút - Thấp |

### 4. ⭐ Best Choice
- **Phương án được khuyến nghị** với lý do cụ thể
- **Rủi ro và lợi ích** chi tiết
- **Timeline thực hiện** và **dependencies**

### 5. ⚠️ Rủi ro và cách xử lý
- **Các lỗi có thể xảy ra** khi thực hiện Best Choice
- **Tác động phụ** đến các file/component khác
- **Cách sửa lỗi** cụ thể cho từng trường hợp
- **Checklist kiểm tra** sau khi thực hiện

### 6. 🐳 Docker Troubleshooting (Bổ sung)
Khi vấn đề liên quan đến Docker containers:

#### 6.1. Kiểm tra trạng thái container
```bash
# Xem tất cả containers
docker ps -a

# Xem containers đang chạy
docker ps

# Kiểm tra trạng thái cụ thể
docker inspect <container-name>
```

#### 6.2. Đọc logs chi tiết
```bash
# Logs đầy đủ
docker logs <container-name>

# 50 dòng cuối cùng
docker logs --tail 50 <container-name>

# Logs từ 1 giờ trước
docker logs --since 1h <container-name>

# Logs real-time
docker logs -f <container-name>

# Logs với timestamp
docker logs -t <container-name>
```

#### 6.3. Phân tích lỗi phổ biến
- **Container không khởi động**: Kiểm tra port conflict, volume mount, environment variables
- **Container restart liên tục**: Phân tích exit code và error messages
- **Network issues**: Kiểm tra Docker network và port mapping
- **Volume mount issues**: Kiểm tra quyền truy cập và đường dẫn
- **Environment variables**: Kiểm tra .env files và docker-compose.yml

#### 6.4. Debug commands
```bash
# Vào trong container đang chạy
docker exec -it <container-name> /bin/bash

# Xem resource usage
docker stats <container-name>

# Kiểm tra network
docker network ls
docker network inspect <network-name>

# Kiểm tra volumes
docker volume ls
docker volume inspect <volume-name>
```

## Ví dụ sử dụng
```
ask: Tại sao trang contracts không load được dữ liệu?
ask: Lỗi 500 Internal Server Error khi gọi API
ask: Performance chậm khi load danh sách hợp đồng
ask: Container docgo-ai-processing-service không khởi động được
ask: Docker service bị restart liên tục
```

## Kết quả mong đợi
- 📊 **Tóm tắt cuộc trò chuyện** (tự động thực hiện)
- 🔍 **Phân tích chi tiết** nguyên nhân
- 🐳 **Docker logs analysis** (nếu có container liên quan)
- 📍 **Xác định vị trí** vấn đề cụ thể
- 💡 **Bảng so sánh** các phương án
- ⭐ **Khuyến nghị** phương án tốt nhất
- ⚠️ **Cảnh báo rủi ro** và cách xử lý
- 🚫 **KHÔNG thay đổi** code hay database

## 🔧 Docker Commands Reference
Khi sử dụng `/ask` với Docker issues, có thể tham khảo các lệnh sau:

### Kiểm tra trạng thái
```bash
# Xem tất cả containers
docker ps -a

# Xem containers đang chạy
docker ps

# Kiểm tra trạng thái cụ thể
docker inspect <container-name>
```

### Đọc logs
```bash
# Logs đầy đủ
docker logs <container-name>

# 50 dòng cuối cùng
docker logs --tail 50 <container-name>

# Logs từ 1 giờ trước
docker logs --since 1h <container-name>

# Logs real-time
docker logs -f <container-name>
```

### Debug và troubleshoot
```bash
# Vào trong container
docker exec -it <container-name> /bin/bash

# Xem resource usage
docker stats <container-name>

# Kiểm tra network
docker network ls
docker network inspect <network-name>

# Kiểm tra volumes
docker volume ls
docker volume inspect <volume-name>
```


## ⚠️ QUAN TRỌNG: Quy tắc điều tra trước khi đưa ra phương án

### 1. **BẮT BUỘC điều tra kỹ**:
- Đọc Docker logs chi tiết
- Phân tích error messages và stack traces
- Kiểm tra network requests/responses
- Xác định file/function gây lỗi
- **KHÔNG đưa ra phương án** cho đến khi điều tra xong

### 2. **Tránh đưa ra phương án sai**:
- **Ví dụ sai**: "createdAt đã có trong VALID_SORT_BY_PROPERTIES" → thực tế lỗi 500 do enum
- **Ví dụ sai**: "API Gateway proxy thành công" → thực tế có lỗi trong service
- **Ví dụ sai**: "Không có error logs" → thực tế có logs nhưng không đọc kỹ

### 3. **Quy trình điều tra chuẩn**:
```
1. Đọc Docker logs chi tiết
2. Phân tích error messages
3. Kiểm tra network requests
4. Xác định nguyên nhân gốc rễ
5. CHỈ SAU ĐÓ mới đưa ra phương án
```

## Prompt mẫu cho AI Agent Chat
```text
Bạn là trợ lý kỹ thuật. Nhiệm vụ: CHỈ PHÂN TÍCH, KHÔNG sửa code hay DB.

Bối cảnh:
- Dự án: DocGO (microservices, API Standards, RestResponse, Swagger /docs).
- Chuẩn phản hồi: Ngắn gọn, có bảng phương án, đề xuất Best Choice.

Yêu cầu thực hiện:
0) **BẮT BUỘC tóm tắt cuộc trò chuyện** trước khi phân tích:
   - Tự động thực hiện /summarize-chat
   - Gom ý chính và file quan trọng
   - Xác định context và vấn đề đã thảo luận
   - Chuẩn bị thông tin đầy đủ cho việc điều tra

1) **BẮT BUỘC điều tra kỹ** trước khi đưa ra phương án:
   - Sử dụng thông tin từ bước tóm tắt
   - Đọc Docker logs chi tiết
   - Phân tích error messages và stack traces
   - Kiểm tra network requests/responses
   - Xác định file/function gây lỗi
   - **KHÔNG đưa ra phương án** cho đến khi điều tra xong

2) **Đọc Docker logs** nếu vấn đề liên quan đến container:
   - `docker logs <container-name>` để xem logs chi tiết
   - `docker logs --tail 50 <container-name>` để xem 50 dòng cuối
   - `docker logs --since 1h <container-name>` để xem logs 1 giờ qua
   - Phân tích error messages, stack traces, và warning
   - Kiểm tra exit codes và restart patterns

3) Xác định vị trí vấn đề (file, hàm, endpoint, tham số, controller/router).

4) **CHỈ SAU KHI ĐIỀU TRA XONG** mới đề xuất tối thiểu 3 phương án (bảng: Mô tả, Ưu/nhược, Độ khó, Thời gian, Chi phí).

5) Chỉ ra Best Choice + lý do, rủi ro, và checklist các bước thực hiện.

6) **CẢNH BÁO RỦI RO**: Liệt kê các lỗi có thể xảy ra khi thực hiện Best Choice:
   - Lỗi import/export khi di chuyển file
   - Lỗi dependency/classpath
   - Lỗi configuration/endpoint
   - Lỗi database migration
   - Lỗi Docker container (port conflict, volume mount, environment variables)
   - Cách sửa từng loại lỗi cụ thể

7) Tuyệt đối không thay đổi code/database. Nếu cần validate, chỉ đưa lệnh kiểm tra (không tự chạy).

Đầu vào:
<dán lỗi/triệu chứng/ngữ cảnh ở đây>

Đầu ra bắt buộc:
- **Tóm tắt cuộc trò chuyện** (từ bước 0)
- **Điều tra chi tiết** nguyên nhân gốc rễ
- **Docker logs analysis** (nếu có container liên quan)
- Vị trí lỗi (file/hàm/endpoint/dòng nếu xác định được)
- **CHỈ SAU KHI ĐIỀU TRA XONG** mới có bảng phương án so sánh
- Best Choice + checklist bước làm
- **Cảnh báo rủi ro** + cách xử lý từng loại lỗi
```
