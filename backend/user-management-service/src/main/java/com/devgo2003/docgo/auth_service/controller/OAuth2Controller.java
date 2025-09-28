package com.devgo2003.docgo.auth_service.controller;

import com.devgo2003.docgo.auth_service.common.response.RestResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/authentication-identity-service/auth/oauth2")
@RequiredArgsConstructor
@Tag(name = "OAuth2", description = "API liên quan đến OAuth2 (Google)")
public class OAuth2Controller {

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri:}")
    private String googleRedirectUri;

    @Value("${GOOGLE_PROJECT_ID:}")
    private String googleProjectId;

    @Operation(summary = "Test OAuth2 endpoint", description = "Kiểm tra xem OAuth2 có hoạt động không")
    @GetMapping("/test")
    public ResponseEntity<RestResponse<Map<String, Object>>> testOAuth2() {
        String requestId = UUID.randomUUID().toString();
        log.info("[{}] OAuth2 test endpoint called", requestId);

        Map<String, Object> data = new HashMap<>();
        data.put("google_oauth_available", googleClientId != null && !googleClientId.trim().isEmpty());
        data.put("google_client_id", googleClientId);
        data.put("google_redirect_uri", googleRedirectUri);
        data.put("note", "OAuth2 authorization endpoints are handled by Spring Security");

        return ResponseEntity.ok(RestResponse.<Map<String, Object>>builder()
                .apiVersion("v1")
                .statusCode(200)
                .shortMessage("Success")
                .description("OAuth2 test endpoint hoạt động bình thường")
                .data(data)
                .timestamp(ZonedDateTime.now())
                .requestId(requestId)
                .path("/api/v1/authentication-identity-service/auth/oauth2/test")
                .build());
    }

    @Operation(summary = "OAuth2 Configuration", description = "Lấy thông tin cấu hình OAuth2")
    @GetMapping("/config")
    public ResponseEntity<RestResponse<Map<String, Object>>> getOAuth2Config() {
        String requestId = UUID.randomUUID().toString();
        log.info("[{}] OAuth2 config endpoint called", requestId);

        Map<String, Object> config = new HashMap<>();
        config.put("google_client_id", googleClientId);
        config.put("google_redirect_uri", googleRedirectUri);
        config.put("google_project_id", googleProjectId);
        config.put("note", "OAuth2 authorization endpoints are handled by Spring Security");
        config.put("endpoints", Map.of(
            "authorization", "/oauth2/authorization/google (handled by Spring Security)",
            "callback", "/login/oauth2/code/google (handled by Spring Security)",
            "test", "/api/v1/authentication-identity-service/auth/oauth2/test",
            "config", "/api/v1/authentication-identity-service/auth/oauth2/config"
        ));

        return ResponseEntity.ok(RestResponse.<Map<String, Object>>builder()
                .apiVersion("v1")
                .statusCode(200)
                .shortMessage("Success")
                .description("Thông tin cấu hình OAuth2")
                .data(config)
                .timestamp(ZonedDateTime.now())
                .requestId(requestId)
                .path("/api/v1/authentication-identity-service/auth/oauth2/config")
                .build());
    }
}