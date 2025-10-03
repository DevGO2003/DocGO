# GitHub Search Issues Command

## Mục đích
Tìm kiếm issues và pull requests trên GitHub repositories.

## Cách sử dụng
```bash
/github-search-issues <query> [order] [page] [per_page] [sort]
```

## Tham số
- `<query>`: Search query theo GitHub search syntax (bắt buộc)
- `[order]`: Thứ tự sắp xếp (asc, desc) (tùy chọn, mặc định: desc)
- `[page]`: Số trang (tùy chọn, mặc định: 1)
- `[per_page]`: Số kết quả mỗi trang (tùy chọn, mặc định: 30, tối đa: 100)
- `[sort]`: Sắp xếp theo (comments, reactions, reactions-+1, reactions--1, reactions-smile, reactions-thinking_face, reactions-heart, reactions-tada, interactions, created, updated) (tùy chọn)

## Quy trình thực hiện

### 1. 🔍 Xác định search query
- Kiểm tra query syntax hợp lệ
- Validate search parameters
- Hiển thị thông tin search

### 2. 🔎 Thực hiện tìm kiếm
- Gọi `mcp_Github_search_issues` với parameters
- Xử lý lỗi search nếu có
- Lấy kết quả search

### 3. 📊 Phân tích kết quả
- Hiển thị issues/PRs tìm được
- Phân tích patterns trong results
- Gợi ý issues/PRs phù hợp

## Kết quả mong đợi
- 📊 **Issues/PRs** tìm được
- 📈 **Search patterns** analysis
- 🎯 **Gợi ý** issues/PRs phù hợp
- ✅ **Thông tin** search query và pagination

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi search và pagination

## Ví dụ sử dụng
```
/github-search-issues "docgo bug"
/github-search-issues "spring boot fastapi" --order asc --page 2
/github-search-issues "user:devgo2003 is:issue is:open"
```

## Troubleshooting
- **Query không hợp lệ**: Kiểm tra GitHub search syntax
- **No results**: Gợi ý query khác
- **Rate limit**: Chờ và thử lại
- **Invalid parameters**: Kiểm tra page và per_page values

