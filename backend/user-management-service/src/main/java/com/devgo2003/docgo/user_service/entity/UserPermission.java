package com.devgo2003.docgo.auth_service.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entity để lưu trữ quyền hạn của người dùng
 */
@Entity
@Table(name = "user_permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPermission extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "permission_name", nullable = false)
    private Permission permissionName;

    @Column(name = "is_enabled", nullable = false)
    @Builder.Default
    private Boolean isEnabled = true;

    // Unique constraint to prevent duplicate permissions for a user
    @PrePersist
    @PreUpdate
    private void validateUniquePermission() {
        // Logic for unique constraint might be better handled at DB level or service layer
    }
}
