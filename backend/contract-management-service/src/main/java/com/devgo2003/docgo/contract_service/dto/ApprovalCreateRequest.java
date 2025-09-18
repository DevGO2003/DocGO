package com.devgo2003.docgo.contract_service.dto;

import com.devgo2003.docgo.contract_service.entity.Approval;
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
public class ApprovalCreateRequest {
    
    @NotBlank(message = "Contract ID không được để trống")
    private String contractId;
    
    @NotBlank(message = "Approver ID không được để trống")
    private String approverId;
    
    @NotBlank(message = "Tên người phê duyệt không được để trống")
    private String approverName;
    
    @NotBlank(message = "Email người phê duyệt không được để trống")
    private String approverEmail;
    
    @NotBlank(message = "Vai trò người phê duyệt không được để trống")
    private String approverRole;
    
    @NotNull(message = "Mức độ ưu tiên không được để trống")
    private Approval.ApprovalPriority priority;
    
    private LocalDateTime dueDate;
    
    private Integer approvalOrder;
    
    private Boolean isRequired = true;
    
    private String comments;
}
