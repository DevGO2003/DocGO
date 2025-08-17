package com.devgo2003.docgo.auth_service.controller;

import com.devgo2003.docgo.auth_service.common.response.RestResponse;
import com.devgo2003.docgo.auth_service.model.AuthRequest;
import com.devgo2003.docgo.auth_service.model.AuthResponse;
import com.devgo2003.docgo.auth_service.model.LoginRequest;
import com.devgo2003.docgo.auth_service.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth-service/auth")
@Tag(name = "API Xác thực và Ủy quyền", description = "Các API để đăng ký, đăng nhập và quản lý xác thực người dùng")
public class AuthController {

    private final AuthService authService;
    private final HttpServletRequest request;

    @Autowired
    public AuthController(AuthService authService, HttpServletRequest request) {
        this.authService = authService;
        this.request = request;
    }

    @Operation(summary = "Tạo tài khoản mới", description = "Tạo tài khoản người dùng mới với thông tin cơ bản")
    @PostMapping("/register")
    public ResponseEntity<RestResponse<AuthResponse>> createUser(@Valid @RequestBody AuthRequest authRequest) {
        AuthResponse created = authService.register(authRequest.getUsername(), authRequest.getEmail(), authRequest.getPassword());
        RestResponse<AuthResponse> response = RestResponse.<AuthResponse>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.CREATED.value())
                .shortMessage("Success")
                .description("Tài khoản đã được tạo thành công.")
                .data(created)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Lấy thông tin đăng nhập", description = "Xác thực thông tin đăng nhập và trả về token")
    @GetMapping("/login")
    public ResponseEntity<RestResponse<AuthResponse>> getUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest.getUsername(), loginRequest.getPassword());
        RestResponse<AuthResponse> response = RestResponse.<AuthResponse>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Thông tin đăng nhập đã được xác thực thành công.")
                .data(authResponse)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Cập nhật thông tin tài khoản", description = "Cập nhật thông tin tài khoản người dùng")
    @PutMapping("/{id}")
    public ResponseEntity<RestResponse<AuthResponse>> updateUser(@PathVariable Long id, @Valid @RequestBody AuthRequest authRequest) {
        // TODO: Implement update user logic
        AuthResponse updatedUser = new AuthResponse(); // Placeholder
        RestResponse<AuthResponse> response = RestResponse.<AuthResponse>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Thông tin tài khoản đã được cập nhật thành công.")
                .data(updatedUser)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Xóa mềm tài khoản", description = "Thay đổi trạng thái tài khoản thành INACTIVE thay vì xóa vật lý")
    @DeleteMapping("/{id}")
    public ResponseEntity<RestResponse<Void>> softDeleteUser(@PathVariable Long id) {
        // TODO: Implement soft delete user logic
        RestResponse<Void> response = RestResponse.<Void>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Tài khoản đã được xóa mềm thành công.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Khôi phục tài khoản", description = "Khôi phục tài khoản đã bị xóa")
    @PutMapping("/{id}/restore")
    public ResponseEntity<RestResponse<Void>> restoreUser(@PathVariable Long id) {
        // TODO: Implement restore user logic
        RestResponse<Void> response = RestResponse.<Void>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Tài khoản đã được khôi phục thành công.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Làm mới token", description = "Tạo token mới khi token cũ hết hạn")
    @PostMapping("/{id}/refresh")
    public ResponseEntity<RestResponse<AuthResponse>> refreshToken(@PathVariable Long id, @RequestHeader("Authorization") String refreshToken) {
        // TODO: Implement refresh token logic
        AuthResponse authResponse = new AuthResponse(); // Placeholder
        RestResponse<AuthResponse> response = RestResponse.<AuthResponse>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Token đã được làm mới thành công.")
                .data(authResponse)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Đăng xuất", description = "Vô hiệu hóa token hiện tại")
    @PostMapping("/{id}/logout")
    public ResponseEntity<RestResponse<Void>> logout(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        // TODO: Implement logout logic
        RestResponse<Void> response = RestResponse.<Void>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Đăng xuất thành công.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Xác thực token", description = "Kiểm tra tính hợp lệ của token")
    @GetMapping("/{id}/validate")
    public ResponseEntity<RestResponse<Object>> validateToken(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        // TODO: Implement token validation logic
        RestResponse<Object> response = RestResponse.<Object>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Token hợp lệ.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Kiểm tra trạng thái dịch vụ", description = "Kiểm tra xem dịch vụ xác thực có đang hoạt động không")
    @GetMapping("/health")
    public ResponseEntity<RestResponse<String>> health() {
        RestResponse<String> response = RestResponse.<String>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Dịch vụ xác thực đang hoạt động bình thường.")
                .data("Auth Service is running!")
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
