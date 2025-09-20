# Loading States Implementation - DocGO

## Tổng quan
Đã triển khai thành công hệ thống loading states cho Next.js App Router với các tính năng:
- ✅ Metadata configuration với metadataBase
- ✅ Loading.tsx files cho route segments
- ✅ Browser tab loading indicator
- ✅ Skeleton components cho UX tốt hơn
- ✅ Global loading provider

## Vấn đề đã giải quyết

### 1. ⚠️ Metadata Warning
**Vấn đề:** `metadata.metadataBase is not set for resolving social open graph or twitter images`
**Giải pháp:** 
- Thêm `metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')`
- Cấu hình OpenGraph và Twitter images
- Tạo file `.env.local` với NEXT_PUBLIC_APP_URL

### 2. 🖥️ Tab Browser Loading State
**Vấn đề:** Tab browser không hiển thị loading khi Next.js đang compile
**Giải pháp:**
- `PageTransition` component: Cập nhật title tab với animation dots
- `LoadingProvider` context: Quản lý loading state toàn cục
- `NavigationLink` component: Tự động hiển thị loading khi navigate

### 3. 📱 UI Loading States
**Vấn đề:** Màn hình "đơ" khi compile trang mới
**Giải pháp:**
- `loading.tsx` files cho mỗi route segment
- Skeleton components với animation
- Loading overlay với backdrop blur

## Cấu trúc Files

### Backend (không thay đổi)
- Không có thay đổi backend

### Frontend
```
frontend/web_nextjs/src/
├── app/
│   ├── layout.tsx                 # ✅ Updated: metadataBase + providers
│   ├── loading.tsx                # ✅ New: Global loading
│   ├── dashboard/
│   │   └── loading.tsx            # ✅ New: Dashboard skeleton
│   └── contracts/
│       └── loading.tsx            # ✅ New: Contracts skeleton
├── components/
│   ├── LoadingProvider.tsx        # ✅ New: Global loading context
│   ├── PageTransition.tsx         # ✅ New: Route transition loading
│   └── NavigationLink.tsx         # ✅ New: Link with loading
├── hooks/
│   └── usePageLoading.ts          # ✅ New: Loading hooks
└── .env.local                     # ✅ New: Environment config
```

## Cách Test

### 1. Test Metadata
```bash
# Chạy frontend
cd frontend/web_nextjs
npm run dev

# Kiểm tra:
# - Không còn warning về metadataBase
# - Social media preview hoạt động
# - Tab title hiển thị đúng
```

### 2. Test Loading States
```bash
# Truy cập http://localhost:3000
# Navigate giữa các trang:
# - /dashboard
# - /contracts
# - /contracts/[id]

# Kiểm tra:
# - Tab title hiển thị "Đang tải..." với animation
# - Loading overlay xuất hiện khi navigate
# - Skeleton components hiển thị đúng
# - Không có màn hình "đơ"
```

### 3. Test Browser Tab Loading
```bash
# Mở Developer Tools > Network tab
# Navigate giữa các trang
# Quan sát:
# - Tab title thay đổi với dots animation
# - Loading indicator trong tab
# - Smooth transition giữa các trang
```

## Tính năng mới

### 1. 🎯 Browser Tab Loading
- **Title Animation:** "Đang tải...", "Đang tải....", "Đang tải....."
- **Visual Feedback:** User biết trang đang load
- **Smooth Transition:** Không có màn hình trắng

### 2. 🎨 Skeleton Loading
- **Dashboard:** Stats cards, charts, activity list
- **Contracts:** Grid view với cards, filters, pagination
- **Responsive:** Hoạt động tốt trên mobile

### 3. 🔄 Global Loading Provider
- **Context API:** Quản lý loading state toàn cục
- **Navigation Links:** Tự động hiển thị loading
- **Programmatic Navigation:** Hook cho router.push với loading

### 4. 📱 Loading Overlay
- **Backdrop Blur:** Hiệu ứng đẹp mắt
- **Non-blocking:** Không chặn user interaction
- **Auto-hide:** Tự động ẩn sau khi load xong

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Performance Impact

### ✅ Cải thiện
- **UX tốt hơn:** User biết trang đang load
- **Professional:** Loading states đẹp mắt
- **SEO:** Metadata đầy đủ cho social sharing

### ⚠️ Lưu ý
- **Bundle size:** Tăng nhẹ do thêm components
- **Memory usage:** Loading context được mount toàn cục
- **Animation:** Sử dụng CSS animations, không ảnh hưởng performance

## Troubleshooting

### 1. Loading không hiển thị
```bash
# Kiểm tra:
# - LoadingProvider đã wrap children
# - PageTransition đã được sử dụng
# - NavigationLink thay vì Link thường
```

### 2. Metadata warning vẫn còn
```bash
# Kiểm tra:
# - .env.local có NEXT_PUBLIC_APP_URL
# - metadataBase được set đúng
# - Restart dev server
```

### 3. Tab title không thay đổi
```bash
# Kiểm tra:
# - Browser có hỗ trợ document.title
# - useEffect chạy đúng
# - Không có lỗi JavaScript
```

## Kết quả
- ✅ **Giải quyết warning metadata**
- ✅ **Tab browser hiển thị loading state**
- ✅ **UI không bị "đơ" khi compile**
- ✅ **UX chuyên nghiệp với skeleton loading**
- ✅ **Tương thích Next.js App Router**
- ✅ **Performance tối ưu**
