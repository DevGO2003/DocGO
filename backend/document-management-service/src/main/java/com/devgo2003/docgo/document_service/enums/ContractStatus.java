package com.devgo2003.docgo.document_service.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * ENUM cho trạng thái hợp đồng
 */
public enum ContractStatus {
    
    DRAFT("DRAFT", "Bản nháp", "Hợp đồng đang được soạn thảo"),
    PENDING_REVIEW("PENDING_REVIEW", "Chờ duyệt", "Hợp đồng đang chờ được duyệt"),
    UNDER_REVIEW("UNDER_REVIEW", "Đang duyệt", "Hợp đồng đang được xem xét"),
    APPROVED("APPROVED", "Đã duyệt", "Hợp đồng đã được phê duyệt"),
    REJECTED("REJECTED", "Bị từ chối", "Hợp đồng bị từ chối"),
    SIGNED("SIGNED", "Đã ký", "Hợp đồng đã được ký kết"),
    ACTIVE("ACTIVE", "Đang hiệu lực", "Hợp đồng đang có hiệu lực"),
    SUSPENDED("SUSPENDED", "Tạm dừng", "Hợp đồng tạm thời bị dừng"),
    EXPIRED("EXPIRED", "Hết hạn", "Hợp đồng đã hết hạn"),
    TERMINATED("TERMINATED", "Chấm dứt", "Hợp đồng đã bị chấm dứt"),
    CANCELLED("CANCELLED", "Hủy bỏ", "Hợp đồng đã bị hủy bỏ"),
    RENEWED("RENEWED", "Gia hạn", "Hợp đồng đã được gia hạn"),
    AMENDED("AMENDED", "Sửa đổi", "Hợp đồng đã được sửa đổi"),
    ARCHIVED("ARCHIVED", "Lưu trữ", "Hợp đồng đã được lưu trữ");
    
    private final String value;
    private final String displayName;
    private final String description;
    
    ContractStatus(String value, String displayName, String description) {
        this.value = value;
        this.displayName = displayName;
        this.description = description;
    }
    
    @JsonValue
    public String getValue() {
        return value;
    }
    
    @JsonCreator
    public static ContractStatus fromValue(String value) {
        for (ContractStatus status : ContractStatus.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown ContractStatus: " + value);
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public String getDescription() {
        return description;
    }
    
    /**
     * Kiểm tra trạng thái có thể chuyển sang trạng thái khác không
     */
    public boolean canTransitionTo(ContractStatus targetStatus) {
        switch (this) {
            case DRAFT:
                return targetStatus == PENDING_REVIEW || targetStatus == CANCELLED;
            case PENDING_REVIEW:
                return targetStatus == UNDER_REVIEW || targetStatus == REJECTED || targetStatus == CANCELLED;
            case UNDER_REVIEW:
                return targetStatus == APPROVED || targetStatus == REJECTED || targetStatus == CANCELLED;
            case APPROVED:
                return targetStatus == SIGNED || targetStatus == CANCELLED;
            case SIGNED:
                return targetStatus == ACTIVE || targetStatus == CANCELLED;
            case ACTIVE:
                return targetStatus == SUSPENDED || targetStatus == EXPIRED || 
                       targetStatus == TERMINATED || targetStatus == RENEWED || targetStatus == AMENDED;
            case SUSPENDED:
                return targetStatus == ACTIVE || targetStatus == TERMINATED || targetStatus == CANCELLED;
            case EXPIRED:
                return targetStatus == RENEWED || targetStatus == ARCHIVED;
            case TERMINATED:
            case CANCELLED:
                return targetStatus == ARCHIVED;
            case RENEWED:
            case AMENDED:
                return targetStatus == ACTIVE || targetStatus == TERMINATED || targetStatus == CANCELLED;
            case ARCHIVED:
                return false; // Không thể chuyển từ archived
            case REJECTED:
                return targetStatus == DRAFT || targetStatus == CANCELLED;
            default:
                return false;
        }
    }
    
    /**
     * Lấy trạng thái tiếp theo có thể
     */
    public ContractStatus[] getPossibleNextStatuses() {
        return java.util.Arrays.stream(values())
                .filter(status -> this.canTransitionTo(status))
                .toArray(ContractStatus[]::new);
    }
    
    /**
     * Kiểm tra trạng thái có hiệu lực không
     */
    public boolean isActive() {
        return this == ACTIVE || this == SIGNED;
    }
    
    /**
     * Kiểm tra trạng thái có thể chỉnh sửa không
     */
    public boolean isEditable() {
        return this == DRAFT || this == PENDING_REVIEW || this == UNDER_REVIEW;
    }
    
    /**
     * Kiểm tra trạng thái cuối cùng
     */
    public boolean isFinal() {
        return this == TERMINATED || this == CANCELLED || this == ARCHIVED;
    }
}

