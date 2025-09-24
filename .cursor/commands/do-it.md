# Do It Command - Thực hiện công việc được gợi ý, tiếp tục công việc giữa chừng, hoặc kiểm tra hoàn thành lệnh khác

## Mục đích
Command này được sử dụng khi:
1. **Agent gợi ý thực hiện công việc** và người dùng muốn agent thực hiện ngay
2. **Tiếp tục công việc giữa chừng** khi agent bị ngừng đột ngột do hết context/token
3. **Kiểm tra và hoàn thành lệnh khác**: Khi được truyền thêm tham số là một command khác (ví dụ: `/do-it /git-push`), agent sẽ kiểm tra tiến độ thực hiện của command đó và tiếp tục nếu chưa hoàn thành.
4. **Ưu tiên vế sau**: Tập trung vào việc tiếp tục công việc bị gián đoạn hoặc hoàn thành lệnh tham số

## Cách sử dụng
- Gõ `/do-it` trong Agent input để:
  - Thực hiện công việc mà agent vừa gợi ý
  - Tiếp tục công việc đang dở dang
  - Khôi phục context và hoàn thành task và Cursor TODO
- Gõ `/do-it <command>` (ví dụ: `/do-it /git-push`) để:
  - Tóm tắt lại đoạn chat liên quan đến `<command>`
  - Kiểm tra xem các bước của `<command>` đã được thực hiện đầy đủ chưa (dựa trên mô tả của command đó)
  - Nếu chưa đủ, tự động thực hiện tiếp các bước còn thiếu cho đến khi hoàn thành

## Quy trình thực hiện

### 1. 🔍 Phân tích context hiện tại
- Kiểm tra công việc đang thực hiện hoặc command tham số (nếu có)
- Xác định bước tiếp theo cần làm
- Đánh giá trạng thái hiện tại

### 2. 📋 Xác định công việc cần tiếp tục hoặc kiểm tra command tham số
- Nếu có gợi ý từ agent: Thực hiện gợi ý đó
- Nếu không có gợi ý: Tiếp tục công việc giữa chừng
- Nếu có tham số command (ví dụ `/do-it /git-push`):
  - Tóm tắt lại các đoạn chat liên quan đến command đó
  - Đọc mô tả của command tham số để biết các bước cần thực hiện
  - So sánh với tiến độ hiện tại, xác định các bước còn thiếu
  - Thực hiện tiếp các bước còn thiếu cho đến khi hoàn thành
- Ưu tiên hoàn thành task đang dở dang hoặc command tham số

### 3. ⚡ Thực hiện ngay lập tức
- Không hỏi lại xác nhận
- Thực hiện công việc một cách tự động
- Báo cáo tiến độ và kết quả

## Ví dụ sử dụng

### Khi agent gợi ý:
```
Agent: "Tôi sẽ tạo file config mới cho service này, sẽ thực hiện nhé?"
User: /do-it
→ Agent thực hiện tạo file config ngay lập tức
```

### Khi công việc bị gián đoạn:
```
Agent: "Đang cập nhật database schema... [bị ngừng do hết token]"
User: /do-it
→ Agent tiếp tục cập nhật database schema từ bước cuối
```

### Khi cần hoàn thành task:
```
Agent: "Cần refactor 5 files, đã xong 3 files..."
User: /do-it
→ Agent tiếp tục refactor 2 files còn lại
```

## Lưu ý quan trọng

### ✅ Sẽ thực hiện:
- Công việc agent vừa gợi ý
- Tiếp tục task đang dở dang
- Hoàn thành công việc bị gián đoạn
- Không hỏi lại xác nhận

### ❌ Không thực hiện:
- Công việc có rủi ro cao (xóa dữ liệu, thay đổi production)
- Công việc cần quyền đặc biệt
- Công việc không rõ ràng hoặc mơ hồ

## Kết quả mong đợi
- 📊 **Báo cáo tiến độ** chi tiết
- ✅ **Hoàn thành công việc** được gợi ý
- 🔄 **Tiếp tục task** bị gián đoạn
- 📝 **Tóm tắt kết quả** và bước tiếp theo

## Ghi chú
- Command này ưu tiên **tiếp tục công việc giữa chừng**
- Sử dụng khi agent bị ngừng đột ngột
- Không cần xác nhận lại từ người dùng
- Tự động phát hiện và thực hiện công việc phù hợp
