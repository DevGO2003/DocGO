package com.devgo2003.docgo.backend.user_service.entity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @org.springframework.data.annotation.Id
    private String id;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Field("username")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Field("email")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Field("password")
    private String password;

    @Field("first_name")
    private String firstName;

    @Field("last_name")
    private String lastName;

    @Field("phone")
    private String phone;

    @Field("status")
    private UserStatus status = UserStatus.ACTIVE;

    @Field("role")
    private UserRole role = UserRole.USER;

    @Field("last_login")
    private LocalDateTime lastLogin;

    @Field("email_verified")
    private Boolean emailVerified = false;

    @Field("profile_picture")
    private String profilePicture;

    @Field("organization_id")
    private String organizationId;

    @Field("organization_ids")
    private java.util.List<String> organizationIds;

    @Field("active_organization_id")
    private String activeOrganizationId;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Field("created_by")
    private String createdBy;

    @Field("updated_by")
    private String updatedBy;

    // Additional fields for full functionality
    @Field("role_ids")
    private Set<String> roleIds;

    @Field("permission_ids")
    private Set<String> permissionIds;

    @Field("login_attempts")
    private Integer loginAttempts = 0;

    @Field("two_factor_enabled")
    private Boolean twoFactorEnabled = false;

    @Field("two_factor_secret")
    private String twoFactorSecret;

    @Field("avatar_url")
    private String avatarUrl;

    @Field("groups")
    private List<String> groups;

    @Field("locked_until")
    private LocalDateTime lockedUntil;

    public enum UserStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED,
        DELETED
    }

    public enum UserRole {
        ADMIN,
        USER,
        MODERATOR
    }
}