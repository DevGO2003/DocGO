package com.devgo2003.docgo.auth_service.entity;

/**
 * Vai trò người dùng trong hệ thống DocGO
 * Đồng bộ với frontend role system
 */
public enum Role {
    /**
     * Quản trị viên - Có toàn quyền trong hệ thống
     */
    ADMIN,
    /**
     * Giám đốc - Lãnh đạo cấp cao phê duyệt hợp đồng giá trị lớn
     */
    DIRECTOR,
    /**
     * Quản lý - Quản lý và phê duyệt hợp đồng
     */
    MANAGER,
    /**
     * Pháp chế - Chuyên gia pháp lý kiểm tra hợp đồng
     */
    LEGAL,
    /**
     * Tài chính - Chuyên gia tài chính kiểm tra hợp đồng
     */
    FINANCE,
    /**
     * Nhân viên - Người dùng cơ bản tải lên hợp đồng
     */
    EMPLOYEE
}
