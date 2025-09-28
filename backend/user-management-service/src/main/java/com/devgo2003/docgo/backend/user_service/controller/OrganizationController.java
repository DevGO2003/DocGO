package com.devgo2003.docgo.backend.user_service.controller;

import com.devgo2003.docgo.backend.user_service.common.response.RestResponse;
import com.devgo2003.docgo.backend.user_service.dto.OrganizationCreateRequest;
import com.devgo2003.docgo.backend.user_service.dto.OrganizationResponse;
import com.devgo2003.docgo.backend.user_service.dto.OrganizationUpdateRequest;
import com.devgo2003.docgo.backend.user_service.service.OrganizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/user-management-service/organizations")
@RequiredArgsConstructor
@Tag(name = "Organization Management", description = "API quản lý tổ chức")
public class OrganizationController {

    private final OrganizationService organizationService;

    @GetMapping
    @Operation(
        summary = "Lấy danh sách tổ chức", 
        description = """
        🔹 Đầu vào
        
        📄 pageNumber (tùy chọn, query)
        Loại: integer
        Mô tả: Số trang (mặc định: 0)
        
        📄 pageSize (tùy chọn, query)  
        Loại: integer
        Mô tả: Kích thước trang (mặc định: 10)
        
        📄 sortBy (tùy chọn, query)
        Loại: string
        Mô tả: Trường sắp xếp (mặc định: createdAt)
        
        📄 sortDirection (tùy chọn, query)
        Loại: string
        Mô tả: Hướng sắp xếp: ASC hoặc DESC (mặc định: DESC)
        
        🔹 Đầu ra
        
        📝 data
        Loại: Page<OrganizationResponse>
        Mô tả: Danh sách tổ chức với phân trang
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (200: OK, 204: No Content)
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý
        
        🕒 timestamp
        Loại: string (ISO-8601)
        Mô tả: Thời gian xử lý yêu cầu
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi
        """
    )
    public ResponseEntity<RestResponse<Page<OrganizationResponse>>> getAllOrganizations(
        @Parameter(description = "Số trang (mặc định: 0)") 
        @RequestParam(defaultValue = "0") int pageNumber,
        
        @Parameter(description = "Kích thước trang (mặc định: 10)") 
        @RequestParam(defaultValue = "10") int pageSize,
        
        @Parameter(description = "Trường sắp xếp (mặc định: createdAt)") 
        @RequestParam(defaultValue = "createdAt") String sortBy,
        
        @Parameter(description = "Hướng sắp xếp (mặc định: DESC)") 
        @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        String requestId = UUID.randomUUID().toString();
        log.info("[{}] Getting all organizations - page: {}, size: {}", requestId, pageNumber, pageSize);

        Page<OrganizationResponse> organizations = organizationService.getAllOrganizations(
                pageNumber, pageSize, sortBy, sortDirection);

        if (organizations.isEmpty()) {
            return ResponseEntity.ok(RestResponse.<Page<OrganizationResponse>>builder()
                    .apiVersion("v1")
                    .statusCode(204)
                    .shortMessage("No Content")
                    .description("Không có tổ chức nào.")
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/user-management-service/organizations")
                    .build());
        }

        return ResponseEntity.ok(RestResponse.<Page<OrganizationResponse>>builder()
                .apiVersion("v1")
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách tổ chức thành công")
                .data(organizations)
                .timestamp(ZonedDateTime.now())
                .requestId(requestId)
                .path("/api/v1/user-management-service/organizations")
                .build());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết tổ chức", description = "Lấy thông tin chi tiết của một tổ chức theo ID")
    public ResponseEntity<RestResponse<OrganizationResponse>> getOrganization(
        @Parameter(description = "ID của tổ chức") 
        @PathVariable String id) {
        
        String requestId = UUID.randomUUID().toString();
        log.info("[{}] Getting organization by id: {}", requestId, id);

        return organizationService.getOrganizationById(id)
                .map(organization -> ResponseEntity.ok(RestResponse.<OrganizationResponse>builder()
                        .apiVersion("v1")
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Đã lấy thông tin tổ chức thành công")
                        .data(organization)
                        .timestamp(ZonedDateTime.now())
                        .requestId(requestId)
                        .path("/api/v1/user-management-service/organizations/" + id)
                        .build()))
                .orElseGet(() -> ResponseEntity.status(404).body(RestResponse.<OrganizationResponse>builder()
                        .apiVersion("v1")
                        .statusCode(404)
                        .shortMessage("Not Found")
                        .description("Không tìm thấy tổ chức với ID: " + id)
                        .data(null)
                        .timestamp(ZonedDateTime.now())
                        .requestId(requestId)
                        .path("/api/v1/user-management-service/organizations/" + id)
                        .build()));
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Lấy tổ chức theo mã", description = "Lấy thông tin tổ chức theo mã tổ chức")
    public ResponseEntity<RestResponse<OrganizationResponse>> getOrganizationByCode(
        @Parameter(description = "Mã của tổ chức") 
        @PathVariable String code) {
        
        String requestId = UUID.randomUUID().toString();
        log.info("[{}] Getting organization by code: {}", requestId, code);

        return organizationService.getOrganizationByCode(code)
                .map(organization -> ResponseEntity.ok(RestResponse.<OrganizationResponse>builder()
                        .apiVersion("v1")
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Đã lấy thông tin tổ chức thành công")
                        .data(organization)
                        .timestamp(ZonedDateTime.now())
                        .requestId(requestId)
                        .path("/api/v1/user-management-service/organizations/code/" + code)
                        .build()))
                .orElseGet(() -> ResponseEntity.status(404).body(RestResponse.<OrganizationResponse>builder()
                        .apiVersion("v1")
                        .statusCode(404)
                        .shortMessage("Not Found")
                        .description("Không tìm thấy tổ chức với mã: " + code)
                        .data(null)
                        .timestamp(ZonedDateTime.now())
                        .requestId(requestId)
                        .path("/api/v1/user-management-service/organizations/code/" + code)
                        .build()));
    }

    @PostMapping
    @Operation(summary = "Tạo tổ chức mới", description = "Tạo một tổ chức mới")
    public ResponseEntity<RestResponse<OrganizationResponse>> createOrganization(
        @Valid @RequestBody OrganizationCreateRequest request) {
        
        String requestId = UUID.randomUUID().toString();
        log.info("[{}] Creating organization with name: {}", requestId, request.getName());

        try {
            OrganizationResponse organization = organizationService.createOrganization(request);
            return ResponseEntity.status(201).body(RestResponse.<OrganizationResponse>builder()
                    .apiVersion("v1")
                    .statusCode(201)
                    .shortMessage("Created")
                    .description("Đã tạo tổ chức thành công")
                    .data(organization)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/user-management-service/organizations")
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(409).body(RestResponse.<OrganizationResponse>builder()
                    .apiVersion("v1")
                    .statusCode(409)
                    .shortMessage("Conflict")
                    .description(e.getMessage())
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/user-management-service/organizations")
                    .build());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật tổ chức", description = "Cập nhật thông tin của một tổ chức")
    public ResponseEntity<RestResponse<OrganizationResponse>> updateOrganization(
        @Parameter(description = "ID của tổ chức") 
        @PathVariable String id,
        @Valid @RequestBody OrganizationUpdateRequest request) {
        
        String requestId = UUID.randomUUID().toString();
        log.info("[{}] Updating organization with id: {}", requestId, id);

        try {
            return organizationService.updateOrganization(id, request)
                    .map(organization -> ResponseEntity.ok(RestResponse.<OrganizationResponse>builder()
                            .apiVersion("v1")
                            .statusCode(200)
                            .shortMessage("Success")
                            .description("Đã cập nhật tổ chức thành công")
                            .data(organization)
                            .timestamp(ZonedDateTime.now())
                            .requestId(requestId)
                            .path("/api/v1/user-management-service/organizations/" + id)
                            .build()))
                    .orElseGet(() -> ResponseEntity.status(404).body(RestResponse.<OrganizationResponse>builder()
                            .apiVersion("v1")
                            .statusCode(404)
                            .shortMessage("Not Found")
                            .description("Không tìm thấy tổ chức với ID: " + id)
                            .data(null)
                            .timestamp(ZonedDateTime.now())
                            .requestId(requestId)
                            .path("/api/v1/user-management-service/organizations/" + id)
                            .build()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(409).body(RestResponse.<OrganizationResponse>builder()
                    .apiVersion("v1")
                    .statusCode(409)
                    .shortMessage("Conflict")
                    .description(e.getMessage())
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/user-management-service/organizations/" + id)
                    .build());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa tổ chức", description = "Xóa mềm một tổ chức")
    public ResponseEntity<RestResponse<Void>> deleteOrganization(
        @Parameter(description = "ID của tổ chức") 
        @PathVariable String id) {
        
        String requestId = UUID.randomUUID().toString();
        log.info("[{}] Deleting organization with id: {}", requestId, id);

        boolean deleted = organizationService.deleteOrganization(id);
        if (deleted) {
            return ResponseEntity.ok(RestResponse.<Void>builder()
                    .apiVersion("v1")
                    .statusCode(200)
                    .shortMessage("Success")
                    .description("Đã xóa tổ chức thành công")
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/user-management-service/organizations/" + id)
                    .build());
        } else {
            return ResponseEntity.status(404).body(RestResponse.<Void>builder()
                    .apiVersion("v1")
                    .statusCode(404)
                    .shortMessage("Not Found")
                    .description("Không tìm thấy tổ chức với ID: " + id)
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/user-management-service/organizations/" + id)
                    .build());
        }
    }

    @PutMapping("/{id}/restore")
    @Operation(summary = "Khôi phục tổ chức", description = "Khôi phục một tổ chức đã bị xóa")
    public ResponseEntity<RestResponse<Void>> restoreOrganization(
        @Parameter(description = "ID của tổ chức") 
        @PathVariable String id) {
        
        String requestId = UUID.randomUUID().toString();
        log.info("[{}] Restoring organization with id: {}", requestId, id);

        boolean restored = organizationService.restoreOrganization(id);
        if (restored) {
            return ResponseEntity.ok(RestResponse.<Void>builder()
                    .apiVersion("v1")
                    .statusCode(200)
                    .shortMessage("Success")
                    .description("Đã khôi phục tổ chức thành công")
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/user-management-service/organizations/" + id + "/restore")
                    .build());
        } else {
            return ResponseEntity.status(404).body(RestResponse.<Void>builder()
                    .apiVersion("v1")
                    .statusCode(404)
                    .shortMessage("Not Found")
                    .description("Không tìm thấy tổ chức với ID: " + id)
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/user-management-service/organizations/" + id + "/restore")
                    .build());
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Tìm kiếm tổ chức", description = "Tìm kiếm tổ chức theo các tiêu chí")
    public ResponseEntity<RestResponse<Page<OrganizationResponse>>> searchOrganizations(
        @Parameter(description = "Tên tổ chức") 
        @RequestParam(required = false) String name,
        
        @Parameter(description = "Mã tổ chức") 
        @RequestParam(required = false) String code,
        
        @Parameter(description = "Trạng thái tổ chức") 
        @RequestParam(required = false) String status,
        
        @Parameter(description = "Số trang (mặc định: 0)") 
        @RequestParam(defaultValue = "0") int pageNumber,
        
        @Parameter(description = "Kích thước trang (mặc định: 10)") 
        @RequestParam(defaultValue = "10") int pageSize,
        
        @Parameter(description = "Trường sắp xếp (mặc định: createdAt)") 
        @RequestParam(defaultValue = "createdAt") String sortBy,
        
        @Parameter(description = "Hướng sắp xếp (mặc định: DESC)") 
        @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        String requestId = UUID.randomUUID().toString();
        log.info("[{}] Searching organizations - name: {}, code: {}, status: {}", requestId, name, code, status);

        Page<OrganizationResponse> organizations = organizationService.searchOrganizations(
                name, code, status, pageNumber, pageSize, sortBy, sortDirection);

        if (organizations.isEmpty()) {
            return ResponseEntity.ok(RestResponse.<Page<OrganizationResponse>>builder()
                    .apiVersion("v1")
                    .statusCode(204)
                    .shortMessage("No Content")
                    .description("Không tìm thấy tổ chức nào phù hợp với tiêu chí tìm kiếm.")
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/user-management-service/organizations/search")
                    .build());
        }

        return ResponseEntity.ok(RestResponse.<Page<OrganizationResponse>>builder()
                .apiVersion("v1")
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã tìm thấy tổ chức phù hợp")
                .data(organizations)
                .timestamp(ZonedDateTime.now())
                .requestId(requestId)
                .path("/api/v1/user-management-service/organizations/search")
                .build());
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Lấy tổ chức theo người dùng", description = "Lấy danh sách tổ chức mà người dùng thuộc về")
    public ResponseEntity<RestResponse<List<OrganizationResponse>>> getOrganizationsByUserId(
        @Parameter(description = "ID của người dùng") 
        @PathVariable String userId) {
        
        String requestId = UUID.randomUUID().toString();
        log.info("[{}] Getting organizations by user id: {}", requestId, userId);

        List<OrganizationResponse> organizations = organizationService.getOrganizationsByUserId(userId);

        if (organizations.isEmpty()) {
            return ResponseEntity.ok(RestResponse.<List<OrganizationResponse>>builder()
                    .apiVersion("v1")
                    .statusCode(204)
                    .shortMessage("No Content")
                    .description("Người dùng không thuộc tổ chức nào.")
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/user-management-service/organizations/user/" + userId)
                    .build());
        }

        return ResponseEntity.ok(RestResponse.<List<OrganizationResponse>>builder()
                .apiVersion("v1")
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách tổ chức của người dùng thành công")
                .data(organizations)
                .timestamp(ZonedDateTime.now())
                .requestId(requestId)
                .path("/api/v1/user-management-service/organizations/user/" + userId)
                .build());
    }

    @GetMapping("/count")
    @Operation(summary = "Đếm số lượng tổ chức", description = "Đếm số lượng tổ chức theo trạng thái")
    public ResponseEntity<RestResponse<Long>> countOrganizations(
        @Parameter(description = "Trạng thái tổ chức") 
        @RequestParam(required = false) String status) {
        
        String requestId = UUID.randomUUID().toString();
        log.info("[{}] Counting organizations by status: {}", requestId, status);

        long count = organizationService.countOrganizationsByStatus(status);

        return ResponseEntity.ok(RestResponse.<Long>builder()
                .apiVersion("v1")
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã đếm số lượng tổ chức thành công")
                .data(count)
                .timestamp(ZonedDateTime.now())
                .requestId(requestId)
                .path("/api/v1/user-management-service/organizations/count")
                .build());
    }
}
