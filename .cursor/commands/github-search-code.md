# GitHub Search Code Command

## Mục đích
Tìm kiếm code trên GitHub repositories.

## Cách sử dụng
```bash
/github-search-code <query> [order] [page] [per_page]
```

## Tham số
- `<query>`: Search query theo GitHub search syntax (bắt buộc)
- `[order]`: Thứ tự sắp xếp (asc, desc) (tùy chọn, mặc định: desc)
- `[page]`: Số trang (tùy chọn, mặc định: 1)
- `[per_page]`: Số kết quả mỗi trang (tùy chọn, mặc định: 30, tối đa: 100)

## Quy trình thực hiện

### 1. 🔍 Xác định search query
- Kiểm tra query syntax hợp lệ
- Validate search parameters
- Hiển thị thông tin search

### 2. 🔎 Thực hiện tìm kiếm
- Gọi `mcp_Github_search_code` với parameters
- Xử lý lỗi search nếu có
- Lấy kết quả search

### 3. 📊 Phân tích kết quả
- Hiển thị code tìm được
- Phân tích patterns trong results
- Gợi ý code phù hợp

## Kết quả mong đợi
- 📊 **Code results** tìm được
- 📈 **Search patterns** analysis
- 🎯 **Gợi ý** code phù hợp
- ✅ **Thông tin** search query và pagination

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi search và pagination

## Ví dụ sử dụng
```
/github-search-code "docgo microservices"
/github-search-code "spring boot fastapi" --order asc --page 2
/github-search-code "user:devgo2003 filename:package.json"
```

## Troubleshooting
- **Query không hợp lệ**: Kiểm tra GitHub search syntax
- **No results**: Gợi ý query khác
- **Rate limit**: Chờ và thử lại
- **Invalid parameters**: Kiểm tra page và per_page values

