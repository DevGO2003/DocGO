package com.devgo2003.docgo.contract_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Entity quản lý phiên bản và lịch sử thay đổi hợp đồng
 */
@Document(collection = "versions")
public class Version extends BaseEntity {

    @Id
    private String id;

    @Field("contract_id")
    @DBRef
    private Contract contract;

    @Field("version_number")
    private String versionNumber;

    @Field("version_name")
    private String versionName;

    @Field("description")
    private String description;

    @Field("change_type")
    private ChangeType changeType;

    @Field("changes_summary")
    private String changesSummary;

    @Field("detailed_changes")
    private Map<String, Object> detailedChanges;

    @Field("previous_version_id")
    private String previousVersionId;

    @Field("is_current")
    private Boolean isCurrent = false;

    @Field("is_published")
    private Boolean isPublished = false;

    @Field("published_at")
    private LocalDateTime publishedAt;

    @Field("published_by")
    private String publishedBy;

    @Field("file_path")
    private String filePath;

    @Field("file_size")
    private Long fileSize;

    @Field("checksum")
    private String checksum;

    @Field("approval_required")
    private Boolean approvalRequired = false;

    @Field("approved_at")
    private LocalDateTime approvedAt;

    @Field("approved_by")
    private String approvedBy;

    @Field("rollback_reason")
    private String rollbackReason;

    @Field("tags")
    private String[] tags;

    @Override
    public boolean isNew() {
        return this.id == null;
    }

    // Enums
    public enum ChangeType {
        MAJOR, MINOR, PATCH, HOTFIX, DRAFT, ROLLBACK
    }

    // Constructors
    public Version() {
        super();
    }

    public Version(Contract contract, String versionNumber, String versionName, 
                  ChangeType changeType, String changesSummary) {
        super();
        this.contract = contract;
        this.versionNumber = versionNumber;
        this.versionName = versionName;
        this.changeType = changeType;
        this.changesSummary = changesSummary;
        this.isCurrent = false;
        this.isPublished = false;
        this.approvalRequired = false;
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
        if (this.contract == null) {
            this.contract = new Contract();
        }
        this.contract.setId(contractId);
    }

    public String getVersionNumber() {
        return versionNumber;
    }

    public void setVersionNumber(String versionNumber) {
        this.versionNumber = versionNumber;
    }

    public String getVersionName() {
        return versionName;
    }

    public void setVersionName(String versionName) {
        this.versionName = versionName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ChangeType getChangeType() {
        return changeType;
    }

    public void setChangeType(ChangeType changeType) {
        this.changeType = changeType;
    }

    public String getChangesSummary() {
        return changesSummary;
    }

    public void setChangesSummary(String changesSummary) {
        this.changesSummary = changesSummary;
    }

    public Map<String, Object> getDetailedChanges() {
        return detailedChanges;
    }

    public void setDetailedChanges(Map<String, Object> detailedChanges) {
        this.detailedChanges = detailedChanges;
    }

    public String getPreviousVersionId() {
        return previousVersionId;
    }

    public void setPreviousVersionId(String previousVersionId) {
        this.previousVersionId = previousVersionId;
    }

    public Boolean getIsCurrent() {
        return isCurrent;
    }

    public void setIsCurrent(Boolean isCurrent) {
        this.isCurrent = isCurrent;
    }

    public Boolean getIsPublished() {
        return isPublished;
    }

    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }

    public String getPublishedBy() {
        return publishedBy;
    }

    public void setPublishedBy(String publishedBy) {
        this.publishedBy = publishedBy;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getChecksum() {
        return checksum;
    }

    public void setChecksum(String checksum) {
        this.checksum = checksum;
    }

    public Boolean getApprovalRequired() {
        return approvalRequired;
    }

    public void setApprovalRequired(Boolean approvalRequired) {
        this.approvalRequired = approvalRequired;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }

    public String getRollbackReason() {
        return rollbackReason;
    }

    public void setRollbackReason(String rollbackReason) {
        this.rollbackReason = rollbackReason;
    }

    public String[] getTags() {
        return tags;
    }

    public void setTags(String[] tags) {
        this.tags = tags;
    }

    // Business methods
    public void publish(String publishedBy) {
        this.isPublished = true;
        this.publishedAt = LocalDateTime.now();
        this.publishedBy = publishedBy;
    }

    public void approve(String approvedBy) {
        this.approvedAt = LocalDateTime.now();
        this.approvedBy = approvedBy;
    }

    public void markAsCurrent() {
        this.isCurrent = true;
    }

    public void unmarkAsCurrent() {
        this.isCurrent = false;
    }

    public void rollback(String rollbackReason) {
        this.changeType = ChangeType.ROLLBACK;
        this.rollbackReason = rollbackReason;
    }

    public boolean isDraft() {
        return changeType == ChangeType.DRAFT;
    }

    public boolean isMajorVersion() {
        return changeType == ChangeType.MAJOR;
    }

    public boolean isMinorVersion() {
        return changeType == ChangeType.MINOR;
    }

    public boolean isPatchVersion() {
        return changeType == ChangeType.PATCH;
    }

    public boolean isHotfix() {
        return changeType == ChangeType.HOTFIX;
    }
}
