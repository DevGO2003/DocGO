# DocGO Web Frontend

Nền tảng quản lý tài liệu và hợp đồng thông minh, được xây dựng với Next.js 14 và TypeScript.

## 🚀 Tính năng chính

- **Quản lý hợp đồng**: Tạo, chỉnh sửa và theo dõi vòng đời hợp đồng
- **Xử lý AI**: Trích xuất và tóm tắt tài liệu tự động
- **Quản lý người dùng**: Hệ thống phân quyền và quản lý tài khoản
- **Lưu trữ tài liệu**: Hệ thống lưu trữ đám mây an toàn
- **Báo cáo & Phân tích**: Theo dõi hiệu suất và tạo báo cáo chi tiết
- **Giao diện responsive**: Tối ưu cho mọi thiết bị
- **Authentication**: Hệ thống đăng nhập/đăng ký hoàn chỉnh
- **API Gateway Integration**: Tích hợp với API Gateway BFF

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Data Fetching**: SWR
- **API Gateway**: Next.js BFF với proxy routing

## 🔗 API Gateway Integration

Frontend được tích hợp với API Gateway BFF để giao tiếp với các microservices:

### Cấu trúc API
```
Frontend (Port 3001) → API Gateway BFF (Port 8000) → Microservices
```

### Microservices được hỗ trợ
- **authentication-identity-service** (Port 8001) - Xác thực và quản lý danh tính
- **user-management-service** (Port 8002) - Quản lý người dùng
- **contract-management-service** (Port 8003) - Quản lý hợp đồng
- **ai-processing-service** (Port 8017) - Xử lý AI
- **file-storage-asset-service** (Port 8012) - Lưu trữ tài liệu

### API Endpoints
- `POST /api/v1/authentication-identity-service/auth/login` - Đăng nhập
- `POST /api/v1/authentication-identity-service/auth/register` - Đăng ký
- `GET /api/v1/contract-management-service/contracts` - Lấy danh sách hợp đồng
- `POST /api/v1/ai-processing-service/extract` - Trích xuất văn bản
- `POST /api/v1/ai-processing-service/summarize` - Tóm tắt văn bản

## 📁 Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout với AuthProvider
│   ├── page.tsx           # Trang chủ
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Trang đăng nhập
│   │   └── register/      # Trang đăng ký
│   ├── contracts/         # Trang quản lý hợp đồng
│   ├── ai-processing/     # Trang xử lý AI
│   ├── dashboard/         # Dashboard
│   ├── privacy/           # Chính sách bảo mật
│   ├── terms/             # Điều khoản sử dụng
│   ├── test-api/          # Test API Gateway
│   └── globals.css        # CSS toàn cục
├── components/            # React components
│   ├── ui/               # UI components cơ bản
│   │   ├── Button.tsx    # Component Button
│   │   ├── Input.tsx     # Component Input
│   │   ├── Card.tsx      # Component Card
│   │   └── index.ts      # Export tất cả UI components
│   ├── layout/           # Layout components
│   │   ├── Header.tsx    # Header component
│   │   ├── Footer.tsx    # Footer component
│   │   ├── MainLayout.tsx # Layout chính
│   │   └── index.ts      # Export layout components
│   └── Sidebar.tsx       # Sidebar navigation
├── hooks/                 # Custom React hooks
│   └── useAuth.ts        # Authentication hook
├── lib/                   # Thư viện và utilities
│   ├── api.ts            # API client và services
│   └── constants.ts      # Constants và configuration
├── types/                 # TypeScript type definitions
│   └── index.ts          # Common types và interfaces
└── utils/                 # Utility functions
    ├── cn.ts             # Class name utility
    └── helpers.ts        # Helper functions
```

## 🚀 Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình môi trường
Tạo file `.env.local` từ `env.example`:
```bash
cp env.example .env.local
```

Cấu hình trong `.env.local`:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Authentication
NEXT_PUBLIC_AUTH_ENABLED=true

# Development
NODE_ENV=development
```

### 3. Chạy development server
```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3001`

### 4. Chạy API Gateway BFF
Đảm bảo API Gateway BFF đang chạy tại port 8000:
```bash
cd backend/api-gateway-bff
npm install
npm run dev
```

### 5. Chạy các microservices
Đảm bảo các microservices cần thiết đang chạy:
- authentication-identity-service (Port 8001)
- user-management-service (Port 8002)
- contract-management-service (Port 8003)
- ai-processing-service (Port 8017)
- file-storage-asset-service (Port 8012)

## 🧪 Testing API Gateway

Truy cập trang test API Gateway tại: `http://localhost:3001/test-api`

Trang này cho phép:
- Test health check của API Gateway
- Test authentication API
- Xem thông tin về các services
- Kiểm tra kết nối đến microservices

## 🎨 UI Components

### Button Component
```tsx
import { Button } from '@/components/ui/Button'

<Button variant="primary" size="lg" loading={isLoading}>
  Click me
</Button>
```

**Variants**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
**Sizes**: `default`, `sm`, `lg`, `icon`

### Input Component
```tsx
import { Input } from '@/components/ui/Input'

<Input
  label="Email"
  type="email"
  error="Email không hợp lệ"
  leftIcon={<MailIcon />}
/>
```

### Card Component
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

<Card>
  <CardHeader>
    <CardTitle>Tiêu đề</CardTitle>
  </CardHeader>
  <CardContent>
    Nội dung card
  </CardContent>
</Card>
```

## 🏗️ Layout System

### MainLayout
Layout chính cho toàn bộ ứng dụng với sidebar và header.

### AuthLayout
Layout cho các trang authentication (login, register).

### PublicLayout
Layout cho các trang công khai (landing page, privacy, terms).

### DashboardLayout
Layout cho dashboard với sidebar navigation.

## 🔐 Authentication System

### useAuth Hook
```tsx
import { useAuth } from '@/hooks/useAuth'

const { user, login, register, logout, loading } = useAuth()
```

### Protected Routes
```tsx
import { useRequireAuth } from '@/hooks/useAuth'

export default function ProtectedPage() {
  useRequireAuth()
  return <div>Protected content</div>
}
```

### Role-based Access
```tsx
import { useRequireRole } from '@/hooks/useAuth'

export default function AdminPage() {
  useRequireRole('ADMIN')
  return <div>Admin content</div>
}
```

## 📡 API Integration

### API Client
```tsx
import { authAPI, contractAPI, aiProcessingAPI } from '@/lib/api'

// Authentication
const response = await authAPI.login({ username, password })

// Contracts
const contracts = await contractAPI.getContracts()

// AI Processing
const result = await aiProcessingAPI.extractText(file)
```

### Error Handling
API client tự động xử lý:
- Authentication errors (401)
- Authorization errors (403)
- Network errors
- Server errors (500)

## 🎯 Available Pages

- `/` - Trang chủ
- `/auth/login` - Đăng nhập
- `/auth/register` - Đăng ký
- `/dashboard` - Dashboard
- `/contracts` - Quản lý hợp đồng
- `/ai-processing` - Xử lý AI
- `/privacy` - Chính sách bảo mật
- `/terms` - Điều khoản sử dụng
- `/test-api` - Test API Gateway

## 🔧 Development

### Type Checking
```bash
npm run type-check
```

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | API Gateway URL | `http://localhost:8000` |
| `NEXT_PUBLIC_AUTH_ENABLED` | Enable authentication | `true` |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Gemini API key (optional) | - |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.