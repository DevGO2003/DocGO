package com.devgo2003.docgo.contract_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Entity quản lý audit log cho tất cả hoạt động trong hệ thống
 */
@Document(collection = "audit_logs")
public class AuditLog extends BaseEntity {

    @Id
    private String id;

    @Field("contract_id")
    @DBRef
    private Contract contract;

    @Field("event_type")
    private String eventType;

    @Field("event_category")
    private EventCategory eventCategory;

    @Field("action")
    private String action;

    @Field("description")
    private String description;

    @Field("user_id")
    private String userId;

    @Field("user_name")
    private String userName;

    @Field("user_email")
    private String userEmail;

    @Field("user_role")
    private String userRole;

    @Field("ip_address")
    private String ipAddress;

    @Field("user_agent")
    private String userAgent;

    @Field("session_id")
    private String sessionId;

    @Field("request_id")
    private String requestId;

    @Field("correlation_id")
    private String correlationId;

    @Field("resource_type")
    private String resourceType;

    @Field("resource_id")
    private String resourceId;

    @Field("old_values")
    private Map<String, Object> oldValues;

    @Field("new_values")
    private Map<String, Object> newValues;

    @Field("changes_summary")
    private String changesSummary;

    @Field("severity")
    private SeverityLevel severity;

    @Field("status")
    private AuditStatus status;

    @Field("error_code")
    private String errorCode;

    @Field("error_message")
    private String errorMessage;

    @Field("execution_time_ms")
    private Long executionTimeMs;

    @Field("additional_data")
    private Map<String, Object> additionalData;

    @Field("tags")
    private String[] tags;

    @Field("is_sensitive")
    private Boolean isSensitive = false;

    @Field("retention_until")
    private LocalDateTime retentionUntil;

    @Field("compliance_required")
    private Boolean complianceRequired = false;

    @Field("compliance_standard")
    private String complianceStandard;

    @Field("is_exported")
    private Boolean isExported = false;

    @Field("exported_at")
    private LocalDateTime exportedAt;

    @Field("exported_by")
    private String exportedBy;

    @Override
    public boolean isNew() {
        return this.id == null;
    }

    // Enums
    public enum EventCategory {
        AUTHENTICATION, AUTHORIZATION, DATA_ACCESS, DATA_MODIFICATION, 
        SYSTEM_EVENT, SECURITY_EVENT, BUSINESS_EVENT, ERROR_EVENT
    }

    public enum SeverityLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum AuditStatus {
        SUCCESS, FAILURE, WARNING, INFO
    }

    // Constructors
    public AuditLog() {
        super();
    }

    public AuditLog(String eventType, EventCategory eventCategory, String action, 
                   String description, String userId, String userName) {
        super();
        this.eventType = eventType;
        this.eventCategory = eventCategory;
        this.action = action;
        this.description = description;
        this.userId = userId;
        this.userName = userName;
        this.severity = SeverityLevel.LOW;
        this.status = AuditStatus.SUCCESS;
        this.isSensitive = false;
        this.complianceRequired = false;
        this.isExported = false;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Contract getContract() {
        return contract;
    }

    public void setContract(Contract contract) {
        this.contract = contract;
    }

    public void setContractId(String contractId) {
        if (contractId != null) {
            Contract contract = new Contract();
            contract.setId(contractId);
            this.contract = contract;
        }
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public EventCategory getEventCategory() {
        return eventCategory;
    }

    public void setEventCategory(EventCategory eventCategory) {
        this.eventCategory = eventCategory;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public void setCorrelationId(String correlationId) {
        this.correlationId = correlationId;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public Map<String, Object> getOldValues() {
        return oldValues;
    }

    public void setOldValues(Map<String, Object> oldValues) {
        this.oldValues = oldValues;
    }

    public Map<String, Object> getNewValues() {
        return newValues;
    }

    public void setNewValues(Map<String, Object> newValues) {
        this.newValues = newValues;
    }

    public String getChangesSummary() {
        return changesSummary;
    }

    public void setChangesSummary(String changesSummary) {
        this.changesSummary = changesSummary;
    }

    public SeverityLevel getSeverity() {
        return severity;
    }

    public void setSeverity(SeverityLevel severity) {
        this.severity = severity;
    }

    public AuditStatus getStatus() {
        return status;
    }

    public void setStatus(AuditStatus status) {
        this.status = status;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public Long getExecutionTimeMs() {
        return executionTimeMs;
    }

    public void setExecutionTimeMs(Long executionTimeMs) {
        this.executionTimeMs = executionTimeMs;
    }

    public Map<String, Object> getAdditionalData() {
        return additionalData;
    }

    public void setAdditionalData(Map<String, Object> additionalData) {
        this.additionalData = additionalData;
    }

    public String[] getTags() {
        return tags;
    }

    public void setTags(String[] tags) {
        this.tags = tags;
    }

    public Boolean getIsSensitive() {
        return isSensitive;
    }

    public void setIsSensitive(Boolean isSensitive) {
        this.isSensitive = isSensitive;
    }

    public LocalDateTime getRetentionUntil() {
        return retentionUntil;
    }

    public void setRetentionUntil(LocalDateTime retentionUntil) {
        this.retentionUntil = retentionUntil;
    }

    public Boolean getComplianceRequired() {
        return complianceRequired;
    }

    public void setComplianceRequired(Boolean complianceRequired) {
        this.complianceRequired = complianceRequired;
    }

    public String getComplianceStandard() {
        return complianceStandard;
    }

    public void setComplianceStandard(String complianceStandard) {
        this.complianceStandard = complianceStandard;
    }

    public Boolean getIsExported() {
        return isExported;
    }

    public void setIsExported(Boolean isExported) {
        this.isExported = isExported;
    }

    public LocalDateTime getExportedAt() {
        return exportedAt;
    }

    public void setExportedAt(LocalDateTime exportedAt) {
        this.exportedAt = exportedAt;
    }

    public String getExportedBy() {
        return exportedBy;
    }

    public void setExportedBy(String exportedBy) {
        this.exportedBy = exportedBy;
    }

    // Business methods
    public void markAsSuccess() {
        this.status = AuditStatus.SUCCESS;
    }

    public void markAsFailure(String errorCode, String errorMessage) {
        this.status = AuditStatus.FAILURE;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    public void markAsWarning() {
        this.status = AuditStatus.WARNING;
    }

    public void markAsInfo() {
        this.status = AuditStatus.INFO;
    }

    public void setSeverityLevel(SeverityLevel severity) {
        this.severity = severity;
    }

    public void markAsSensitive() {
        this.isSensitive = true;
    }

    public void setComplianceRequirement(String complianceStandard) {
        this.complianceRequired = true;
        this.complianceStandard = complianceStandard;
    }

    public void markAsExported(String exportedBy) {
        this.isExported = true;
        this.exportedAt = LocalDateTime.now();
        this.exportedBy = exportedBy;
    }

    public void setExecutionTime(long startTime) {
        this.executionTimeMs = System.currentTimeMillis() - startTime;
    }

    public boolean isExpired() {
        return retentionUntil != null && LocalDateTime.now().isAfter(retentionUntil);
    }

    public boolean isHighSeverity() {
        return severity == SeverityLevel.HIGH || severity == SeverityLevel.CRITICAL;
    }

    public boolean isSecurityEvent() {
        return eventCategory == EventCategory.SECURITY_EVENT || 
               eventCategory == EventCategory.AUTHENTICATION || 
               eventCategory == EventCategory.AUTHORIZATION;
    }

    public boolean isDataModification() {
        return eventCategory == EventCategory.DATA_MODIFICATION;
    }

    public void addTag(String tag) {
        if (this.tags == null) {
            this.tags = new String[]{tag};
        } else {
            String[] newTags = new String[this.tags.length + 1];
            System.arraycopy(this.tags, 0, newTags, 0, this.tags.length);
            newTags[this.tags.length] = tag;
            this.tags = newTags;
        }
    }
}
