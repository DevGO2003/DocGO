package com.devgo2003.docgo.auth_service.entity;

/**
 * Trạng thái của tài khoản người dùng
 */
public enum UserStatus {
    /**
     * Tài khoản đang hoạt động
     */
    ACTIVE,
    
    /**
     * Tài khoản bị khóa tạm thời
     */
    LOCKED,
    
    /**
     * Tài khoản bị vô hiệu hóa
     */
    INACTIVE,
    
    /**
     * Tài khoản chờ xác thực email
     */
    PENDING_VERIFICATION,
    
    /**
     * Tài khoản bị xóa mềm
     */
    DELETED
}
