package com.devgo2003.docgo.auth_service.repository;

import com.devgo2003.docgo.auth_service.entity.UserMongo;
import com.devgo2003.docgo.auth_service.entity.UserStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserMongoRepository extends MongoRepository<UserMongo, String> {
    
    Optional<UserMongo> findByUsername(String username);
    
    Optional<UserMongo> findByEmail(String email);
    
    Optional<UserMongo> findByUsernameOrEmail(String username, String email);
    
    List<UserMongo> findByStatus(UserStatus status);
    
    List<UserMongo> findByRoleIdsContaining(String roleId);
    
    List<UserMongo> findByGroupsContaining(String group);
    
    @Query("{'$or': [{'firstName': {'$regex': ?0, '$options': 'i'}}, {'lastName': {'$regex': ?0, '$options': 'i'}}, {'email': {'$regex': ?0, '$options': 'i'}}]}")
    List<UserMongo> findBySearchTerm(String searchTerm);
    
    @Query("{'lastLogin': {'$gte': ?0, '$lte': ?1}}")
    List<UserMongo> findByLastLoginBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'createdAt': {'$gte': ?0, '$lte': ?1}}")
    List<UserMongo> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'emailVerified': ?0}")
    List<UserMongo> findByEmailVerified(Boolean emailVerified);
    
    @Query("{'twoFactorEnabled': ?0}")
    List<UserMongo> findByTwoFactorEnabled(Boolean twoFactorEnabled);
    
    @Query("{'lockedUntil': {'$gt': ?0}}")
    List<UserMongo> findLockedUsers(LocalDateTime now);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
}
