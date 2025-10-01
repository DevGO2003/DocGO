<!-- 6bce040f-06ae-4c96-977e-d3585a68cc07 9c40b77b-bfa5-4530-b934-27b8b9a1addb -->
# Kế hoạch tích hợp Tab 1 (Import Document)

Mục tiêu: Tại Tab 1, cho phép người dùng tải file hợp đồng, chạy AI extract → classify → (nếu là hợp đồng) summarize, rồi hiển thị kết quả và cho phép lưu.

### Phạm vi và nguyên tắc
- Sử dụng API chuẩn:
  - Upload: `POST /api/v1/document-management-service/documents/upload`
  - Extract: `POST /api/v1/automation-service/document/extract`
  - Classify: `POST /api/v1/automation-service/document/classify`
  - Summarize (nếu isContract=true): `POST /api/v1/automation-service/contracts/summarize`
- Qua API Gateway BFF nếu đã có proxy; nếu thiếu, bổ sung endpoint proxy tương ứng trong `backend/api-gateway/pages/api/...`.
- Tuân thủ RestResponse (HTTP 200/201; không dùng HTTP 204 thật; dùng statusCode=204 trong body khi không dữ liệu).

### Thay đổi Frontend (Next.js web-app)
- Trang: `frontend/web-app/src/app/import-document/page.tsx` (hoặc file hiện hữu nếu đã có).
- Component Tab 1: tạo `frontend/web-app/src/components/import/TabUpload.tsx`.
- Trạng thái UI: file chọn, tiến trình (upload → extract → classify → summarize), lỗi, kết quả.
- UX: drag-and-drop + chọn file, hiển thị bước-progress, cho phép xem raw text đã extract, kết quả classify, JSON summary nếu là hợp đồng.

### Luồng gọi API tại Tab 1
1) Upload lên DMS
- FormData `file`, optional `userId`, `folder`.
- Nhận `fileId`, `filename`, `fileUrl` từ `data`.

2) Extract nội dung
- Gửi multipart `file` (re-upload từ client) hoặc (nếu sau bổ sung) gửi `text` sau khi client tự đọc; mặc định: multipart.
- Nhận `data` là text (nếu `statusCode=204` thì hiển thị "Không có nội dung").

3) Classify
- Gửi multipart (file) hoặc JSON body `{ text }` (dùng text từ bước extract để tránh re-upload lần nữa).
- Nhận `{ documentType, isContract, confidence, reasons, contractSubtype }`.

4) Summarize (nếu là hợp đồng)
- Gửi `{ text }` (ưu tiên text từ extract) hoặc multipart (file) nếu text lớn/thiếu.
- Nhận JSON summary (chuẩn khoá camelCase).

5) Hiển thị & Lưu
- Render kết quả từng bước; nút "Lưu vào hệ thống" (tuỳ chọn) sẽ gọi API domain ở DMS (nếu có) hoặc lưu tạm client.

### Bảo mật & cấu hình
- `GEMINI_API_KEY`: để trong server-side (Gateway) hoặc `.env` frontend cho dev; không log key.
- Kích thước file: cảnh báo >10MB (extract) và >50MB (summarize) theo handler hiện tại.

### Mapping endpoint qua BFF (nếu cần)
- Nếu frontend gọi trực tiếp service nội bộ bị CORS, thêm proxy:
  - `backend/api-gateway/pages/api/files/upload.ts` → proxy DMS upload
  - `backend/api-gateway/pages/api/ai/extract.ts` → proxy AS extract
  - `backend/api-gateway/pages/api/ai/classify.ts` → proxy AS classify
  - `backend/api-gateway/pages/api/ai/contracts/summarize.ts` → proxy AS summarize
- Chuẩn hoá header `GEMINI_API_KEY` khi cần (server-side only).

### Kiểm soát lỗi (theo RestResponse)
- Với body có `statusCode` != 200/201: hiển thị toast và chi tiết `description`.
- Trường hợp `statusCode=204`: hiển thị trạng thái "Không có nội dung" thay vì lỗi.
- Bắt exception mạng: retry nhẹ cho extract/classify (tối đa 1 lần).

### Telemetry & UX
- Thêm loading spinner theo bước; disable nút khi đang chạy.
- Log `requestId` (nếu trả về) để hỗ trợ debug.

### Artifacts hiển thị
- Card 1: File info (tên, size, type) từ DMS.
- Card 2: Extracted text (collapse).
- Card 3: Classify (badges: documentType, confidence, subtype).
- Card 4: Contract Summary (JSON view), chỉ hiện khi isContract.
- CTA: Lưu/Kết thúc.


### To-dos

- [ ] Tạo UI TabUpload (drag&drop, progress, kết quả)
- [ ] Gọi upload DMS và hiển thị metadata file
- [ ] Gọi AS extract, lấy text; fallback no-content
- [ ] Gọi AS classify bằng text từ extract
- [ ] Nếu isContract, gọi AS summarize bằng text
- [ ] Chuẩn hoá RestResponse + toast lỗi/204
- [ ] Bổ sung proxy endpoint BFF nếu thiếu
- [ ] Cấu hình GEMINI_API_KEY an toàn (server-side)
- [ ] Loading, retry nhẹ, JSON viewer, CTA lưu