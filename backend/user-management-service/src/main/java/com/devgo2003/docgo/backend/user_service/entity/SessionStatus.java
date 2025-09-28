package com.devgo2003.docgo.backend.user_service.entity;

/**
 * Trạng thái của phiên đăng nhập
 */
public enum SessionStatus {
    /**
     * Phiên đang hoạt động
     */
    ACTIVE,
    
    /**
     * Phiên đã kết thúc
     */
    TERMINATED,
    
    /**
     * Phiên đã hết hạn
     */
    EXPIRED,
    
    /**
     * Phiên bị vô hiệu hóa
     */
    REVOKED,
    
    /**
     * Phiên đang chờ xác thực
     */
    PENDING_VERIFICATION
}
