package com.devgo2003.docgo.contract_service.controller;

import com.devgo2003.docgo.contract_service.script.ManualTestDataGenerator;
import com.devgo2003.docgo.contract_service.common.response.RestResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller để quản lý dữ liệu test
 * CHỈ SỬ DỤNG TRONG MÔI TRƯỜNG DEVELOPMENT
 */
@RestController
@RequestMapping("/api/v1/contract-management-service/test")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Test Data Management", description = "Quản lý dữ liệu test cho Contract Management Service")
public class TestDataController {

    private final ManualTestDataGenerator testDataGenerator;

    /**
     * Tạo dữ liệu test mới (xóa dữ liệu cũ và tạo mới)
     */
    @PostMapping("/generate")
    @Operation(summary = "Tạo dữ liệu test mới", 
               description = "Xóa tất cả dữ liệu cũ và tạo 4 hợp đồng test mới với ContractType chuẩn")
    public ResponseEntity<RestResponse<String>> generateTestData() {
        try {
            log.info("Bắt đầu tạo dữ liệu test mới...");
            
            // Gọi script tạo dữ liệu test
            testDataGenerator.generateTestData();
            
            String message = "Đã tạo thành công 4 hợp đồng test mới với ContractType chuẩn";
            log.info(message);
            
            return ResponseEntity.ok(RestResponse.success(message));
            
        } catch (Exception e) {
            log.error("Lỗi khi tạo dữ liệu test: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(RestResponse.<String>builder()
                            .apiVersion("v1")
                            .statusCode(500)
                            .shortMessage("Internal Server Error")
                            .description("Lỗi khi tạo dữ liệu test: " + e.getMessage())
                            .timestamp(java.time.ZonedDateTime.now())
                            .requestId(java.util.UUID.randomUUID().toString())
                            .build());
        }
    }

    /**
     * Xóa tất cả dữ liệu test
     */
    @DeleteMapping("/clear")
    @Operation(summary = "Xóa dữ liệu test", 
               description = "Xóa tất cả dữ liệu test trong database")
    public ResponseEntity<RestResponse<String>> clearTestData() {
        try {
            log.info("Bắt đầu xóa dữ liệu test...");
            
            // Gọi script xóa dữ liệu
            testDataGenerator.clearTestData();
            
            String message = "Đã xóa thành công tất cả dữ liệu test";
            log.info(message);
            
            return ResponseEntity.ok(RestResponse.success(message));
            
        } catch (Exception e) {
            log.error("Lỗi khi xóa dữ liệu test: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(RestResponse.<String>builder()
                            .apiVersion("v1")
                            .statusCode(500)
                            .shortMessage("Internal Server Error")
                            .description("Lỗi khi xóa dữ liệu test: " + e.getMessage())
                            .timestamp(java.time.ZonedDateTime.now())
                            .requestId(java.util.UUID.randomUUID().toString())
                            .build());
        }
    }

    /**
     * Tạo dữ liệu test nếu database trống
     */
    @PostMapping("/generate-if-empty")
    @Operation(summary = "Tạo dữ liệu test nếu trống", 
               description = "Chỉ tạo dữ liệu test nếu database chưa có dữ liệu")
    public ResponseEntity<RestResponse<String>> generateTestDataIfEmpty() {
        try {
            log.info("Kiểm tra và tạo dữ liệu test nếu cần...");
            
            // Gọi script tạo dữ liệu nếu trống
            testDataGenerator.generateTestDataIfEmpty();
            
            String message = "Đã kiểm tra và tạo dữ liệu test nếu cần";
            log.info(message);
            
            return ResponseEntity.ok(RestResponse.success(message));
            
        } catch (Exception e) {
            log.error("Lỗi khi kiểm tra/tạo dữ liệu test: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(RestResponse.<String>builder()
                            .apiVersion("v1")
                            .statusCode(500)
                            .shortMessage("Internal Server Error")
                            .description("Lỗi khi kiểm tra/tạo dữ liệu test: " + e.getMessage())
                            .timestamp(java.time.ZonedDateTime.now())
                            .requestId(java.util.UUID.randomUUID().toString())
                            .build());
        }
    }
}
