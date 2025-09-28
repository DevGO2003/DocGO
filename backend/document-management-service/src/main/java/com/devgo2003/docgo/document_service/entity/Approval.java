package com.devgo2003.docgo.document_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

/**
 * Entity quản lý quy trình phê duyệt hợp đồng
 */
@Document(collection = "approvals")
public class Approval extends BaseEntity {

    @Id
    private String id;

    @Field("contract_id")
    @DBRef
    private Contract contract;

    @Field("approver_id")
    private String approverId;

    @Field("approver_name")
    private String approverName;

    @Field("approver_email")
    private String approverEmail;

    @Field("approver_role")
    private String approverRole;

    @Field("status")
    private ApprovalStatus status;

    @Field("priority")
    private ApprovalPriority priority;

    @Field("due_date")
    private LocalDateTime dueDate;

    @Field("approved_at")
    private LocalDateTime approvedAt;

    @Field("rejected_at")
    private LocalDateTime rejectedAt;

    @Field("comments")
    private String comments;

    @Field("rejection_reason")
    private String rejectionReason;

    @Field("approval_order")
    private Integer approvalOrder;

    @Field("is_required")
    private Boolean isRequired = true;

    @Field("notified_at")
    private LocalDateTime notifiedAt;

    @Field("reminder_count")
    private Integer reminderCount = 0;

    @Override
    public boolean isNew() {
        return this.id == null;
    }

    // Enums
    public enum ApprovalStatus {
        PENDING_REVIEW, APPROVED, REJECTED, CANCELLED, EXPIRED
    }

    public enum ApprovalPriority {
        LOW, MEDIUM, HIGH, URGENT
    }

    // Constructors
    public Approval() {
        super();
    }

    public Approval(Contract contract, String approverId, String approverName, 
                   String approverEmail, String approverRole, ApprovalPriority priority) {
        super();
        this.contract = contract;
        this.approverId = approverId;
        this.approverName = approverName;
        this.approverEmail = approverEmail;
        this.approverRole = approverRole;
        this.priority = priority;
        this.status = ApprovalStatus.PENDING_REVIEW;
        this.isRequired = true;
        this.reminderCount = 0;
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

    public String getApproverId() {
        return approverId;
    }

    public void setApproverId(String approverId) {
        this.approverId = approverId;
    }

    public String getApproverName() {
        return approverName;
    }

    public void setApproverName(String approverName) {
        this.approverName = approverName;
    }

    public String getApproverEmail() {
        return approverEmail;
    }

    public void setApproverEmail(String approverEmail) {
        this.approverEmail = approverEmail;
    }

    public String getApproverRole() {
        return approverRole;
    }

    public void setApproverRole(String approverRole) {
        this.approverRole = approverRole;
    }

    public ApprovalStatus getStatus() {
        return status;
    }

    public void setStatus(ApprovalStatus status) {
        this.status = status;
    }

    public ApprovalPriority getPriority() {
        return priority;
    }

    public void setPriority(ApprovalPriority priority) {
        this.priority = priority;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public LocalDateTime getRejectedAt() {
        return rejectedAt;
    }

    public void setRejectedAt(LocalDateTime rejectedAt) {
        this.rejectedAt = rejectedAt;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public Integer getApprovalOrder() {
        return approvalOrder;
    }

    public void setApprovalOrder(Integer approvalOrder) {
        this.approvalOrder = approvalOrder;
    }

    public Boolean getIsRequired() {
        return isRequired;
    }

    public void setIsRequired(Boolean isRequired) {
        this.isRequired = isRequired;
    }

    public LocalDateTime getNotifiedAt() {
        return notifiedAt;
    }

    public void setNotifiedAt(LocalDateTime notifiedAt) {
        this.notifiedAt = notifiedAt;
    }

    public Integer getReminderCount() {
        return reminderCount;
    }

    public void setReminderCount(Integer reminderCount) {
        this.reminderCount = reminderCount;
    }

    // Business methods
    public void approve(String comments) {
        this.status = ApprovalStatus.APPROVED;
        this.approvedAt = LocalDateTime.now();
        this.comments = comments;
    }

    public void reject(String rejectionReason) {
        this.status = ApprovalStatus.REJECTED;
        this.rejectedAt = LocalDateTime.now();
        this.rejectionReason = rejectionReason;
    }

    public void cancel() {
        this.status = ApprovalStatus.CANCELLED;
    }

    public boolean isExpired() {
        return dueDate != null && LocalDateTime.now().isAfter(dueDate) && status == ApprovalStatus.PENDING_REVIEW;
    }

    public void markAsExpired() {
        if (isExpired()) {
            this.status = ApprovalStatus.EXPIRED;
        }
    }

    public void incrementReminderCount() {
        this.reminderCount++;
    }
}
