package com.devgo2003.docgo.contract_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ContractStatusChangeEvent {
    private String contractId;
    private String oldStatus;
    private String newStatus;
    private String changedBy;
    private String changedAt;
    private String reason;
    private String correlationId;
}
