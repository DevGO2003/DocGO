package com.devgo2003.docgo.auth_service.model;

import com.devgo2003.docgo.auth_service.entity.UserMongo;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthResponse {
    private boolean success;
    private String message;
    private String token; // Keep for backward compatibility
    private String accessToken; // New standard field
    private String refreshToken;
    private Long expiresIn; // token expiration time in seconds
    private String tokenType; // token type (Bearer)
    private UserInfo user;

    public AuthResponse(boolean success, String message, String token, UserInfo user, String refreshToken) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.accessToken = token; // Set both for compatibility
        this.user = user;
        this.refreshToken = refreshToken;
        this.expiresIn = 900L; // 15 minutes (access token TTL)
        this.tokenType = "Bearer";
    }

    public AuthResponse(boolean success, String message, String token, UserInfo user, String refreshToken, Long expiresIn, String tokenType) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.accessToken = token; // Set both for compatibility
        this.user = user;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.tokenType = tokenType;
    }

    // New constructor with accessToken
    public AuthResponse(boolean success, String message, String accessToken, String refreshToken, UserInfo user, Long expiresIn, String tokenType) {
        this.success = success;
        this.message = message;
        this.token = accessToken; // Set token for backward compatibility
        this.accessToken = accessToken;
        this.user = user;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.tokenType = tokenType;
    }
    
    @Data
    @NoArgsConstructor
    public static class UserInfo {
        private String id; // Changed from userId to id as String
        private Long userId; // Keep for backward compatibility
        private String username;
        private String email;
        private String role;
        private String firstName;
        private String lastName;
        private String status;
        private String fullName;
        private String department;
        private String position;
        private String avatarUrl;
        private Integer approvalLevel;
        private Long maxContractValue;
        
        // Constructor for backward compatibility
        public UserInfo(Long userId, String username, String email, String role) {
            this.id = userId != null ? userId.toString() : null;
            this.userId = userId;
            this.username = username;
            this.email = email;
            this.role = role;
            this.status = "ACTIVE";
            this.approvalLevel = 1;
            this.maxContractValue = 0L;
        }
        
        // Constructor with additional fields
        public UserInfo(Long userId, String username, String email, String role, String firstName, String lastName, String status) {
            this.id = userId != null ? userId.toString() : null;
            this.userId = userId;
            this.username = username;
            this.email = email;
            this.role = role;
            this.firstName = firstName;
            this.lastName = lastName;
            this.status = status;
            this.approvalLevel = 1;
            this.maxContractValue = 0L;
        }
        
        // Full constructor
        public UserInfo(Long userId, String username, String email, String role, String firstName, String lastName, 
                       String status, String fullName, String department, String position, String avatarUrl, 
                       Integer approvalLevel, Long maxContractValue) {
            this.id = userId != null ? userId.toString() : null;
            this.userId = userId;
            this.username = username;
            this.email = email;
            this.role = role;
            this.firstName = firstName;
            this.lastName = lastName;
            this.status = status;
            this.fullName = fullName;
            this.department = department;
            this.position = position;
            this.avatarUrl = avatarUrl;
            this.approvalLevel = approvalLevel;
            this.maxContractValue = maxContractValue;
        }
        
        // Constructor for UserMongo
        public UserInfo(String id, String username, String email, String firstName, String lastName, 
                       Set<String> roleIds, com.devgo2003.docgo.auth_service.entity.UserStatus status) {
            this.id = id;
            this.userId = null; // Not applicable for MongoDB
            this.username = username;
            this.email = email;
            this.role = roleIds != null && !roleIds.isEmpty() ? roleIds.iterator().next() : "employee";
            this.firstName = firstName;
            this.lastName = lastName;
            this.status = status != null ? status.name() : "ACTIVE";
            this.approvalLevel = 1;
            this.maxContractValue = 0L;
        }
    }
}
