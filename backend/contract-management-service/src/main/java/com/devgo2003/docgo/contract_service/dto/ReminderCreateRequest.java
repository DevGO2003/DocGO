package com.devgo2003.docgo.contract_service.dto;

import com.devgo2003.docgo.contract_service.entity.Reminder;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderCreateRequest {
    
    @NotBlank(message = "Contract ID không được để trống")
    private String contractId;
    
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;
    
    @NotBlank(message = "Mô tả không được để trống")
    private String description;
    
    @NotNull(message = "Loại nhắc nhở không được để trống")
    private Reminder.ReminderType reminderType;
    
    @NotNull(message = "Ngày nhắc nhở không được để trống")
    private LocalDateTime reminderDate;
    
    private Boolean isRecurring = false;
    
    private String recurringPattern;
    
    private String recipientEmail;
    
    private String recipientPhone;
    
    private String notificationMethod;
    
    private String priority;
    
    private String additionalData;
}
