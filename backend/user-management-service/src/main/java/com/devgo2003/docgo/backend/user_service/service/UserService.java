package com.devgo2003.docgo.backend.user_service.service;

import com.devgo2003.docgo.backend.user_service.entity.User;
import com.devgo2003.docgo.backend.user_service.repository.UserRepository;
import com.devgo2003.docgo.backend.user_service.dto.UserSearchRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    private final MongoTemplate mongoTemplate;
    
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
    
    /**
     * Tìm kiếm người dùng với dynamic query (MongoDB)
     * Hỗ trợ các filter: view, searchTerm, status, roleId, organizationId, username
     */
    public Page<User> searchUsers(UserSearchRequest request) {
        log.info("Searching users with request: {}", request);
        request.normalize();

        List<Criteria> criteriaList = new ArrayList<>();

        // Search term - tìm kiếm trong username, email, firstName, lastName
        if (request.getSearchTerm() != null && !request.getSearchTerm().trim().isEmpty()) {
            String pattern = ".*" + java.util.regex.Pattern.quote(request.getSearchTerm().trim()) + ".*";
            Criteria orCriteria = new Criteria().orOperator(
                Criteria.where("username").regex(pattern, "i"),
                Criteria.where("email").regex(pattern, "i"),
                Criteria.where("firstName").regex(pattern, "i"),
                Criteria.where("lastName").regex(pattern, "i")
            );
            criteriaList.add(orCriteria);
        }

        // Status filter
        if (request.getStatus() != null) {
            criteriaList.add(Criteria.where("status").is(request.getStatus()));
        }

        // Role ID filter (mảng roleIds chứa roleId)
        if (request.getRoleId() != null && !request.getRoleId().trim().isEmpty()) {
            criteriaList.add(Criteria.where("roleIds").is(request.getRoleId()));
        }

        // Organization ID filter
        if (request.getOrganizationId() != null && !request.getOrganizationId().trim().isEmpty()) {
            criteriaList.add(Criteria.where("organizationId").is(request.getOrganizationId()));
        }

        // Username exact match
        if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            criteriaList.add(Criteria.where("username").is(request.getUsername()));
        }

        Query query = new Query();
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        // Sorting & Pagination
        Sort.Direction direction = Sort.Direction.fromString(request.getSortDirection());
        String sortBy = request.getSortBy();
        if ("fullName".equalsIgnoreCase(sortBy)) {
            sortBy = "firstName"; // fallback đơn giản
        }
        Pageable pageable = PageRequest.of(request.getPageNumber(), request.getPageSize(), Sort.by(direction, sortBy));
        query.with(pageable);

        List<User> users = mongoTemplate.find(query, User.class);
        users = applyViewFilter(users, request.getView());

        // Count total
        Query countQuery = Query.of(query).limit(-1).skip(-1);
        long total = mongoTemplate.count(countQuery, User.class);

        return PageableExecutionUtils.getPage(users, pageable, () -> total);
    }
    
    /**
     * Áp dụng view filter dựa trên loại view
     */
    private List<User> applyViewFilter(List<User> users, String viewType) {
        if (users == null || users.isEmpty()) {
            return users;
        }
        
        switch (viewType.toLowerCase()) {
            case "summary":
                return users.stream()
                    .map(this::createSummaryView)
                    .collect(java.util.stream.Collectors.toList());
            case "minimal":
                return users.stream()
                    .map(this::createMinimalView)
                    .collect(java.util.stream.Collectors.toList());
            case "full":
            default:
                return users; // Return full data
        }
    }
    
    /**
     * Tạo summary view của User (chỉ các trường quan trọng)
     */
    private User createSummaryView(User user) {
        User summaryUser = new User();
        summaryUser.setId(user.getId());
        summaryUser.setUsername(user.getUsername());
        summaryUser.setEmail(user.getEmail());
        summaryUser.setFirstName(user.getFirstName());
        summaryUser.setLastName(user.getLastName());
        summaryUser.setStatus(user.getStatus());
        summaryUser.setRoleIds(user.getRoleIds());
        summaryUser.setOrganizationId(user.getOrganizationId());
        summaryUser.setCreatedAt(user.getCreatedAt());
        summaryUser.setUpdatedAt(user.getUpdatedAt());
        return summaryUser;
    }
    
    /**
     * Tạo minimal view của User (chỉ các trường cơ bản)
     */
    private User createMinimalView(User user) {
        User minimalUser = new User();
        minimalUser.setId(user.getId());
        minimalUser.setUsername(user.getUsername());
        minimalUser.setEmail(user.getEmail());
        minimalUser.setFirstName(user.getFirstName());
        minimalUser.setLastName(user.getLastName());
        minimalUser.setStatus(user.getStatus());
        return minimalUser;
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
