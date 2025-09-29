package com.devgo2003.docgo.backend.user_service.repository;

import com.devgo2003.docgo.backend.user_service.entity.UserSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends MongoRepository<UserSession, String> {
    Optional<UserSession> findBySessionToken(String sessionToken);
    Optional<UserSession> findByRefreshToken(String refreshToken);
    List<UserSession> findByUserId(String userId);
    List<UserSession> findByUserIdAndStatus(String userId, UserSession.SessionStatus status);
    List<UserSession> findByStatus(UserSession.SessionStatus status);
    List<UserSession> findByIpAddressAndStatus(String ipAddress, UserSession.SessionStatus status);
    List<UserSession> findByDeviceInfoAndStatus(String deviceInfo, UserSession.SessionStatus status);
    void deleteByUserIdAndStatus(String userId, UserSession.SessionStatus status);
    @Query(value = "{'expiresAt': {$lt: ?0}}", delete = true)
    void deleteExpiredSessions(LocalDateTime now);
    
    @Query("{'lastActivity': {$lt: ?0}}")
    List<UserSession> findInactiveSessions(LocalDateTime threshold);
    
    @Query("{'expiresAt': {$lt: ?0}}")
    List<UserSession> findExpiredSessions(LocalDateTime now);
}
