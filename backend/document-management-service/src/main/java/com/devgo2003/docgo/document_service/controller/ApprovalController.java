package com.devgo2003.docgo.document_service.controller;

import com.devgo2003.docgo.document_service.entity.Approval;
import com.devgo2003.docgo.document_service.service.ApprovalService;
import com.devgo2003.docgo.document_service.dto.ApprovalCreateRequest;
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

@RestController
@RequestMapping("/api/v1/document-management-service/approvals")
@Tag(name = "✅ APIs Quản lý Phê duyệt", description = "Các API để quản lý quy trình phê duyệt hợp đồng trong hệ thống DocGO")
public class ApprovalController {

    private final ApprovalService approvalService;
    private final HttpServletRequest request;

    public ApprovalController(ApprovalService approvalService, HttpServletRequest request) {
        this.approvalService = approvalService;
        this.request = request;
    }

    @GetMapping
    @Operation(
        summary = "Lấy danh sách phê duyệt (hợp nhất)",
        description = """
        ## 📖 Mô tả
        Lấy danh sách phê duyệt (approval) với nhiều chế độ lọc/sort/aggregate. Trả về theo chuẩn RestResponse.

        ## 🔹 Đầu vào

        📄 pageNumber (tùy chọn, query)
        Loại: integer
        Mô tả: Số trang (mặc định: 0)

        📄 pageSize (tùy chọn, query)
        Loại: integer
        Mô tả: Kích thước trang (mặc định: 10)

        📄 sortBy (tùy chọn, query)
        Loại: string
        Mô tả: createdAt | dueDate | order (mặc định: createdAt)

        📄 sortDirection (tùy chọn, query)
        Loại: string
        Mô tả: ASC | DESC (mặc định: DESC)

        📄 searchTerm (tùy chọn, query)
        Loại: string
        Mô tả: Từ khóa tìm kiếm

        📄 includeDeleted (tùy chọn, query)
        Loại: boolean
        Mô tả: Bao gồm các approval đã xóa mềm (mặc định: false)

        📄 contractId, approverId, approverEmail, approverRole (tùy chọn, query)
        Loại: string
        Mô tả: Các tiêu chí lọc theo hợp đồng/người phê duyệt

        📄 status (tùy chọn, query)
        Loại: enum
        Mô tả: PENDING_REVIEW | APPROVED | REJECTED | EXPIRED

        📄 priority (tùy chọn, query)
        Loại: enum
        Mô tả: Mức độ ưu tiên

        📄 order (tùy chọn, query)
        Loại: integer
        Mô tả: Thứ tự phê duyệt

        📄 dueFrom, dueTo (tùy chọn, query)
        Loại: string (ISO-8601)
        Mô tả: Khoảng thời gian due date

        📄 aggregate (tùy chọn, query)
        Loại: string
        Mô tả: count | exists (chế độ tổng hợp; thay vì trả list)

        ## 🔹 Đầu ra

        📝 data
        Loại: List<Approval> | Long | Boolean
        Mô tả: Danh sách/đếm/kiểm tra tồn tại approval tùy theo aggregate

        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)

        🔢 statusCode
        Loại: integer
        Mô tả: 200 (OK) | 204 (No Content)

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
    public ResponseEntity<RestResponse<?>> getAllApprovals(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "false") boolean includeDeleted,
            @RequestParam(required = false) String contractId,
            @RequestParam(required = false) String approverId,
            @RequestParam(required = false) String approverEmail,
            @RequestParam(required = false) String approverRole,
            @RequestParam(required = false) Approval.ApprovalStatus status,
            @RequestParam(required = false) Approval.ApprovalPriority priority,
            @RequestParam(required = false) Integer order,
            @RequestParam(required = false) String dueFrom,
            @RequestParam(required = false) String dueTo,
            @RequestParam(required = false) String aggregate) {

        // Aggregate (count|exists)
        if (aggregate != null && !aggregate.isBlank()) {
            String agg = aggregate.toLowerCase();
            if ("count".equals(agg)) {
                long count;
                if (contractId != null && status != null) {
                    count = approvalService.countApprovalsByContractIdAndStatus(contractId, status);
                } else if (approverId != null && status != null) {
                    count = approvalService.countApprovalsByApproverIdAndStatus(approverId, status);
                } else if (contractId != null) {
                    // no direct count-all; degrade to size
                    List<Approval> list = approvalService.getApprovalsByContractId(contractId);
                    count = list == null ? 0 : list.size();
                } else {
                    List<Approval> all = approvalService.getAllApprovals();
                    count = all == null ? 0 : all.size();
                }
                RestResponse<Long> response = RestResponse.<Long>builder()
                        .apiVersion("v1")
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Đếm số phê duyệt thành công.")
                        .data(count)
                        .timestamp(ZonedDateTime.now())
                        .requestId(UUID.randomUUID().toString())
                        .path(request.getRequestURI())
                        .build();
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
            if ("exists".equals(agg)) {
                boolean exists = false;
                if (contractId != null && status == Approval.ApprovalStatus.PENDING_REVIEW) {
                    exists = approvalService.hasPendingApprovals(contractId);
                } else if (contractId != null && status == Approval.ApprovalStatus.APPROVED) {
                    exists = approvalService.hasApprovedApprovals(contractId);
                } else if (contractId != null && status == Approval.ApprovalStatus.REJECTED) {
                    exists = approvalService.hasRejectedApprovals(contractId);
                } else if (contractId != null && status == Approval.ApprovalStatus.EXPIRED) {
                    exists = approvalService.hasExpiredApprovals(contractId);
                } else if (contractId != null && approverRole != null) {
                    exists = approvalService.hasApprovalsByRole(contractId, approverRole);
                } else if (contractId != null) {
                    exists = !approvalService.getApprovalsByContractId(contractId).isEmpty();
                }
                RestResponse<Boolean> response = RestResponse.<Boolean>builder()
                        .apiVersion("v1")
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Kiểm tra tồn tại phê duyệt thành công.")
                        .data(exists)
                        .timestamp(ZonedDateTime.now())
                        .requestId(UUID.randomUUID().toString())
                        .path(request.getRequestURI())
                        .build();
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
        }

        // List mode
        List<Approval> approvals;
        if (contractId != null && status == Approval.ApprovalStatus.PENDING_REVIEW) {
            approvals = approvalService.getPendingApprovalsByContractId(contractId);
        } else if (contractId != null && status == Approval.ApprovalStatus.APPROVED) {
            approvals = approvalService.getApprovedApprovalsByContractId(contractId);
        } else if (contractId != null && status == Approval.ApprovalStatus.REJECTED) {
            approvals = approvalService.getRejectedApprovalsByContractId(contractId);
        } else if (approverId != null) {
            approvals = approvalService.getApprovalsByApproverId(approverId);
        } else if (approverEmail != null) {
            approvals = approvalService.getApprovalsByApproverEmail(approverEmail);
        } else if (approverRole != null && status != null) {
            // Fallback: lấy theo role rồi lọc theo status
            List<Approval> byRole = approvalService.getApprovalsByApproverRole(approverRole);
            approvals = byRole == null ? List.of() : byRole.stream()
                    .filter(a -> a.getStatus() == status)
                    .toList();
        } else if (approverRole != null) {
            approvals = approvalService.getApprovalsByApproverRole(approverRole);
        } else if (priority != null) {
            approvals = approvalService.getApprovalsByPriority(priority);
        } else if (contractId != null && order != null) {
            approvals = approvalService.getApprovalsByOrder(contractId, order);
        } else if (dueFrom != null && dueTo != null) {
            try {
                LocalDateTime from = LocalDateTime.parse(dueFrom);
                LocalDateTime to = LocalDateTime.parse(dueTo);
                approvals = approvalService.getApprovalsByDueDateRange(contractId, from, to);
            } catch (Exception e) {
                approvals = approvalService.getAllApprovals();
            }
        } else if (contractId != null && sortBy.equalsIgnoreCase("order")) {
            approvals = approvalService.getApprovalsByOrder(contractId, 0); // fallback usage
        } else if (contractId != null) {
            approvals = approvalService.getApprovalsByContractId(contractId);
        } else {
            approvals = approvalService.getAllApprovals();
        }

        if (approvals == null || approvals.isEmpty()) {
            RestResponse<List<Approval>> response = RestResponse.<List<Approval>>builder()
                .apiVersion("v1")
                .statusCode(204)
                .shortMessage("No Content")
                .description("Không có phê duyệt nào.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        RestResponse<List<Approval>> response = RestResponse.<List<Approval>>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Lấy danh sách phê duyệt thành công.")
            .data(approvals)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Removed duplicate getApproval mapping to avoid ambiguous mapping with getApprovalById

    @GetMapping("/count")
    @Operation(summary = "Đếm phê duyệt (rút gọn)", description = "Thay thế các đường dẫn count-* bằng query aggregate=count")
    public ResponseEntity<RestResponse<Long>> countApprovals(
            @RequestParam(required = false) String contractId,
            @RequestParam(required = false) Approval.ApprovalStatus status,
            @RequestParam(required = false) String approverId) {
        long count;
        if (contractId != null && status != null) {
            count = approvalService.countApprovalsByContractIdAndStatus(contractId, status);
        } else if (approverId != null && status != null) {
            count = approvalService.countApprovalsByApproverIdAndStatus(approverId, status);
        } else if (contractId != null) {
            List<Approval> list = approvalService.getApprovalsByContractId(contractId);
            count = list == null ? 0 : list.size();
        } else {
            List<Approval> all = approvalService.getAllApprovals();
            count = all == null ? 0 : all.size();
        }

        RestResponse<Long> response = RestResponse.<Long>builder()
                .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số phê duyệt thành công.")
            .data(count)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        
    @GetMapping("/exists")
    @Operation(summary = "Kiểm tra tồn tại phê duyệt (rút gọn)", description = "Thay thế các đường dẫn exists-/has-* bằng query aggregate=exists")
    public ResponseEntity<RestResponse<Boolean>> existsApprovals(
            @RequestParam(required = false) String contractId,
            @RequestParam(required = false) Approval.ApprovalStatus status,
            @RequestParam(required = false) String approverRole) {
        boolean exists = false;
        if (contractId != null && status == Approval.ApprovalStatus.PENDING_REVIEW) {
            exists = approvalService.hasPendingApprovals(contractId);
        } else if (contractId != null && status == Approval.ApprovalStatus.APPROVED) {
            exists = approvalService.hasApprovedApprovals(contractId);
        } else if (contractId != null && status == Approval.ApprovalStatus.REJECTED) {
            exists = approvalService.hasRejectedApprovals(contractId);
        } else if (contractId != null && status == Approval.ApprovalStatus.EXPIRED) {
            exists = approvalService.hasExpiredApprovals(contractId);
        } else if (contractId != null && approverRole != null) {
            exists = approvalService.hasApprovalsByRole(contractId, approverRole);
        } else if (contractId != null) {
            exists = !approvalService.getApprovalsByContractId(contractId).isEmpty();
        }

        RestResponse<Boolean> response = RestResponse.<Boolean>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Kiểm tra tồn tại phê duyệt thành công.")
            .data(exists)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    @Operation(
        summary = "Tạo phê duyệt mới", 
        description = """
        ## 📖 Mô tả
        Tạo phê duyệt mới cho hợp đồng. Trả về theo chuẩn RestResponse.

        ## 🔹 Đầu vào

        📄 body (bắt buộc, application/json)
        Loại: ApprovalCreateRequest
        Mô tả: contractId, approverId, approverName, approverEmail, approverRole, priority, dueDate, approvalOrder, isRequired

        ## 🔹 Đầu ra

        📝 data
        Loại: Approval
        Mô tả: Bản ghi phê duyệt vừa tạo

        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)

        🔢 statusCode
        Loại: integer
        Mô tả: 201 (Created)

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
    public ResponseEntity<RestResponse<Approval>> createApproval(@RequestBody ApprovalCreateRequest request) {
        Approval approval = approvalService.createApproval(request);
        
        RestResponse<Approval> response = RestResponse.<Approval>builder()
            .apiVersion("v1")
            .statusCode(201)
            .shortMessage("Created")
            .description("Tạo phê duyệt thành công.")
            .data(approval)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(this.request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Removed deprecated nested create endpoint. Use POST /approvals with body instead.

    // Removed deprecated nested list endpoint. Use GET /approvals?contractId=...

    @GetMapping("/{id}")
    @Operation(summary = "Lấy approval theo ID", description = "Lấy chi tiết approval")
    public ResponseEntity<RestResponse<Approval>> getApprovalById(@PathVariable String id) {
        Optional<Approval> approval = approvalService.getApprovalById(id);
        
        if (approval.isEmpty()) {
            RestResponse<Approval> response = RestResponse.<Approval>builder()
                .apiVersion("v1")
                .statusCode(404)
                .shortMessage("Not Found")
                .description("Không tìm thấy approval.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        
                RestResponse<Approval> response = RestResponse.<Approval>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Lấy approval thành công.")
            .data(approval.get())
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Removed deprecated nested PENDING_REVIEW endpoint. Use GET /approvals?contractId=...&status=PENDING_REVIEW

    // Removed deprecated nested approved endpoint. Use GET /approvals?contractId=...&status=APPROVED

    // Removed deprecated nested rejected endpoint. Use GET /approvals?contractId=...&status=REJECTED

    // Removed deprecated approverId path. Use GET /approvals?approverId=...

    // Removed deprecated approverEmail path. Use GET /approvals?approverEmail=...

    // Removed deprecated approverRole path. Use GET /approvals?approverRole=...

    // Removed deprecated expiring list. Use GET /approvals with query.

    // Removed deprecated expired list. Use GET /approvals with query.

    // Removed deprecated priority path. Use GET /approvals?priority=...

    // Removed deprecated order path. Use GET /approvals?contractId=...&order=...

    // Deprecated nested route removed: dùng GET /approvals?contractId=...&isRequired=true

    // Deprecated nested route removed: dùng GET /approvals?contractId=...&isRequired=false

    // Deprecated nested route removed: dùng GET /approvals?contractId=...&dueFrom=...&dueTo=...

    // Deprecated nested route removed: dùng GET /approvals?contractId=...&dueTo=...

    // Deprecated nested route removed: dùng GET /approvals?contractId=...&notified=true

    // Deprecated nested route removed: dùng GET /approvals?contractId=...&notified=false

    @PutMapping("/{id}/approve")
    @Operation(summary = "Phê duyệt approval", description = "Phê duyệt approval với comments")
    public ResponseEntity<RestResponse<Approval>> approveApproval(
            @PathVariable String id,
            @RequestParam String comments) {
        Approval approval = approvalService.approveApproval(id, comments);
        
        RestResponse<Approval> response = RestResponse.<Approval>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Phê duyệt approval thành công.")
            .data(approval)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Từ chối approval", description = "Từ chối approval với lý do")
    public ResponseEntity<RestResponse<Approval>> rejectApproval(
            @PathVariable String id,
            @RequestParam String rejectionReason) {
        Approval approval = approvalService.rejectApproval(id, rejectionReason);
        
        RestResponse<Approval> response = RestResponse.<Approval>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Từ chối approval thành công.")
            .data(approval)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Hủy approval", description = "Hủy approval")
    public ResponseEntity<RestResponse<Approval>> cancelApproval(@PathVariable String id) {
        Approval approval = approvalService.cancelApproval(id);
        
        RestResponse<Approval> response = RestResponse.<Approval>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Hủy approval thành công.")
            .data(approval)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/expire")
    @Operation(summary = "Đánh dấu approval hết hạn", description = "Đánh dấu approval đã hết hạn")
    public ResponseEntity<RestResponse<Approval>> markApprovalAsExpired(@PathVariable String id) {
        Approval approval = approvalService.markApprovalAsExpired(id);
        
        RestResponse<Approval> response = RestResponse.<Approval>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đánh dấu approval hết hạn thành công.")
            .data(approval)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/increment-reminder")
    @Operation(summary = "Tăng reminder count", description = "Tăng số lần nhắc nhở")
    public ResponseEntity<RestResponse<Approval>> incrementReminderCount(@PathVariable String id) {
        Approval approval = approvalService.incrementReminderCount(id);
        
        RestResponse<Approval> response = RestResponse.<Approval>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Tăng reminder count thành công.")
            .data(approval)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/notify")
    @Operation(summary = "Đánh dấu đã notify", description = "Đánh dấu approval đã được thông báo")
    public ResponseEntity<RestResponse<Approval>> setNotificationTime(@PathVariable String id) {
        Approval approval = approvalService.setNotificationTime(id);
        
        RestResponse<Approval> response = RestResponse.<Approval>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đánh dấu đã notify thành công.")
            .data(approval)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/due-date")
    @Operation(summary = "Cập nhật due date", description = "Cập nhật ngày hết hạn")
    public ResponseEntity<RestResponse<Approval>> setDueDate(
            @PathVariable String id,
            @RequestParam LocalDateTime dueDate) {
        Approval approval = approvalService.setDueDate(id, dueDate);
        
        RestResponse<Approval> response = RestResponse.<Approval>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật due date thành công.")
            .data(approval)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/priority")
    @Operation(summary = "Cập nhật priority", description = "Cập nhật mức độ ưu tiên")
    public ResponseEntity<RestResponse<Approval>> setPriority(
            @PathVariable String id,
            @RequestParam Approval.ApprovalPriority priority) {
        Approval approval = approvalService.setPriority(id, priority);
        
        RestResponse<Approval> response = RestResponse.<Approval>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật priority thành công.")
            .data(approval)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái phê duyệt (rút gọn)", description = "Thay thế các URL dài approve/reject/cancel/expire")
    public ResponseEntity<RestResponse<Approval>> updateApprovalStatus(
            @PathVariable String id,
            @RequestBody(required = false) java.util.Map<String, Object> body) {
        Approval approval;
        String status = body == null ? null : (String) body.getOrDefault("status", null);
        String comment = body == null ? null : (String) body.getOrDefault("comment", null);

        if (status == null) {
            RestResponse<Approval> response = RestResponse.<Approval>builder()
                .apiVersion("v1")
                .statusCode(400)
                .shortMessage("Bad Request")
                .description("Thiếu trường 'status'.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        switch (status.toUpperCase()) {
            case "APPROVED" -> approval = approvalService.approveApproval(id, comment == null ? "" : comment);
            case "REJECTED" -> approval = approvalService.rejectApproval(id, comment == null ? "" : comment);
            case "CANCELED" -> approval = approvalService.cancelApproval(id);
            case "EXPIRED" -> approval = approvalService.markApprovalAsExpired(id);
            default -> {
                RestResponse<Approval> response = RestResponse.<Approval>builder()
                    .apiVersion("v1")
                    .statusCode(400)
                    .shortMessage("Bad Request")
                    .description("Giá trị 'status' không hợp lệ.")
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(UUID.randomUUID().toString())
                    .path(request.getRequestURI())
                    .build();
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
        }

        RestResponse<Approval> response = RestResponse.<Approval>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật trạng thái approval thành công.")
            .data(approval)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Cập nhật từng phần phê duyệt (rút gọn)", description = "Hỗ trợ cập nhật dueDate, priority, order, isRequired, incrementReminder, notify")
    public ResponseEntity<RestResponse<Approval>> patchApproval(
            @PathVariable String id,
            @RequestBody java.util.Map<String, Object> body) {
        Approval updated = null;

        if (body.containsKey("dueDate")) {
            Object v = body.get("dueDate");
            if (v instanceof String s) {
                try {
                    LocalDateTime dt = LocalDateTime.parse(s);
                    updated = approvalService.setDueDate(id, dt);
                } catch (Exception ignored) { /* fallback below */ }
            }
        }

        if (body.containsKey("priority")) {
            Object v = body.get("priority");
            if (v instanceof String s) {
                try {
                    Approval.ApprovalPriority p = Approval.ApprovalPriority.valueOf(s.toUpperCase());
                    updated = approvalService.setPriority(id, p);
                } catch (Exception ignored) { /* fallback below */ }
            }
        }

        if (body.containsKey("order")) {
            Object v = body.get("order");
            if (v instanceof Number n) {
                updated = approvalService.setApprovalOrder(id, n.intValue());
            }
        }

        if (body.containsKey("isRequired")) {
            Object v = body.get("isRequired");
            if (v instanceof Boolean b) {
                updated = approvalService.setIsRequired(id, b);
            }
        }

        if (body.containsKey("incrementReminder") && Boolean.TRUE.equals(body.get("incrementReminder"))) {
            updated = approvalService.incrementReminderCount(id);
        }

        if (body.containsKey("notify") && Boolean.TRUE.equals(body.get("notify"))) {
            updated = approvalService.setNotificationTime(id);
        }

        if (updated == null) {
            RestResponse<Approval> response = RestResponse.<Approval>builder()
                .apiVersion("v1")
                .statusCode(400)
                .shortMessage("Bad Request")
                .description("Không có trường hợp lệ để cập nhật.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        RestResponse<Approval> response = RestResponse.<Approval>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật approval thành công.")
            .data(updated)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/order")
    @Operation(summary = "Cập nhật approval order", description = "Cập nhật thứ tự phê duyệt")
    public ResponseEntity<RestResponse<Approval>> setApprovalOrder(
            @PathVariable String id,
            @RequestParam Integer approvalOrder) {
        Approval approval = approvalService.setApprovalOrder(id, approvalOrder);
        
        RestResponse<Approval> response = RestResponse.<Approval>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật approval order thành công.")
            .data(approval)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/required")
    @Operation(summary = "Cập nhật isRequired", description = "Cập nhật trạng thái bắt buộc")
    public ResponseEntity<RestResponse<Approval>> setIsRequired(
            @PathVariable String id,
            @RequestParam Boolean isRequired) {
        Approval approval = approvalService.setIsRequired(id, isRequired);
        
        RestResponse<Approval> response = RestResponse.<Approval>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật isRequired thành công.")
            .data(approval)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa approval", description = "Soft delete approval")
    public ResponseEntity<RestResponse<Void>> deleteApproval(
            @PathVariable String id,
            @RequestParam String deletedBy) {
        approvalService.deleteApproval(id, deletedBy);
        
        RestResponse<Void> response = RestResponse.<Void>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Xóa approval thành công.")
            .data(null)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/restore")
    @Operation(summary = "Khôi phục approval", description = "Khôi phục approval đã xóa")
    public ResponseEntity<RestResponse<Approval>> restoreApproval(@PathVariable String id) {
        Approval approval = approvalService.restoreApproval(id);
        
        RestResponse<Approval> response = RestResponse.<Approval>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Khôi phục approval thành công.")
            .data(approval)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Deprecated nested count route removed: dùng GET /approvals?contractId=...&status=...&aggregate=count

    // Deprecated nested count route removed: dùng GET /approvals?approverId=...&status=...&aggregate=count

    // Deprecated nested exists route removed: dùng GET /approvals?contractId=...&status=PENDING_REVIEW&aggregate=exists

    // Deprecated nested exists route removed: dùng GET /approvals?contractId=...&status=APPROVED&aggregate=exists

    // Deprecated nested exists route removed: dùng GET /approvals?contractId=...&status=REJECTED&aggregate=exists

    // Deprecated nested exists route removed: dùng GET /approvals?contractId=...&status=EXPIRED&aggregate=exists

    // Deprecated nested exists route removed: dùng GET /approvals?contractId=...&status=EXPIRING&aggregate=exists hoặc dueTo

    // Deprecated nested exists route removed: dùng GET /approvals?contractId=...&aggregate=exists&minReminderCount=...

    // Deprecated nested exists route removed: dùng GET /approvals?aggregate=exists&contractId=...&approverRole=...

    // Deprecated nested exists route removed: dùng GET /approvals?aggregate=exists&contractId=...&approverRole=...&status=...
}


