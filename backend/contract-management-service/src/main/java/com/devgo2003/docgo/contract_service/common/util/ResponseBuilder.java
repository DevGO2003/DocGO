package com.devgo2003.docgo.contract_service.common.util;

import com.devgo2003.docgo.contract_service.common.response.RestResponse;
import com.devgo2003.docgo.contract_service.common.response.ValidationErrorResponse;
import com.devgo2003.docgo.contract_service.common.response.ErrorDetail;
import com.devgo2003.docgo.contract_service.common.response.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public class ResponseBuilder {

    private static final String API_VERSION = "v1";

    public static <T> ResponseEntity<RestResponse<T>> success(T data, String shortMessage, String description) {
        RestResponse<T> response = RestResponse.<T>builder()
                .apiVersion(API_VERSION)
                .statusCode(200)
                .shortMessage(shortMessage)
                .description(description)
                .data(data)
                .timestamp(ZonedDateTime.now())
                .requestId(generateRequestId())
                .path(getCurrentPath())
                .build();
        return ResponseEntity.ok(response);
    }

    public static <T> ResponseEntity<RestResponse<T>> success(T data) {
        return success(data, "Success", "Yêu cầu đã được xử lý thành công.");
    }

    public static <T> ResponseEntity<RestResponse<T>> success(T data, String description) {
        return success(data, "Success", description);
    }

    public static RestResponse<ErrorResponse> validationError(List<ErrorDetail> errors, String shortMessage, String description) {
        ErrorResponse errorData = ErrorResponse.builder()
                .errors(errors)
                .build();

        return RestResponse.<ErrorResponse>builder()
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

    public static RestResponse<ErrorResponse> validationError(List<ErrorDetail> errors) {
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

    public static <T> ResponseEntity<RestResponse<T>> noContent(String description) {
        RestResponse<T> response = RestResponse.<T>builder()
                .apiVersion(API_VERSION)
                .statusCode(204)
                .shortMessage("No Content")
                .description(description)
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(generateRequestId())
                .path(getCurrentPath())
                .build();
        return ResponseEntity.ok(response);
    }

    public static <T> ResponseEntity<RestResponse<T>> notFound(String description) {
        RestResponse<T> response = RestResponse.<T>builder()
                .apiVersion(API_VERSION)
                .statusCode(404)
                .shortMessage("Not Found")
                .description(description)
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(generateRequestId())
                .path(getCurrentPath())
                .build();
        return ResponseEntity.ok(response);
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
