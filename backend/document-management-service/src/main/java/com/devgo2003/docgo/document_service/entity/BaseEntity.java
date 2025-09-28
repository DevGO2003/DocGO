package com.devgo2003.docgo.document_service.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

/**
 * Base entity chứa các trường audit cơ bản (created_at, created_by),
 * soft-delete và version. Các thay đổi/updates sẽ được lưu vào collection audit riêng (contract_events).
 */
public abstract class BaseEntity {

    /**
     * Thời gian tạo bản ghi
     */
    @CreatedDate
    @Field("created_at")
    private LocalDateTime createdAt;

    /**
     * Người tạo bản ghi
     */
    @CreatedBy
    @Field("created_by")
    private String createdBy;

    /**
     * Thời gian cập nhật cuối
     */
    @LastModifiedDate
    @Field("updated_at")
    private LocalDateTime updatedAt;

    /**
     * Người cập nhật cuối
     */
    @LastModifiedBy
    @Field("updated_by")
    private String updatedBy;

    /**
     * Thời gian xóa (null nếu chưa xóa)
     */
    @Field("deleted_at")
    private LocalDateTime deletedAt;

    /**
     * Người xóa
     */
    @Field("deleted_by")
    private String deletedBy;

    /**
     * Trạng thái xóa: false = chưa xóa, true = đã xóa
     */
    @Field("is_deleted")
    private Boolean isDeleted = false;

    /**
     * Phiên bản bản ghi cho optimistic locking
     * Temporarily removed @Version to avoid conflicts with mongoTemplate.insert()
     */
    @Field("version")
    private Long version;

    // Getters / Setters
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public String getCreatedBy() {
        return createdBy;
    }
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    public String getUpdatedBy() {
        return updatedBy;
    }
    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }
    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
    public String getDeletedBy() {
        return deletedBy;
    }
    public void setDeletedBy(String deletedBy) {
        this.deletedBy = deletedBy;
    }
    public Boolean getIsDeleted() {
        return isDeleted;
    }
    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
    public Long getVersion() {
        return version;
    }
    public void setVersion(Long version) {
        this.version = version;
    }

    /**
     * Đánh dấu soft-delete — không xóa vật lý, chỉ cập nhật cờ và thời gian.
     */
    public void markAsDeleted(String deletedBy) {
        this.isDeleted = true;
        this.deletedAt = LocalDateTime.now();
        this.deletedBy = deletedBy;
    }

    /**
     * Khôi phục bản ghi đã xóa (soft-restore)
     */
    public void restore() {
        this.isDeleted = false;
        this.deletedAt = null;
        this.deletedBy = null;
    }
    
    /**
     * Kiểm tra xem entity có phải là mới hay không
     * Spring Data MongoDB sử dụng method này để xác định entity mới hay cũ
     * Các class con cần override method này để trả về true nếu id == null
     */
    public abstract boolean isNew();
    
    /**
     * Khởi tạo các giá trị mặc định cho entity mới
     * Sử dụng method này để đảm bảo tính nhất quán khi tạo entity mới
     */
    public void initializeNewEntity() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isDeleted = false;
        // Version sẽ được Spring Data MongoDB tự động set
    }
}
