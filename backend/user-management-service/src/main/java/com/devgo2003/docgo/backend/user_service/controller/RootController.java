package com.devgo2003.docgo.backend.user_service.controller;

import com.devgo2003.docgo.backend.user_service.common.response.RestResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@Tag(name = "🏠 APIs Gốc", description = "APIs gốc của service - health check, info, redirect")
public class RootController {

    @GetMapping("/")
    @Operation(
        summary = "Chuyển hướng",
        description = """
        ## 📖 Mô tả
        API chuyển hướng từ root path sang Swagger UI documentation.
        Tự động redirect người dùng đến trang tài liệu API.
        
        ## 🔹 Đầu vào
        
        Không có tham số đầu vào
        
        ## 🔹 Đầu ra
        
        🔄 **Redirect** (HTTP 302)
        - **Mô tả**: Tự động chuyển hướng sang /docs
        - **Location**: "/docs"
        - **Ví dụ**: HTTP 302 Found với Location header
        
        📊 **apiVersion** (string)
        - **Mô tả**: Phiên bản API hiện tại
        - **Giá trị**: "v1"
        
        🔢 **statusCode** (integer)
        - **Mô tả**: Mã trạng thái HTTP
        - **Giá trị**: 302 (Found - Redirect)
        
        📋 **shortMessage** (string)
        - **Mô tả**: Thông báo ngắn gọn về kết quả
        - **Ví dụ**: "Found"
        
        📖 **description** (string)
        - **Mô tả**: Mô tả chi tiết về kết quả xử lý
        - **Ví dụ**: "Chuyển hướng đến tài liệu API"
        
        🕒 **timestamp** (string, ISO-8601)
        - **Mô tả**: Thời gian xử lý yêu cầu
        - **Ví dụ**: "2024-01-15T10:30:00Z"
        
        🆔 **requestId** (string, UUID)
        - **Mô tả**: Định danh duy nhất của yêu cầu để theo dõi
        - **Ví dụ**: "123e4567-e89b-12d3-a456-426614174000"
        
        🛣️ **path** (string)
        - **Mô tả**: Đường dẫn API được gọi
        - **Ví dụ**: "/"
        """
    )
    public void redirectToDocs(HttpServletResponse response) throws IOException {
        response.sendRedirect("/docs");
    }

    @GetMapping({"/health", "/api/v1/user-management-service/v1/health"})
    @Operation(
        summary = "Health check",
        description = """
        ## 📖 Mô tả
        API kiểm tra trạng thái sức khỏe của service.
        Trả về thông tin về trạng thái hoạt động và thời gian uptime.
        
        ## 🔹 Đầu vào
        
        Không có tham số đầu vào
        
        ## 🔹 Đầu ra
        
        📄 **data** (Map<String, Object>)
        - **Mô tả**: Thông tin trạng thái service
        - **Bao gồm**: status, uptime, version, timestamp
        - **Ví dụ**: {"status": "UP", "uptime": "2h 30m", "version": "1.0.0"}
        
        📊 **apiVersion** (string)
        - **Mô tả**: Phiên bản API hiện tại
        - **Giá trị**: "v1"
        
        🔢 **statusCode** (integer)
        - **Mô tả**: Mã trạng thái xử lý
        - **Giá trị**: 200 (thành công)
        
        📋 **shortMessage** (string)
        - **Mô tả**: Thông báo ngắn gọn về kết quả
        - **Ví dụ**: "Success"
        
        📖 **description** (string)
        - **Mô tả**: Mô tả chi tiết về kết quả xử lý
        - **Ví dụ**: "Service đang hoạt động bình thường"
        
        🕒 **timestamp** (string, ISO-8601)
        - **Mô tả**: Thời gian xử lý yêu cầu
        - **Ví dụ**: "2024-01-15T10:30:00Z"
        
        🆔 **requestId** (string, UUID)
        - **Mô tả**: Định danh duy nhất của yêu cầu để theo dõi
        - **Ví dụ**: "123e4567-e89b-12d3-a456-426614174000"
        
        🛣️ **path** (string)
        - **Mô tả**: Đường dẫn API được gọi
        - **Ví dụ**: "/health"
        """
    )
    public ResponseEntity<RestResponse<Map<String, Object>>> healthCheck() {
        String requestId = UUID.randomUUID().toString();
        
        Map<String, Object> healthData = new HashMap<>();
        healthData.put("status", "UP");
        healthData.put("uptime", "2h 30m");
        healthData.put("version", "1.0.0");
        healthData.put("timestamp", ZonedDateTime.now().toString());
        
        return ResponseEntity.ok(RestResponse.<Map<String, Object>>builder()
                .apiVersion("v1")
                .statusCode(200)
                .shortMessage("Success")
                .description("Service đang hoạt động bình thường")
                .data(healthData)
                .timestamp(ZonedDateTime.now())
                .requestId(requestId)
                .path("/api/v1/user-management-service/v1/health")
                .build());
    }

    @GetMapping("/info")
    @Operation(
        summary = "Thông tin service",
        description = """
        ## 📖 Mô tả
        API lấy thông tin chi tiết về service bao gồm tên, phiên bản, mô tả và các thông tin khác.
        
        ## 🔹 Đầu vào
        
        Không có tham số đầu vào
        
        ## 🔹 Đầu ra
        
        📄 **data** (Map<String, Object>)
        - **Mô tả**: Thông tin chi tiết về service
        - **Bao gồm**: name, version, description, environment, buildTime
        - **Ví dụ**: {"name": "User Management Service", "version": "1.0.0", "description": "API quản lý người dùng"}
        
        📊 **apiVersion** (string)
        - **Mô tả**: Phiên bản API hiện tại
        - **Giá trị**: "v1"
        
        🔢 **statusCode** (integer)
        - **Mô tả**: Mã trạng thái xử lý
        - **Giá trị**: 200 (thành công)
        
        📋 **shortMessage** (string)
        - **Mô tả**: Thông báo ngắn gọn về kết quả
        - **Ví dụ**: "Success"
        
        📖 **description** (string)
        - **Mô tả**: Mô tả chi tiết về kết quả xử lý
        - **Ví dụ**: "Lấy thông tin service thành công"
        
        🕒 **timestamp** (string, ISO-8601)
        - **Mô tả**: Thời gian xử lý yêu cầu
        - **Ví dụ**: "2024-01-15T10:30:00Z"
        
        🆔 **requestId** (string, UUID)
        - **Mô tả**: Định danh duy nhất của yêu cầu để theo dõi
        - **Ví dụ**: "123e4567-e89b-12d3-a456-426614174000"
        
        🛣️ **path** (string)
        - **Mô tả**: Đường dẫn API được gọi
        - **Ví dụ**: "/info"
        """
    )
    public ResponseEntity<RestResponse<Map<String, Object>>> getServiceInfo() {
        String requestId = UUID.randomUUID().toString();
        
        Map<String, Object> serviceInfo = new HashMap<>();
        serviceInfo.put("name", "User Management Service");
        serviceInfo.put("version", "1.0.0");
        serviceInfo.put("description", "API quản lý người dùng trong hệ thống DocGO");
        serviceInfo.put("environment", "development");
        serviceInfo.put("buildTime", "2024-01-15T10:00:00Z");
        serviceInfo.put("javaVersion", System.getProperty("java.version"));
        serviceInfo.put("springVersion", "3.5.4");
        
        return ResponseEntity.ok(RestResponse.<Map<String, Object>>builder()
                .apiVersion("v1")
                .statusCode(200)
                .shortMessage("Success")
                .description("Lấy thông tin service thành công")
                .data(serviceInfo)
                .timestamp(ZonedDateTime.now())
                .requestId(requestId)
                .path("/info")
                .build());
    }
}
