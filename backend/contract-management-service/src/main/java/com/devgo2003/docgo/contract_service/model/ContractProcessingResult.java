package com.devgo2003.docgo.contract_service.model;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class ContractProcessingResult {
    
    private String requestId;
    
    private Long fileId;
    
    private Boolean success;
    
    private String summary;
    
    private String contractType;
    
    private String riskLevel;
    
    private String keyTerms;
    
    private String extractedText;
    
    private String errorMessage;
    
    private LocalDateTime processingTime;
    
    private String serviceType;
}
