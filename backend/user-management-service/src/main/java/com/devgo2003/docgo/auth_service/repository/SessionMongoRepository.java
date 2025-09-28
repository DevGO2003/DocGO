package com.devgo2003.docgo.auth_service.repository;

import com.devgo2003.docgo.auth_service.entity.SessionMongo;
import com.devgo2003.docgo.auth_service.entity.SessionStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionMongoRepository extends MongoRepository<SessionMongo, String> {
    
    Optional<SessionMongo> findBySessionToken(String sessionToken);
    
    Optional<SessionMongo> findByRefreshToken(String refreshToken);
    
    List<SessionMongo> findByUserId(String userId);
    
    List<SessionMongo> findByStatus(SessionStatus status);
    
    List<SessionMongo> findByUserIdAndStatus(String userId, SessionStatus status);
    
    @Query("{'expiresAt': {'$lt': ?0}}")
    List<SessionMongo> findExpiredSessions(LocalDateTime now);
    
    @Query("{'lastActivity': {'$lt': ?0}}")
    List<SessionMongo> findInactiveSessions(LocalDateTime threshold);
    
    @Query("{'$and': [{'userId': ?0}, {'status': ?1}, {'expiresAt': {'$gt': ?2}}]}")
    List<SessionMongo> findActiveSessionsForUser(String userId, SessionStatus status, LocalDateTime now);
    
    @Query("{'ipAddress': ?0, 'status': ?1}")
    List<SessionMongo> findByIpAddressAndStatus(String ipAddress, SessionStatus status);
    
    @Query("{'deviceInfo': {'$regex': ?0, '$options': 'i'}, 'status': ?1}")
    List<SessionMongo> findByDeviceInfoAndStatus(String deviceInfo, SessionStatus status);
    
    @Query("{'userId': ?0, 'status': ?1}")
    void deleteByUserIdAndStatus(String userId, SessionStatus status);
    
    @Query("{'expiresAt': {'$lt': ?0}}")
    void deleteExpiredSessions(LocalDateTime now);
}
