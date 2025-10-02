package com.devgo2003.docgo.backend.user_service.dto;

import com.devgo2003.docgo.backend.user_service.entity.User;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * DTO cho việc tìm kiếm người dùng với query parameters
 * Hỗ trợ tất cả các filter: searchTerm, status, roleId, organizationId, username
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSearchRequest {
    
    /**
     * Loại view dữ liệu
     */
    @Pattern(regexp = "^(full|summary|minimal)$", 
             message = "Loại view phải là full, summary hoặc minimal")
    @Builder.Default
    private String view = "full";
    
    /**
     * Từ khóa tìm kiếm trong username, email, fullName
     */
    private String searchTerm;
    
    /**
     * Trạng thái người dùng
     */
    private User.UserStatus status;
    
    /**
     * ID của vai trò
     */
    private String roleId;
    
    /**
     * ID của tổ chức
     */
    private String organizationId;
    
    /**
     * Username cụ thể (tìm kiếm chính xác)
     */
    private String username;
    
    /**
     * Số trang (bắt đầu từ 0)
     */
    @Min(value = 0, message = "Số trang phải >= 0")
    @Builder.Default
    private int pageNumber = 0;
    
    /**
     * Kích thước trang
     */
    @Min(value = 1, message = "Kích thước trang phải >= 1")
    @Max(value = 100, message = "Kích thước trang phải <= 100")
    @Builder.Default
    private int pageSize = 10;
    
    /**
     * Trường sắp xếp
     */
    @Pattern(regexp = "^(createdAt|updatedAt|username|email|fullName|status)$", 
             message = "Trường sắp xếp không hợp lệ")
    @Builder.Default
    private String sortBy = "createdAt";
    
    /**
     * Hướng sắp xếp
     */
    @Pattern(regexp = "^(ASC|DESC)$", 
             message = "Hướng sắp xếp phải là ASC hoặc DESC")
    @Builder.Default
    private String sortDirection = "DESC";
    
    /**
     * Kiểm tra xem có filter nào được áp dụng không
     */
    public boolean hasFilters() {
        return searchTerm != null && !searchTerm.trim().isEmpty() ||
               status != null ||
               roleId != null && !roleId.trim().isEmpty() ||
               organizationId != null && !organizationId.trim().isEmpty() ||
               username != null && !username.trim().isEmpty();
    }
    
    /**
     * Làm sạch và chuẩn hóa dữ liệu
     */
    public void normalize() {
        if (searchTerm != null) {
            searchTerm = searchTerm.trim();
            if (searchTerm.isEmpty()) {
                searchTerm = null;
            }
        }
        
        if (roleId != null) {
            roleId = roleId.trim();
            if (roleId.isEmpty()) {
                roleId = null;
            }
        }
        
        if (organizationId != null) {
            organizationId = organizationId.trim();
            if (organizationId.isEmpty()) {
                organizationId = null;
            }
        }
        
        if (username != null) {
            username = username.trim();
            if (username.isEmpty()) {
                username = null;
            }
        }
    }
}
