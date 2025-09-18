package com.devgo2003.docgo.contract_service.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractPartyDto {
    private String id;
    private String contractId;
    private String partyName;
    private String partyRole;
    private String representative;
    private String taxCode;
    private String contact;
    private String address;
    private String businessLicense;
    private String partyType;
    private Boolean isPrimary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
