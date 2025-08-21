### Introduction

`file-storage-asset-service` quản lý lưu trữ tệp trên S3/Filebase.

- Base path: `/api/v1/file-storage-asset-service`
- Endpoints chính:
  - `POST /upload`: Tải tệp lên bucket
  - `GET /list`: Liệt kê đối tượng theo `prefix`
  - `GET /url`: Lấy presigned URL để tải xuống
  - `DELETE /delete`: Xóa đối tượng theo `key`

Yêu cầu môi trường:
- `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET`
- (Tùy chọn) `IPFS_RPC_ENDPOINT`, `IPFS_RPC_TOKEN`

Xem “How to run this microservice.md” để chạy local.


