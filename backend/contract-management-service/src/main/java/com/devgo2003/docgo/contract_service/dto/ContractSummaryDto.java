package com.devgo2003.docgo.contract_service.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractSummaryDto {
    private String id;
    private String contractId;
    private String fileId;
    private String filename;
    private String summary;
    private Integer summaryLength;
    private List<String> keyPoints;
    private String extractionMethod;
    private BigDecimal confidence;
    private String classification;
    private BigDecimal classificationConfidence;
    private List<String> categories;
    private LocalDateTime processedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
