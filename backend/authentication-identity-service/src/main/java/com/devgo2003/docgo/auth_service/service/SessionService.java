package com.devgo2003.docgo.auth_service.service;

import com.devgo2003.docgo.auth_service.entity.SessionMongo;
import com.devgo2003.docgo.auth_service.entity.SessionStatus;
import com.devgo2003.docgo.auth_service.repository.SessionMongoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SessionService {
    
    private final SessionMongoRepository sessionRepository;
    
    @Value("${security.jwt.access-ttl-seconds:3600}")
    private long accessTokenTtlSeconds;
    
    @Value("${security.jwt.refresh-ttl-seconds:2592000}")
    private long refreshTokenTtlSeconds;
    
    public SessionMongo createSession(String userId, String deviceInfo, String ipAddress, String userAgent) {
        log.info("Creating new session for user: {}", userId);
        
        String sessionToken = UUID.randomUUID().toString();
        String refreshToken = UUID.randomUUID().toString();
        
        SessionMongo session = SessionMongo.builder()
                .userId(userId)
                .sessionToken(sessionToken)
                .refreshToken(refreshToken)
                .deviceInfo(deviceInfo)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .status(SessionStatus.ACTIVE)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshTokenTtlSeconds)) // 30 days
                .lastActivity(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        return sessionRepository.save(session);
    }
    
    public Optional<SessionMongo> getSessionById(String id) {
        return sessionRepository.findById(id);
    }
    
    public Optional<SessionMongo> getSessionByToken(String sessionToken) {
        return sessionRepository.findBySessionToken(sessionToken);
    }
    
    public Optional<SessionMongo> getSessionByRefreshToken(String refreshToken) {
        return sessionRepository.findByRefreshToken(refreshToken);
    }
    
    public List<SessionMongo> getUserSessions(String userId) {
        return sessionRepository.findByUserId(userId);
    }
    
    public List<SessionMongo> getActiveUserSessions(String userId) {
        return sessionRepository.findByUserIdAndStatus(userId, SessionStatus.ACTIVE);
    }
    
    public Page<SessionMongo> getAllSessions(int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return sessionRepository.findAll(pageable);
    }
    
    public List<SessionMongo> getSessionsByStatus(SessionStatus status) {
        return sessionRepository.findByStatus(status);
    }
    
    public List<SessionMongo> getSessionsByIpAddress(String ipAddress) {
        return sessionRepository.findByIpAddressAndStatus(ipAddress, SessionStatus.ACTIVE);
    }
    
    public List<SessionMongo> getSessionsByDevice(String deviceInfo) {
        return sessionRepository.findByDeviceInfoAndStatus(deviceInfo, SessionStatus.ACTIVE);
    }
    
    public SessionMongo updateSessionActivity(String sessionId) {
        log.info("Updating session activity: {}", sessionId);
        
        return sessionRepository.findById(sessionId)
                .map(session -> {
                    session.setLastActivity(LocalDateTime.now());
                    session.setUpdatedAt(LocalDateTime.now());
                    return sessionRepository.save(session);
                })
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
    }
    
    public SessionMongo updateSessionStatus(String sessionId, SessionStatus status) {
        log.info("Updating session status: {} to {}", sessionId, status);
        
        return sessionRepository.findById(sessionId)
                .map(session -> {
                    session.setStatus(status);
                    session.setUpdatedAt(LocalDateTime.now());
                    return sessionRepository.save(session);
                })
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
    }
    
    public SessionMongo extendSession(String sessionId, int hours) {
        log.info("Extending session: {} by {} hours", sessionId, hours);
        
        return sessionRepository.findById(sessionId)
                .map(session -> {
                    session.setExpiresAt(LocalDateTime.now().plusHours(hours));
                    session.setUpdatedAt(LocalDateTime.now());
                    return sessionRepository.save(session);
                })
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
    }
    
    public void terminateSession(String sessionId) {
        log.info("Terminating session: {}", sessionId);
        
        sessionRepository.findById(sessionId)
                .ifPresent(session -> {
                    session.setStatus(SessionStatus.TERMINATED);
                    session.setUpdatedAt(LocalDateTime.now());
                    sessionRepository.save(session);
                });
    }
    
    public void terminateUserSessions(String userId) {
        log.info("Terminating all sessions for user: {}", userId);
        sessionRepository.deleteByUserIdAndStatus(userId, SessionStatus.ACTIVE);
    }
    
    public void terminateSessionsByIp(String ipAddress) {
        log.info("Terminating sessions by IP: {}", ipAddress);
        
        List<SessionMongo> sessions = sessionRepository.findByIpAddressAndStatus(ipAddress, SessionStatus.ACTIVE);
        sessions.forEach(session -> {
            session.setStatus(SessionStatus.TERMINATED);
            session.setUpdatedAt(LocalDateTime.now());
            sessionRepository.save(session);
        });
    }
    
    public void cleanupExpiredSessions() {
        log.info("Cleaning up expired sessions");
        sessionRepository.deleteExpiredSessions(LocalDateTime.now());
    }
    
    public void cleanupInactiveSessions(int hours) {
        log.info("Cleaning up inactive sessions older than {} hours", hours);
        
        LocalDateTime threshold = LocalDateTime.now().minusHours(hours);
        List<SessionMongo> inactiveSessions = sessionRepository.findInactiveSessions(threshold);
        
        inactiveSessions.forEach(session -> {
            session.setStatus(SessionStatus.EXPIRED);
            session.setUpdatedAt(LocalDateTime.now());
            sessionRepository.save(session);
        });
    }
    
    public boolean isSessionValid(String sessionToken) {
        Optional<SessionMongo> session = sessionRepository.findBySessionToken(sessionToken);
        
        if (session.isEmpty()) {
            return false;
        }
        
        SessionMongo sessionData = session.get();
        
        // Check if session is active and not expired
        return sessionData.getStatus() == SessionStatus.ACTIVE &&
               sessionData.getExpiresAt().isAfter(LocalDateTime.now());
    }
    
    public boolean isRefreshTokenValid(String refreshToken) {
        Optional<SessionMongo> session = sessionRepository.findByRefreshToken(refreshToken);
        
        if (session.isEmpty()) {
            return false;
        }
        
        SessionMongo sessionData = session.get();
        
        // Check if session is active and not expired
        return sessionData.getStatus() == SessionStatus.ACTIVE &&
               sessionData.getExpiresAt().isAfter(LocalDateTime.now());
    }
    
    public void deleteSession(String sessionId) {
        log.info("Deleting session: {}", sessionId);
        sessionRepository.deleteById(sessionId);
    }
    
    public List<SessionMongo> getExpiredSessions() {
        return sessionRepository.findExpiredSessions(LocalDateTime.now());
    }
    
    public List<SessionMongo> getInactiveSessions(int hours) {
        LocalDateTime threshold = LocalDateTime.now().minusHours(hours);
        return sessionRepository.findInactiveSessions(threshold);
    }
}
