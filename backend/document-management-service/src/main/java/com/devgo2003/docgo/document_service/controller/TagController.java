package com.devgo2003.docgo.document_service.controller;

import com.devgo2003.docgo.document_service.common.response.RestResponse;
import com.devgo2003.docgo.document_service.dto.TagDto;
import com.devgo2003.docgo.document_service.service.ITagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/document-management-service/tags")
@Tag(name = "🏷️ APIs Quản lý Tags", description = "Các API để quản lý tags của hợp đồng trong hệ thống DocGO")
public class TagController {

    private final ITagService tagService;
    private final HttpServletRequest request;

    public TagController(ITagService tagService, HttpServletRequest request) {
        this.tagService = tagService;
        this.request = request;
    }

    @Operation(
        summary = "Lấy danh sách 10 tags phổ biến nhất", 
        description = """
        🔹 Đầu vào
        
        Không có tham số đầu vào.
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<TagDto>
        Mô tả: Danh sách 10 tags phổ biến nhất, được sắp xếp theo số lần sử dụng (giảm dần).
        Mỗi TagDto bao gồm:
        - name: Tên tag gốc (ví dụ: "ưu_tiên")
        - displayName: Tên tag đã format (ví dụ: "Ưu tiên")
        - count: Số lần sử dụng
        - isPopular: true (vì đây là danh sách popular)
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @GetMapping("/popular")
    public ResponseEntity<RestResponse<List<TagDto>>> getPopularTags() {
        List<TagDto> popularTags = tagService.getPopularTags();
        
        RestResponse<List<TagDto>> response = RestResponse.<List<TagDto>>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Danh sách 10 tags phổ biến nhất đã được lấy thành công.")
                .data(popularTags)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
        summary = "Lấy tất cả tags được sắp xếp theo tên", 
        description = """
        🔹 Đầu vào
        
        Không có tham số đầu vào.
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<TagDto>
        Mô tả: Danh sách tất cả tags, được sắp xếp theo tên (tăng dần).
        Mỗi TagDto bao gồm:
        - name: Tên tag gốc (ví dụ: "ưu_tiên")
        - displayName: Tên tag đã format (ví dụ: "Ưu tiên")
        - count: Số lần sử dụng
        - isPopular: false (vì đây là danh sách đầy đủ)
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @GetMapping("/all")
    public ResponseEntity<RestResponse<List<TagDto>>> getAllTags() {
        List<TagDto> allTags = tagService.getAllTags();
        
        RestResponse<List<TagDto>> response = RestResponse.<List<TagDto>>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Danh sách tất cả tags đã được lấy thành công.")
                .data(allTags)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
        summary = "Tìm kiếm tags theo từ khóa", 
        description = """
        🔹 Đầu vào
        
        📄 searchTerm (tùy chọn, query)
        Loại: string
        Mô tả: Từ khóa tìm kiếm tags (không phân biệt hoa thường). Nếu không có thì trả về tất cả tags.
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<TagDto>
        Mô tả: Danh sách tags phù hợp với từ khóa tìm kiếm, được sắp xếp theo tên (tăng dần).
        Mỗi TagDto bao gồm:
        - name: Tên tag gốc (ví dụ: "ưu_tiên")
        - displayName: Tên tag đã format (ví dụ: "Ưu tiên")
        - count: Số lần sử dụng
        - isPopular: false
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @GetMapping("/search")
    public ResponseEntity<RestResponse<List<TagDto>>> searchTags(@RequestParam(required = false) String searchTerm) {
        List<TagDto> searchResults = tagService.searchTags(searchTerm);
        
        RestResponse<List<TagDto>> response = RestResponse.<List<TagDto>>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Kết quả tìm kiếm tags đã được lấy thành công.")
                .data(searchResults)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @Operation(
        summary = "Lấy top 5 tags được sử dụng gần đây nhất", 
        description = """
        🔹 Đầu vào
        
        Không có tham số đầu vào.
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<TagDto>
        Mô tả: Danh sách 5 tags được sử dụng gần đây nhất, được sắp xếp theo thời gian sử dụng cuối cùng (giảm dần).
        Mỗi TagDto bao gồm:
        - name: Tên tag gốc (ví dụ: "ưu_tiên")
        - displayName: Tên tag đã format (ví dụ: "Ưu tiên")
        - count: Số lần sử dụng
        - isPopular: false
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @GetMapping("/top5-last-used")
    public ResponseEntity<RestResponse<List<TagDto>>> getTop5LastUsedTags() {
        List<TagDto> lastUsedTags = tagService.getTop5LastUsedTags();
        
        RestResponse<List<TagDto>> response = RestResponse.<List<TagDto>>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Danh sách 5 tags được sử dụng gần đây nhất đã được lấy thành công.")
                .data(lastUsedTags)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @Operation(
        summary = "Lấy top 5 tags được tạo mới gần đây nhất", 
        description = """
        🔹 Đầu vào
        
        Không có tham số đầu vào.
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<TagDto>
        Mô tả: Danh sách 5 tags được tạo mới gần đây nhất, được sắp xếp theo thời gian tạo (giảm dần).
        Mỗi TagDto bao gồm:
        - name: Tên tag gốc (ví dụ: "ưu_tiên")
        - displayName: Tên tag đã format (ví dụ: "Ưu tiên")
        - count: Số lần sử dụng
        - isPopular: false
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @GetMapping("/top5-last-created")
    public ResponseEntity<RestResponse<List<TagDto>>> getTop5LastCreatedTags() {
        List<TagDto> lastCreatedTags = tagService.getTop5LastCreatedTags();
        
        RestResponse<List<TagDto>> response = RestResponse.<List<TagDto>>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Danh sách 5 tags được tạo mới gần đây nhất đã được lấy thành công.")
                .data(lastCreatedTags)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @Operation(
        summary = "Cập nhật thống kê tags từ contracts", 
        description = """
        🔹 Đầu vào
        
        Không có tham số đầu vào.
        
        🔹 Đầu ra
        
        📝 data
        Loại: null
        Mô tả: Không có dữ liệu trả về.
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @PostMapping("/update-statistics")
    public ResponseEntity<RestResponse<Void>> updateTagStatistics() {
        tagService.updateTagStatistics();
        
        RestResponse<Void> response = RestResponse.<Void>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Thống kê tags đã được cập nhật thành công.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @Operation(
        summary = "Lấy tất cả tags với phân trang", 
        description = """
        🔹 Đầu vào
        
        📄 page (tùy chọn, query)
        Loại: integer
        Mô tả: Số trang (mặc định: 0).
        
        📄 size (tùy chọn, query)
        Loại: integer
        Mô tả: Kích thước trang (mặc định: 10).
        
        📄 sort (tùy chọn, query)
        Loại: string
        Mô tả: Trường sắp xếp (mặc định: name,asc).
        
        🔹 Đầu ra
        
        📝 data
        Loại: Page<TagDto>
        Mô tả: Danh sách tags có phân trang.
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @GetMapping("/paginated")
    public ResponseEntity<RestResponse<Page<TagDto>>> getAllTagsPaginated(Pageable pageable) {
        Page<TagDto> tags = tagService.getAllTags(pageable);
        
        RestResponse<Page<TagDto>> response = RestResponse.<Page<TagDto>>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Danh sách tags có phân trang đã được lấy thành công.")
                .data(tags)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
