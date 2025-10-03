package com.devgo2003.docgo.backend.user_service.controller;

import com.devgo2003.docgo.backend.user_service.common.response.RestResponse;
import com.devgo2003.docgo.backend.user_service.model.AuthResponse;
import com.devgo2003.docgo.backend.user_service.service.AuthService;
import com.devgo2003.docgo.backend.user_service.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.devgo2003.docgo.backend.user_service.dto.LoginRequest;
import com.devgo2003.docgo.backend.user_service.dto.RegisterRequest;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/user-management-service/v1/auth")
@RequiredArgsConstructor
@Tag(name = "🔐 APIs Xác thực người dùng", description = "APIs xác thực: đăng nhập, đăng xuất, refresh token, OAuth2 Google")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri:}")
    private String googleRedirectUri;

    @Value("${GOOGLE_PROJECT_ID:}")
    private String googleProjectId;

    @PostMapping("/login")
    @Operation(
        summary = "Đăng nhập",
        description = """
        ## 📖 Mô tả
        API đăng nhập người dùng vào hệ thống bằng username và password.
        Trả về accessToken và refreshToken để xác thực các request tiếp theo.
        
        ## 🔹 Đầu vào
        
        📝 **request** (bắt buộc, body)
        - **Loại**: LoginRequest
        - **Mô tả**: Thông tin đăng nhập của người dùng
        - **Bao gồm**: username, password
        - **Ví dụ**: {"username": "john_doe", "password": "123456"}
        
        ## 🔹 Đầu ra
        
        📄 **data** (AuthResponse)
        - **Mô tả**: Thông tin xác thực và người dùng
        - **Bao gồm**: accessToken, refreshToken, userInfo, expiresIn
        - **Ví dụ**: {"accessToken": "eyJ...", "refreshToken": "eyJ...", "userInfo": {...}}
        
        📊 **apiVersion** (string)
        - **Mô tả**: Phiên bản API hiện tại
        - **Giá trị**: "v1"
        
        🔢 **statusCode** (integer)
        - **Mô tả**: Mã trạng thái xử lý
        - **Các giá trị**: 200 (thành công), 400 (thông tin đăng nhập sai), 500 (lỗi server)
        
        📋 **shortMessage** (string)
        - **Mô tả**: Thông báo ngắn gọn về kết quả
        - **Ví dụ**: "Success", "Bad Request", "Internal Server Error"
        
        📖 **description** (string)
        - **Mô tả**: Mô tả chi tiết về kết quả xử lý
        - **Ví dụ**: "Đăng nhập thành công"
        
        🕒 **timestamp** (string, ISO-8601)
        - **Mô tả**: Thời gian xử lý yêu cầu
        - **Ví dụ**: "2024-01-15T10:30:00Z"
        
        🆔 **requestId** (string, UUID)
        - **Mô tả**: Định danh duy nhất của yêu cầu để theo dõi
        - **Ví dụ**: "123e4567-e89b-12d3-a456-426614174000"
        
        🛣️ **path** (string)
        - **Mô tả**: Đường dẫn API được gọi
        - **Ví dụ**: "/api/v1/user-management-service/v1/auth/login"
        """
    )
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
                    .path("/api/v1/user-management-service/v1/auth/login")
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
                    .path("/api/v1/user-management-service/v1/auth/login")
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
                .path("/api/v1/user-management-service/v1/auth/login")
                .build());
    }

    @PostMapping("/register")
    @Operation(
        summary = "Đăng ký",
        description = """
        ## 📖 Mô tả
        API đăng ký tài khoản người dùng mới trong hệ thống.
        Tạo tài khoản với thông tin cơ bản và trả về thông tin xác thực.
        
        ## 🔹 Đầu vào
        
        📝 **request** (bắt buộc, body)
        - **Loại**: RegisterRequest
        - **Mô tả**: Thông tin đăng ký tài khoản mới
        - **Bao gồm**: username, email, password, fullName, phone
        - **Ví dụ**: {"username": "john_doe", "email": "john@example.com", "password": "123456"}
        
        ## 🔹 Đầu ra
        
        📄 **data** (AuthResponse)
        - **Mô tả**: Thông tin xác thực và người dùng đã tạo
        - **Bao gồm**: accessToken, refreshToken, userInfo, expiresIn
        - **Ví dụ**: {"accessToken": "eyJ...", "refreshToken": "eyJ...", "userInfo": {...}}
        
        📊 **apiVersion** (string)
        - **Mô tả**: Phiên bản API hiện tại
        - **Giá trị**: "v1"
        
        🔢 **statusCode** (integer)
        - **Mô tả**: Mã trạng thái xử lý
        - **Các giá trị**: 201 (tạo thành công), 400 (dữ liệu không hợp lệ), 409 (tài khoản đã tồn tại)
        
        📋 **shortMessage** (string)
        - **Mô tả**: Thông báo ngắn gọn về kết quả
        - **Ví dụ**: "Success", "Bad Request", "Conflict"
        
        📖 **description** (string)
        - **Mô tả**: Mô tả chi tiết về kết quả xử lý
        - **Ví dụ**: "Đăng ký tài khoản thành công"
        
        🕒 **timestamp** (string, ISO-8601)
        - **Mô tả**: Thời gian xử lý yêu cầu
        - **Ví dụ**: "2024-01-15T10:30:00Z"
        
        🆔 **requestId** (string, UUID)
        - **Mô tả**: Định danh duy nhất của yêu cầu để theo dõi
        - **Ví dụ**: "123e4567-e89b-12d3-a456-426614174000"
        
        🛣️ **path** (string)
        - **Mô tả**: Đường dẫn API được gọi
        - **Ví dụ**: "/api/v1/user-management-service/v1/auth/register"
        """
    )
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
                    .path("/api/v1/user-management-service/v1/auth/register")
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
                .path("/api/v1/user-management-service/v1/auth/register")
                .build());
    }

    @PostMapping("/refresh")
    @Operation(
        summary = "Refresh token",
        description = """
        ## 📖 Mô tả
        API tạo access token mới từ refresh token hiện có.
        Sử dụng khi access token hết hạn để tiếp tục xác thực.
        
        ## 🔹 Đầu vào
        
        📝 **body** (bắt buộc, body)
        - **Loại**: Map<String, String>
        - **Mô tả**: Chứa refresh token để tạo access token mới
        - **Bao gồm**: refreshToken
        - **Ví dụ**: {"refreshToken": "eyJ..."}
        
        ## 🔹 Đầu ra
        
        📄 **data** (AuthResponse)
        - **Mô tả**: Thông tin xác thực mới
        - **Bao gồm**: accessToken, refreshToken, userInfo, expiresIn
        - **Ví dụ**: {"accessToken": "eyJ...", "refreshToken": "eyJ...", "userInfo": {...}}
        
        📊 **apiVersion** (string)
        - **Mô tả**: Phiên bản API hiện tại
        - **Giá trị**: "v1"
        
        🔢 **statusCode** (integer)
        - **Mô tả**: Mã trạng thái xử lý
        - **Các giá trị**: 200 (thành công), 400 (refresh token không hợp lệ), 401 (refresh token hết hạn)
        
        📋 **shortMessage** (string)
        - **Mô tả**: Thông báo ngắn gọn về kết quả
        - **Ví dụ**: "Success", "Bad Request", "Unauthorized"
        
        📖 **description** (string)
        - **Mô tả**: Mô tả chi tiết về kết quả xử lý
        - **Ví dụ**: "Tạo access token mới thành công"
        
        🕒 **timestamp** (string, ISO-8601)
        - **Mô tả**: Thời gian xử lý yêu cầu
        - **Ví dụ**: "2024-01-15T10:30:00Z"
        
        🆔 **requestId** (string, UUID)
        - **Mô tả**: Định danh duy nhất của yêu cầu để theo dõi
        - **Ví dụ**: "123e4567-e89b-12d3-a456-426614174000"
        
        🛣️ **path** (string)
        - **Mô tả**: Đường dẫn API được gọi
        - **Ví dụ**: "/api/v1/user-management-service/v1/auth/refresh"
        """
    )
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
                    .path("/api/v1/user-management-service/v1/auth/refresh")
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
                    .path("/api/v1/user-management-service/v1/auth/refresh")
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
                .path("/api/v1/user-management-service/v1/auth/refresh")
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
                    .path("/api/v1/user-management-service/v1/auth/logout")
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
                .path("/api/v1/user-management-service/v1/auth/logout")
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
                    .path("/api/v1/user-management-service/v1/auth/me")
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
                                .path("/api/v1/user-management-service/v1/auth/me")
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
                            .path("/api/v1/user-management-service/v1/auth/me")
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
                    .path("/api/v1/user-management-service/v1/auth/me")
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
                .path("/api/v1/user-management-service/v1/auth/health")
                .build());
    }

    @GetMapping("/test-auth")
    @Operation(summary = "Test authentication", description = "Test endpoint để kiểm tra JWT authentication")
    public ResponseEntity<RestResponse<Map<String, Object>>> testAuth(@RequestHeader(name = "Authorization", required = false) String authorization) {
        String requestId = UUID.randomUUID().toString();
        log.info("[AuthController] Test auth endpoint called with Authorization: {}", authorization);
        
        Map<String, Object> data = new HashMap<>();
        data.put("hasAuthHeader", authorization != null);
        data.put("authHeader", authorization);
        data.put("timestamp", ZonedDateTime.now().toString());
        
        return ResponseEntity.ok(RestResponse.<Map<String, Object>>builder()
                .apiVersion("v1")
                .statusCode(200)
                .shortMessage("Success")
                .description("Test authentication endpoint")
                .data(data)
                .timestamp(ZonedDateTime.now())
                .requestId(requestId)
                .path("/api/v1/user-management-service/v1/auth/test-auth")
                .build());
    }

    // ==================== OAuth2 Endpoints ====================

    @GetMapping("/oauth2/get-config")
    @Operation(
        summary = "Lấy cấu hình OAuth2", 
        description = """
        🔹 Đầu vào
        
        📄 Không có tham số đầu vào
        
        🔹 Đầu ra
        
        📝 data
        Loại: Map<String, Object>
        Mô tả: Thông tin cấu hình OAuth2 và trạng thái hoạt động
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (200: OK)
        
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
    public ResponseEntity<RestResponse<Map<String, Object>>> getOAuth2Config() {
        String requestId = UUID.randomUUID().toString();
        log.info("[{}] OAuth2 get-config endpoint called", requestId);

        Map<String, Object> config = new HashMap<>();
        
        // Thông tin cấu hình OAuth2 (với null check)
        config.put("google_client_id", googleClientId != null ? googleClientId : "");
        config.put("google_redirect_uri", googleRedirectUri != null ? googleRedirectUri : "");
        config.put("google_project_id", googleProjectId != null ? googleProjectId : "");
        
        // Trạng thái hoạt động (gộp từ test endpoint)
        config.put("google_oauth_available", googleClientId != null && !googleClientId.trim().isEmpty());
        
        // Thông tin endpoints
        config.put("endpoints", Map.of(
            "authorization", "/oauth2/authorization/google (handled by Spring Security)",
            "callback", "/login/oauth2/code/google (handled by Spring Security)",
            "config", "/api/v1/user-management-service/v1/oauth2/get-config"
        ));
        
        config.put("note", "OAuth2 authorization endpoints are handled by Spring Security");

        return ResponseEntity.ok(RestResponse.<Map<String, Object>>builder()
                .apiVersion("v1")
                .statusCode(200)
                .shortMessage("Success")
                .description("Thông tin cấu hình OAuth2 và trạng thái hoạt động")
                .data(config)
                .timestamp(ZonedDateTime.now())
                .requestId(requestId)
                .path("/api/v1/user-management-service/v1/oauth2/get-config")
                .build());
    }
}



