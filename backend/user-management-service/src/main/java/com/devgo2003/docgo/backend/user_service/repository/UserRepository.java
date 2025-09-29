package com.devgo2003.docgo.backend.user_service.repository;

import com.devgo2003.docgo.backend.user_service.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    
    // Additional methods for full functionality
    @Query("{'$or': [{'username': ?0}, {'email': ?1}]}")
    Optional<User> findByUsernameOrEmail(String username, String email);
    
    @Query("{'$or': [{'username': {$regex: ?0, $options: 'i'}}, {'email': {$regex: ?0, $options: 'i'}}, {'firstName': {$regex: ?0, $options: 'i'}}, {'lastName': {$regex: ?0, $options: 'i'}}]}")
    List<User> findBySearchTerm(String searchTerm);
    
    List<User> findByStatus(User.UserStatus status);
    List<User> findByRoleIdsContaining(String roleId);
    List<User> findByGroupsContaining(String group);
    
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    @Query("{'lockedUntil': {$lte: ?0}}")
    List<User> findLockedUsers(LocalDateTime now);
    
    @Query("{'lastLogin': {$gte: ?0, $lte: ?1}}")
    List<User> findByLastLoginBetween(LocalDateTime start, LocalDateTime end);
}