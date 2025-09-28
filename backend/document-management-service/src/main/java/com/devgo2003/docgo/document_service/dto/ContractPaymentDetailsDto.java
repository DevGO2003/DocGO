package com.devgo2003.docgo.document_service.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractPaymentDetailsDto {
    private String totalValue;
    private String schedule;
    private String currency;
    private String paymentMethod;
}




