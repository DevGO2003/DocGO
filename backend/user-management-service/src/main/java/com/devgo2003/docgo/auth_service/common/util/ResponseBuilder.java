package com.devgo2003.docgo.auth_service.common.util;

import com.devgo2003.docgo.auth_service.common.response.RestResponse;
import com.devgo2003.docgo.auth_service.common.response.ValidationErrorResponse;
import com.devgo2003.docgo.auth_service.common.response.ErrorDetail;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public class ResponseBuilder {

    private static final String API_VERSION = "v1";

    public static <T> RestResponse<T> success(T data, String shortMessage, String description) {
        return RestResponse.<T>builder()
                .apiVersion(API_VERSION)
                .statusCode(200)
                .shortMessage(shortMessage)
                .description(description)
                .data(data)
                .timestamp(ZonedDateTime.now())
                .requestId(generateRequestId())
                .path(getCurrentPath())
                .build();
    }

    public static <T> RestResponse<T> success(T data) {
        return success(data, "Success", "Yêu cầu đã được xử lý thành công.");
    }

    public static RestResponse<ValidationErrorResponse> validationError(List<ErrorDetail> errors, String shortMessage, String description) {
        ValidationErrorResponse errorData = ValidationErrorResponse.builder()
                .errors(errors)
                .build();

        return RestResponse.<ValidationErrorResponse>builder()
                .apiVersion(API_VERSION)
                .statusCode(400)
                .shortMessage(shortMessage)
                .description(description)
                .data(errorData)
                .timestamp(ZonedDateTime.now())
                .requestId(generateRequestId())
                .path(getCurrentPath())
                .build();
    }

    public static RestResponse<ValidationErrorResponse> validationError(List<ErrorDetail> errors) {
        return validationError(errors, "Validation failed", "Dữ liệu gửi lên không hợp lệ.");
    }

    public static <T> RestResponse<T> error(int statusCode, String shortMessage, String description, T data) {
        return RestResponse.<T>builder()
                .apiVersion(API_VERSION)
                .statusCode(statusCode)
                .shortMessage(shortMessage)
                .description(description)
                .data(data)
                .timestamp(ZonedDateTime.now())
                .requestId(generateRequestId())
                .path(getCurrentPath())
                .build();
    }

    public static <T> RestResponse<T> error(int statusCode, String shortMessage, String description) {
        return error(statusCode, shortMessage, description, null);
    }

    private static String generateRequestId() {
        return UUID.randomUUID().toString();
    }

    private static String getCurrentPath() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                return request.getRequestURI();
            }
        } catch (Exception e) {
            // Fallback if request context is not available
        }
        return "/api";
    }
}
