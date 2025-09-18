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

## Ví dụ sử dụng
```
ask: Tại sao trang contracts không load được dữ liệu?
ask: Lỗi 500 Internal Server Error khi gọi API
ask: Performance chậm khi load danh sách hợp đồng
```

## Kết quả mong đợi
- 📊 **Phân tích chi tiết** nguyên nhân
- 📍 **Xác định vị trí** vấn đề cụ thể
- 💡 **Bảng so sánh** các phương án
- ⭐ **Khuyến nghị** phương án tốt nhất
- 🚫 **KHÔNG thay đổi** code hay database


## Prompt mẫu cho AI Agent Chat
```text
Bạn là trợ lý kỹ thuật. Nhiệm vụ: CHỈ PHÂN TÍCH, KHÔNG sửa code hay DB.

Bối cảnh:
- Dự án: DocGO (microservices, API Standards, RestResponse, Swagger /docs).
- Chuẩn phản hồi: Ngắn gọn, có bảng phương án, đề xuất Best Choice.

Yêu cầu thực hiện:
1) Điều tra nguyên nhân (triệu chứng, log, network, cấu hình liên quan).
2) Xác định vị trí vấn đề (file, hàm, endpoint, tham số, controller/router).
3) Đề xuất tối thiểu 3 phương án (bảng: Mô tả, Ưu/nhược, Độ khó, Thời gian, Chi phí).
4) Chỉ ra Best Choice + lý do, rủi ro, và checklist các bước thực hiện.
5) Tuyệt đối không thay đổi code/database. Nếu cần validate, chỉ đưa lệnh kiểm tra (không tự chạy).

Đầu vào:
<dán lỗi/triệu chứng/ngữ cảnh ở đây>

Đầu ra bắt buộc:
- Phân tích ngắn gọn nguyên nhân gốc rễ
- Vị trí lỗi (file/hàm/endpoint/dòng nếu xác định được)
- Bảng phương án so sánh
- Best Choice + checklist bước làm
```

