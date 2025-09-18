package com.devgo2003.docgo.contract_service.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractResponseDto {
    private String id;
    private String contractNumber;
    private String status;
    private String contractType;
    private String title;
    private List<String> tags;
    private List<ContractPartyResponseDto> parties;
    private String object;
    private String effectiveDate;
    private String term;
    private ContractPaymentDetailsDto paymentDetails;
    private List<ContractKeyClauseDto> keyClauses;
    private List<ContractFavorableClauseDto> favorableClauses;
    private List<ContractUnfavorableClauseDto> unfavorableClauses;
    private List<ContractReminderDto> reminders;
    private String terminationConditions;
    private ContractRiskAssessmentResponseDto riskAssessment;
    private ContractComplianceStatusResponseDto complianceStatus;
}


