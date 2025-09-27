package com.devgo2003.docgo.auth_service.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class UserMongo {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    @Field("username")
    private String username;
    
    @Indexed(unique = true)
    @Field("email")
    private String email;
    
    @Field("password")
    private String password;
    
    @Field("first_name")
    private String firstName;
    
    @Field("last_name")
    private String lastName;
    
    @Field("phone")
    private String phone;
    
    @Field("avatar_url")
    private String avatarUrl;
    
    @Field("status")
    private UserStatus status;
    
    @Field("roles")
    private Set<String> roleIds;
    
    @Field("permissions")
    private Set<String> permissionIds;
    
    @Field("groups")
    private List<String> groups;
    
    @Field("last_login")
    private LocalDateTime lastLogin;
    
    @Field("login_attempts")
    private Integer loginAttempts;
    
    @Field("locked_until")
    private LocalDateTime lockedUntil;
    
    @Field("email_verified")
    private Boolean emailVerified;
    
    @Field("two_factor_enabled")
    private Boolean twoFactorEnabled;
    
    @Field("two_factor_secret")
    private String twoFactorSecret;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    @Field("created_by")
    private String createdBy;
    
    @Field("updated_by")
    private String updatedBy;
}
