package com.devgo2003.docgo.auth_service.service;

import com.devgo2003.docgo.auth_service.entity.Permission;
import com.devgo2003.docgo.auth_service.entity.UserPermission;
import com.devgo2003.docgo.auth_service.repository.UserPermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

// @Service
public class PermissionService {

    private final UserPermissionRepository userPermissionRepository;

    @Autowired
    public PermissionService(UserPermissionRepository userPermissionRepository) {
        this.userPermissionRepository = userPermissionRepository;
    }

    @Transactional(readOnly = true)
    public Set<Permission> getUserPermissions(Long userId) {
        return userPermissionRepository.findByUserId(userId).stream()
                .filter(UserPermission::getIsEnabled)
                .map(UserPermission::getPermissionName)
                .collect(Collectors.toSet());
    }

    @Transactional
    public void updatePermissionsForUser(Long userId, Set<Permission> newPermissions) {
        // Delete existing permissions not in newPermissions
        userPermissionRepository.findByUserId(userId).stream()
                .filter(p -> !newPermissions.contains(p.getPermissionName()))
                .forEach(userPermissionRepository::delete);

        // Add new permissions
        newPermissions.forEach(permission -> {
            if (!userPermissionRepository.existsByUserIdAndPermissionName(userId, permission)) {
                userPermissionRepository.save(UserPermission.builder()
                        .userId(userId)
                        .permissionName(permission)
                        .isEnabled(true)
                        .build());
            }
        });
    }

    @Transactional(readOnly = true)
    public boolean hasPermission(Long userId, Permission permission) {
        return userPermissionRepository.findByUserIdAndPermissionName(userId, permission)
                .map(UserPermission::getIsEnabled)
                .orElse(false);
    }
}
