package com.devgo2003.docgo.contract_service.controller;
// encoding: utf-8

import com.devgo2003.docgo.contract_service.entity.ESignature;
import com.devgo2003.docgo.contract_service.service.ESignatureService;
import com.devgo2003.docgo.contract_service.dto.ESignatureCreateRequest;
import com.devgo2003.docgo.contract_service.common.response.RestResponse;
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
@RequestMapping("/api/v1/contract-management-service/esignatures")
@Tag(name = "API Quản lý chữ ký điện tử", description = "Các API để quản lý chữ ký điện tử trong hệ thống DocGO")
public class ESignatureController {

    private final ESignatureService eSignatureService;
    private final HttpServletRequest request;

    public ESignatureController(ESignatureService eSignatureService, HttpServletRequest request) {
        this.eSignatureService = eSignatureService;
        this.request = request;
    }

    @GetMapping
    @Operation(
        summary = "Lấy danh sách e-signature (hợp nhất)",
        description = "Hỗ trợ lọc: contractId, signerId, signerEmail, status(PENDING|SIGNED|DECLINED|EXPIRED|VERIFIED), type, verificationMethod, required(true/false). Khoảng thời gian: signedFrom/signedTo. Sắp xếp: sortBy(signedAt|createdAt). Tổng hợp: aggregate=count|exists."
    )
    public ResponseEntity<RestResponse<?>> getAllESignatures(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "false") boolean includeDeleted,
            @RequestParam(required = false) String contractId,
            @RequestParam(required = false) String signerId,
            @RequestParam(required = false) String signerEmail,
            @RequestParam(required = false) ESignature.SignatureStatus status,
            @RequestParam(required = false) ESignature.SignatureType type,
            @RequestParam(required = false) ESignature.VerificationMethod verificationMethod,
            @RequestParam(required = false) Boolean required,
            @RequestParam(required = false) String signedFrom,
            @RequestParam(required = false) String signedTo,
            @RequestParam(required = false) Integer minVerificationAttempts,
            @RequestParam(required = false) Integer minReminderCount,
            @RequestParam(required = false) String aggregate) {

        // Aggregate (count|exists)
        if (aggregate != null && !aggregate.isBlank()) {
            String agg = aggregate.toLowerCase();
            if ("count".equals(agg)) {
                long count;
                if (contractId != null && status != null) {
                    count = eSignatureService.countESignaturesByContractIdAndStatus(contractId, status);
                } else if (contractId != null) {
                    count = eSignatureService.countESignaturesByContractId(contractId);
                } else if (signerId != null) {
                    count = eSignatureService.countESignaturesBySignerId(signerId);
                } else {
                    List<ESignature> all = eSignatureService.getAllESignatures();
                    count = all == null ? 0 : all.size();
                }
                RestResponse<Long> response = RestResponse.<Long>builder()
                        .apiVersion("v1")
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Đếm e-signature thành công.")
                        .data(count)
                        .timestamp(ZonedDateTime.now())
                        .requestId(UUID.randomUUID().toString())
                        .path(request.getRequestURI())
                        .build();
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
            if ("exists".equals(agg)) {
                boolean exists = false;
                if (contractId != null && status != null) {
                    exists = eSignatureService.countESignaturesByContractIdAndStatus(contractId, status) > 0;
                } else if (contractId != null) {
                    exists = eSignatureService.existsESignaturesByContractId(contractId);
                } else if (signerId != null) {
                    exists = eSignatureService.getESignaturesBySignerId(signerId).size() > 0;
                }
                RestResponse<Boolean> response = RestResponse.<Boolean>builder()
                        .apiVersion("v1")
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Kiểm tra tồn tại e-signature thành công.")
                        .data(exists)
                        .timestamp(ZonedDateTime.now())
                        .requestId(UUID.randomUUID().toString())
                        .path(request.getRequestURI())
                        .build();
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
        }

        // List mode
        List<ESignature> eSignatures;
        if (signerId != null) {
            eSignatures = eSignatureService.getESignaturesBySignerId(signerId);
        } else if (signerEmail != null) {
            eSignatures = eSignatureService.getESignaturesBySignerEmail(signerEmail);
        } else if (type != null) {
            eSignatures = eSignatureService.getESignaturesBySignatureType(type);
        } else if (verificationMethod != null) {
            eSignatures = eSignatureService.getESignaturesByVerificationMethod(verificationMethod);
        } else if (contractId != null && status == ESignature.SignatureStatus.PENDING) {
            eSignatures = eSignatureService.getPendingSignaturesByContractId(contractId);
        } else if (contractId != null && status == ESignature.SignatureStatus.SIGNED) {
            eSignatures = eSignatureService.getSignedSignaturesByContractId(contractId);
        } else if (contractId != null && status == ESignature.SignatureStatus.DECLINED) {
            eSignatures = eSignatureService.getDeclinedSignaturesByContractId(contractId);
        } else if (contractId != null && Boolean.TRUE.equals(required)) {
            eSignatures = eSignatureService.getRequiredSignaturesByContractId(contractId);
        } else if (contractId != null && Boolean.FALSE.equals(required)) {
            eSignatures = eSignatureService.getOptionalSignaturesByContractId(contractId);
        } else if (contractId != null && sortBy != null && sortBy.equalsIgnoreCase("signatureOrder")) {
            eSignatures = eSignatureService.getESignaturesByContractIdOrderBySignatureOrder(contractId);
        } else if (contractId != null && sortBy != null && sortBy.equalsIgnoreCase("signedAt")) {
            eSignatures = eSignatureService.getESignaturesByContractIdOrderBySignedAt(contractId);
        } else if (contractId != null && signedFrom != null && signedTo != null) {
            try {
                LocalDateTime from = LocalDateTime.parse(signedFrom);
                LocalDateTime to = LocalDateTime.parse(signedTo);
                eSignatures = eSignatureService.getESignaturesBySignedAtBetween(from, to);
            } catch (Exception e) {
                eSignatures = eSignatureService.getAllESignatures();
            }
        } else if (contractId != null && status == ESignature.SignatureStatus.EXPIRED) {
            eSignatures = eSignatureService.getExpiredSignatures(LocalDateTime.now());
        } else if (minVerificationAttempts != null) {
            eSignatures = eSignatureService.getSignaturesWithHighVerificationAttempts(minVerificationAttempts);
        } else if (minReminderCount != null) {
            eSignatures = eSignatureService.getSignaturesWithReminders(minReminderCount);
        } else if (contractId != null) {
            eSignatures = eSignatureService.getESignaturesByContractId(contractId);
        } else {
            eSignatures = eSignatureService.getAllESignatures();
        }

        if (eSignatures == null || eSignatures.isEmpty()) {
            RestResponse<List<ESignature>> response = RestResponse.<List<ESignature>>builder()
                .apiVersion("v1")
                .statusCode(204)
                .shortMessage("No Content")
                .description("Không có chữ ký điện tử nào.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        RestResponse<List<ESignature>> response = RestResponse.<List<ESignature>>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Lấy danh sách e-signature thành công.")
            .data(eSignatures)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Removed duplicate getESignature mapping to avoid ambiguous mapping with getESignatureById

    @PostMapping
    @Operation(
        summary = "Tạo chữ ký điện tử mới", 
        description = """
        🔹 Đầu vào
        
        🔸 eSignature (bắt buộc, body)
        Loại: ESignatureCreateRequest
        mô tả: Thông tin chữ ký điện tử cần tạo (contractId, signerId, signerName, signerEmail, signatureType, signatureData)
        
        🔹 Đầu ra
        
        🔸 data
        Loại: ESignature
        mô tả: Thông tin chữ ký điện tử đã được tạo thành công
        
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
    public ResponseEntity<RestResponse<ESignature>> createESignature(@RequestBody ESignatureCreateRequest request) {
        ESignature eSignature = eSignatureService.createESignature(request);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(201)
            .shortMessage("Created")
            .description("Tạo chữ ký điện tử thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(this.request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Removed deprecated nested create endpoint. Use POST /esignatures with body

    // Removed deprecated nested list endpoint. Use GET /esignatures?contractId=...

    @GetMapping("/{id}")
    @Operation(summary = "Lấy e-signature theo ID", description = "Lấy chi tiết e-signature")
    public ResponseEntity<RestResponse<ESignature>> getESignatureById(@PathVariable String id) {
        Optional<ESignature> eSignature = eSignatureService.getESignatureById(id);
        
        if (eSignature.isEmpty()) {
            RestResponse<ESignature> response = RestResponse.<ESignature>builder()
                .apiVersion("v1")
                .statusCode(404)
                .shortMessage("Not Found")
                .description("Không tìm thấy e-signature.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Lấy e-signature thành công.")
            .data(eSignature.get())
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Deprecated nested status route removed: dùng GET /esignatures?contractId=...&status=PENDING

    // Deprecated nested status route removed: dùng GET /esignatures?contractId=...&status=SIGNED

    // Deprecated nested status route removed: dùng GET /esignatures?contractId=...&status=DECLINED


    // Deprecated nested status route removed: dùng GET /esignatures?contractId=...&status=VERIFIED

    // Deprecated nested required route removed: dùng GET /esignatures?contractId=...&required=true

    // Deprecated nested optional route removed: dùng GET /esignatures?contractId=...&required=false

    // Deprecated nested consented route removed: dùng GET /esignatures?contractId=...&consented=true

    // Deprecated nested unconsented route removed: dùng GET /esignatures?contractId=...&consented=false

    // Deprecated nested compliance verified route removed: dùng GET /esignatures?contractId=...&complianceVerified=true

    // Deprecated nested compliance unverified route removed: dùng GET /esignatures?contractId=...&complianceVerified=false

    // Removed deprecated signerId path. Use GET /esignatures?signerId=...

    // Removed deprecated signerEmail path. Use GET /esignatures?signerEmail=...

    // Removed deprecated signatureType path. Use GET /esignatures?type=...

    // Removed deprecated verificationMethod path. Use GET /esignatures?verificationMethod=...

    // Deprecated nested route removed: dùng GET /esignatures?contractId=...&sortBy=signatureOrder

    // Deprecated nested route removed: dùng GET /esignatures?contractId=...&sortBy=signedAt

    // Deprecated nested route removed: dùng GET /esignatures?signedFrom=...&signedTo=...

    // Deprecated nested route removed: dùng GET /esignatures?status=EXPIRED

    // Deprecated nested route removed: dùng GET /esignatures?expiresTo=...

    // Deprecated nested route removed: dùng GET /esignatures?minVerificationAttempts=...

    // Deprecated nested route removed: dùng GET /esignatures?minReminderCount=...

    @PutMapping("/{id}/sign")
    @Operation(summary = "Ký e-signature", description = "Ký e-signature")
    public ResponseEntity<RestResponse<ESignature>> signESignature(
            @PathVariable String id,
            @RequestParam String signatureData,
            @RequestParam String signatureImage,
            @RequestParam String ipAddress,
            @RequestParam String useragent,
            @RequestBody Map<String, Object> deviceInfo) {
        ESignature eSignature = eSignatureService.signESignature(id, signatureData, signatureImage, ipAddress, useragent, deviceInfo);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Ký e-signature thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/decline")
    @Operation(summary = "Từ chối e-signature", description = "Từ chối e-signature")
    public ResponseEntity<RestResponse<ESignature>> declineESignature(
            @PathVariable String id,
            @RequestParam String declineReason) {
        ESignature eSignature = eSignatureService.declineESignature(id, declineReason);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Từ chối e-signature thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/verify")
    @Operation(summary = "Xác thực e-signature", description = "Xác thực e-signature")
    public ResponseEntity<RestResponse<ESignature>> verifyESignature(@PathVariable String id) {
        ESignature eSignature = eSignatureService.verifyESignature(id);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Xác thực e-signature thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/fail-verification")
    @Operation(summary = "Xác thực e-signature thất bại", description = "Xác thực e-signature thất bại")
    public ResponseEntity<RestResponse<ESignature>> failVerificationESignature(@PathVariable String id) {
        ESignature eSignature = eSignatureService.failVerificationESignature(id);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Xác thực e-signature thất bại thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/expire")
    @Operation(summary = "Đánh dấu e-signature hết hạn", description = "Đánh dấu e-signature đã hết hạn")
    public ResponseEntity<RestResponse<ESignature>> expireESignature(@PathVariable String id) {
        ESignature eSignature = eSignatureService.expireESignature(id);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đánh dấu e-signature hết hạn thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Hủy e-signature", description = "Hủy e-signature")
    public ResponseEntity<RestResponse<ESignature>> cancelESignature(@PathVariable String id) {
        ESignature eSignature = eSignatureService.cancelESignature(id);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Hủy e-signature thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/increment-reminder")
    @Operation(summary = "Tăng reminder count", description = "Tăng số lần nhắc nhở")
    public ResponseEntity<RestResponse<ESignature>> incrementReminderCount(@PathVariable String id) {
        ESignature eSignature = eSignatureService.incrementReminderCount(id);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Tăng reminder count thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/give-consent")
    @Operation(summary = "Đồng ý e-signature", description = "Đồng ý e-signature")
    public ResponseEntity<RestResponse<ESignature>> giveLegalConsent(@PathVariable String id) {
        ESignature eSignature = eSignatureService.giveLegalConsent(id);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đồng ý e-signature thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/verify-compliance")
    @Operation(summary = "Xác thực compliance", description = "Xác thực compliance")
    public ResponseEntity<RestResponse<ESignature>> verifyCompliance(
            @PathVariable String id,
            @RequestParam String verifiedBy) {
        ESignature eSignature = eSignatureService.verifyCompliance(id, verifiedBy);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Xác thực compliance thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/signature-order")
    @Operation(summary = "Cập nhật signature order", description = "Cập nhật thứ tự ký")
    public ResponseEntity<RestResponse<ESignature>> setSignatureOrder(
            @PathVariable String id,
            @RequestParam Integer signatureOrder) {
        ESignature eSignature = eSignatureService.setSignatureOrder(id, signatureOrder);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật signature order thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/required")
    @Operation(summary = "Cập nhật isRequired", description = "Cập nhật trạng thái bắt buộc")
    public ResponseEntity<RestResponse<ESignature>> setIsRequired(
            @PathVariable String id,
            @RequestParam Boolean isRequired) {
        ESignature eSignature = eSignatureService.setIsRequired(id, isRequired);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật isRequired thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/expires-at")
    @Operation(summary = "Cập nhật expires at", description = "Cập nhật thời gian hết hạn")
    public ResponseEntity<RestResponse<ESignature>> setExpiresAt(
            @PathVariable String id,
            @RequestParam LocalDateTime expiresAt) {
        ESignature eSignature = eSignatureService.setExpiresAt(id, expiresAt);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật expires at thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/verification-method")
    @Operation(summary = "Cập nhật verification method", description = "Cập nhật phương thức xác thực")
    public ResponseEntity<RestResponse<ESignature>> setVerificationMethod(
            @PathVariable String id,
            @RequestParam ESignature.VerificationMethod verificationMethod) {
        ESignature eSignature = eSignatureService.setVerificationMethod(id, verificationMethod);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật verification method thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/verification-code")
    @Operation(summary = "Cập nhật verification code", description = "Cập nhật mã xác thực")
    public ResponseEntity<RestResponse<ESignature>> setVerificationCode(
            @PathVariable String id,
            @RequestParam String verificationCode) {
        ESignature eSignature = eSignatureService.setVerificationCode(id, verificationCode);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật verification code thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/certificate-data")
    @Operation(summary = "Cập nhật certificate data", description = "Cập nhật dữ liệu chứng chỉ")
    public ResponseEntity<RestResponse<ESignature>> setCertificateData(
            @PathVariable String id,
            @RequestParam String certificateData,
            @RequestParam String certificateIssuer,
            @RequestParam String certificateSerial,
            @RequestParam LocalDateTime validFrom,
            @RequestParam LocalDateTime validTo) {
        ESignature eSignature = eSignatureService.setCertificateData(id, certificateData, certificateIssuer, certificateSerial, validFrom, validTo);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật certificate data thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/location-info")
    @Operation(summary = "Cập nhật location info", description = "Cập nhật thông tin vị trí")
    public ResponseEntity<RestResponse<ESignature>> setLocationInfo(
            @PathVariable String id,
            @RequestBody Map<String, Object> locationInfo) {
        ESignature eSignature = eSignatureService.setLocationInfo(id, locationInfo);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật location info thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/audit-trail")
    @Operation(summary = "Cập nhật audit trail", description = "Cập nhật audit trail")
    public ResponseEntity<RestResponse<ESignature>> setAuditTrail(
            @PathVariable String id,
            @RequestParam String auditTrail) {
        ESignature eSignature = eSignatureService.setAuditTrail(id, auditTrail);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật audit trail thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa e-signature", description = "Soft delete e-signature")
    public ResponseEntity<RestResponse<Void>> deleteESignature(
            @PathVariable String id,
            @RequestParam String deletedBy) {
        eSignatureService.deleteESignature(id, deletedBy);
        
                RestResponse<Void> response = RestResponse.<Void>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Xóa e-signature thành công.")
            .data(null)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/restore")
    @Operation(summary = "Khôi phục e-signature", description = "Khôi phục e-signature đã xóa")
    public ResponseEntity<RestResponse<ESignature>> restoreESignature(@PathVariable String id) {
        ESignature eSignature = eSignatureService.restoreESignature(id);
        
        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Khôi phục e-signature thành công.")
            .data(eSignature)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/count")
    @Operation(summary = "Đếm e-signature (rút gọn)", description = "Thay thế các đường dẫn count-* bằng query aggregate=count")
    public ResponseEntity<RestResponse<Long>> countESignatures(
            @RequestParam(required = false) String contractId,
            @RequestParam(required = false) ESignature.SignatureStatus status,
            @RequestParam(required = false) String signerId) {
        long count;
        if (contractId != null && status != null) {
            count = eSignatureService.countESignaturesByContractIdAndStatus(contractId, status);
        } else if (contractId != null) {
            count = eSignatureService.countESignaturesByContractId(contractId);
        } else if (signerId != null) {
            count = eSignatureService.countESignaturesBySignerId(signerId);
        } else {
            List<ESignature> all = eSignatureService.getAllESignatures();
            count = all == null ? 0 : all.size();
        }
        RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm e-signature thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/exists")
    @Operation(summary = "Kiểm tra tồn tại e-signature (rút gọn)", description = "Thay thế các đường dẫn exists-* bằng query aggregate=exists")
    public ResponseEntity<RestResponse<Boolean>> existsESignatures(
            @RequestParam(required = false) String contractId,
            @RequestParam(required = false) ESignature.SignatureStatus status,
            @RequestParam(required = false) String signerId) {
        boolean exists = false;
        if (contractId != null && status != null) {
            exists = eSignatureService.countESignaturesByContractIdAndStatus(contractId, status) > 0;
        } else if (contractId != null) {
            exists = eSignatureService.existsESignaturesByContractId(contractId);
        } else if (signerId != null) {
            exists = eSignatureService.getESignaturesBySignerId(signerId).size() > 0;
        }
        RestResponse<Boolean> response = RestResponse.<Boolean>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Kiểm tra tồn tại e-signature thành công.")
            .data(exists)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái e-signature (rút gọn)", description = "Thay thế các URL dài sign/decline/verify/expire/cancel")
    public ResponseEntity<RestResponse<ESignature>> updateESignatureStatus(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, Object> body) {
        String status = body == null ? null : (String) body.getOrDefault("status", null);
        ESignature updated;
        if (status == null) {
            RestResponse<ESignature> bad = RestResponse.<ESignature>builder()
                .apiVersion("v1")
                .statusCode(400)
                .shortMessage("Bad Request")
                .description("Thiếu trường 'status'.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
            return new ResponseEntity<>(bad, HttpStatus.OK);
        }
        switch (status.toUpperCase()) {
            case "SIGNED" -> {
                String signatureData = (String) body.getOrDefault("signatureData", "");
                String signatureImage = (String) body.getOrDefault("signatureImage", "");
                String ipAddress = (String) body.getOrDefault("ipAddress", "");
                String useragent = (String) body.getOrDefault("useragent", "");
                @SuppressWarnings("unchecked") Map<String,Object> deviceInfo = (Map<String,Object>) body.getOrDefault("deviceInfo", java.util.Map.of());
                updated = eSignatureService.signESignature(id, signatureData, signatureImage, ipAddress, useragent, deviceInfo);
            }
            case "DECLINED" -> {
                String declineReason = (String) body.getOrDefault("declineReason", "");
                updated = eSignatureService.declineESignature(id, declineReason);
            }
            case "VERIFIED" -> updated = eSignatureService.verifyESignature(id);
            case "EXPIRED" -> updated = eSignatureService.expireESignature(id);
            case "CANCELED" -> updated = eSignatureService.cancelESignature(id);
            default -> {
                RestResponse<ESignature> bad = RestResponse.<ESignature>builder()
                    .apiVersion("v1")
                    .statusCode(400)
                    .shortMessage("Bad Request")
                    .description("Giá trị 'status' không hợp lệ.")
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(UUID.randomUUID().toString())
                    .path(request.getRequestURI())
                    .build();
                return new ResponseEntity<>(bad, HttpStatus.OK);
            }
        }

        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật trạng thái e-signature thành công.")
            .data(updated)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Cập nhật từng phần e-signature (rút gọn)", description = "Hỗ trợ: required, expiresAt, verificationMethod, verificationCode, certificateData, locationInfo, signatureOrder, incrementReminder, giveConsent, auditTrail")
    public ResponseEntity<RestResponse<ESignature>> patchESignature(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {
        ESignature updated = null;

        if (body.containsKey("required")) {
            Object v = body.get("required");
            if (v instanceof Boolean b) updated = eSignatureService.setIsRequired(id, b);
        }
        if (body.containsKey("expiresAt")) {
            Object v = body.get("expiresAt");
            if (v instanceof String s) {
                try { updated = eSignatureService.setExpiresAt(id, LocalDateTime.parse(s)); } catch (Exception ignored) {}
            }
        }
        if (body.containsKey("verificationMethod")) {
            Object v = body.get("verificationMethod");
            if (v instanceof String s) {
                try { updated = eSignatureService.setVerificationMethod(id, ESignature.VerificationMethod.valueOf(s.toUpperCase())); } catch (Exception ignored) {}
            }
        }
        if (body.containsKey("verificationCode")) {
            Object v = body.get("verificationCode");
            if (v instanceof String s) updated = eSignatureService.setVerificationCode(id, s);
        }
        if (body.containsKey("certificateData")) {
            Object v = body.get("certificateData");
            if (v instanceof String s) {
                String issuer = (String) body.getOrDefault("certificateIssuer", "");
                String serial = (String) body.getOrDefault("certificateSerial", "");
                String validFrom = (String) body.getOrDefault("validFrom", null);
                String validTo = (String) body.getOrDefault("validTo", null);
                LocalDateTime vf = validFrom == null ? null : LocalDateTime.parse(validFrom);
                LocalDateTime vt = validTo == null ? null : LocalDateTime.parse(validTo);
                updated = eSignatureService.setCertificateData(id, s, issuer, serial, vf, vt);
            }
        }
        if (body.containsKey("locationInfo")) {
            Object v = body.get("locationInfo");
            if (v instanceof Map<?,?> m) {
                @SuppressWarnings("unchecked") Map<String,Object> cast = (Map<String,Object>) m;
                updated = eSignatureService.setLocationInfo(id, cast);
            }
        }
        if (body.containsKey("signatureOrder")) {
            Object v = body.get("signatureOrder");
            if (v instanceof Number n) updated = eSignatureService.setSignatureOrder(id, n.intValue());
        }
        if (Boolean.TRUE.equals(body.get("incrementReminder"))) {
            updated = eSignatureService.incrementReminderCount(id);
        }
        if (Boolean.TRUE.equals(body.get("giveConsent"))) {
            updated = eSignatureService.giveLegalConsent(id);
        }
        if (body.containsKey("auditTrail")) {
            Object v = body.get("auditTrail");
            if (v instanceof String s) updated = eSignatureService.setAuditTrail(id, s);
        }

        if (updated == null) {
            RestResponse<ESignature> bad = RestResponse.<ESignature>builder()
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

        RestResponse<ESignature> response = RestResponse.<ESignature>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Cập nhật e-signature thành công.")
            .data(updated)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/count")
    @Operation(summary = "(Deprecated) Đếm e-signature", description = "Dùng GET /esignatures?contractId=...&aggregate=count", deprecated = true)
    public ResponseEntity<RestResponse<Long>> countESignaturesByContractId(@PathVariable String contractId) {
        long count = eSignatureService.countESignaturesByContractId(contractId);
        
                RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số e-signature thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/count-by-status")
    @Operation(summary = "(Deprecated) Đếm e-signature theo status", description = "Dùng GET /esignatures?contractId=...&status=...&aggregate=count", deprecated = true)
    public ResponseEntity<RestResponse<Long>> countESignaturesByContractIdAndStatus(
            @PathVariable String contractId,
            @RequestParam ESignature.SignatureStatus status) {
        long count = eSignatureService.countESignaturesByContractIdAndStatus(contractId, status);
        
                RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số e-signature theo status thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/esignatures/signer/{signerId}/count")
    @Operation(summary = "(Deprecated) Đếm e-signature của signer", description = "Dùng GET /esignatures?signerId=...&aggregate=count", deprecated = true)
    public ResponseEntity<RestResponse<Long>> countESignaturesBySignerId(@PathVariable String signerId) {
        long count = eSignatureService.countESignaturesBySignerId(signerId);
        
                RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số e-signature của signer thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/count-pending")
    @Operation(summary = "(Deprecated) Đếm e-signature pending", description = "Dùng GET /esignatures?contractId=...&status=PENDING&aggregate=count", deprecated = true)
    public ResponseEntity<RestResponse<Long>> countPendingSignaturesByContractId(@PathVariable String contractId) {
        long count = eSignatureService.countPendingSignaturesByContractId(contractId);
        
                RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số e-signature pending thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/count-signed")
    @Operation(summary = "Đếm số e-signature signed", description = "Đếm số lượng e-signature đã signed")
    public ResponseEntity<RestResponse<Long>> countSignedSignaturesByContractId(@PathVariable String contractId) {
        long count = eSignatureService.countSignedSignaturesByContractId(contractId);
        
                RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số e-signature signed thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/count-declined")
    @Operation(summary = "Đếm số e-signature declined", description = "Đếm số lượng e-signature đã declined")
    public ResponseEntity<RestResponse<Long>> countDeclinedSignaturesByContractId(@PathVariable String contractId) {
        long count = eSignatureService.countDeclinedSignaturesByContractId(contractId);
        
                RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số e-signature declined thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/count-expired")
    @Operation(summary = "Đếm số e-signature expired", description = "Đếm số lượng e-signature đã expired")
    public ResponseEntity<RestResponse<Long>> countExpiredSignaturesByContractId(@PathVariable String contractId) {
        long count = eSignatureService.countExpiredSignaturesByContractId(contractId);
        
                RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số e-signature expired thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/count-verified")
    @Operation(summary = "Đếm số e-signature verified", description = "Đếm số lượng e-signature đã verified")
    public ResponseEntity<RestResponse<Long>> countVerifiedSignaturesByContractId(@PathVariable String contractId) {
        long count = eSignatureService.countVerifiedSignaturesByContractId(contractId);
        
                RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số e-signature verified thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/count-required")
    @Operation(summary = "Đếm số e-signature required", description = "Đếm số lượng e-signature bắt buộc")
    public ResponseEntity<RestResponse<Long>> countRequiredSignaturesByContractId(@PathVariable String contractId) {
        long count = eSignatureService.countRequiredSignaturesByContractId(contractId);
        
                RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số e-signature required thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/count-optional")
    @Operation(summary = "Đếm số e-signature optional", description = "Đếm số lượng e-signature tùy chọn")
    public ResponseEntity<RestResponse<Long>> countOptionalSignaturesByContractId(@PathVariable String contractId) {
        long count = eSignatureService.countOptionalSignaturesByContractId(contractId);
        
                RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số e-signature optional thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/count-consented")
    @Operation(summary = "Đếm số e-signature consented", description = "Đếm số lượng e-signature đã consented")
    public ResponseEntity<RestResponse<Long>> countConsentedSignaturesByContractId(@PathVariable String contractId) {
        long count = eSignatureService.countConsentedSignaturesByContractId(contractId);
        
                RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số e-signature consented thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/count-unconsented")
    @Operation(summary = "Đếm số e-signature unconsented", description = "Đếm số lượng e-signature chưa consented")
    public ResponseEntity<RestResponse<Long>> countUnconsentedSignaturesByContractId(@PathVariable String contractId) {
        long count = eSignatureService.countUnconsentedSignaturesByContractId(contractId);
        
                RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số e-signature unconsented thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/count-compliance-verified")
    @Operation(summary = "Đếm số e-signature compliance verified", description = "Đếm số lượng e-signature đã compliance verified")
    public ResponseEntity<RestResponse<Long>> countComplianceVerifiedSignaturesByContractId(@PathVariable String contractId) {
        long count = eSignatureService.countComplianceVerifiedSignaturesByContractId(contractId);
        
                RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số e-signature compliance verified thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/count-compliance-unverified")
    @Operation(summary = "Đếm số e-signature compliance unverified", description = "Đếm số lượng e-signature chưa compliance verified")
    public ResponseEntity<RestResponse<Long>> countComplianceUnverifiedSignaturesByContractId(@PathVariable String contractId) {
        long count = eSignatureService.countComplianceUnverifiedSignaturesByContractId(contractId);
        
                RestResponse<Long> response = RestResponse.<Long>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Đếm số e-signature compliance unverified thành công.")
            .data(count)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/exists")
    @Operation(summary = "Kiểm tra có e-signature", description = "Kiểm tra contract có e-signature không")
    public ResponseEntity<RestResponse<Boolean>> existsESignaturesByContractId(@PathVariable String contractId) {
        boolean exists = eSignatureService.existsESignaturesByContractId(contractId);
        
                RestResponse<Boolean> response = RestResponse.<Boolean>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Kiểm tra có e-signature thành công.")
            .data(exists)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/exists-pending")
    @Operation(summary = "Kiểm tra có e-signature pending", description = "Kiểm tra contract có e-signature pending không")
    public ResponseEntity<RestResponse<Boolean>> existsPendingSignaturesByContractId(@PathVariable String contractId) {
        boolean exists = eSignatureService.existsPendingSignaturesByContractId(contractId);
        
                RestResponse<Boolean> response = RestResponse.<Boolean>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Kiểm tra có e-signature pending thành công.")
            .data(exists)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/exists-signed")
    @Operation(summary = "Kiểm tra có e-signature signed", description = "Kiểm tra contract có e-signature signed không")
    public ResponseEntity<RestResponse<Boolean>> existsSignedSignaturesByContractId(@PathVariable String contractId) {
        boolean exists = eSignatureService.existsSignedSignaturesByContractId(contractId);
        
                RestResponse<Boolean> response = RestResponse.<Boolean>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Kiểm tra có e-signature signed thành công.")
            .data(exists)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/exists-declined")
    @Operation(summary = "Kiểm tra có e-signature declined", description = "Kiểm tra contract có e-signature declined không")
    public ResponseEntity<RestResponse<Boolean>> existsDeclinedSignaturesByContractId(@PathVariable String contractId) {
        boolean exists = eSignatureService.existsDeclinedSignaturesByContractId(contractId);
        
                RestResponse<Boolean> response = RestResponse.<Boolean>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Kiểm tra có e-signature declined thành công.")
            .data(exists)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/exists-expired")
    @Operation(summary = "Kiểm tra có e-signature expired", description = "Kiểm tra contract có e-signature expired không")
    public ResponseEntity<RestResponse<Boolean>> existsExpiredSignaturesByContractId(@PathVariable String contractId) {
        boolean exists = eSignatureService.existsExpiredSignaturesByContractId(contractId);
        
                RestResponse<Boolean> response = RestResponse.<Boolean>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Kiểm tra có e-signature expired thành công.")
            .data(exists)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/exists-verified")
    @Operation(summary = "Kiểm tra có e-signature verified", description = "Kiểm tra contract có e-signature verified không")
    public ResponseEntity<RestResponse<Boolean>> existsVerifiedSignaturesByContractId(@PathVariable String contractId) {
        boolean exists = eSignatureService.existsVerifiedSignaturesByContractId(contractId);
        
                RestResponse<Boolean> response = RestResponse.<Boolean>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Kiểm tra có e-signature verified thành công.")
            .data(exists)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/exists-required")
    @Operation(summary = "Kiểm tra có e-signature required", description = "Kiểm tra contract có e-signature required không")
    public ResponseEntity<RestResponse<Boolean>> existsRequiredSignaturesByContractId(@PathVariable String contractId) {
        boolean exists = eSignatureService.existsRequiredSignaturesByContractId(contractId);
        
                RestResponse<Boolean> response = RestResponse.<Boolean>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Kiểm tra có e-signature required thành công.")
            .data(exists)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/exists-optional")
    @Operation(summary = "Kiểm tra có e-signature optional", description = "Kiểm tra contract có e-signature optional không")
    public ResponseEntity<RestResponse<Boolean>> existsOptionalSignaturesByContractId(@PathVariable String contractId) {
        boolean exists = eSignatureService.existsOptionalSignaturesByContractId(contractId);
        
                RestResponse<Boolean> response = RestResponse.<Boolean>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Kiểm tra có e-signature optional thành công.")
            .data(exists)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/exists-consented")
    @Operation(summary = "Kiểm tra có e-signature consented", description = "Kiểm tra contract có e-signature consented không")
    public ResponseEntity<RestResponse<Boolean>> existsConsentedSignaturesByContractId(@PathVariable String contractId) {
        boolean exists = eSignatureService.existsConsentedSignaturesByContractId(contractId);
        
                RestResponse<Boolean> response = RestResponse.<Boolean>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Kiểm tra có e-signature consented thành công.")
            .data(exists)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/exists-unconsented")
    @Operation(summary = "Kiểm tra có e-signature unconsented", description = "Kiểm tra contract có e-signature unconsented không")
    public ResponseEntity<RestResponse<Boolean>> existsUnconsentedSignaturesByContractId(@PathVariable String contractId) {
        boolean exists = eSignatureService.existsUnconsentedSignaturesByContractId(contractId);
        
                RestResponse<Boolean> response = RestResponse.<Boolean>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Kiểm tra có e-signature unconsented thành công.")
            .data(exists)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/exists-compliance-verified")
    @Operation(summary = "Kiểm tra có e-signature compliance verified", description = "Kiểm tra contract có e-signature compliance verified không")
    public ResponseEntity<RestResponse<Boolean>> existsComplianceVerifiedSignaturesByContractId(@PathVariable String contractId) {
        boolean exists = eSignatureService.existsComplianceVerifiedSignaturesByContractId(contractId);
        
                RestResponse<Boolean> response = RestResponse.<Boolean>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Kiểm tra có e-signature compliance verified thành công.")
            .data(exists)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/contracts/{contractId}/esignatures/exists-compliance-unverified")
    @Operation(summary = "Kiểm tra có e-signature compliance unverified", description = "Kiểm tra contract có e-signature compliance unverified không")
    public ResponseEntity<RestResponse<Boolean>> existsComplianceUnverifiedSignaturesByContractId(@PathVariable String contractId) {
        boolean exists = eSignatureService.existsComplianceUnverifiedSignaturesByContractId(contractId);
        
                RestResponse<Boolean> response = RestResponse.<Boolean>builder()
            .apiVersion("v1")
            .statusCode(200)
            .shortMessage("Success")
            .description("Kiểm tra có e-signature compliance unverified thành công.")
            .data(exists)
            .timestamp(ZonedDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .path(request.getRequestURI())
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}