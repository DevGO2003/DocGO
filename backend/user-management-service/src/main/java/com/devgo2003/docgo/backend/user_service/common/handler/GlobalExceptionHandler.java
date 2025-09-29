package com.devgo2003.docgo.backend.user_service.common.handler;

import com.devgo2003.docgo.backend.user_service.common.response.ErrorDetail;
import com.devgo2003.docgo.backend.user_service.common.response.RestResponse;
import com.devgo2003.docgo.backend.user_service.common.response.ValidationErrorResponse;
import com.devgo2003.docgo.backend.user_service.common.util.ResponseBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RestResponse<ValidationErrorResponse>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<ErrorDetail> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(this::mapToErrorDetail)
                .collect(Collectors.toList());

        RestResponse<ValidationErrorResponse> response = ResponseBuilder.validationError(errors);
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<RestResponse<Object>> handleGenericException(Exception ex) {
        // Sanitize error message to prevent information leakage
        String sanitizedMessage = sanitizeErrorMessage(ex.getMessage());
        
        // Log full error details for debugging (with limited stacktrace)
        log.error("Unexpected error occurred: {} - Request: {}", 
                 sanitizedMessage, ex);
        
        RestResponse<Object> response = ResponseBuilder.error(
                500, 
                "Internal Server Error", 
                "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
    
    /**
     * Sanitize error message to prevent sensitive information leakage
     */
    private String sanitizeErrorMessage(String message) {
        if (message == null) {
            return "Unknown error";
        }
        
        // Remove sensitive patterns
        String sanitized = message
                .replaceAll("(?i)password[=:][^\\s,]+", "password=***")
                .replaceAll("(?i)token[=:][^\\s,]+", "token=***")
                .replaceAll("(?i)key[=:][^\\s,]+", "key=***")
                .replaceAll("(?i)secret[=:][^\\s,]+", "secret=***")
                .replaceAll("mongodb://[^@]+@", "mongodb://***:***@")
                .replaceAll("mongodb\\+srv://[^@]+@", "mongodb+srv://***:***@");
        
        // Limit message length
        if (sanitized.length() > 200) {
            sanitized = sanitized.substring(0, 200) + "...";
        }
        
        return sanitized;
    }

    private ErrorDetail mapToErrorDetail(FieldError fieldError) {
        return ErrorDetail.builder()
                .field(fieldError.getField())
                .rejectedValue(fieldError.getRejectedValue() != null ? fieldError.getRejectedValue().toString() : null)
                .message(fieldError.getDefaultMessage())
                .build();
    }
}
