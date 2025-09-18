package com.devgo2003.docgo.auth_service.repository;

import com.devgo2003.docgo.auth_service.entity.Permission;
import com.devgo2003.docgo.auth_service.entity.UserPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPermissionRepository extends JpaRepository<UserPermission, Long> {
    
    List<UserPermission> findByUserId(Long userId);
    
    Optional<UserPermission> findByUserIdAndPermissionName(Long userId, Permission permissionName);
    
    boolean existsByUserIdAndPermissionName(Long userId, Permission permissionName);
}
