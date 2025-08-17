package com.devgo2003.docgo.contractmanagement.common.handler;

import com.devgo2003.docgo.contractmanagement.common.response.ErrorDetail;
import com.devgo2003.docgo.contractmanagement.common.response.ErrorResponse;
import com.devgo2003.docgo.contractmanagement.common.response.RestResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.devgo2003.docgo.contractmanagement.common.exception.ConflictException;
import com.devgo2003.docgo.contractmanagement.common.exception.InvalidInputException;
import com.devgo2003.docgo.contractmanagement.common.exception.NoContentException;
import com.devgo2003.docgo.contractmanagement.common.exception.ResourceNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(NoContentException.class)
        public ResponseEntity<RestResponse<Void>> handleNoContentException(NoContentException ex,
                        HttpServletRequest request) {
                RestResponse<Void> response = RestResponse.<Void>builder()
                                .apiVersion("v1")
                                .statusCode(HttpStatus.NO_CONTENT.value())
                                .shortMessage("No Content")
                                .description(ex.getMessage())
                                .data(null) // 204 không có data
                                .timestamp(ZonedDateTime.now())
                                .requestId(UUID.randomUUID().toString())
                                .path(request.getRequestURI())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<RestResponse<ErrorResponse>> handleValidationExceptions(
                        MethodArgumentNotValidException ex, HttpServletRequest request) {
                List<ErrorDetail> errors = ex.getBindingResult().getFieldErrors().stream()
                                .map(error -> ErrorDetail.builder()
                                                .field(error.getField())
                                                .rejectedValue(error.getRejectedValue())
                                                .message(error.getDefaultMessage())
                                                .build())
                                .collect(Collectors.toList());

                String description = "Hệ thống phát hiện dữ liệu nhập chưa hợp lệ. Cụ thể: " +
                                errors.stream()
                                                .map(e -> String.format(
                                                                "trường '%s' được cung cấp có giá trị '%s', nhưng thông báo lỗi là '%s'",
                                                                e.getField(), e.getRejectedValue(), e.getMessage()))
                                                .collect(Collectors.joining(". "))
                                + ".";

                RestResponse<ErrorResponse> response = RestResponse.<ErrorResponse>builder()
                                .apiVersion("v1")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .shortMessage("Validation failed")
                                .description(description)
                                .data(ErrorResponse.builder().errors(errors).build())
                                .timestamp(ZonedDateTime.now())
                                .requestId(UUID.randomUUID().toString())
                                .path(request.getRequestURI())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<RestResponse<Void>> handleResourceNotFoundException(ResourceNotFoundException ex,
                        HttpServletRequest request) {
                RestResponse<Void> response = RestResponse.<Void>builder()
                                .apiVersion("v1")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .shortMessage("Not Found")
                                .description(ex.getMessage())
                                .data(null)
                                .timestamp(ZonedDateTime.now())
                                .requestId(UUID.randomUUID().toString())
                                .path(request.getRequestURI())
                                .build();
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(InvalidInputException.class)
        public ResponseEntity<RestResponse<Void>> handleInvalidInputException(InvalidInputException ex,
                        HttpServletRequest request) {
                RestResponse<Void> response = RestResponse.<Void>builder()
                                .apiVersion("v1")
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .shortMessage("Bad Request")
                                .description(ex.getMessage())
                                .data(null)
                                .timestamp(ZonedDateTime.now())
                                .requestId(UUID.randomUUID().toString())
                                .path(request.getRequestURI())
                                .build();
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(ConflictException.class)
        public ResponseEntity<RestResponse<Void>> handleConflictException(ConflictException ex,
                        HttpServletRequest request) {
                RestResponse<Void> response = RestResponse.<Void>builder()
                                .apiVersion("v1")
                                .statusCode(HttpStatus.CONFLICT.value())
                                .shortMessage("Conflict")
                                .description(ex.getMessage())
                                .data(null)
                                .timestamp(ZonedDateTime.now())
                                .requestId(UUID.randomUUID().toString())
                                .path(request.getRequestURI())
                                .build();
                return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<RestResponse<Void>> handleAllExceptions(Exception ex, HttpServletRequest request) {
                RestResponse<Void> response = RestResponse.<Void>builder()
                                .apiVersion("v1")
                                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                .shortMessage("Internal Server Error")
                                .description("An unexpected error occurred: " + ex.getMessage())
                                .data(null)
                                .timestamp(ZonedDateTime.now())
                                .requestId(UUID.randomUUID().toString())
                                .path(request.getRequestURI())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
}
