# Ask Command - Phân tích vấn đề

## Mục đích
Khi người dùng gặp vấn đề, command này sẽ:
- **KHÔNG thực hiện** bất kỳ thay đổi code nào
- **Chỉ phân tích** và đưa ra giải pháp
- **Điều tra nguyên nhân** gốc rễ
- **Đề xuất phương án** khả thi với ưu/nhược điểm

## Quy trình thực hiện

### 1. 🔍 Điều tra nguyên nhân
- Phân tích lỗi từ logs, console, network
- **Đọc Docker logs** để xác định lỗi container
- Xác định file/function gây ra vấn đề
- Tìm hiểu context và dependencies

### 2. 📍 Xác định vị trí vấn đề
- File cụ thể gây lỗi
- Dòng code có vấn đề
- Component/Service liên quan

### 3. 💡 Đề xuất phương án (Format bảng)

| Phương án | Mô tả | ✅ Ưu điểm | ⚠️ Nhược điểm | 🎯 Độ khó | ⏱️ Thời gian | 💰 Chi phí |
|-----------|-------|------------|---------------|-----------|-------------|-----------|
| **Phương án 1** | Sửa trực tiếp | ✅ Nhanh chóng<br/>✅ Ít thay đổi | ⚠️ Có thể gây side effect<br/>⚠️ Không giải quyết gốc rễ | 🟢 Dễ | 🟢 < 1h | 🟢 Thấp |
| **Phương án 2** | Refactor code | ✅ Code sạch hơn<br/>✅ Dễ maintain | ⚠️ Cần test kỹ<br/>⚠️ Có thể break existing | 🟡 Trung bình | 🟡 2-4h | 🟡 Trung bình |
| **Phương án 3** | Thay đổi architecture | ✅ Giải quyết triệt để<br/>✅ Scalable | ⚠️ Thay đổi lớn<br/>⚠️ Cần migration | 🔴 Khó | 🔴 > 1 ngày | 🔴 Cao |
| **Phương án 4** | Workaround tạm thời | ✅ Giải quyết ngay<br/>✅ Không ảnh hưởng code | ⚠️ Không bền vững<br/>⚠️ Cần fix sau | 🟢 Dễ | 🟢 < 30 phút | 🟢 Thấp |

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
- 📊 **Phân tích chi tiết** nguyên nhân
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


## Prompt mẫu cho AI Agent Chat
```text
Bạn là trợ lý kỹ thuật. Nhiệm vụ: CHỈ PHÂN TÍCH, KHÔNG sửa code hay DB.

Bối cảnh:
- Dự án: DocGO (microservices, API Standards, RestResponse, Swagger /docs).
- Chuẩn phản hồi: Ngắn gọn, có bảng phương án, đề xuất Best Choice.

Yêu cầu thực hiện:
1) Điều tra nguyên nhân (triệu chứng, log, network, cấu hình liên quan).
2) **Đọc Docker logs** nếu vấn đề liên quan đến container:
   - `docker logs <container-name>` để xem logs chi tiết
   - `docker logs --tail 50 <container-name>` để xem 50 dòng cuối
   - `docker logs --since 1h <container-name>` để xem logs 1 giờ qua
   - Phân tích error messages, stack traces, và warning
   - Kiểm tra exit codes và restart patterns
3) Xác định vị trí vấn đề (file, hàm, endpoint, tham số, controller/router).
4) Đề xuất tối thiểu 3 phương án (bảng: Mô tả, Ưu/nhược, Độ khó, Thời gian, Chi phí).
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
- Phân tích ngắn gọn nguyên nhân gốc rễ
- **Docker logs analysis** (nếu có container liên quan)
- Vị trí lỗi (file/hàm/endpoint/dòng nếu xác định được)
- Bảng phương án so sánh
- Best Choice + checklist bước làm
- **Cảnh báo rủi ro** + cách xử lý từng loại lỗi
```

