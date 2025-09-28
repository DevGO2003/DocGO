package com.devgo2003.docgo.auth_service.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestInfo {
    private int page;
    private int size;
    private String searchTerm;
    private List<String> sortBy;
    private List<String> sortDirection;
}
