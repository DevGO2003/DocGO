package com.devgo2003.docgo.document_service.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RestResponse<T> {
    private String apiVersion;
    private int statusCode;
    private String shortMessage;
    private String description;
    private T data;
    private ZonedDateTime timestamp;
    private String requestId;
    private String path;
    
    public static <T> RestResponse<T> success(T data) {
        return RestResponse.<T>builder()
                .apiVersion("v1")
                .statusCode(200)
                .shortMessage("Success")
                .description("Operation completed successfully")
                .data(data)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .build();
    }
    
    public static <T> RestResponse<T> success(T data, String description) {
        return RestResponse.<T>builder()
                .apiVersion("v1")
                .statusCode(200)
                .shortMessage("Success")
                .description(description)
                .data(data)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .build();
    }
}
