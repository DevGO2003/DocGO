package com.devgo2003.docgo.auth_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, columnDefinition = "VARCHAR(20)")
    private Role role;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "failed_login_attempts")
    @Builder.Default
    private Integer failedLoginAttempts = 0;

    @Column(name = "account_locked_until")
    private LocalDateTime accountLockedUntil;

    /**
     * Tên đầy đủ của người dùng
     */
    @Column(name = "full_name")
    private String fullName;

    /**
     * Phòng ban
     */
    @Column(name = "department")
    private String department;

    /**
     * Chức vụ
     */
    @Column(name = "position")
    private String position;

    /**
     * URL avatar
     */
    @Column(name = "avatar_url")
    private String avatarUrl;

    /**
     * Cấp độ phê duyệt (1: employee, 2: manager, 3: director, 4: admin)
     */
    @Column(name = "approval_level")
    @Builder.Default
    private Integer approvalLevel = 1;

    /**
     * Giá trị hợp đồng tối đa có thể phê duyệt (VNĐ)
     */
    @Column(name = "max_contract_value")
    @Builder.Default
    private Long maxContractValue = 0L;

    /**
     * Metadata bổ sung (JSON)
     */
    @Column(name = "metadata_json", columnDefinition = "TEXT")
    private String metadataJson;

    @Column(name = "token_version", nullable = false)
    @Builder.Default
    private Integer tokenVersion = 0;

    // Additional methods for user management
    public void incrementFailedLoginAttempts() {
        this.failedLoginAttempts++;
    }

    public void resetFailedLoginAttempts() {
        this.failedLoginAttempts = 0;
    }

    public void lockAccount(int lockDurationMinutes) {
        this.accountLockedUntil = LocalDateTime.now().plusMinutes(lockDurationMinutes);
    }

    public void unlockAccount() {
        this.accountLockedUntil = null;
        this.failedLoginAttempts = 0;
    }

    public boolean isAccountLocked() {
        return this.accountLockedUntil != null && 
               LocalDateTime.now().isBefore(this.accountLockedUntil);
    }

    public void updateLastLogin() {
        this.lastLoginAt = LocalDateTime.now();
        this.failedLoginAttempts = 0;
    }

    /**
     * Kiểm tra xem user có quyền phê duyệt hợp đồng với giá trị này không
     */
    public boolean canApproveContract(Long contractValue) {
        return this.maxContractValue >= contractValue;
    }

    /**
     * Lấy approval level theo role
     */
    public Integer getApprovalLevelByRole() {
        return switch (this.role) {
            case ADMIN -> 4;
            case DIRECTOR -> 3;
            case MANAGER, LEGAL, FINANCE -> 2;
            case EMPLOYEE -> 1;
        };
    }

    /**
     * Lấy max contract value theo role
     */
    public Long getMaxContractValueByRole() {
        return switch (this.role) {
            case ADMIN -> Long.MAX_VALUE; // Không giới hạn
            case DIRECTOR -> 1_000_000_000L; // 1 tỷ VNĐ
            case MANAGER, LEGAL, FINANCE -> 1_000_000_000L; // 1 tỷ VNĐ
            case EMPLOYEE -> 0L; // Không có quyền phê duyệt
        };
    }

    /**
     * Cập nhật thông tin từ role
     */
    public void updateFromRole() {
        this.approvalLevel = getApprovalLevelByRole();
        this.maxContractValue = getMaxContractValueByRole();
    }
} 