package com.devgo2003.docgo.auth_service.entity;

/**
 * Kết quả của sự kiện
 */
public enum EventResult {
    /**
     * Thành công
     */
    SUCCESS,
    
    /**
     * Thất bại
     */
    FAILED,
    
    /**
     * Đang xử lý
     */
    PENDING,
    
    /**
     * Bị từ chối
     */
    REJECTED,
    
    /**
     * Hủy bỏ
     */
    CANCELLED,
    
    /**
     * Hết hạn
     */
    EXPIRED
}
