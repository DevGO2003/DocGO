package com.devgo2003.docgo.auth_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "RegisterRequest", description = "Yêu cầu đăng ký tài khoản")
public class RegisterRequest {
    @NotBlank
    @Schema(description = "Tên đăng nhập", example = "luan")
    private String username;

    @NotBlank
    @Email
    @Schema(description = "Email", example = "luan@example.com")
    private String email;

    @NotBlank
    @Schema(description = "Mật khẩu", example = "123123")
    private String password;
}


