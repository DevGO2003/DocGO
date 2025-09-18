package com.devgo2003.docgo.contract_service.controller;

import com.devgo2003.docgo.contract_service.entity.AuditLog;
import com.devgo2003.docgo.contract_service.service.AuditService;
import com.devgo2003.docgo.contract_service.dto.AuditLogCreateRequest;
import com.devgo2003.docgo.contract_service.common.response.RestResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.UUID;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/contract-management-service/audit-logs")
@Tag(name = "API Quản lý Audit Log", description = "Các API để quản lý nhật ký kiểm toán trong hệ thống DocGO")
public class AuditController {

    private final AuditService auditService;
    private final HttpServletRequest request;

    public AuditController(AuditService auditService, HttpServletRequest request) {
        this.auditService = auditService;
        this.request = request;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả audit log", description = "Lấy danh sách tất cả audit log")
    public ResponseEntity<RestResponse<List<AuditLog>>> getAllAuditLogs() {
        
        List<AuditLog> auditLogs = auditService.getAllAuditLogs();
        
        if (auditLogs.isEmpty()) {
            RestResponse<List<AuditLog>> response = RestResponse.<List<AuditLog>>builder()
                .apiVersion("v1")
                .statusCode(204)
                .shortMessage("No Content")
                .description("Không có audit log nào.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        
        RestResponse<List<AuditLog>> response = RestResponse.<List<AuditLog>>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Lấy danh sách audit log thành công.")
            .data(auditLogs)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết audit log", description = "Lấy thông tin chi tiết của audit log theo ID")
    public ResponseEntity<RestResponse<AuditLog>> getAuditLogById(@PathVariable String id) {
        Optional<AuditLog> auditLog = auditService.getAuditLogById(id);
        
        if (auditLog.isEmpty()) {
            RestResponse<AuditLog> response = RestResponse.<AuditLog>builder()
                .apiVersion("v1")
                .statusCode(404)
                .shortMessage("Not Found")
                .description("Không tìm thấy audit log với ID: " + id)
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        
        RestResponse<AuditLog> response = RestResponse.<AuditLog>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Lấy chi tiết audit log thành công.")
            .data(auditLog.get())
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Tạo audit log mới", description = "Tạo audit log mới trong hệ thống")
    public ResponseEntity<RestResponse<AuditLog>> createAuditLog(@RequestBody AuditLogCreateRequest request) {
        AuditLog auditLog = auditService.createAuditLog(request);
        
        RestResponse<AuditLog> response = RestResponse.<AuditLog>builder()
            .apiVersion("v1")
            .statusCode(201)
            .shortMessage("Created")
            .description("Tạo audit log thành công.")
            .data(auditLog)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(this.request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}


