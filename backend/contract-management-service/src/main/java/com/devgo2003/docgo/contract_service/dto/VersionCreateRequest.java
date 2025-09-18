package com.devgo2003.docgo.contract_service.dto;

import com.devgo2003.docgo.contract_service.entity.Version;
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
public class VersionCreateRequest {
    
    @NotBlank(message = "Contract ID không được để trống")
    private String contractId;
    
    @NotBlank(message = "Số phiên bản không được để trống")
    private String versionNumber;
    
    @NotBlank(message = "Tên phiên bản không được để trống")
    private String versionName;
    
    @NotBlank(message = "Mô tả thay đổi không được để trống")
    private String changeDescription;
    
    @NotNull(message = "Loại thay đổi không được để trống")
    private Version.ChangeType changeType;
    
    @NotBlank(message = "Người tạo không được để trống")
    private String createdBy;
    
    private String changeSummary;
    
    private String changeDetails;
    
    private String previousVersionId;
    
    private String changeReason;
    
    private String changeImpact;
    
    private String changeApproval;
    
    private String changeReviewer;
    
    private LocalDateTime changeDate;
    
    private String additionalData;
}
