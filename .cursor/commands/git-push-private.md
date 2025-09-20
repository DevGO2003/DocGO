# Git Push Private - AI-Powered Smart Merge (Bash-only)

## Nguyên tắc

- **Chỉ còn một chế độ Smart Merge**
- **Không tham số**: push vào `private/<current-branch>`
- **Có tham số**: ngoài `private/<current-branch>` còn push thêm vào `private/<param>`
- **Env files**: được force-add tạm thời để push vào private nhưng không bị track ở origin
- **Đồng bộ**: sau khi push, đồng bộ lại local từ `private/<current-branch>`

## Luồng thực thi chi tiết

### 1. Xác định nhánh hiện tại
- Nếu không có, mặc định là `main`

### 2. Backup env (Smart Backup)
- Copy toàn bộ các file `.env` (bao gồm `.env.local`, `.env.example`,...) vào một thư mục được đặt tên theo thời gian trong `.git-backup/env/`
- Thao tác này là một phần của thuật toán Smart Backup, giúp bạn có thể khôi phục lại trạng thái ban đầu nếu có lỗi xảy ra

### 3. Kiểm tra env trong Git (Security Check)
- Áp dụng thuật toán Security Check
- Hệ thống sẽ tự động quét để xem có file `.env` nào đang bị Git theo dõi
- Nếu có, nó sẽ:
  - Unstage các file này khỏi index
  - Xóa chúng khỏi tracking (`git rm --cached`)
  - Tạo một commit dọn dẹp riêng trước khi push
  - Đảm bảo kho lưu trữ công khai (origin) luôn sạch sẽ và an toàn

### 4. Push code lên origin (không env)
- Stage và commit toàn bộ các thay đổi code
- Lúc này, các file `.env` đã được bỏ theo dõi nên sẽ không được đưa vào commit
- Cuối cùng, push lên `origin/<current-branch>`

### 5. Push code + env lên private

#### 5.1. Force-add env files
- Sử dụng lệnh `git add -f` để tạm thời force-add các file `.env` vào index
- Tạo một commit riêng cho các file env này

#### 5.2. Đồng bộ hóa hai chiều (Bidirectional Sync)
- **Lần 1**: Thực thi thuật toán AI-Powered Smart Merge để hợp nhất các file `.env` từ kho lưu trữ cục bộ của bạn vào `private/<current-branch>`
- **Lần 2**: Nếu có tham số, thực hiện tương tự để hợp nhất vào `private/<param>`

#### 5.3. Cleanup local history
- Sau khi push thành công, sử dụng `git reset --soft HEAD~1` để loại bỏ commit env vừa tạo
- Sau đó sử dụng `git reset HEAD` để unstage các file .env
- **QUAN TRỌNG**: Không sử dụng `git reset --hard` vì sẽ xóa file .env khỏi working directory
- Giữ cho lịch sử cục bộ của bạn sạch sẽ mà không mất file .env

### 6. Đồng bộ lại local từ private
- Fetch từ private
- Thực hiện `git reset --soft private/<current-branch>` để đồng bộ hoàn toàn kho lưu trữ cục bộ với trạng thái mới nhất của private
- **QUAN TRỌNG**: Sử dụng `--soft` thay vì `--hard` để giữ file .env trong working directory

### 7. Ngăn env bị track ở local
- Sử dụng `.git/info/exclude` để ngăn Git theo dõi các file `.env` vĩnh viễn trên kho lưu trữ cục bộ
- Đảm bảo chúng chỉ tồn tại trong working directory
- Bạn cũng có thể thiết lập các pre-push hook để chặn bất kỳ nỗ lực nào nhằm push các file này lên origin

### 8. Pull để đồng bộ hoàn chỉnh
- Thực hiện `git pull private <current-branch>` để đảm bảo kho lưu trữ cục bộ của bạn có cùng một bản sao hoàn chỉnh với private
- Bao gồm cả các file `.env` không bị theo dõi

## Chi tiết về AI-Powered Smart Merge

Trong bước 5, khi thực hiện hợp nhất các file `.env`, thuật toán AI-Powered Smart Merge sẽ diễn ra như sau:

### Phân tích nội dung
- So sánh nội dung của file `.env` cục bộ và từ xa
- Xác định các khóa (key) có ở cả hai nơi, các khóa chỉ có ở cục bộ hoặc chỉ có ở từ xa
- Đếm số lượng xung đột
- Phân tích ngữ cảnh, như các khóa bí mật (API_KEY), cấu hình cơ sở dữ liệu (DATABASE_URL), hay cấu hình dịch vụ (_SERVICE_URL) để chuẩn bị cho việc ra quyết định

### Động cơ ra quyết định
Dựa trên phân tích ngữ cảnh, thuật toán áp dụng các quy tắc ưu tiên:

- **Ưu tiên Remote cho Database**: Nếu khóa là `MONGODB_URI` hoặc `DATABASE_URL`, nó sẽ chọn giá trị từ xa
- **Ưu tiên Local cho API Keys**: Nếu khóa là `API_KEY` hoặc `SECRET`, nó sẽ chọn giá trị cục bộ
- **Ưu tiên Local cho Port/Host**: Các khóa như `SERVER_PORT` sẽ ưu tiên giá trị cục bộ để phù hợp với môi trường hiện tại
- **Hợp nhất Logic**: Các khóa như `DEBUG` hoặc cờ tính năng sẽ được hợp nhất bằng logic (ví dụ: `true` nếu một trong hai giá trị là `true`)

### Kiểm tra và Thử lại
- Sau khi hợp nhất, thuật toán sẽ kiểm tra tính hợp lệ của file `.env` mới
- Nếu kiểm tra thất bại (ví dụ: thiếu một khóa bắt buộc), thuật toán sẽ tự động thử lại với một chiến lược hợp nhất khác (như ưu tiên hoàn toàn cục bộ) trước khi quyết định thất bại
- Kích hoạt Smart Rollback để khôi phục trạng thái ban đầu
- Đảm bảo tính toàn vẹn của file

## Cách sử dụng

```bash
# Push vào private/<current-branch>
./git-push-private.sh

# Push vào private/<current-branch> và private/<param>
./git-push-private.sh <param>
```

## Lưu ý quan trọng

- Script này chỉ hoạt động trên Bash
- Đảm bảo có quyền truy cập vào remote `private`
- Các file `.env` sẽ được backup tự động trước khi xử lý
- Smart Merge đảm bảo không mất dữ liệu quan trọng trong quá trình đồng bộ

## ⚠️ Cảnh báo về file .env

- **KHÔNG BAO GIỜ** sử dụng `git reset --hard` trong quá trình cleanup
- **LUÔN SỬ DỤNG** `git reset --soft` để giữ file .env trong working directory
- **BACKUP TỰ ĐỘNG** được tạo trước mỗi lần thực thi để khôi phục nếu cần
- **KIỂM TRA** file .env sau khi thực thi script để đảm bảo không bị mất

## 🔧 Khôi phục file .env nếu bị mất

Nếu file .env bị mất do lỗi script, sử dụng lệnh sau để khôi phục:

```bash
# Tìm backup mới nhất
latest_backup=$(ls -t .git-backup/env/ | head -1)

# Khôi phục tất cả file .env
find .git-backup/env/$latest_backup -name ".env*" | while read file; do
    target=$(echo $file | sed "s|.git-backup/env/$latest_backup/||")
    mkdir -p $(dirname "$target")
    cp "$file" "$target"
    echo "Restored: $target"
done
```
