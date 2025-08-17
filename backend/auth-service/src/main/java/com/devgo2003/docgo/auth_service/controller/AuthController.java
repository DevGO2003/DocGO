package com.devgo2003.docgo.auth_service.controller;

import com.devgo2003.docgo.auth_service.common.response.RestResponse;
import com.devgo2003.docgo.auth_service.common.util.ResponseBuilder;
import com.devgo2003.docgo.auth_service.model.AuthRequest;
import com.devgo2003.docgo.auth_service.model.AuthResponse;
import com.devgo2003.docgo.auth_service.model.LoginRequest;
import com.devgo2003.docgo.auth_service.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/health")
    public ResponseEntity<RestResponse<String>> health() {
        RestResponse<String> response = ResponseBuilder.success("Auth Service is running!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<RestResponse<AuthResponse>> register(@Valid @RequestBody AuthRequest request) {
        AuthResponse authResponse = authService.register(request.getUsername(), request.getEmail(), request.getPassword());
        RestResponse<AuthResponse> response = ResponseBuilder.success(authResponse, "Registration successful", "Tài khoản đã được đăng ký thành công.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<RestResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request.getUsername(), request.getPassword());
        RestResponse<AuthResponse> response = ResponseBuilder.success(authResponse, "Login successful", "Đăng nhập thành công.");
        return ResponseEntity.ok(response);
    }
}
