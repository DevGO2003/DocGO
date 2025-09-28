package com.devgo2003.docgo.auth_service.controller;

import com.devgo2003.docgo.auth_service.common.response.RestResponse;
import com.devgo2003.docgo.auth_service.model.AuthResponse;
import com.devgo2003.docgo.auth_service.service.AuthService;
import com.devgo2003.docgo.auth_service.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.devgo2003.docgo.auth_service.dto.LoginRequest;
import com.devgo2003.docgo.auth_service.dto.RegisterRequest;

import java.time.ZonedDateTime;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/authentication-identity-service/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "API xác thực: đăng nhập, đăng xuất, refresh token")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập", description = "Đăng nhập bằng username và password, trả về accessToken và refreshToken")
    public ResponseEntity<RestResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        String requestId = UUID.randomUUID().toString();
        String username = request.getUsername();
        String password = request.getPassword();

        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(RestResponse.<AuthResponse>builder()
                    .apiVersion("v1")
                    .statusCode(400)
                    .shortMessage("Bad Request")
                    .description("Thiếu username hoặc password")
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/authentication-identity-service/auth/login")
                    .build());
        }

        AuthResponse result = authService.login(username, password);
        if (result.isSuccess()) {
            return ResponseEntity.ok(RestResponse.<AuthResponse>builder()
                    .apiVersion("v1")
                    .statusCode(200)
                    .shortMessage("Success")
                    .description("Đăng nhập thành công")
                    .data(result)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/authentication-identity-service/auth/login")
                    .build());
        }

        return ResponseEntity.status(401).body(RestResponse.<AuthResponse>builder()
                .apiVersion("v1")
                .statusCode(401)
                .shortMessage("Unauthorized")
                .description(result.getMessage())
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(requestId)
                .path("/api/v1/authentication-identity-service/auth/login")
                .build());
    }

    @PostMapping("/register")
    @Operation(summary = "Đăng ký", description = "Tạo tài khoản mới")
    public ResponseEntity<RestResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        String requestId = UUID.randomUUID().toString();
        String username = request.getUsername();
        String email = request.getEmail();
        String password = request.getPassword();

        if (username.isBlank() || email.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body(RestResponse.<AuthResponse>builder()
                    .apiVersion("v1")
                    .statusCode(400)
                    .shortMessage("Bad Request")
                    .description("Thiếu username, email hoặc password")
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/authentication-identity-service/auth/register")
                    .build());
        }

        AuthResponse result = authService.register(username, email, password);
        int http = result.isSuccess() ? 201 : 409;
        return ResponseEntity.status(http).body(RestResponse.<AuthResponse>builder()
                .apiVersion("v1")
                .statusCode(result.isSuccess() ? 201 : 409)
                .shortMessage(result.isSuccess() ? "Created" : "Conflict")
                .description(result.getMessage())
                .data(result.isSuccess() ? result : null)
                .timestamp(ZonedDateTime.now())
                .requestId(requestId)
                .path("/api/v1/authentication-identity-service/auth/register")
                .build());
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Tạo access token mới từ refresh token")
    public ResponseEntity<RestResponse<AuthResponse>> refresh(@RequestBody Map<String, String> body) {
        String requestId = UUID.randomUUID().toString();
        String refreshToken = body.getOrDefault("refreshToken", "");
        if (refreshToken.isBlank()) {
            return ResponseEntity.badRequest().body(RestResponse.<AuthResponse>builder()
                    .apiVersion("v1")
                    .statusCode(400)
                    .shortMessage("Bad Request")
                    .description("Thiếu refreshToken")
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/authentication-identity-service/auth/refresh")
                    .build());
        }

        AuthResponse result = authService.refreshToken(refreshToken);
        if (result.isSuccess()) {
            return ResponseEntity.ok(RestResponse.<AuthResponse>builder()
                    .apiVersion("v1")
                    .statusCode(200)
                    .shortMessage("Success")
                    .description(result.getMessage())
                    .data(result)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/authentication-identity-service/auth/refresh")
                    .build());
        }

        return ResponseEntity.status(401).body(RestResponse.<AuthResponse>builder()
                .apiVersion("v1")
                .statusCode(401)
                .shortMessage("Unauthorized")
                .description(result.getMessage())
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(requestId)
                .path("/api/v1/authentication-identity-service/auth/refresh")
                .build());
    }

    @PostMapping("/logout")
    @Operation(summary = "Đăng xuất", description = "Đăng xuất và vô hiệu hoá token hiện tại")
    public ResponseEntity<RestResponse<Void>> logout(@RequestHeader(name = "Authorization", required = false) String authorization) {
        String requestId = UUID.randomUUID().toString();
        String token = (authorization != null && authorization.startsWith("Bearer ")) ? authorization.substring(7) : null;
        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body(RestResponse.<Void>builder()
                    .apiVersion("v1")
                    .statusCode(400)
                    .shortMessage("Bad Request")
                    .description("Thiếu Authorization Bearer token")
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/authentication-identity-service/auth/logout")
                    .build());
        }

        boolean ok = authService.logout(token);
        return ResponseEntity.ok(RestResponse.<Void>builder()
                .apiVersion("v1")
                .statusCode(200)
                .shortMessage("Success")
                .description(ok ? "Đăng xuất thành công" : "Đăng xuất thất bại")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(requestId)
                .path("/api/v1/authentication-identity-service/auth/logout")
                .build());
    }

    @GetMapping("/me")
    @Operation(summary = "Thông tin người dùng hiện tại", description = "Lấy thông tin user từ access token hiện tại")
    public ResponseEntity<RestResponse<AuthResponse>> me(@RequestHeader(name = "Authorization", required = false) String authorization) {
        String requestId = UUID.randomUUID().toString();
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(RestResponse.<AuthResponse>builder()
                    .apiVersion("v1")
                    .statusCode(401)
                    .shortMessage("Unauthorized")
                    .description("Thiếu Authorization Bearer token")
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/authentication-identity-service/auth/me")
                    .build());
        }

        String token = authorization.substring(7);
        try {
            var claims = jwtUtil.parseClaims(token);
            String username = claims.getSubject();
            return authService.getUserByUsername(username)
                    .map(user -> {
                        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                                user.getId(),
                                user.getUsername(),
                                user.getEmail(),
                                user.getFirstName(),
                                user.getLastName(),
                                user.getRoleIds(),
                                user.getStatus()
                        );
                        Long expSeconds = null;
                        try {
                            Object exp = claims.get("exp");
                            if (exp instanceof Number) {
                                expSeconds = ((Number) exp).longValue() - (System.currentTimeMillis() / 1000);
                                if (expSeconds < 0) expSeconds = 0L;
                            }
                        } catch (Exception ignored) {}

                        AuthResponse data = new AuthResponse(true, "Lấy thông tin người dùng thành công", token, null, userInfo, expSeconds != null ? expSeconds : 900L, "Bearer");
                        return ResponseEntity.ok(RestResponse.<AuthResponse>builder()
                                .apiVersion("v1")
                                .statusCode(200)
                                .shortMessage("Success")
                                .description("Thông tin người dùng hiện tại")
                                .data(data)
                                .timestamp(ZonedDateTime.now())
                                .requestId(requestId)
                                .path("/api/v1/authentication-identity-service/auth/me")
                                .build());
                    })
                    .orElseGet(() -> ResponseEntity.status(404).body(RestResponse.<AuthResponse>builder()
                            .apiVersion("v1")
                            .statusCode(404)
                            .shortMessage("Not Found")
                            .description("Không tìm thấy người dùng")
                            .data(null)
                            .timestamp(ZonedDateTime.now())
                            .requestId(requestId)
                            .path("/api/v1/authentication-identity-service/auth/me")
                            .build()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(RestResponse.<AuthResponse>builder()
                    .apiVersion("v1")
                    .statusCode(401)
                    .shortMessage("Unauthorized")
                    .description("Token không hợp lệ")
                    .data(null)
                    .timestamp(ZonedDateTime.now())
                    .requestId(requestId)
                    .path("/api/v1/authentication-identity-service/auth/me")
                    .build());
        }
    }

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Kiểm tra tình trạng service")
    public ResponseEntity<RestResponse<Map<String, String>>> health() {
        String requestId = UUID.randomUUID().toString();
        return ResponseEntity.ok(RestResponse.<Map<String, String>>builder()
                .apiVersion("v1")
                .statusCode(200)
                .shortMessage("Success")
                .description("Service is healthy")
                .data(Map.of("status", "UP"))
                .timestamp(ZonedDateTime.now())
                .requestId(requestId)
                .path("/api/v1/authentication-identity-service/auth/health")
                .build());
    }
}



