package com.devgo2003.docgo.document_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagDto {
    private String name;
    private String displayName;
    private Long count;
    private Boolean isPopular;
}
