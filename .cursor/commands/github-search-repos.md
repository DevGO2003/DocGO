# GitHub Search Repositories Command

## Mục đích
Tìm kiếm repositories trên GitHub theo query.

## Cách sử dụng
```bash
/github-search-repos <query> [page] [perPage]
```

## Tham số
- `<query>`: Search query theo GitHub search syntax (bắt buộc)
- `[page]`: Số trang (mặc định: 1)
- `[perPage]`: Số kết quả mỗi trang (mặc định: 30, tối đa: 100)

## Quy trình thực hiện

### 1. 🔍 Xác định search query
- Kiểm tra query syntax hợp lệ
- Validate search parameters
- Hiển thị thông tin search

### 2. 🔎 Thực hiện tìm kiếm
- Gọi `mcp_Github_search_repositories` với parameters
- Xử lý lỗi search nếu có
- Lấy kết quả search

### 3. 📊 Phân tích kết quả
- Hiển thị repositories tìm được
- Phân tích patterns trong results
- Gợi ý repositories phù hợp

## Kết quả mong đợi
- 📊 **Repositories** tìm được
- 📈 **Search results** analysis
- 🎯 **Gợi ý** repositories phù hợp
- ✅ **Thông tin** search query và pagination

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi search và pagination

## Ví dụ sử dụng
```
/github-search-repos "docgo microservices"
/github-search-repos "spring boot fastapi" --page 2 --perPage 50
/github-search-repos "user:devgo2003"
```

## Troubleshooting
- **Query không hợp lệ**: Kiểm tra GitHub search syntax
- **No results**: Gợi ý query khác
- **Rate limit**: Chờ và thử lại
- **Invalid parameters**: Kiểm tra page và perPage values
