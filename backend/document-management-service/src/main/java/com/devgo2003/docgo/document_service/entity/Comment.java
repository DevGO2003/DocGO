package com.devgo2003.docgo.document_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Entity quản lý bình luận và cộng tác trên hợp đồng
 */
@Document(collection = "comments")
public class Comment extends BaseEntity {

    @Id
    private String id;

    @Field("contract_id")
    @DBRef
    private Contract contract;

    @Field("parent_comment_id")
    private String parentCommentId;

    @Field("author_id")
    private String authorId;

    @Field("author_name")
    private String authorName;

    @Field("author_email")
    private String authorEmail;

    @Field("author_role")
    private String authorRole;

    @Field("content")
    private String content;

    @Field("comment_type")
    private CommentType commentType;

    @Field("status")
    private CommentStatus status;

    @Field("priority")
    private CommentPriority priority;

    @Field("is_resolved")
    private Boolean isResolved = false;

    @Field("resolved_at")
    private LocalDateTime resolvedAt;

    @Field("resolved_by")
    private String resolvedBy;

    @Field("resolution_note")
    private String resolutionNote;

    @Field("mentioned_users")
    private List<String> mentionedUsers;

    @Field("attachments")
    private List<String> attachments;

    @Field("reaction_count")
    private Integer reactionCount = 0;

    @Field("reply_count")
    private Integer replyCount = 0;

    @Field("is_pinned")
    private Boolean isPinned = false;

    @Field("pinned_at")
    private LocalDateTime pinnedAt;

    @Field("pinned_by")
    private String pinnedBy;

    @Field("section_reference")
    private String sectionReference;

    @Field("line_number")
    private Integer lineNumber;

    @Field("is_private")
    private Boolean isPrivate = false;

    @Field("visibility")
    private CommentVisibility visibility;

    @Override
    public boolean isNew() {
        return this.id == null;
    }

    // Enums
    public enum CommentType {
        GENERAL, QUESTION, SUGGESTION, ISSUE, APPROVAL, REJECTION, CLARIFICATION, FEEDBACK
    }

    public enum CommentStatus {
        ACTIVE, RESOLVED, HIDDEN, DELETED
    }

    public enum CommentPriority {
        LOW, MEDIUM, HIGH, URGENT
    }

    public enum CommentVisibility {
        PUBLIC, PRIVATE, INTERNAL, RESTRICTED
    }

    // Constructors
    public Comment() {
        super();
    }

    public Comment(Contract contract, String authorId, String authorName, 
                  String authorEmail, String content, CommentType commentType) {
        super();
        this.contract = contract;
        this.authorId = authorId;
        this.authorName = authorName;
        this.authorEmail = authorEmail;
        this.content = content;
        this.commentType = commentType;
        this.status = CommentStatus.ACTIVE;
        this.priority = CommentPriority.MEDIUM;
        this.isResolved = false;
        this.reactionCount = 0;
        this.replyCount = 0;
        this.isPinned = false;
        this.isPrivate = false;
        this.visibility = CommentVisibility.PUBLIC;
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

    public String getParentCommentId() {
        return parentCommentId;
    }

    public void setParentCommentId(String parentCommentId) {
        this.parentCommentId = parentCommentId;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorEmail() {
        return authorEmail;
    }

    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }

    public String getAuthorRole() {
        return authorRole;
    }

    public void setAuthorRole(String authorRole) {
        this.authorRole = authorRole;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public CommentType getCommentType() {
        return commentType;
    }

    public void setCommentType(CommentType commentType) {
        this.commentType = commentType;
    }

    public CommentStatus getStatus() {
        return status;
    }

    public void setStatus(CommentStatus status) {
        this.status = status;
    }

    public CommentPriority getPriority() {
        return priority;
    }

    public void setPriority(CommentPriority priority) {
        this.priority = priority;
    }

    public Boolean getIsResolved() {
        return isResolved;
    }

    public void setIsResolved(Boolean isResolved) {
        this.isResolved = isResolved;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getResolvedBy() {
        return resolvedBy;
    }

    public void setResolvedBy(String resolvedBy) {
        this.resolvedBy = resolvedBy;
    }

    public String getResolutionNote() {
        return resolutionNote;
    }

    public void setResolutionNote(String resolutionNote) {
        this.resolutionNote = resolutionNote;
    }

    public List<String> getMentionedUsers() {
        return mentionedUsers;
    }

    public void setMentionedUsers(List<String> mentionedUsers) {
        this.mentionedUsers = mentionedUsers;
    }

    public List<String> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }

    public Integer getReactionCount() {
        return reactionCount;
    }

    public void setReactionCount(Integer reactionCount) {
        this.reactionCount = reactionCount;
    }

    public Integer getReplyCount() {
        return replyCount;
    }

    public void setReplyCount(Integer replyCount) {
        this.replyCount = replyCount;
    }

    public Boolean getIsPinned() {
        return isPinned;
    }

    public void setIsPinned(Boolean isPinned) {
        this.isPinned = isPinned;
    }

    public LocalDateTime getPinnedAt() {
        return pinnedAt;
    }

    public void setPinnedAt(LocalDateTime pinnedAt) {
        this.pinnedAt = pinnedAt;
    }

    public String getPinnedBy() {
        return pinnedBy;
    }

    public void setPinnedBy(String pinnedBy) {
        this.pinnedBy = pinnedBy;
    }

    public String getSectionReference() {
        return sectionReference;
    }

    public void setSectionReference(String sectionReference) {
        this.sectionReference = sectionReference;
    }

    public Integer getLineNumber() {
        return lineNumber;
    }

    public void setLineNumber(Integer lineNumber) {
        this.lineNumber = lineNumber;
    }

    public Boolean getIsPrivate() {
        return isPrivate;
    }

    public void setIsPrivate(Boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public CommentVisibility getVisibility() {
        return visibility;
    }

    public void setVisibility(CommentVisibility visibility) {
        this.visibility = visibility;
    }

    // Business methods
    public void resolve(String resolvedBy, String resolutionNote) {
        this.isResolved = true;
        this.resolvedAt = LocalDateTime.now();
        this.resolvedBy = resolvedBy;
        this.resolutionNote = resolutionNote;
        this.status = CommentStatus.RESOLVED;
    }

    public void unresolve() {
        this.isResolved = false;
        this.resolvedAt = null;
        this.resolvedBy = null;
        this.resolutionNote = null;
        this.status = CommentStatus.ACTIVE;
    }

    public void pin(String pinnedBy) {
        this.isPinned = true;
        this.pinnedAt = LocalDateTime.now();
        this.pinnedBy = pinnedBy;
    }

    public void unpin() {
        this.isPinned = false;
        this.pinnedAt = null;
        this.pinnedBy = null;
    }

    public void incrementReactionCount() {
        this.reactionCount++;
    }

    public void decrementReactionCount() {
        if (this.reactionCount > 0) {
            this.reactionCount--;
        }
    }

    public void incrementReplyCount() {
        this.replyCount++;
    }

    public void decrementReplyCount() {
        if (this.replyCount > 0) {
            this.replyCount--;
        }
    }

    public boolean isReply() {
        return parentCommentId != null;
    }

    public boolean isRootComment() {
        return parentCommentId == null;
    }

    public void hide() {
        this.status = CommentStatus.HIDDEN;
    }

    public void show() {
        this.status = CommentStatus.ACTIVE;
    }
}
