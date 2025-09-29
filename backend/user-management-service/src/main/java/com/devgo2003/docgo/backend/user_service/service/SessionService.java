package com.devgo2003.docgo.backend.user_service.service;

import com.devgo2003.docgo.backend.user_service.entity.UserSession;
import com.devgo2003.docgo.backend.user_service.repository.UserSessionRepository;
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
    
    private final UserSessionRepository sessionRepository;
    
    @Value("${security.jwt.access-ttl-seconds:3600}")
    private long accessTokenTtlSeconds;
    
    @Value("${security.jwt.refresh-ttl-seconds:2592000}")
    private long refreshTokenTtlSeconds;
    
    public UserSession createSession(String userId, String deviceInfo, String ipAddress, String userAgent) {
        log.info("Creating new session for user: {}", userId);
        
        String sessionToken = UUID.randomUUID().toString();
        String refreshToken = UUID.randomUUID().toString();
        
        UserSession session = UserSession.builder()
                .userId(userId)
                .sessionToken(sessionToken)
                .refreshToken(refreshToken)
                .deviceInfo(deviceInfo)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .status(UserSession.SessionStatus.ACTIVE)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshTokenTtlSeconds)) // 30 days
                .lastActivity(LocalDateTime.now())
                .build();
        
        return sessionRepository.save(session);
    }
    
    public Optional<UserSession> getSessionById(String id) {
        return sessionRepository.findById(id);
    }
    
    public Optional<UserSession> getSessionByToken(String sessionToken) {
        return sessionRepository.findBySessionToken(sessionToken);
    }
    
    public Optional<UserSession> getSessionByRefreshToken(String refreshToken) {
        return sessionRepository.findByRefreshToken(refreshToken);
    }
    
    public List<UserSession> getUserSessions(String userId) {
        return sessionRepository.findByUserId(userId);
    }
    
    public List<UserSession> getActiveUserSessions(String userId) {
        return sessionRepository.findByUserIdAndStatus(userId, UserSession.SessionStatus.ACTIVE);
    }
    
    public Page<UserSession> getAllSessions(int pageNumber, int pageSize, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        return sessionRepository.findAll(pageable);
    }
    
    public List<UserSession> getSessionsByStatus(UserSession.SessionStatus status) {
        return sessionRepository.findByStatus(status);
    }
    
    public List<UserSession> getSessionsByIpAddress(String ipAddress) {
        return sessionRepository.findByIpAddressAndStatus(ipAddress, UserSession.SessionStatus.ACTIVE);
    }
    
    public List<UserSession> getSessionsByDevice(String deviceInfo) {
        return sessionRepository.findByDeviceInfoAndStatus(deviceInfo, UserSession.SessionStatus.ACTIVE);
    }
    
    public UserSession updateSessionActivity(String sessionId) {
        log.info("Updating session activity: {}", sessionId);
        
        return sessionRepository.findById(sessionId)
                .map(session -> {
                    session.setLastActivity(LocalDateTime.now());
                    return sessionRepository.save(session);
                })
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
    }
    
    public UserSession updateSessionStatus(String sessionId, UserSession.SessionStatus status) {
        log.info("Updating session status: {} to {}", sessionId, status);
        
        return sessionRepository.findById(sessionId)
                .map(session -> {
                    session.setStatus(status);
                    return sessionRepository.save(session);
                })
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
    }
    
    public UserSession extendSession(String sessionId, int hours) {
        log.info("Extending session: {} by {} hours", sessionId, hours);
        
        return sessionRepository.findById(sessionId)
                .map(session -> {
                    session.setExpiresAt(LocalDateTime.now().plusHours(hours));
                    return sessionRepository.save(session);
                })
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
    }
    
    public void terminateSession(String sessionId) {
        log.info("Terminating session: {}", sessionId);
        
        sessionRepository.findById(sessionId)
                .ifPresent(session -> {
                    session.setStatus(UserSession.SessionStatus.TERMINATED);
                    sessionRepository.save(session);
                });
    }
    
    public void terminateUserSessions(String userId) {
        log.info("Terminating all sessions for user: {}", userId);
        sessionRepository.deleteByUserIdAndStatus(userId, UserSession.SessionStatus.ACTIVE);
    }
    
    public void terminateSessionsByIp(String ipAddress) {
        log.info("Terminating sessions by IP: {}", ipAddress);
        
        List<UserSession> sessions = sessionRepository.findByIpAddressAndStatus(ipAddress, UserSession.SessionStatus.ACTIVE);
        sessions.forEach(session -> {
            session.setStatus(UserSession.SessionStatus.TERMINATED);
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
        List<UserSession> inactiveSessions = sessionRepository.findInactiveSessions(threshold);
        
        inactiveSessions.forEach(session -> {
            session.setStatus(UserSession.SessionStatus.EXPIRED);
            sessionRepository.save(session);
        });
    }
    
    public boolean isSessionValid(String sessionToken) {
        Optional<UserSession> session = sessionRepository.findBySessionToken(sessionToken);
        
        if (session.isEmpty()) {
            return false;
        }
        
        UserSession sessionData = session.get();
        
        // Check if session is active and not expired
        return sessionData.getStatus() == UserSession.SessionStatus.ACTIVE &&
               sessionData.getExpiresAt().isAfter(LocalDateTime.now());
    }
    
    public boolean isRefreshTokenValid(String refreshToken) {
        Optional<UserSession> session = sessionRepository.findByRefreshToken(refreshToken);
        
        if (session.isEmpty()) {
            return false;
        }
        
        UserSession sessionData = session.get();
        
        // Check if session is active and not expired
        return sessionData.getStatus() == UserSession.SessionStatus.ACTIVE &&
               sessionData.getExpiresAt().isAfter(LocalDateTime.now());
    }
    
    public void deleteSession(String sessionId) {
        log.info("Deleting session: {}", sessionId);
        sessionRepository.deleteById(sessionId);
    }
    
    public List<UserSession> getExpiredSessions() {
        return sessionRepository.findExpiredSessions(LocalDateTime.now());
    }
    
    public List<UserSession> getInactiveSessions(int hours) {
        LocalDateTime threshold = LocalDateTime.now().minusHours(hours);
        return sessionRepository.findInactiveSessions(threshold);
    }
}
