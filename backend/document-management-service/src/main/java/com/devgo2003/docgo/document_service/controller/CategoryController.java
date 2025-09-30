package com.devgo2003.docgo.document_service.controller;

import com.devgo2003.docgo.document_service.common.response.RestResponse;
import com.devgo2003.docgo.document_service.dto.CategoryResponse;
import com.devgo2003.docgo.document_service.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * Controller cho quản lý categories, statuses và types
 */
@RestController
@RequestMapping("/api/v1/document-management-service/categories")
@Tag(name = "Category Management", description = "Quản lý danh mục hợp đồng")
@Validated
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;
    
    /**
     * Lấy tất cả categories
     */
    @GetMapping
    @Operation(
        summary = "Lấy danh sách tất cả categories",
        description = "Trả về danh sách tất cả categories với thông tin chi tiết"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Thành công"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<RestResponse<CategoryResponse>> getAllCategories() {
        CategoryResponse response = categoryService.getAllCategories();
        return ResponseEntity.ok(RestResponse.success(response));
    }
    
    /**
     * Lấy categories theo main category
     */
    @GetMapping("/{mainCategory}")
    @Operation(
        summary = "Lấy categories theo main category",
        description = "Trả về danh sách categories thuộc main category cụ thể"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Thành công"),
        @ApiResponse(responseCode = "400", description = "Main category không hợp lệ"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<RestResponse<CategoryResponse>> getCategoriesByMainCategory(
            @Parameter(description = "Main category", example = "COMMERCIAL")
            @PathVariable @NotBlank @Size(max = 50) String mainCategory) {
        
        CategoryResponse response = categoryService.getCategoriesByMainCategory(mainCategory);
        return ResponseEntity.ok(RestResponse.success(response));
    }
    
    /**
     * Lấy categories theo sub category
     */
    @GetMapping("/{mainCategory}/{subCategory}")
    @Operation(
        summary = "Lấy categories theo sub category",
        description = "Trả về danh sách categories thuộc sub category cụ thể"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Thành công"),
        @ApiResponse(responseCode = "400", description = "Sub category không hợp lệ"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<RestResponse<CategoryResponse>> getCategoriesBySubCategory(
            @Parameter(description = "Main category", example = "COMMERCIAL")
            @PathVariable @NotBlank @Size(max = 50) String mainCategory,
            @Parameter(description = "Sub category", example = "SALES")
            @PathVariable @NotBlank @Size(max = 50) String subCategory) {
        
        CategoryResponse response = categoryService.getCategoriesBySubCategory(mainCategory, subCategory);
        return ResponseEntity.ok(RestResponse.success(response));
    }
    
    /**
     * Tìm kiếm categories
     */
    @GetMapping("/search")
    @Operation(
        summary = "Tìm kiếm categories",
        description = "Tìm kiếm categories theo từ khóa"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Thành công"),
        @ApiResponse(responseCode = "400", description = "Từ khóa không hợp lệ"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<RestResponse<CategoryResponse>> searchCategories(
            @Parameter(description = "Từ khóa tìm kiếm", example = "sales")
            @RequestParam @NotBlank @Size(min = 2, max = 100) String query) {
        
        CategoryResponse response = categoryService.searchCategories(query);
        return ResponseEntity.ok(RestResponse.success(response));
    }
    
    /**
     * Lấy tất cả statuses
     */
    @GetMapping("/statuses")
    @Operation(
        summary = "Lấy danh sách tất cả statuses",
        description = "Trả về danh sách tất cả statuses với thông tin chi tiết"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Thành công"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<RestResponse<CategoryResponse.StatusResponse>> getAllStatuses() {
        CategoryResponse.StatusResponse response = categoryService.getAllStatuses();
        return ResponseEntity.ok(RestResponse.success(response));
    }
    
    /**
     * Lấy statuses có thể chuyển từ status hiện tại
     */
    @GetMapping("/statuses/{currentStatus}/next")
    @Operation(
        summary = "Lấy statuses có thể chuyển tiếp",
        description = "Trả về danh sách statuses có thể chuyển từ status hiện tại"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Thành công"),
        @ApiResponse(responseCode = "400", description = "Status hiện tại không hợp lệ"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<RestResponse<CategoryResponse.StatusResponse>> getPossibleNextStatuses(
            @Parameter(description = "Status hiện tại", example = "DRAFT")
            @PathVariable @NotBlank @Size(max = 50) String currentStatus) {
        
        CategoryResponse.StatusResponse response = categoryService.getPossibleNextStatuses(currentStatus);
        return ResponseEntity.ok(RestResponse.success(response));
    }
    
    /**
     * Lấy tất cả types
     */
    @GetMapping("/types")
    @Operation(
        summary = "Lấy danh sách tất cả types",
        description = "Trả về danh sách tất cả types với thông tin chi tiết"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Thành công"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<RestResponse<CategoryResponse.TypeResponse>> getAllTypes() {
        CategoryResponse.TypeResponse response = categoryService.getAllTypes();
        return ResponseEntity.ok(RestResponse.success(response));
    }
    
    /**
     * Lấy types theo group
     */
    @GetMapping("/types/group/{group}")
    @Operation(
        summary = "Lấy types theo group",
        description = "Trả về danh sách types thuộc group cụ thể"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Thành công"),
        @ApiResponse(responseCode = "400", description = "Group không hợp lệ"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<RestResponse<CategoryResponse.TypeResponse>> getTypesByGroup(
            @Parameter(description = "Group", example = "SERVICE")
            @PathVariable @NotBlank @Size(max = 50) String group) {
        
        CategoryResponse.TypeResponse response = categoryService.getTypesByGroup(group);
        return ResponseEntity.ok(RestResponse.success(response));
    }
    
    /**
     * Tìm kiếm types
     */
    @GetMapping("/types/search")
    @Operation(
        summary = "Tìm kiếm types",
        description = "Tìm kiếm types theo từ khóa"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Thành công"),
        @ApiResponse(responseCode = "400", description = "Từ khóa không hợp lệ"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<RestResponse<CategoryResponse.TypeResponse>> searchTypes(
            @Parameter(description = "Từ khóa tìm kiếm", example = "service")
            @RequestParam @NotBlank @Size(min = 2, max = 100) String query) {
        
        CategoryResponse.TypeResponse response = categoryService.searchTypes(query);
        return ResponseEntity.ok(RestResponse.success(response));
    }
    
    /**
     * Validate category
     */
    @GetMapping("/validate/{category}")
    @Operation(
        summary = "Validate category",
        description = "Kiểm tra category có tồn tại không"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Thành công"),
        @ApiResponse(responseCode = "400", description = "Category không hợp lệ"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<RestResponse<Boolean>> validateCategory(
            @Parameter(description = "Category cần validate", example = "COMMERCIAL_SALES_DIRECT")
            @PathVariable @NotBlank @Size(max = 100) String category) {
        
        boolean isValid = categoryService.isValidCategory(category);
        return ResponseEntity.ok(RestResponse.success(isValid));
    }
    
    /**
     * Validate status
     */
    @GetMapping("/statuses/validate/{status}")
    @Operation(
        summary = "Validate status",
        description = "Kiểm tra status có tồn tại không"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Thành công"),
        @ApiResponse(responseCode = "400", description = "Status không hợp lệ"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<RestResponse<Boolean>> validateStatus(
            @Parameter(description = "Status cần validate", example = "ACTIVE")
            @PathVariable @NotBlank @Size(max = 50) String status) {
        
        boolean isValid = categoryService.isValidStatus(status);
        return ResponseEntity.ok(RestResponse.success(isValid));
    }
    
    /**
     * Validate type
     */
    @GetMapping("/types/validate/{type}")
    @Operation(
        summary = "Validate type",
        description = "Kiểm tra type có tồn tại không"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Thành công"),
        @ApiResponse(responseCode = "400", description = "Type không hợp lệ"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<RestResponse<Boolean>> validateType(
            @Parameter(description = "Type cần validate", example = "SERVICE_AGREEMENT")
            @PathVariable @NotBlank @Size(max = 100) String type) {
        
        boolean isValid = categoryService.isValidType(type);
        return ResponseEntity.ok(RestResponse.success(isValid));
    }
    
    /**
     * Validate status transition
     */
    @GetMapping("/statuses/validate-transition")
    @Operation(
        summary = "Validate status transition",
        description = "Kiểm tra có thể chuyển từ status hiện tại sang status mới không"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Thành công"),
        @ApiResponse(responseCode = "400", description = "Status không hợp lệ"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<RestResponse<Boolean>> validateStatusTransition(
            @Parameter(description = "Status hiện tại", example = "DRAFT")
            @RequestParam @NotBlank @Size(max = 50) String currentStatus,
            @Parameter(description = "Status mới", example = "PENDING_REVIEW")
            @RequestParam @NotBlank @Size(max = 50) String newStatus) {
        
        boolean isValid = categoryService.isValidStatusTransition(currentStatus, newStatus);
        return ResponseEntity.ok(RestResponse.success(isValid));
    }
    
    /**
     * Lấy thống kê categories
     */
    @GetMapping("/stats")
    @Operation(
        summary = "Lấy thống kê categories",
        description = "Trả về thống kê tổng quan về categories, statuses và types"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Thành công"),
        @ApiResponse(responseCode = "500", description = "Lỗi server")
    })
    public ResponseEntity<RestResponse<CategoryService.CategoryStats>> getCategoryStats() {
        CategoryService.CategoryStats stats = categoryService.getCategoryStats();
        return ResponseEntity.ok(RestResponse.success(stats));
    }
}

