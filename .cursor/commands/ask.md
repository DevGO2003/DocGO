# /ask – Investigation-First (No Code Changes)

## Mục đích
- KHÔNG thay đổi code/DB
- Chỉ phân tích, điều tra, đề xuất sau khi có nguyên nhân

## Quy trình
1) 🔍 Điều tra
- Đọc Docker logs có kiểm soát (tail/1h)
- Phân tích error/stacktrace
- Kiểm tra request/response và cấu hình port/URL
- Xác định file/hàm/endpoint gây lỗi

2) 📍 Xác định vị trí
- Chỉ ra file, hàm, dòng (nếu xác định)
- Liên quan: service/component, tham số, dependency

3) 💡 Đề xuất (sau khi điều tra xong)
| Phương án | Mô tả | Ưu | Nhược | Độ khó | Thời gian | Chi phí |
|---|---|---|---|---|---|---|
| 1 | Sửa trực tiếp | Nhanh | Có side effect | Dễ | <1h | Thấp |
| 2 | Refactor | Sạch | Cần test | TB | 2-4h | TB |
| 3 | Đổi kiến trúc | Triệt để | Lớn | Khó | >1d | Cao |
| 4 | Workaround | Ngay | Tạm thời | Dễ | <30m | Thấp |

4) ⭐ Best Choice
- Lý do, lợi ích, rủi ro
- Checklist thực hiện ngắn gọn

5) ⚠️ Rủi ro & Cách xử lý
- Import/Classpath, Config/Endpoint, DB migration
- Docker: port conflict, volume, env
- Cách sửa tương ứng

## Docker Cheatsheet
```bash
# Trạng thái
docker ps -a | cat

# Logs
docker logs --tail 200 --since 1h -t <container> | cat

# Inspect
docker inspect <container> | cat

# Network
docker network inspect <network> | cat
```

## Prompt mẫu
```text
ask: <vấn đề>
- Môi trường/Container liên quan
- Endpoint/URL
- Log snippet (nếu có)
```

