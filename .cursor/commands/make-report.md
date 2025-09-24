# Tạo Báo Cáo Tiến Độ Hằng Ngày

## Mục đích
Tạo báo cáo tiến độ dự án DocGO cho ngày hôm qua (24h commit vừa qua) với định dạng HTML chuyên nghiệp.

## Cách sử dụng
```
make-report
```

## Quy trình thực hiện

### 1. Thu thập dữ liệu commit (UTC+7)
```bash
# Lấy danh sách commit của ngày hôm qua (UTC+7)
git log --since="yesterday 00:00:00 +0700" --until="today 00:00:00 +0700" --oneline --all

# Lấy thống kê chi tiết
git log --since="yesterday 00:00:00 +0700" --until="today 00:00:00 +0700" --stat --pretty=format:"%h - %an, %ad : %s" --date=iso

# Đếm số lượng commit
git log --since="yesterday 00:00:00 +0700" --until="today 00:00:00 +0700" --oneline | wc -l

# Lấy danh sách files được thay đổi
git log --since="yesterday 00:00:00 +0700" --until="today 00:00:00 +0700" --name-only --pretty=format: | sort | uniq | grep -v "^$"
```

### 2. Phân tích và phân loại commit
- **Infrastructure**: Git workflow, environment, configuration
- **Feature**: Tính năng mới, API endpoints
- **Bugfix**: Sửa lỗi, hotfix
- **Documentation**: Tài liệu, README, comments
- **Testing**: Test cases, validation
- **Refactor**: Tối ưu code, cleanup

### 3. Tạo báo cáo HTML
Tạo file `bao-cao-YYYY-MM-DD.html` với cấu trúc:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Báo Cáo Tiến Độ Dự Án DocGO - [NGÀY]</title>
    <style>
        /* CSS styling tương tự như trước */
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 BÁO CÁO TIẾN ĐỘ DỰ ÁN DOCGO</h1>
            <p class="subtitle">Ngày báo cáo: [NGÀY HIỆN TẠI] | Thời gian báo cáo: Ngày hôm qua ([NGÀY HÔM QUA])</p>
        </div>
        
        <div class="content">
            <!-- Các section báo cáo -->
        </div>
    </div>
</body>
</html>
```

### 4. Cấu trúc báo cáo

#### A. TỔNG QUAN HOẠT ĐỘNG
- Bảng tóm tắt các mục tiêu đã hoàn thành
- Trạng thái: ✅ Hoàn thành / 🔄 Đang thực hiện / ❌ Chưa bắt đầu

#### B. CHI TIẾT CÔNG VIỆC THỰC HIỆN
- Danh sách commit với thông tin:
  - STT
  - Công việc (từ commit message)
  - Commit ID
  - Thời gian (UTC+7)
  - Tác động/Loại công việc

#### C. SERVICES ĐƯỢC CẬP NHẬT
- Bảng các services được thay đổi:
  - Tên service
  - Loại (FastAPI/Spring Boot/Next.js)
  - Files được cập nhật
  - Mục đích thay đổi

#### D. THỐNG KÊ HOẠT ĐỘNG
- Cards thống kê:
  - Tổng số commit
  - Files được thay đổi
  - Services được cập nhật
  - Thời gian làm việc (ước tính)

#### E. KẾT QUẢ ĐẠT ĐƯỢC
- Bảng lợi ích và tác động:
  - Lợi ích
  - Mô tả
  - Tác động

#### F. KẾ HOẠCH TIẾP THEO
- Bảng kế hoạch:
  - Ưu tiên (Cao/Trung bình/Thấp)
  - Công việc
  - Thời gian dự kiến

### 5. Template dữ liệu

#### Commit Analysis Template:
```javascript
const commitAnalysis = {
    totalCommits: 0,
    commitsByType: {
        infrastructure: [],
        feature: [],
        bugfix: [],
        documentation: [],
        testing: [],
        refactor: []
    },
    servicesUpdated: [],
    filesChanged: [],
    workingTime: "0h",
    keyAchievements: []
};
```

#### Services Mapping:
```javascript
const services = {
    'ai-processing-service': { type: 'FastAPI', port: 8017 },
    'api-gateway-bff': { type: 'Next.js', port: 8000 },
    'authentication-identity-service': { type: 'Spring Boot', port: 8001 },
    'contract-management-service': { type: 'Spring Boot', port: 8003 },
    'file-storage-asset-service': { type: 'FastAPI', port: 8012 },
    'user-management-service': { type: 'FastAPI', port: 8002 },
    'versioning-document-history-service': { type: 'FastAPI', port: 8004 },
    'commenting-collaboration-service': { type: 'FastAPI', port: 8005 },
    'approval-workflow-service': { type: 'FastAPI', port: 8006 },
    'reminder-scheduler-service': { type: 'FastAPI', port: 8007 },
    'esignature-integration-service': { type: 'FastAPI', port: 8008 },
    'notification-service': { type: 'FastAPI', port: 8009 },
    'reporting-analytics-service': { type: 'FastAPI', port: 8010 },
    'ocr-document-extraction-service': { type: 'FastAPI', port: 8011 },
    'audit-activity-log-service': { type: 'FastAPI', port: 8013 },
    'integration-connectors-service': { type: 'FastAPI', port: 8014 },
    'batch-etl-service': { type: 'FastAPI', port: 8015 },
    'health-monitoring-agent': { type: 'FastAPI', port: 8016 },
    'general-file-management-service': { type: 'FastAPI', port: 8018 }
};
```

### 6. Quy tắc phân loại commit

#### Infrastructure:
- `chore:`, `fix:`, `feat:` liên quan đến git workflow
- `chore(env):`, `feat(env):` - environment management
- `chore(docker):`, `feat(docker):` - docker configuration
- `chore(ci):`, `feat(ci):` - CI/CD pipeline

#### Feature:
- `feat:` - tính năng mới
- `feat(api):` - API endpoints mới
- `feat(ui):` - giao diện người dùng

#### Bugfix:
- `fix:` - sửa lỗi
- `hotfix:` - sửa lỗi khẩn cấp

#### Documentation:
- `docs:` - tài liệu
- `chore(docs):` - cập nhật tài liệu

#### Testing:
- `test:` - test cases
- `chore(test):` - cấu hình test

#### Refactor:
- `refactor:` - tối ưu code
- `chore(refactor):` - cleanup code

### 7. Tự động hóa

#### Script tự động tạo báo cáo:
```bash
#!/bin/bash
# Tạo báo cáo tự động

DATE=$(date +%Y-%m-%d)
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)

echo "Tạo báo cáo cho ngày: $YESTERDAY"

# Thu thập dữ liệu
COMMITS=$(git log --since="yesterday 00:00:00 +0700" --until="today 00:00:00 +0700" --oneline | wc -l)
FILES=$(git log --since="yesterday 00:00:00 +0700" --until="today 00:00:00 +0700" --name-only --pretty=format: | sort | uniq | grep -v "^$" | wc -l)

echo "Số commit: $COMMITS"
echo "Số files thay đổi: $FILES"

# Tạo file HTML (sẽ được implement bởi AI)
echo "Tạo file báo cáo: bao-cao-$YESTERDAY.html"
```

### 8. Lưu ý quan trọng

#### Múi giờ:
- **Luôn sử dụng UTC+7** (múi giờ Việt Nam)
- Format: `+0700` trong git log commands
- Hiển thị thời gian theo định dạng: `YYYY-MM-DD HH:MM:SS +0700`

#### Tên file báo cáo:
- Format: `bao-cao-YYYY-MM-DD.html`
- Ví dụ: `bao-cao-2025-09-19.html`

#### Nội dung báo cáo:
- Không hiển thị thông tin báo cáo viên
- Tập trung vào kết quả công việc
- Sử dụng emoji để làm nổi bật
- Giao diện responsive, dễ đọc

### 9. Ví dụ sử dụng

```bash
# Chạy command tạo báo cáo
make-report

# Kết quả: Tạo file bao-cao-2025-09-19.html
# Mở file bằng trình duyệt để xem và chụp ảnh
```

### 10. Troubleshooting

#### Nếu không có commit nào:
- Hiển thị thông báo "Không có hoạt động nào trong ngày hôm qua"
- Vẫn tạo file HTML với thông báo

#### Nếu có lỗi git:
- Kiểm tra repository có sạch không
- Kiểm tra múi giờ hệ thống
- Fallback về UTC nếu cần

---

**Lưu ý**: Command này sẽ được thực hiện bởi AI assistant để tạo báo cáo HTML chuyên nghiệp với dữ liệu thực tế từ git log.
