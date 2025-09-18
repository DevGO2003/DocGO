package com.devgo2003.docgo.auth_service.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@Tag(name = "Root", description = "Root endpoint và redirect")
public class RootController {

    @Operation(
        summary = "Root endpoint", 
        description = """
        🔹 Đầu vào
        
        Không có tham số đầu vào
        
        🔹 Đầu ra
        
        🔄 Redirect
        Loại: HTTP Redirect (302)
        Mô tả: Tự động chuyển hướng sang /docs để hiển thị API documentation
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (302: Found - Redirect)
        
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
    @GetMapping("/")
    public void redirectToDocs(HttpServletResponse response) throws IOException {
        response.sendRedirect("/docs");
    }
}
