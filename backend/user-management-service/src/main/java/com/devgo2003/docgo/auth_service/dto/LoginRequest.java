package com.devgo2003.docgo.auth_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "LoginRequest", description = "Yêu cầu đăng nhập với username và password")
public class LoginRequest {
    @NotBlank
    @Schema(description = "Tên đăng nhập", example = "luan")
    private String username;

    @NotBlank
    @Schema(description = "Mật khẩu", example = "123123")
    private String password;
}


