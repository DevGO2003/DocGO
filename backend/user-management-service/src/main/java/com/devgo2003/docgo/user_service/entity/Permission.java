package com.devgo2003.docgo.auth_service.entity;

/**
 * Các quyền hạn cụ thể của người dùng trong hệ thống DocGO
 * Đồng bộ với frontend permission system
 */
public enum Permission {
    /**
     * Quyền tải lên hợp đồng
     */
    CAN_UPLOAD,
    /**
     * Quyền phê duyệt hợp đồng
     */
    CAN_APPROVE,
    /**
     * Quyền quản lý người dùng
     */
    CAN_MANAGE_USERS,
    /**
     * Quyền xem thống kê và báo cáo
     */
    CAN_VIEW_ANALYTICS,
    /**
     * Quyền ký hợp đồng điện tử
     */
    CAN_SIGN,
    /**
     * Quyền phê duyệt tài khoản người dùng
     */
    CAN_APPROVE_USERS
}
