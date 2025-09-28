package com.devgo2003.docgo.auth_service.service;

import com.devgo2003.docgo.auth_service.entity.UserMongo;
import com.devgo2003.docgo.auth_service.entity.UserStatus;
import com.devgo2003.docgo.auth_service.repository.UserMongoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserMongoRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserMongo createUser(UserMongo user) {
        log.info("Creating new user: {}", user.getUsername());
        
        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Set default values
        user.setStatus(UserStatus.ACTIVE);
        user.setEmailVerified(false);
        user.setTwoFactorEnabled(false);
        user.setLoginAttempts(0);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }
    
    public Optional<UserMongo> getUserById(String id) {
        return userRepository.findById(id);
    }
    
    public Optional<UserMongo> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<UserMongo> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<UserMongo> getUserByUsernameOrEmail(String usernameOrEmail) {
        return userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);
    }
    
    public Page<UserMongo> getAllUsers(int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return userRepository.findAll(pageable);
    }
    
    public List<UserMongo> searchUsers(String searchTerm) {
        return userRepository.findBySearchTerm(searchTerm);
    }
    
    public List<UserMongo> getUsersByStatus(UserStatus status) {
        return userRepository.findByStatus(status);
    }
    
    public List<UserMongo> getUsersByRole(String roleId) {
        return userRepository.findByRoleIdsContaining(roleId);
    }
    
    public List<UserMongo> getUsersByGroup(String group) {
        return userRepository.findByGroupsContaining(group);
    }
    
    public UserMongo updateUser(String id, UserMongo userDetails) {
        log.info("Updating user: {}", id);
        
        return userRepository.findById(id)
                .map(user -> {
                    user.setFirstName(userDetails.getFirstName());
                    user.setLastName(userDetails.getLastName());
                    user.setEmail(userDetails.getEmail());
                    user.setPhone(userDetails.getPhone());
                    user.setAvatarUrl(userDetails.getAvatarUrl());
                    user.setStatus(userDetails.getStatus());
                    user.setGroups(userDetails.getGroups());
                    user.setUpdatedAt(LocalDateTime.now());
                    user.setUpdatedBy(userDetails.getUpdatedBy());
                    
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public UserMongo updateUserStatus(String id, UserStatus status) {
        log.info("Updating user status: {} to {}", id, status);
        
        return userRepository.findById(id)
                .map(user -> {
                    user.setStatus(status);
                    user.setUpdatedAt(LocalDateTime.now());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public UserMongo assignRoles(String id, Set<String> roleIds) {
        log.info("Assigning roles to user: {}", id);
        
        return userRepository.findById(id)
                .map(user -> {
                    user.setRoleIds(roleIds);
                    user.setUpdatedAt(LocalDateTime.now());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public UserMongo assignPermissions(String id, Set<String> permissionIds) {
        log.info("Assigning permissions to user: {}", id);
        
        return userRepository.findById(id)
                .map(user -> {
                    user.setPermissionIds(permissionIds);
                    user.setUpdatedAt(LocalDateTime.now());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public UserMongo updatePassword(String id, String newPassword) {
        log.info("Updating password for user: {}", id);
        
        return userRepository.findById(id)
                .map(user -> {
                    user.setPassword(passwordEncoder.encode(newPassword));
                    user.setUpdatedAt(LocalDateTime.now());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public UserMongo updateLastLogin(String id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setLastLogin(LocalDateTime.now());
                    user.setLoginAttempts(0);
                    user.setUpdatedAt(LocalDateTime.now());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public UserMongo incrementLoginAttempts(String id) {
        return userRepository.findById(id)
                .map(user -> {
                    int attempts = user.getLoginAttempts() != null ? user.getLoginAttempts() + 1 : 1;
                    user.setLoginAttempts(attempts);
                    
                    // Lock account after 5 failed attempts for 30 minutes
                    if (attempts >= 5) {
                        user.setLockedUntil(LocalDateTime.now().plusMinutes(30));
                    }
                    
                    user.setUpdatedAt(LocalDateTime.now());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public UserMongo enableTwoFactor(String id, String secret) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setTwoFactorEnabled(true);
                    user.setTwoFactorSecret(secret);
                    user.setUpdatedAt(LocalDateTime.now());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public UserMongo disableTwoFactor(String id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setTwoFactorEnabled(false);
                    user.setTwoFactorSecret(null);
                    user.setUpdatedAt(LocalDateTime.now());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public void deleteUser(String id) {
        log.info("Deleting user: {}", id);
        userRepository.deleteById(id);
    }
    
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public List<UserMongo> getLockedUsers() {
        return userRepository.findLockedUsers(LocalDateTime.now());
    }
    
    public List<UserMongo> getUsersByLastLoginBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return userRepository.findByLastLoginBetween(startDate, endDate);
    }
}
