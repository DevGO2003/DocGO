package com.devgo2003.docgo.contract_service.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractDetailDto {
    // Basic contract fields
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
    
    // New fields from updated schema
    private String contractObject;
    private String effectiveDate;
    private String contractTerm;
    private String totalValue;
    private String paymentSchedule;
    private String currency;
    private String terminationConditions;
    private String riskAssessment;
    private String complianceStatus;
    private Boolean legalReviewRequired;
    private LocalDateTime reviewDeadline;
    
    // Related data
    private List<ContractSummaryDto> summaries;
    private List<ContractPartyDto> parties;
    private List<ContractClauseDto> clauses;
    private List<ContractPaymentDto> payments;
}
