package com.devgo2003.docgo.document_service.controller;

import com.devgo2003.docgo.document_service.common.response.RestResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@Tag(name = "Health", description = "Health check endpoints")
public class HealthController {

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Kiểm tra tình trạng service")
    public ResponseEntity<RestResponse<Map<String, Object>>> health() {
        String requestId = UUID.randomUUID().toString();
        return ResponseEntity.ok(RestResponse.<Map<String, Object>>builder()
                .apiVersion("v1")
                .statusCode(200)
                .shortMessage("Success")
                .description("Service đang hoạt động bình thường")
                .data(Map.of(
                    "status", "healthy",
                    "service", "Document Management Service",
                    "version", "1.0.0",
                    "timestamp", ZonedDateTime.now().toString()
                ))
                .timestamp(ZonedDateTime.now())
                .requestId(requestId)
                .path("/health")
                .build());
    }
}
