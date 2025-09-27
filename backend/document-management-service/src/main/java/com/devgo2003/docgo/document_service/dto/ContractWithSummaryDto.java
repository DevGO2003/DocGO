package com.devgo2003.docgo.document_service.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractWithSummaryDto {
    // Contract fields
    private String id;
    private String contractNumber;
    private String title;
    private String status;
    private String partiesJson;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String systemId;
    private String summary;
    private String contractType;
    private String riskLevel;
    private String keyTerms;
    private Boolean aiProcessed;
    private String processingStatus;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime deletedAt;
    private String deletedBy;
    private Boolean isDeleted;
    private Long version;
    
    // Contract Summary fields
    private List<ContractSummaryDto> summaries;
}
