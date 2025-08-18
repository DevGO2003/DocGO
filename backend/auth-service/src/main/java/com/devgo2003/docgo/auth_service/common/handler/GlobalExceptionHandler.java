package com.devgo2003.docgo.auth_service.common.handler;

import com.devgo2003.docgo.auth_service.common.response.ErrorDetail;
import com.devgo2003.docgo.auth_service.common.response.RestResponse;
import com.devgo2003.docgo.auth_service.common.response.ValidationErrorResponse;
import com.devgo2003.docgo.auth_service.common.util.ResponseBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

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
        RestResponse<Object> response = ResponseBuilder.error(
                500, 
                "Internal Server Error", 
                "Đã xảy ra lỗi hệ thống: " + ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    private ErrorDetail mapToErrorDetail(FieldError fieldError) {
        return ErrorDetail.builder()
                .field(fieldError.getField())
                .rejectedValue(fieldError.getRejectedValue() != null ? fieldError.getRejectedValue().toString() : null)
                .message(fieldError.getDefaultMessage())
                .build();
    }
}
