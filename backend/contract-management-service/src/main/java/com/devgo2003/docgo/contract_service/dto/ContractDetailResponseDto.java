package com.devgo2003.docgo.contract_service.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.ArrayList;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractDetailResponseDto {
    private String id;
    private String contractNumber;
    private String title;
    private String status;
    private String contractType;
    private String riskLevel;
    
    // Key terms as list of objects
    private List<ContractClauseDto> keyTerms;
    
    // Favorable and unfavorable clauses
    private List<ContractClauseDto> favorableClauses;
    private List<ContractClauseDto> unfavorableClauses;
    
    // Contract details
    private String contractObject;
    private String effectiveDate;
    private String contractTerm;
    
    // Payment information
    private ContractPaymentDto payment;
    
    // Termination conditions
    private String terminationConditions;
    
    // Risk assessment
    private ContractRiskAssessmentDto riskAssessment;
    
    // Compliance status
    private ContractComplianceDto complianceStatus;
    
    // Parties
    private List<ContractPartyDto> parties;
    
    // Static factory method to create from Contract entity
    public static ContractDetailResponseDto fromContract(
            com.devgo2003.docgo.contract_service.entity.Contract contract,
            List<com.devgo2003.docgo.contract_service.entity.ContractParty> parties) {
        
        List<ContractPartyDto> partyDtos = parties.stream()
                .map(party -> ContractPartyDto.builder()
                        .id(party.getId())
                        .contractId(party.getContractId())
                        .partyName(party.getPartyName())
                        .partyRole(party.getPartyType())
                        .representative(party.getContactPerson())
                        .taxCode(party.getTaxCode())
                        .contact(party.getPhone())
                        .address(party.getAddress())
                        .createdAt(party.getCreatedAt())
                        .updatedAt(party.getUpdatedAt())
                        .build())
                .collect(java.util.stream.Collectors.toList());
        
        return ContractDetailResponseDto.builder()
                .id(contract.getId())
                .contractNumber(contract.getContractNumber())
                .title(contract.getTitle())
                .status(contract.getStatus().name())
                .contractType(contract.getContractType())
                .riskLevel(contract.getRiskLevel())
                .keyTerms(new ArrayList<>())
                .favorableClauses(new ArrayList<>())
                .unfavorableClauses(new ArrayList<>())
                .contractObject(contract.getContractObject())
                .effectiveDate(contract.getEffectiveDate())
                .contractTerm(contract.getContractTerm())
                .payment(null)
                .terminationConditions(contract.getTerminationConditions())
                .riskAssessment(parseRiskAssessment(contract.getRiskAssessment()))
                .complianceStatus(parseComplianceStatus(contract.getComplianceStatus()))
                .parties(partyDtos)
                .build();
    }
    
    private static List<ContractClauseDto> convertToClauseDtos(List<?> clauses) {
        if (clauses == null) return null;
        return clauses.stream()
                .map(clause -> {
                    if (clause instanceof ContractKeyTermDto) {
                        ContractKeyTermDto dto = (ContractKeyTermDto) clause;
                        return ContractClauseDto.builder()
                                .name(dto.getName())
                                .description(dto.getDescription())
                                .source(dto.getSource())
                                .build();
                    } else if (clause instanceof ContractFavorableClauseDto) {
                        ContractFavorableClauseDto dto = (ContractFavorableClauseDto) clause;
                        return ContractClauseDto.builder()
                                .name(dto.getClauseName())
                                .description(dto.getDescription())
                                .source(dto.getBenefitTo())
                                .build();
                    } else if (clause instanceof ContractUnfavorableClauseDto) {
                        ContractUnfavorableClauseDto dto = (ContractUnfavorableClauseDto) clause;
                        return ContractClauseDto.builder()
                                .name(dto.getClauseName())
                                .description(dto.getDescription())
                                .source(dto.getRiskTo())
                                .build();
                    }
                    return null;
                })
                .filter(clause -> clause != null)
                .toList();
    }
    
    private static ContractRiskAssessmentDto parseRiskAssessment(String riskAssessmentJson) {
        // TODO: Implement JSON parsing for risk assessment
        // For now, return a default structure
        return ContractRiskAssessmentDto.builder()
                .riskLevel("MEDIUM")
                .riskFactors(List.of("Default risk factor"))
                .mitigationMeasures(List.of("Default mitigation"))
                .build();
    }
    
    private static ContractComplianceDto parseComplianceStatus(String complianceJson) {
        // TODO: Implement JSON parsing for compliance status
        // For now, return a default structure
        return ContractComplianceDto.builder()
                .status("COMPLIANT")
                .issues(List.of())
                .recommendations(List.of())
                .build();
    }
}
