package com.devgo2003.docgo.auth_service.service;

import com.devgo2003.docgo.auth_service.event.AuthEvent;
import com.devgo2003.docgo.auth_service.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.util.UUID;

@Service
public class AuthEventService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthEventService.class);
    
    // @Autowired
    // private KafkaTemplate<String, Object> kafkaTemplate;
    
    private static final String AUTH_EVENTS_TOPIC = "auth.events";
    
    /**
     * Publish login event
     */
    public void publishLoginEvent(User user, HttpServletRequest request, boolean success, String reason) {
        try {
            String ip = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            String sessionId = request.getSession().getId();
            
            AuthEvent event = AuthEvent.createLoginEvent(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                ip,
                userAgent,
                sessionId,
                success,
                reason
            );
            
            // kafkaTemplate.send(AUTH_EVENTS_TOPIC, event);
            logger.info("Published login event for user: {} (Kafka disabled)", user.getUsername());
        } catch (Exception e) {
            logger.error("Failed to publish login event for user: {}", user.getUsername(), e);
        }
    }
    
    /**
     * Publish logout event
     */
    public void publishLogoutEvent(User user, HttpServletRequest request) {
        try {
            String ip = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            String sessionId = request.getSession().getId();
            
            AuthEvent event = AuthEvent.createLogoutEvent(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                ip,
                userAgent,
                sessionId
            );
            
            // kafkaTemplate.send(AUTH_EVENTS_TOPIC, event);
            logger.info("Published logout event for user: {} (Kafka disabled)", user.getUsername());
        } catch (Exception e) {
            logger.error("Failed to publish logout event for user: {}", user.getUsername(), e);
        }
    }
    
    /**
     * Publish registration event
     */
    public void publishRegisterEvent(User user, HttpServletRequest request, boolean success, String reason) {
        try {
            String ip = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            String sessionId = request.getSession().getId();
            
            AuthEvent event = AuthEvent.createRegisterEvent(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                ip,
                userAgent,
                sessionId,
                success,
                reason
            );
            
            // kafkaTemplate.send(AUTH_EVENTS_TOPIC, event);
            logger.info("Published registration event for user: {} (Kafka disabled)", user.getUsername());
        } catch (Exception e) {
            logger.error("Failed to publish registration event for user: {}", user.getUsername(), e);
        }
    }
    
    /**
     * Publish refresh token event
     */
    public void publishRefreshTokenEvent(User user, HttpServletRequest request, boolean success, String reason) {
        try {
            String ip = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            String sessionId = request.getSession().getId();
            
            AuthEvent event = AuthEvent.createRefreshTokenEvent(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                ip,
                userAgent,
                sessionId,
                success,
                reason
            );
            
            // kafkaTemplate.send(AUTH_EVENTS_TOPIC, event);
            logger.info("Published refresh token event for user: {} (Kafka disabled)", user.getUsername());
        } catch (Exception e) {
            logger.error("Failed to publish refresh token event for user: {}", user.getUsername(), e);
        }
    }
    
    /**
     * Publish OAuth login event
     */
    public void publishOAuthLoginEvent(User user, String provider, HttpServletRequest request, boolean success, String reason) {
        try {
            String ip = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            String sessionId = request.getSession().getId();
            
            AuthEvent event = AuthEvent.createOAuthLoginEvent(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                provider,
                ip,
                userAgent,
                sessionId,
                success,
                reason
            );
            
            // kafkaTemplate.send(AUTH_EVENTS_TOPIC, event);
            logger.info("Published OAuth login event for user: {} with provider: {} (Kafka disabled)", user.getUsername(), provider);
        } catch (Exception e) {
            logger.error("Failed to publish OAuth login event for user: {}", user.getUsername(), e);
        }
    }
    
    /**
     * Get client IP address from request
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}


