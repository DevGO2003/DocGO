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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "sessions")
public class SessionMongo {
    
    @Id
    private String id;
    
    @Indexed
    @Field("user_id")
    private String userId;
    
    @Indexed
    @Field("session_token")
    private String sessionToken;
    
    @Field("refresh_token")
    private String refreshToken;
    
    @Field("device_info")
    private String deviceInfo;
    
    @Field("ip_address")
    private String ipAddress;
    
    @Field("user_agent")
    private String userAgent;
    
    @Field("status")
    private SessionStatus status;
    
    @Field("expires_at")
    private LocalDateTime expiresAt;
    
    @Field("last_activity")
    private LocalDateTime lastActivity;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
}
