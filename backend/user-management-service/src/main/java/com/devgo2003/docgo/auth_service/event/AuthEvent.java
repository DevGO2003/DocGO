package com.devgo2003.docgo.auth_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthEvent {
    private String eventVersion;
    private String eventType;
    private String eventId;
    private String timestamp;
    private String source;
    private String correlationId;
    private Actor actor;
    private AuthEventData data;
    private Map<String, Object> metadata;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Actor {
        private String userId;
        private String userRole;
        private String ip;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthEventData {
        private Long userId;
        private String username;
        private String email;
        private String action; // LOGIN, LOGOUT, REGISTER, REFRESH_TOKEN, OAUTH_LOGIN
        private String status; // SUCCESS, FAILED
        private String reason; // Reason for failure if status is FAILED
        private String userAgent;
        private String sessionId;
        private Map<String, Object> additionalData;
    }

    // Factory methods for common events
    public static AuthEvent createLoginEvent(Long userId, String username, String email, String ip, String userAgent, String sessionId, boolean success, String reason) {
        AuthEvent event = new AuthEvent();
        event.setEventVersion("v1");
        event.setEventType("UserLogin");
        event.setEventId(UUID.randomUUID().toString());
        event.setTimestamp(ZonedDateTime.now().toString());
        event.setSource("authentication-identity-service");
        event.setCorrelationId(UUID.randomUUID().toString());
        
        Actor actor = new Actor();
        actor.setUserId(userId.toString());
        actor.setUserRole("USER");
        actor.setIp(ip);
        event.setActor(actor);
        
        AuthEventData data = new AuthEventData();
        data.setUserId(userId);
        data.setUsername(username);
        data.setEmail(email);
        data.setAction("LOGIN");
        data.setStatus(success ? "SUCCESS" : "FAILED");
        data.setReason(reason);
        data.setUserAgent(userAgent);
        data.setSessionId(sessionId);
        event.setData(data);
        
        return event;
    }

    public static AuthEvent createLogoutEvent(Long userId, String username, String email, String ip, String userAgent, String sessionId) {
        AuthEvent event = new AuthEvent();
        event.setEventVersion("v1");
        event.setEventType("UserLogout");
        event.setEventId(UUID.randomUUID().toString());
        event.setTimestamp(ZonedDateTime.now().toString());
        event.setSource("authentication-identity-service");
        event.setCorrelationId(UUID.randomUUID().toString());
        
        Actor actor = new Actor();
        actor.setUserId(userId.toString());
        actor.setUserRole("USER");
        actor.setIp(ip);
        event.setActor(actor);
        
        AuthEventData data = new AuthEventData();
        data.setUserId(userId);
        data.setUsername(username);
        data.setEmail(email);
        data.setAction("LOGOUT");
        data.setStatus("SUCCESS");
        data.setUserAgent(userAgent);
        data.setSessionId(sessionId);
        event.setData(data);
        
        return event;
    }

    public static AuthEvent createRegisterEvent(Long userId, String username, String email, String ip, String userAgent, String sessionId, boolean success, String reason) {
        AuthEvent event = new AuthEvent();
        event.setEventVersion("v1");
        event.setEventType("UserRegistration");
        event.setEventId(UUID.randomUUID().toString());
        event.setTimestamp(ZonedDateTime.now().toString());
        event.setSource("authentication-identity-service");
        event.setCorrelationId(UUID.randomUUID().toString());
        
        Actor actor = new Actor();
        actor.setUserId(userId != null ? userId.toString() : null);
        actor.setUserRole("USER");
        actor.setIp(ip);
        event.setActor(actor);
        
        AuthEventData data = new AuthEventData();
        data.setUserId(userId);
        data.setUsername(username);
        data.setEmail(email);
        data.setAction("REGISTER");
        data.setStatus(success ? "SUCCESS" : "FAILED");
        data.setReason(reason);
        data.setUserAgent(userAgent);
        data.setSessionId(sessionId);
        event.setData(data);
        
        return event;
    }

    public static AuthEvent createRefreshTokenEvent(Long userId, String username, String email, String ip, String userAgent, String sessionId, boolean success, String reason) {
        AuthEvent event = new AuthEvent();
        event.setEventVersion("v1");
        event.setEventType("TokenRefresh");
        event.setEventId(UUID.randomUUID().toString());
        event.setTimestamp(ZonedDateTime.now().toString());
        event.setSource("authentication-identity-service");
        event.setCorrelationId(UUID.randomUUID().toString());
        
        Actor actor = new Actor();
        actor.setUserId(userId.toString());
        actor.setUserRole("USER");
        actor.setIp(ip);
        event.setActor(actor);
        
        AuthEventData data = new AuthEventData();
        data.setUserId(userId);
        data.setUsername(username);
        data.setEmail(email);
        data.setAction("REFRESH_TOKEN");
        data.setStatus(success ? "SUCCESS" : "FAILED");
        data.setReason(reason);
        data.setUserAgent(userAgent);
        data.setSessionId(sessionId);
        event.setData(data);
        
        return event;
    }

    public static AuthEvent createOAuthLoginEvent(Long userId, String username, String email, String provider, String ip, String userAgent, String sessionId, boolean success, String reason) {
        AuthEvent event = new AuthEvent();
        event.setEventVersion("v1");
        event.setEventType("OAuthLogin");
        event.setEventId(UUID.randomUUID().toString());
        event.setTimestamp(ZonedDateTime.now().toString());
        event.setSource("authentication-identity-service");
        event.setCorrelationId(UUID.randomUUID().toString());
        
        Actor actor = new Actor();
        actor.setUserId(userId != null ? userId.toString() : null);
        actor.setUserRole("USER");
        actor.setIp(ip);
        event.setActor(actor);
        
        AuthEventData data = new AuthEventData();
        data.setUserId(userId);
        data.setUsername(username);
        data.setEmail(email);
        data.setAction("OAUTH_LOGIN");
        data.setStatus(success ? "SUCCESS" : "FAILED");
        data.setReason(reason);
        data.setUserAgent(userAgent);
        data.setSessionId(sessionId);
        data.setAdditionalData(Map.of("provider", provider));
        event.setData(data);
        
        return event;
    }
}


