package com.devgo2003.docgo.document_service.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractUnfavorableClauseDto {
    private String clauseName;
    private String description;
    private String riskTo;
}
