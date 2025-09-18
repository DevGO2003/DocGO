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
public class ContractComplianceStatusResponseDto {
    private String status;
    private List<String> issues;
    private List<String> recommendations;
}




