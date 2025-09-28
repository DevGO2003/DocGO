package com.devgo2003.docgo.auth_service.service;

import com.devgo2003.docgo.auth_service.entity.RoleMongo;
import com.devgo2003.docgo.auth_service.repository.RoleMongoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoleService {
    
    private final RoleMongoRepository roleRepository;
    
    public RoleMongo createRole(RoleMongo role) {
        log.info("Creating new role: {}", role.getName());
        
        // Set default values
        role.setIsActive(true);
        role.setIsSystem(false);
        role.setCreatedAt(LocalDateTime.now());
        role.setUpdatedAt(LocalDateTime.now());
        
        return roleRepository.save(role);
    }
    
    public Optional<RoleMongo> getRoleById(String id) {
        return roleRepository.findById(id);
    }
    
    public Optional<RoleMongo> getRoleByName(String name) {
        return roleRepository.findByName(name);
    }
    
    public Page<RoleMongo> getAllRoles(int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return roleRepository.findAll(pageable);
    }
    
    public List<RoleMongo> getActiveRoles() {
        return roleRepository.findByIsActive(true);
    }
    
    public List<RoleMongo> getSystemRoles() {
        return roleRepository.findByIsSystem(true);
    }
    
    public List<RoleMongo> getRolesByParent(String parentRoleId) {
        return roleRepository.findByParentRoleId(parentRoleId);
    }
    
    public List<RoleMongo> getRolesByLevel(Integer level) {
        return roleRepository.findByLevel(level);
    }
    
    public List<RoleMongo> searchRoles(String searchTerm) {
        return roleRepository.findBySearchTerm(searchTerm);
    }
    
    public List<RoleMongo> getRolesByPermission(String permissionId) {
        return roleRepository.findByPermissionIdsContaining(permissionId);
    }
    
    public List<RoleMongo> getActiveRolesWithLevelGreaterThanOrEqual(Integer level) {
        return roleRepository.findActiveRolesWithLevelGreaterThanOrEqual(level);
    }
    
    public RoleMongo updateRole(String id, RoleMongo roleDetails) {
        log.info("Updating role: {}", id);
        
        return roleRepository.findById(id)
                .map(role -> {
                    role.setDisplayName(roleDetails.getDisplayName());
                    role.setDescription(roleDetails.getDescription());
                    role.setParentRoleId(roleDetails.getParentRoleId());
                    role.setLevel(roleDetails.getLevel());
                    role.setIsActive(roleDetails.getIsActive());
                    role.setUpdatedAt(LocalDateTime.now());
                    role.setUpdatedBy(roleDetails.getUpdatedBy());
                    
                    return roleRepository.save(role);
                })
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));
    }
    
    public RoleMongo assignPermissions(String id, Set<String> permissionIds) {
        log.info("Assigning permissions to role: {}", id);
        
        return roleRepository.findById(id)
                .map(role -> {
                    role.setPermissionIds(permissionIds);
                    role.setUpdatedAt(LocalDateTime.now());
                    return roleRepository.save(role);
                })
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));
    }
    
    public RoleMongo addPermission(String id, String permissionId) {
        log.info("Adding permission to role: {}", id);
        
        return roleRepository.findById(id)
                .map(role -> {
                    Set<String> permissions = role.getPermissionIds();
                    permissions.add(permissionId);
                    role.setPermissionIds(permissions);
                    role.setUpdatedAt(LocalDateTime.now());
                    return roleRepository.save(role);
                })
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));
    }
    
    public RoleMongo removePermission(String id, String permissionId) {
        log.info("Removing permission from role: {}", id);
        
        return roleRepository.findById(id)
                .map(role -> {
                    Set<String> permissions = role.getPermissionIds();
                    permissions.remove(permissionId);
                    role.setPermissionIds(permissions);
                    role.setUpdatedAt(LocalDateTime.now());
                    return roleRepository.save(role);
                })
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));
    }
    
    public RoleMongo updateRoleStatus(String id, Boolean isActive) {
        log.info("Updating role status: {} to {}", id, isActive);
        
        return roleRepository.findById(id)
                .map(role -> {
                    role.setIsActive(isActive);
                    role.setUpdatedAt(LocalDateTime.now());
                    return roleRepository.save(role);
                })
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));
    }
    
    public void deleteRole(String id) {
        log.info("Deleting role: {}", id);
        
        // Check if role is system role
        RoleMongo role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));
        
        if (role.getIsSystem()) {
            throw new RuntimeException("Cannot delete system role");
        }
        
        // Check if role has child roles
        List<RoleMongo> childRoles = roleRepository.findByParentRoleId(id);
        if (!childRoles.isEmpty()) {
            throw new RuntimeException("Cannot delete role with child roles");
        }
        
        roleRepository.deleteById(id);
    }
    
    public boolean existsByName(String name) {
        return roleRepository.existsByName(name);
    }
    
    public List<RoleMongo> getRoleHierarchy(String roleId) {
        // This would implement a recursive hierarchy traversal
        // For now, return the role and its direct children
        List<RoleMongo> hierarchy = roleRepository.findByParentRoleId(roleId);
        roleRepository.findById(roleId).ifPresent(hierarchy::add);
        return hierarchy;
    }
}
