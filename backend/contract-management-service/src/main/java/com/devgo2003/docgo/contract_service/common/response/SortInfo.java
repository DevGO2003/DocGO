package com.devgo2003.docgo.contract_service.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SortInfo {
    private String by;
    private String direction;
}
