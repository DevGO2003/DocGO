package com.devgo2003.docgo.document_service.controller;

import com.devgo2003.docgo.document_service.entity.Version;
import com.devgo2003.docgo.document_service.service.VersionService;
import com.devgo2003.docgo.document_service.dto.VersionCreateRequest;
import com.devgo2003.docgo.document_service.common.response.RestResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.UUID;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/document-management-service/v1/versions")
@Tag(name = "🔄 APIs Quản lý Phiên bản", description = "Các API để quản lý phiên bản hợp đồng trong hệ thống DocGO")
public class VersionController {

    private final VersionService versionService;
    private final HttpServletRequest request;

    public VersionController(VersionService versionService, HttpServletRequest request) {
        this.versionService = versionService;
        this.request = request;
    }

    @GetMapping
    @Operation(
        summary = "Lấy danh sách phiên bản (hợp nhất)",
        description = """
        ## 📖 Mô tả
        Lấy danh sách phiên bản với tiêu chí lọc/sort/aggregate. Trả về theo chuẩn RestResponse.

        ## 🔹 Đầu vào

        👁️ view (tùy chọn, query)
        Loại: string
        Mô tả: Loại view dữ liệu (mặc định: full)
        
        📄 pageNumber, pageSize (tùy chọn, query) — integer
        📄 sortBy (tùy chọn, query) — createdAt | versionNumber (mặc định: createdAt)
        📄 sortDirection (tùy chọn, query) — ASC | DESC (mặc định: DESC)
        📄 contractId (tùy chọn, query) — string
        📄 changeType (tùy chọn, query) — enum
        📄 isPublished, isCurrent (tùy chọn, query) — boolean
        📄 tags[] (tùy chọn, query) — string[]
        📄 filePath, checksum (tùy chọn, query) — string
        📄 createdFrom/To, publishedFrom/To, approvedFrom/To (tùy chọn, query) — string (ISO-8601)
        📄 aggregate (tùy chọn, query) — count | exists

        ## 🔹 Đầu ra

        📝 data — List<Version> | Long | Boolean
        📊 apiVersion | 🔢 statusCode | 📋 shortMessage | 📖 description | 🕒 timestamp | 🆔 requestId | 🛣️ path
        """
    )
    public ResponseEntity<RestResponse<?>> getAllVersions(
            @RequestParam(defaultValue = "full") String view,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "false") boolean includeDeleted,
            @RequestParam(required = false) String contractId,
            @RequestParam(required = false) Version.ChangeType changeType,
            @RequestParam(required = false) Boolean isPublished,
            @RequestParam(required = false) Boolean isCurrent,
            @RequestParam(required = false) String[] tags,
            @RequestParam(required = false) String filePath,
            @RequestParam(required = false) String checksum,
            @RequestParam(required = false) String createdFrom,
            @RequestParam(required = false) String createdTo,
            @RequestParam(required = false) String publishedFrom,
            @RequestParam(required = false) String publishedTo,
            @RequestParam(required = false) String approvedFrom,
            @RequestParam(required = false) String approvedTo,
            @RequestParam(required = false) String aggregate) {

        // Aggregate (count|exists)
        if (aggregate != null && !aggregate.isBlank()) {
            String agg = aggregate.toLowerCase();
            if ("count".equals(agg)) {
                long count;
                if (contractId != null && changeType != null) {
                    count = versionService.countVersionsByContractIdAndChangeType(contractId, changeType);
                } else if (contractId != null && isPublished != null) {
                    count = versionService.countVersionsByContractIdAndIsPublished(contractId, isPublished);
                } else if (contractId != null && isCurrent != null) {
                    count = versionService.countVersionsByContractIdAndIsCurrent(contractId, isCurrent);
                } else if (contractId != null) {
                    count = versionService.countVersionsByContractId(contractId);
                } else {
                    List<Version> all = versionService.getAllVersions();
                    count = all == null ? 0 : all.size();
                }
                RestResponse<Long> response = RestResponse.<Long>builder()
                        .apiVersion("v1")
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Đếm số phiên bản thành công.")
                        .data(count)
                        .timestamp(ZonedDateTime.now())
                        .requestId(UUID.randomUUID().toString())
                        .path(request.getRequestURI())
                        .build();
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
            if ("exists".equals(agg)) {
                boolean exists = false;
                if (contractId != null && isCurrent != null && isCurrent) {
                    exists = versionService.existsCurrentVersionByContractId(contractId);
                } else if (contractId != null && isPublished != null) {
                    exists = versionService.existsPublishedVersionByContractId(contractId);
                } else if (contractId != null && tags != null) {
                    exists = versionService.existsVersionByTags(contractId, tags);
                } else if (contractId != null && filePath != null) {
                    exists = versionService.existsVersionByFilePath(contractId, filePath);
                } else if (contractId != null && checksum != null) {
                    exists = versionService.existsVersionByChecksum(contractId, checksum);
                } else if (contractId != null && changeType != null) {
                    exists = versionService.existsVersionByChangeType(contractId, changeType);
                } else if (contractId != null) {
                    exists = versionService.countVersionsByContractId(contractId) > 0;
                }
                RestResponse<Boolean> response = RestResponse.<Boolean>builder()
                        .apiVersion("v1")
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Kiểm tra tồn tại phiên bản thành công.")
                        .data(exists)
                        .timestamp(ZonedDateTime.now())
                        .requestId(UUID.randomUUID().toString())
                        .path(request.getRequestURI())
                        .build();
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
        }

        // List mode
        List<Version> versions;
        if (contractId != null && changeType != null && sortBy.equalsIgnoreCase("createdAt")) {
            versions = versionService.getVersionsByContractIdAndChangeTypeOrderByCreatedAt(contractId, changeType);
        } else if (contractId != null && changeType != null && sortBy.equalsIgnoreCase("versionNumber")) {
            versions = versionService.getVersionsByContractIdAndChangeTypeOrderByVersionNumber(contractId, changeType);
        } else if (contractId != null && changeType != null) {
            versions = versionService.getVersionsByChangeType(contractId, changeType);
        } else if (contractId != null && Boolean.TRUE.equals(isPublished)) {
            versions = versionService.getPublishedVersionsByContractId(contractId);
        } else if (contractId != null && Boolean.FALSE.equals(isPublished)) {
            versions = versionService.getUnpublishedVersionsByContractId(contractId);
        } else if (contractId != null && Boolean.TRUE.equals(isCurrent)) {
            versions = versionService.getCurrentVersionsByContractId(contractId);
        } else if (contractId != null && tags != null) {
            versions = versionService.getVersionsByContractIdAndTags(contractId, tags);
        } else if (contractId != null && filePath != null) {
            versions = versionService.getVersionsByContractIdAndFilePath(contractId, filePath);
        } else if (contractId != null && checksum != null) {
            versions = versionService.getVersionsByContractIdAndChecksum(contractId, checksum);
        } else if (contractId != null && sortBy.equalsIgnoreCase("versionNumber")) {
            versions = versionService.getVersionsByContractIdOrderByVersionNumber(contractId);
        } else if (contractId != null && sortBy.equalsIgnoreCase("createdAt")) {
            versions = versionService.getVersionsByContractIdOrderByCreatedAt(contractId);
        } else if (createdFrom != null && createdTo != null) {
            try {
                // Handle date format "2024-03-01" by adding time component
                String fromStr = createdFrom.contains("T") ? createdFrom : createdFrom + "T00:00:00";
                String toStr = createdTo.contains("T") ? createdTo : createdTo + "T23:59:59";
                LocalDateTime from = LocalDateTime.parse(fromStr);
                LocalDateTime to = LocalDateTime.parse(toStr);
                versions = versionService.getVersionsByCreatedAtBetween(from, to);
            } catch (Exception e) {
                versions = versionService.getAllVersions();
            }
        } else if (publishedFrom != null && publishedTo != null) {
            try {
                // Handle date format "2024-03-01" by adding time component
                String fromStr = publishedFrom.contains("T") ? publishedFrom : publishedFrom + "T00:00:00";
                String toStr = publishedTo.contains("T") ? publishedTo : publishedTo + "T23:59:59";
                LocalDateTime from = LocalDateTime.parse(fromStr);
                LocalDateTime to = LocalDateTime.parse(toStr);
                versions = versionService.getVersionsByPublishedAtBetween(from, to);
            } catch (Exception e) {
                versions = versionService.getAllVersions();
            }
        } else if (approvedFrom != null && approvedTo != null) {
            try {
                // Handle date format "2024-03-01" by adding time component
                String fromStr = approvedFrom.contains("T") ? approvedFrom : approvedFrom + "T00:00:00";
                String toStr = approvedTo.contains("T") ? approvedTo : approvedTo + "T23:59:59";
                LocalDateTime from = LocalDateTime.parse(fromStr);
                LocalDateTime to = LocalDateTime.parse(toStr);
                versions = versionService.getVersionsByApprovedAtBetween(from, to);
            } catch (Exception e) {
                versions = versionService.getAllVersions();
            }
        } else if (contractId != null) {
            versions = versionService.getVersionsByContractId(contractId);
        } else {
            versions = versionService.getAllVersions();
        }

        // Áp dụng view filter
        versions = versionService.applyViewFilter(versions, view);

        if (versions == null || versions.isEmpty()) {
            RestResponse<List<Version>> response = RestResponse.<List<Version>>builder()
                .apiVersion("v1")
                .statusCode(204)
                .shortMessage("No Content")
                .description("Không có phiên bản nào.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        RestResponse<List<Version>> response = RestResponse.<List<Version>>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Lấy danh sách phiên bản thành công.")
            .data(versions)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Lấy chi tiết phiên bản", 
        description = """
        🔹 Đầu vào
        
        🔸 id (bắt buộc, path)
        Loại: string
        mô tả: ID của phiên bản cần lấy
        
        🔹 Đầu ra
        
        🔸 data
        Loại: Version
        mô tả: Thông tin chi tiết phiên bản
        
        🔸 apiVersion
        Loại: string
        mô tả: Phiên bản API (v1)
        
        🔸 statusCode
        Loại: integer
        mô tả: mã trạng thái HTTP (200: OK, 404: Not Found)
        
        🔸 shortMessage
        Loại: string
        mô tả: Thông báo ngắn gọn về kết quả
        
        🔸 description
        Loại: string
        mô tả: mô tả chi tiết về kết quả xử lý
        
        🔸 timestamp
        Loại: string
        mô tả: Thời điểm xử lý request (ISO-8601)
        
        🔸 requestId
        Loại: string
        mô tả: ID duy nhất của request
        
        🔸 path
        Loại: string
        mô tả: Đường dẫn API được gọi
        """
    )
    public ResponseEntity<RestResponse<Version>> getVersion(@PathVariable String id) {
        Optional<Version> version = versionService.getVersionById(id);
        
        if (version.isEmpty()) {
            RestResponse<Version> response = RestResponse.<Version>builder()
                .apiVersion("v1")
                .statusCode(404)
                .shortMessage("Not Found")
                .description("Không tìm thấy phiên bản với ID: " + id)
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        
        RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Lấy chi tiết phiên bản thành công.")
            .data(version.get())
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    @Operation(
        summary = "Tạo phiên bản mới", 
        description = """
        🔹 Đầu vào
        
        🔸 version (bắt buộc, body)
        Loại: VersionCreateRequest
        mô tả: Thông tin phiên bản cần tạo (contractId, versionNumber, changeDescription, changeType, createdBy)
        
        🔹 Đầu ra
        
        🔸 data
        Loại: Version
        mô tả: Thông tin phiên bản đã được tạo thành công
        
        🔸 apiVersion
        Loại: string
        mô tả: Phiên bản API (v1)
        
        🔸 statusCode
        Loại: integer
        mô tả: mã trạng thái HTTP (201: Created)
        
        🔸 shortMessage
        Loại: string
        mô tả: Thông báo ngắn gọn về kết quả
        
        🔸 description
        Loại: string
        mô tả: mô tả chi tiết về kết quả xử lý
        
        🔸 timestamp
        Loại: string
        mô tả: Thời điểm xử lý request (ISO-8601)
        
        🔸 requestId
        Loại: string
        mô tả: ID duy nhất của request
        
        🔸 path
        Loại: string
        mô tả: Đường dẫn API được gọi
        """
    )
    public ResponseEntity<RestResponse<Version>> createVersion(@RequestBody VersionCreateRequest request) {
        Version version = versionService.createVersion(request);
        
        RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(201)
            .shortMessage("Created")
            .description("Tạo phiên bản thành công.")
            .data(version)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(this.request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Deprecated nested create route removed: dùng POST /versions với body

    // Removed deprecated nested version list. Use GET /versions?contractId=...

    // Duplicate method removed: getVersionById - already exists as getVersion above

    // Removed deprecated nested current version. Use GET /versions?contractId=...&isCurrent=true
    @Operation(summary = "(Deprecated) Lấy version hiện tại", description = "Dùng GET /versions?contractId=...&isCurrent=true", deprecated = true)
    public ResponseEntity<RestResponse<Version>> getCurrentVersion(@PathVariable String contractId) {
        Optional<Version> version = versionService.getCurrentVersionByContractId(contractId);
        
        if (version.isEmpty()) {
            RestResponse<Version> response = RestResponse.<Version>builder()
                .apiVersion("v1")
                .statusCode(404)
                .shortMessage("Not Found")
                .description("Không có version hiện tại cho contract: " + contractId)
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        
        RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Lấy version hiện tại thành công.")
            .data(version.get())
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Removed deprecated nested published list. Use GET /versions?contractId=...&isPublished=true

    // Removed deprecated nested unpublished list. Use GET /versions?contractId=...&isPublished=false
    @Operation(summary = "(Deprecated) Lấy version chưa published", description = "Dùng GET /versions?contractId=...&isPublished=false", deprecated = true)
    public ResponseEntity<RestResponse<List<Version>>> getUnpublishedVersions(@PathVariable String contractId) {
        List<Version> versions = versionService.getUnpublishedVersionsByContractId(contractId);
        
        if (versions.isEmpty()) {
            RestResponse<List<Version>> response = RestResponse.<List<Version>>builder()
                .apiVersion("v1")
                .statusCode(204)
                .shortMessage("No Content")
                .description("Không có version nào chưa published.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        
        RestResponse<List<Version>> response = RestResponse.<List<Version>>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Lấy danh sách version unpublished thành công.")
            .data(versions)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Removed deprecated change-type path. Use GET /versions?contractId=...&changeType=...
    @Operation(summary = "(Deprecated) Lấy version theo change type", description = "Dùng GET /versions?contractId=...&changeType=...", deprecated = true)
    public ResponseEntity<RestResponse<List<Version>>> getVersionsByChangeType(
            @PathVariable String contractId,
            @PathVariable Version.ChangeType changeType) {
        List<Version> versions = versionService.getVersionsByChangeType(contractId, changeType);
        
        if (versions.isEmpty()) {
            RestResponse<List<Version>> response = RestResponse.<List<Version>>builder()
                .apiVersion("v1")
                .statusCode(204)
                .shortMessage("No Content")
                .description("Không có version nào với change type này.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        
        RestResponse<List<Version>> response = RestResponse.<List<Version>>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Lấy danh sách version theo change type thành công.")
            .data(versions)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Removed deprecated current-list endpoint. Use GET /versions?contractId=...&isCurrent=true

    // Removed deprecated published-list endpoint. Use GET /versions?contractId=...&isPublished=true

    // Removed deprecated approval-required endpoint. Use GET /versions?contractId=...&approvalRequired=true

    // Removed deprecated no-approval-required endpoint. Use GET /versions with query

    // Removed deprecated previousVersion path. Use GET /versions?contractId=...&previousVersionId=...

    // Removed deprecated order-by-version endpoint. Use GET /versions?contractId=...&sortBy=versionNumber

    // Removed deprecated order-by-created endpoint. Use GET /versions?contractId=...&sortBy=createdAt

    // Deprecated nested route removed: dùng GET /versions?createdFrom=...&createdTo=...

    // Deprecated nested route removed: dùng GET /versions?publishedFrom=...&publishedTo=...

    // Deprecated nested route removed: dùng GET /versions?approvedFrom=...&approvedTo=...

    // Deprecated nested route removed: dùng GET /versions?publishedBy=...

    // Deprecated nested route removed: dùng GET /versions?approvedBy=...

    // Deprecated nested route removed: dùng GET /versions?tags=...

    // Deprecated: dùng GET /versions?contractId=...&changeType=...&sortBy=createdAt

    // Deprecated: dùng GET /versions?contractId=...&changeType=...&sortBy=versionNumber

    // Deprecated: dùng GET /versions?contractId=...&previousVersionId=...

    // Deprecated: dùng GET /versions?contractId=...&filePath=...

    // Deprecated: dùng GET /versions?contractId=...&checksum=...

    // Deprecated: dùng GET /versions?contractId=...&fileSize=...
    
    // Deprecated: dùng GET /versions?contractId=...&minFileSize=...&maxFileSize=...
    
    // Deprecated: dùng GET /versions?contractId=...&changeType=ROLLBACK
    
    // Deprecated: dùng GET /versions?contractId=...&changeType=ROLLBACK
    
    // Deprecated: dùng GET /versions?contractId=...&changeType=DRAFT
    
    // Deprecated: dùng GET /versions?contractId=...&changeType=MAJOR

    // Deprecated: dùng GET /versions?contractId=...&changeType=MINOR
    
    // Deprecated: dùng GET /versions?contractId=...&changeType=PATCH
    
    // Deprecated: dùng GET /versions?contractId=...&changeType=HOTFIX

    @PutMapping("/{id}/publish")
    @Operation(summary = "Publish version", description = "Publish version")
    public ResponseEntity<RestResponse<Version>> publishVersion(
            @PathVariable String id,
            @RequestParam String publishedBy) {
        Version version = versionService.publishVersion(id, publishedBy);
        
        RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Publish version thành công.")
            .data(version)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/approve")
    @Operation(summary = "Approve version", description = "Approve version")
    public ResponseEntity<RestResponse<Version>> approveVersion(
            @PathVariable String id,
            @RequestParam String approvedBy) {
        Version version = versionService.approveVersion(id, approvedBy);
        
        RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Approve version thành công.")
            .data(version)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/mark-current")
    @Operation(summary = "Đánh dấu version hiện tại", description = "Đánh dấu version là current")
    public ResponseEntity<RestResponse<Version>> markVersionAsCurrent(@PathVariable String id) {
        Version version = versionService.markVersionAsCurrent(id);
        
        RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đánh dấu version hiện tại thành công.")
            .data(version)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/unmark-current")
    @Operation(summary = "Bỏ đánh dấu version hiện tại", description = "Bỏ đánh dấu version là current")
    public ResponseEntity<RestResponse<Version>> unmarkVersionAsCurrent(@PathVariable String id) {
        Version version = versionService.unmarkVersionAsCurrent(id);
        
        RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Bỏ đánh dấu version hiện tại thành công.")
            .data(version)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/rollback")
    @Operation(summary = "Rollback version", description = "Rollback version")
    public ResponseEntity<RestResponse<Version>> rollbackVersion(
            @PathVariable String id,
            @RequestParam String rollbackReason) {
        Version version = versionService.rollbackVersion(id, rollbackReason);
        
        RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Rollback version thành công.")
            .data(version)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/previous-version")
    @Operation(summary = "Cập nhật previous version ID", description = "Cập nhật previous version ID")
    public ResponseEntity<RestResponse<Version>> setPreviousVersionId(
            @PathVariable String id,
            @RequestParam String previousVersionId) {
        Version version = versionService.setPreviousVersionId(id, previousVersionId);
        
                RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật previous version ID thành công.")
            .data(version)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/file-path")
    @Operation(summary = "Cập nhật file path", description = "Cập nhật file path")
    public ResponseEntity<RestResponse<Version>> setFilePath(
            @PathVariable String id,
            @RequestParam String filePath) {
        Version version = versionService.setFilePath(id, filePath);
        
                RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật file path thành công.")
            .data(version)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/file-size")
    @Operation(summary = "Cập nhật file size", description = "Cập nhật file size")
    public ResponseEntity<RestResponse<Version>> setFileSize(
            @PathVariable String id,
            @RequestParam Long fileSize) {
        Version version = versionService.setFileSize(id, fileSize);
        
                RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật file size thành công.")
            .data(version)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/checksum")
    @Operation(summary = "Cập nhật checksum", description = "Cập nhật checksum")
    public ResponseEntity<RestResponse<Version>> setChecksum(
            @PathVariable String id,
            @RequestParam String checksum) {
        Version version = versionService.setChecksum(id, checksum);
        
                RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật checksum thành công.")
            .data(version)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/approval-required")
    @Operation(summary = "Cập nhật approval required", description = "Cập nhật trạng thái cần approval")
    public ResponseEntity<RestResponse<Version>> setApprovalRequired(
            @PathVariable String id,
            @RequestParam Boolean approvalRequired) {
        Version version = versionService.setApprovalRequired(id, approvalRequired);
        
                RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật approval required thành công.")
            .data(version)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/tags")
    @Operation(summary = "Cập nhật tags", description = "Cập nhật tags")
    public ResponseEntity<RestResponse<Version>> setTags(
            @PathVariable String id,
            @RequestParam String[] tags) {
        Version version = versionService.setTags(id, tags);
        
                RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật tags thành công.")
            .data(version)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/detailed-changes")
    @Operation(summary = "Cập nhật detailed changes", description = "Cập nhật detailed changes")
    public ResponseEntity<RestResponse<Version>> setDetailedChanges(
            @PathVariable String id,
            @RequestBody Map<String, Object> detailedChanges) {
        Version version = versionService.setDetailedChanges(id, detailedChanges);
        
                RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật detailed changes thành công.")
            .data(version)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa version", description = "Soft delete version")
    public ResponseEntity<RestResponse<Void>> deleteVersion(
            @PathVariable String id,
            @RequestParam String deletedBy) {
        versionService.deleteVersion(id, deletedBy);
        
        RestResponse<Void> response = RestResponse.<Void>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Xóa version thành công.")
            .data(null)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/restore")
    @Operation(summary = "Khôi phục version", description = "Khôi phục version đã xóa")
    public ResponseEntity<RestResponse<Version>> restoreVersion(@PathVariable String id) {
        Version version = versionService.restoreVersion(id);
        
                RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Khôi phục version thành công.")
            .data(version)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/count")
    @Operation(summary = "Đếm phiên bản (rút gọn)", description = "Thay thế các đường dẫn count-* bằng query aggregate=count")
    public ResponseEntity<RestResponse<Long>> countVersions(
            @RequestParam(required = false) String contractId,
            @RequestParam(required = false) Version.ChangeType changeType,
            @RequestParam(required = false) Boolean isPublished,
            @RequestParam(required = false) Boolean isCurrent) {
        long count;
        if (contractId != null && changeType != null) {
            count = versionService.countVersionsByContractIdAndChangeType(contractId, changeType);
        } else if (contractId != null && isPublished != null) {
            count = versionService.countVersionsByContractIdAndIsPublished(contractId, isPublished);
        } else if (contractId != null && isCurrent != null) {
            count = versionService.countVersionsByContractIdAndIsCurrent(contractId, isCurrent);
        } else if (contractId != null) {
            count = versionService.countVersionsByContractId(contractId);
        } else {
            List<Version> all = versionService.getAllVersions();
            count = all == null ? 0 : all.size();
        }

        RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số phiên bản thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/exists")
    @Operation(summary = "Kiểm tra tồn tại phiên bản (rút gọn)", description = "Thay thế các đường dẫn exists-* bằng query aggregate=exists")
    public ResponseEntity<RestResponse<Boolean>> existsVersions(
            @RequestParam(required = false) String contractId,
            @RequestParam(required = false) Version.ChangeType changeType,
            @RequestParam(required = false) Boolean isPublished,
            @RequestParam(required = false) Boolean isCurrent,
            @RequestParam(required = false) String[] tags,
            @RequestParam(required = false) String filePath,
            @RequestParam(required = false) String checksum) {
        boolean exists = false;
        if (contractId != null && Boolean.TRUE.equals(isCurrent)) {
            exists = versionService.existsCurrentVersionByContractId(contractId);
        } else if (contractId != null && isPublished != null) {
            exists = versionService.existsPublishedVersionByContractId(contractId);
        } else if (contractId != null && tags != null) {
            exists = versionService.existsVersionByTags(contractId, tags);
        } else if (contractId != null && filePath != null) {
            exists = versionService.existsVersionByFilePath(contractId, filePath);
        } else if (contractId != null && checksum != null) {
            exists = versionService.existsVersionByChecksum(contractId, checksum);
        } else if (contractId != null && changeType != null) {
            exists = versionService.existsVersionByChangeType(contractId, changeType);
        } else if (contractId != null) {
            exists = versionService.countVersionsByContractId(contractId) > 0;
        }

        RestResponse<Boolean> response = RestResponse.<Boolean>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Kiểm tra tồn tại phiên bản thành công.")
            .data(exists)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Cập nhật từng phần phiên bản (rút gọn)", description = "Hỗ trợ: previousVersionId, filePath, fileSize, checksum, approvalRequired, tags[], detailedChanges, markCurrent, unmarkCurrent, publishBy, approveBy, rollbackReason")
    public ResponseEntity<RestResponse<Version>> patchVersion(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {
        Version updated = null;

        if (body.containsKey("previousVersionId")) {
            Object v = body.get("previousVersionId");
            if (v instanceof String s) updated = versionService.setPreviousVersionId(id, s);
        }
        if (body.containsKey("filePath")) {
            Object v = body.get("filePath");
            if (v instanceof String s) updated = versionService.setFilePath(id, s);
        }
        if (body.containsKey("fileSize")) {
            Object v = body.get("fileSize");
            if (v instanceof Number n) updated = versionService.setFileSize(id, n.longValue());
        }
        if (body.containsKey("checksum")) {
            Object v = body.get("checksum");
            if (v instanceof String s) updated = versionService.setChecksum(id, s);
        }
        if (body.containsKey("approvalRequired")) {
            Object v = body.get("approvalRequired");
            if (v instanceof Boolean b) updated = versionService.setApprovalRequired(id, b);
        }
        if (body.containsKey("tags")) {
            Object v = body.get("tags");
            if (v instanceof java.util.List<?> list) {
                String[] arr = list.stream().filter(String.class::isInstance).map(String.class::cast).toArray(String[]::new);
                updated = versionService.setTags(id, arr);
            }
        }
        if (body.containsKey("detailedChanges")) {
            Object v = body.get("detailedChanges");
            if (v instanceof Map<?,?> m) {
                @SuppressWarnings("unchecked") Map<String,Object> cast = (Map<String,Object>) m;
                updated = versionService.setDetailedChanges(id, cast);
            }
        }
        if (Boolean.TRUE.equals(body.get("markCurrent"))) {
            updated = versionService.markVersionAsCurrent(id);
        }
        if (Boolean.TRUE.equals(body.get("unmarkCurrent"))) {
            updated = versionService.unmarkVersionAsCurrent(id);
        }
        if (body.containsKey("publishBy")) {
            Object v = body.get("publishBy");
            if (v instanceof String s) updated = versionService.publishVersion(id, s);
        }
        if (body.containsKey("approveBy")) {
            Object v = body.get("approveBy");
            if (v instanceof String s) updated = versionService.approveVersion(id, s);
        }
        if (body.containsKey("rollbackReason")) {
            Object v = body.get("rollbackReason");
            if (v instanceof String s) updated = versionService.rollbackVersion(id, s);
        }

        if (updated == null) {
            RestResponse<Version> bad = RestResponse.<Version>builder()
                .apiVersion("v1")
                .statusCode(400)
                .shortMessage("Bad Request")
                .description("Không có trường hợp lệ để cập nhật.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            return new ResponseEntity<>(bad, HttpStatus.OK);
        }

        RestResponse<Version> response = RestResponse.<Version>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật phiên bản thành công.")
            .data(updated)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Deprecated: dùng GET /versions?contractId=...&aggregate=count
    
    // Deprecated: dùng GET /versions?contractId=...&changeType=...&aggregate=count
    
    // Deprecated: dùng GET /versions?contractId=...&isPublished=...&aggregate=count
    
    // Deprecated: dùng GET /versions?contractId=...&isCurrent=...&aggregate=count

    // Deprecated: dùng GET /versions?contractId=...&versionNumber=...&aggregate=exists
    
    // Deprecated: dùng GET /versions?contractId=...&isCurrent=true&aggregate=exists
    
    // Deprecated: dùng GET /versions?contractId=...&isPublished=true&aggregate=exists
    
    // Deprecated: dùng GET /versions?contractId=...&changeType=...&aggregate=exists
    
    // Deprecated: dùng GET /versions?contractId=...&tags=...&aggregate=exists
    
    // Deprecated: dùng GET /versions?contractId=...&filePath=...&aggregate=exists

    // Deprecated: dùng GET /versions?contractId=...&checksum=...&aggregate=exists
    
    // Deprecated: dùng GET /versions?contractId=...&fileSize=...&aggregate=exists
    
    // Deprecated: dùng GET /versions?contractId=...&previousVersionId=...&aggregate=exists
    
    // Deprecated: dùng GET /versions?contractId=...&publishedBy=...&aggregate=exists
    
    // Deprecated: dùng GET /versions?contractId=...&approvedBy=...&aggregate=exists

    // Deprecated: dùng GET /versions?contractId=...&searchTerm=...&aggregate=exists
    
    // Deprecated: dùng GET /versions?contractId=...&searchTerm=...&aggregate=exists
}
