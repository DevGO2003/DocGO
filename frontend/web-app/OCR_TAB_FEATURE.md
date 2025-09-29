# OCR Tab Feature - Tạo hợp đồng nhanh

## 🎯 Tổng quan
Đã thêm tab OCR Upload vào trang tạo hợp đồng (`/dashboard/create-contract`) để người dùng có thể sử dụng OCR để trích xuất thông tin từ file hoặc văn bản.

## ✨ Tính năng mới

### 1. Tab System
- **OCR Upload** (tab đầu tiên - mặc định): Sử dụng OCR để trích xuất thông tin
- **Upload tài liệu** (tab thứ hai): Upload file bình thường không cần OCR
- **Tạo thủ công** (tab thứ ba): Form nhập liệu thủ công như trước

### 2. OCR Upload Tab
- **Upload File**: Hỗ trợ PDF, DOCX, TXT (tối đa 10MB)
- **Nhập văn bản**: Nhập trực tiếp nội dung hợp đồng
- **Drag & Drop**: Kéo thả file vào vùng upload
- **Auto-fill**: Tự động điền form với kết quả OCR

### 3. Upload Tài liệu Tab
- **Upload File**: Hỗ trợ tất cả loại file (PDF, DOCX, TXT, JPG, PNG, etc.)
- **Drag & Drop**: Kéo thả file vào vùng upload
- **Auto-fill**: Tự động điền tên file vào form
- **File Storage**: Upload file lên file storage service

### 4. API Integration
- **AI Processing Service**: Sử dụng API thật khi có sẵn
- **Mock API Fallback**: Tự động chuyển sang mock API nếu AI service không khả dụng
- **Error Handling**: Xử lý lỗi và hiển thị thông báo rõ ràng

## 🛠️ Cấu trúc Code

### Files đã tạo/sửa đổi:
1. `src/components/OCRUpload.tsx` - Component OCR upload riêng biệt
2. `src/app/dashboard/create-contract/page.tsx` - Thêm tab system và tích hợp OCR

### API Endpoints:
- `/api/v1/ai-processing-service/extract` - Trích xuất văn bản từ file
- `/api/v1/ai-processing-service/summarize` - Tóm tắt hợp đồng
- `/api/v1/file-storage-asset-service/upload` - Upload file lên storage
- `/api/mock/ocr` - Mock API fallback

## 🎨 UI/UX

### Design giống Quick Create:
- Header với gradient teal-green
- Card upload với drag & drop
- Button "Trích xuất thông tin" và "Xóa dữ liệu"
- Hiển thị kết quả OCR và lỗi

### Responsive:
- Mobile-friendly
- Touch support cho drag & drop
- Loading states và error handling

## 🚀 Cách sử dụng

1. Truy cập `/dashboard/create-contract`
2. Tab "OCR Upload" sẽ được chọn mặc định
3. Chọn phương thức:
   - **Upload File**: Kéo thả hoặc click chọn file
   - **Nhập văn bản**: Gõ trực tiếp nội dung
4. Click "Trích xuất thông tin"
5. Kết quả sẽ tự động điền vào form
6. Có thể chuyển sang tab "Tạo thủ công" để chỉnh sửa

## 🔧 Technical Details

### State Management:
- `activeTab`: 'ocr' | 'upload' | 'manual'
- `ocrResult`: Kết quả OCR
- `ocrError`: Lỗi OCR
- `ocrLoading`: Trạng thái loading
- `uploadedFile`: File đã upload
- `uploadError`: Lỗi upload
- `uploadLoading`: Trạng thái upload
- `dragActive`: Trạng thái drag & drop

### Error Handling:
- AI service không khả dụng → Fallback mock API
- File storage service không khả dụng → Simulate upload
- File không hỗ trợ → Hiển thị lỗi
- Network error → Retry mechanism

### Performance:
- Lazy loading component
- Optimized re-renders
- Efficient state updates

## 📱 Mobile Support
- Touch-friendly drag & drop
- Responsive layout
- Mobile-optimized buttons
- Swipe gestures support

## 🎯 Next Steps
1. Test với AI Processing Service thật
2. Thêm progress bar cho upload
3. Thêm preview file trước khi upload
4. Thêm batch upload multiple files
5. Thêm OCR result validation

## 🐛 Known Issues
- Chưa có progress bar cho upload lớn
- Chưa có preview file
- Chưa có validation OCR result

## 📝 Notes
- Tab OCR được đặt ở vị trí đầu tiên vì người dùng thích sử dụng OCR hơn
- Mock API được sử dụng làm fallback để đảm bảo tính năng luôn hoạt động
- Component OCRUpload có thể tái sử dụng ở các trang khác
