### Giới thiệu

Web frontend của DocGO được xây dựng bằng React + Vite + TypeScript và TailwindCSS.

### Cách chạy (How to run)

Prerequisites:
- Node.js 18+ (khuyến nghị LTS 18.x hoặc 20.x)
- npm 9+ (hoặc dùng yarn/pnpm nếu quen thuộc)

Run (PowerShell):
```powershell
cd frontend/web
npm install
npm run dev
```

Ứng dụng chạy tại: `http://localhost:5173`

Environment (tùy chọn):
- Nếu cần cấu hình endpoint API, tạo file `.env.local` và khai báo biến theo quy ước của Vite (bắt đầu bằng `VITE_...`). Ví dụ:
```
VITE_API_BASE_URL=http://localhost:8000/api
```


