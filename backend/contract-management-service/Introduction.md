### Introduction

`contract-management-service` cung cấp API CRUD quản lý Hợp đồng, Sự kiện hợp đồng và Tệp đính kèm.

- Base path: `/api/v1/contract-management-service`
- Tài nguyên chính: `contracts`, sub-resources: `events`, `attachments`
- Chuẩn hóa URL, RestResponse và GlobalExceptionHandler theo quy ước DocGO.

Yêu cầu môi trường:
- Kết nối MariaDB cấu hình tại `src/main/resources/application.properties`

Xem “How to run this microservice.md” để chạy local.


