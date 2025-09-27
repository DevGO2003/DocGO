package com.devgo2003.docgo.document_service.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractReminderDto {
    private String type;
    private String date;
    private String content;
}




