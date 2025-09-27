package com.devgo2003.docgo.document_service.dto;

import com.devgo2003.docgo.document_service.entity.AuditLog;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogCreateRequest {
    
    @NotBlank(message = "Event type không được để trống")
    private String eventType;
    
    @NotNull(message = "Event category không được để trống")
    private AuditLog.EventCategory eventCategory;
    
    @NotBlank(message = "Action không được để trống")
    private String action;
    
    @NotBlank(message = "Description không được để trống")
    private String description;
    
    @NotBlank(message = "User ID không được để trống")
    private String userId;
    
    @NotBlank(message = "User name không được để trống")
    private String userName;
    
    private String contractId;
    
    private String ipAddress;
    
    private String userAgent;
    
    private String additionalData;
}
