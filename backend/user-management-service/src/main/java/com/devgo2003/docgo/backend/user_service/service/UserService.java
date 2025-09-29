package com.devgo2003.docgo.backend.user_service.service;

import com.devgo2003.docgo.backend.user_service.entity.User;
import com.devgo2003.docgo.backend.user_service.repository.UserRepository;
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
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public User createUser(User user) {
        log.info("Creating new user: {}", user.getUsername());
        
        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Set default values
        user.setStatus(User.UserStatus.ACTIVE);
        user.setEmailVerified(false);
        user.setTwoFactorEnabled(false);
        user.setLoginAttempts(0);
        
        return userRepository.save(user);
    }
    
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> getUserByUsernameOrEmail(String usernameOrEmail) {
        return userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);
    }
    
    public Page<User> getAllUsers(int pageNumber, int pageSize, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        return userRepository.findAll(pageable);
    }
    
    public List<User> searchUsers(String searchTerm) {
        return userRepository.findBySearchTerm(searchTerm);
    }
    
    public List<User> getUsersByStatus(User.UserStatus status) {
        return userRepository.findByStatus(status);
    }
    
    public List<User> getUsersByRole(String roleId) {
        return userRepository.findByRoleIdsContaining(roleId);
    }
    
    public List<User> getUsersByGroup(String group) {
        return userRepository.findByGroupsContaining(group);
    }
    
    public User updateUser(String id, User userDetails) {
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
                    user.setUpdatedBy(userDetails.getUpdatedBy());
                    
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public User updateUserStatus(String id, User.UserStatus status) {
        log.info("Updating user status: {} to {}", id, status);
        
        return userRepository.findById(id)
                .map(user -> {
                    user.setStatus(status);
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public User assignRoles(String id, Set<String> roleIds) {
        log.info("Assigning roles to user: {}", id);
        
        return userRepository.findById(id)
                .map(user -> {
                    user.setRoleIds(roleIds);
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public User assignPermissions(String id, Set<String> permissionIds) {
        log.info("Assigning permissions to user: {}", id);
        
        return userRepository.findById(id)
                .map(user -> {
                    user.setPermissionIds(permissionIds);
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public User updatePassword(String id, String newPassword) {
        log.info("Updating password for user: {}", id);
        
        return userRepository.findById(id)
                .map(user -> {
                    user.setPassword(passwordEncoder.encode(newPassword));
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public User updateLastLogin(String id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setLastLogin(LocalDateTime.now());
                    user.setLoginAttempts(0);
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public User incrementLoginAttempts(String id) {
        return userRepository.findById(id)
                .map(user -> {
                    int attempts = user.getLoginAttempts() != null ? user.getLoginAttempts() + 1 : 1;
                    user.setLoginAttempts(attempts);
                    
                    // Lock account after 5 failed attempts for 30 minutes
                    if (attempts >= 5) {
                        user.setLockedUntil(LocalDateTime.now().plusMinutes(30));
                    }
                    
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public User enableTwoFactor(String id, String secret) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setTwoFactorEnabled(true);
                    user.setTwoFactorSecret(secret);
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public User disableTwoFactor(String id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setTwoFactorEnabled(false);
                    user.setTwoFactorSecret(null);
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
    
    public List<User> getLockedUsers() {
        return userRepository.findLockedUsers(LocalDateTime.now());
    }
    
    public List<User> getUsersByLastLoginBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return userRepository.findByLastLoginBetween(startDate, endDate);
    }
}
