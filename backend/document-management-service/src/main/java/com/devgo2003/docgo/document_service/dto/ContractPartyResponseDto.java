package com.devgo2003.docgo.document_service.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractPartyResponseDto {
    private String role;
    private String name;
    private String representative;
    private String taxCode;
    private String contact;
    private String address;
    private String businessLicense;
}




