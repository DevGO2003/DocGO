package com.devgo2003.docgo.backend.user_service.entity;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

/**
 * Base entity chứa các trường audit cơ bản (created_at, created_by),
 * soft-delete và version. Các thay đổi/updates sẽ được lưu vào bảng audit riêng.
 */
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseEntity {

    /**
     * Thời gian tạo bản ghi
     */
    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    /**
     * Người tạo bản ghi
     */
    @Field("created_by")
    private String createdBy;

    /**
     * Thời gian cập nhật
     */
    @Field("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    /**
     * Người cập nhật
     */
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
}