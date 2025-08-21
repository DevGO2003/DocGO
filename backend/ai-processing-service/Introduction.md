### Introduction

`ai-processing-service` cung cấp API AI để trích xuất và tóm tắt nội dung hợp đồng.

- Base path: `/api/v1/ai-processing-service`
- Endpoints chính:
  - `POST /extract`: Trích xuất nội dung chính từ file `.docx` hoặc `.pdf`
  - `POST /summarize`: Tóm tắt từ file `.txt` hoặc chuỗi `text`
- Chuẩn RestResponse: đồng bộ với các service khác của DocGO.

Yêu cầu môi trường:
- `GEMINI_API_KEY`: khóa API cho Google Generative AI

Xem “How to run this microservice.md” để chạy local.


