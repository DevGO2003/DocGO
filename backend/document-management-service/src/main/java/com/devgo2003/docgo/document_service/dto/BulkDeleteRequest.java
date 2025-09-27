package com.devgo2003.docgo.document_service.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * DTO cho bulk delete request
 */
public class BulkDeleteRequest {
    
    @NotEmpty(message = "Danh sách ID không được để trống")
    @Size(max = 100, message = "Không thể xóa quá 100 hợp đồng cùng lúc")
    private List<String> ids;
    
    public BulkDeleteRequest() {}
    
    public BulkDeleteRequest(List<String> ids) {
        this.ids = ids;
    }
    
    public List<String> getIds() {
        return ids;
    }
    
    public void setIds(List<String> ids) {
        this.ids = ids;
    }
}
