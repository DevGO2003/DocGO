package com.devgo2003.docgo.auth_service.entity;

/**
 * Các loại sự kiện của người dùng
 */
public enum UserEventType {
    /**
     * Đăng ký tài khoản
     */
    REGISTRATION,
    
    /**
     * Đăng nhập
     */
    LOGIN,
    
    /**
     * Đăng xuất
     */
    LOGOUT,
    
    /**
     * Thay đổi mật khẩu
     */
    PASSWORD_CHANGE,
    
    /**
     * Đặt lại mật khẩu
     */
    PASSWORD_RESET,
    
    /**
     * Cập nhật thông tin cá nhân
     */
    PROFILE_UPDATE,
    
    /**
     * Khóa tài khoản
     */
    ACCOUNT_LOCKED,
    
    /**
     * Mở khóa tài khoản
     */
    ACCOUNT_UNLOCKED,
    
    /**
     * Xóa tài khoản
     */
    ACCOUNT_DELETED,
    
    /**
     * Khôi phục tài khoản
     */
    ACCOUNT_RESTORED,
    
    /**
     * Xác thực email
     */
    EMAIL_VERIFICATION,
    
    /**
     * Thay đổi vai trò
     */
    ROLE_CHANGE,
    
    /**
     * Đăng nhập thất bại
     */
    LOGIN_FAILED,
    
    /**
     * Yêu cầu làm mới token
     */
    TOKEN_REFRESH
}
