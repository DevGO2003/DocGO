package com.devgo2003.docgo.contract_service.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ContractValidationResult {
    private boolean valid;
    private List<String> errors;
    private List<String> warnings;
    private String summary;
    
    public static ContractValidationResult success() {
        return ContractValidationResult.builder()
                .valid(true)
                .summary("Validation successful")
                .build();
    }
    
    public static ContractValidationResult failure(List<String> errors) {
        return ContractValidationResult.builder()
                .valid(false)
                .errors(errors)
                .summary("Validation failed with " + errors.size() + " error(s)")
                .build();
    }
    
    public static ContractValidationResult failure(List<String> errors, List<String> warnings) {
        return ContractValidationResult.builder()
                .valid(false)
                .errors(errors)
                .warnings(warnings)
                .summary("Validation failed with " + errors.size() + " error(s) and " + warnings.size() + " warning(s)")
                .build();
    }
}
