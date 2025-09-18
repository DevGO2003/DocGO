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
public class ContractRiskAssessmentResponseDto {
    private String riskLevel;
    private List<String> riskFactors;
    private List<String> mitigationMeasures;
}




