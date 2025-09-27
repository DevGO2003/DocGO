package com.devgo2003.docgo.document_service.dto;

import java.util.List;

/**
 * DTO cho bulk delete response
 */
public class BulkDeleteResponse {
    
    private int totalCount;
    private int successCount;
    private int failedCount;
    private List<String> successIds;
    private List<BulkDeleteError> errors;
    
    public BulkDeleteResponse() {}
    
    public BulkDeleteResponse(int totalCount, int successCount, int failedCount, 
                             List<String> successIds, List<BulkDeleteError> errors) {
        this.totalCount = totalCount;
        this.successCount = successCount;
        this.failedCount = failedCount;
        this.successIds = successIds;
        this.errors = errors;
    }
    
    // Getters and Setters
    public int getTotalCount() {
        return totalCount;
    }
    
    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }
    
    public int getSuccessCount() {
        return successCount;
    }
    
    public void setSuccessCount(int successCount) {
        this.successCount = successCount;
    }
    
    public int getFailedCount() {
        return failedCount;
    }
    
    public void setFailedCount(int failedCount) {
        this.failedCount = failedCount;
    }
    
    public List<String> getSuccessIds() {
        return successIds;
    }
    
    public void setSuccessIds(List<String> successIds) {
        this.successIds = successIds;
    }
    
    public List<BulkDeleteError> getErrors() {
        return errors;
    }
    
    public void setErrors(List<BulkDeleteError> errors) {
        this.errors = errors;
    }
    
    /**
     * Inner class cho error details
     */
    public static class BulkDeleteError {
        private String id;
        private String message;
        
        public BulkDeleteError() {}
        
        public BulkDeleteError(String id, String message) {
            this.id = id;
            this.message = message;
        }
        
        public String getId() {
            return id;
        }
        
        public void setId(String id) {
            this.id = id;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
}
