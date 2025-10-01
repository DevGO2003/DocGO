package com.devgo2003.docgo.backend.user_service.entity;

import lombok.*;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

/**
 * Entity để theo dõi phiên đăng nhập của người dùng
 */
@Document(collection = "user_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSession {

    @org.springframework.data.annotation.Id
    private String id;

    @Field("user_id")
    private String userId;

    @Field("session_token")
    private String sessionToken;

    @Field("ip_address")
    private String ipAddress;

    @Field("user_agent")
    private String userAgent;

    @Field("device_info")
    private String deviceInfo;

    @Field("is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Field("last_activity")
    private LocalDateTime lastActivity;

    @Field("expires_at")
    private LocalDateTime expiresAt;

    @Field("refresh_token")
    private String refreshToken;

    @Field("status")
    @Builder.Default
    private SessionStatus status = SessionStatus.ACTIVE;

    @Field("active_organization_id")
    private String activeOrganizationId;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum SessionStatus {
        ACTIVE,
        EXPIRED,
        REVOKED,
        INACTIVE,
        TERMINATED
    }
}
