# GitHub Search Users Command

## Mục đích
Tìm kiếm users trên GitHub.

## Cách sử dụng
```bash
/github-search-users <query> [order] [page] [per_page] [sort]
```

## Tham số
- `<query>`: Search query theo GitHub search syntax (bắt buộc)
- `[order]`: Thứ tự sắp xếp (asc, desc) (tùy chọn, mặc định: desc)
- `[page]`: Số trang (tùy chọn, mặc định: 1)
- `[per_page]`: Số kết quả mỗi trang (tùy chọn, mặc định: 30, tối đa: 100)
- `[sort]`: Sắp xếp theo (followers, repositories, joined) (tùy chọn)

## Quy trình thực hiện

### 1. 🔍 Xác định search query
- Kiểm tra query syntax hợp lệ
- Validate search parameters
- Hiển thị thông tin search

### 2. 🔎 Thực hiện tìm kiếm
- Gọi `mcp_Github_search_users` với parameters
- Xử lý lỗi search nếu có
- Lấy kết quả search

### 3. 📊 Phân tích kết quả
- Hiển thị users tìm được
- Phân tích patterns trong results
- Gợi ý users phù hợp

## Kết quả mong đợi
- 📊 **Users** tìm được
- 📈 **Search patterns** analysis
- 🎯 **Gợi ý** users phù hợp
- ✅ **Thông tin** search query và pagination

## Lưu ý quan trọng
- **BẮT BUỘC** sử dụng MCP GitHub Server
- **KHÔNG được** tạo file script
- **CHỈ được** sử dụng MCP tools có sẵn
- **Tự động** xử lý lỗi search và pagination

## Ví dụ sử dụng
```
/github-search-users "docgo developer"
/github-search-users "spring boot fastapi" --order asc --page 2
/github-search-users "location:vietnam language:javascript"
```

## Troubleshooting
- **Query không hợp lệ**: Kiểm tra GitHub search syntax
- **No results**: Gợi ý query khác
- **Rate limit**: Chờ và thử lại
- **Invalid parameters**: Kiểm tra page và per_page values
