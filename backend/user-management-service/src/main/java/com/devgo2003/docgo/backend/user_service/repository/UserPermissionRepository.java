package com.devgo2003.docgo.backend.user_service.repository;

import com.devgo2003.docgo.backend.user_service.entity.Permission;
import com.devgo2003.docgo.backend.user_service.entity.UserPermission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPermissionRepository extends MongoRepository<UserPermission, String> {
    
    List<UserPermission> findByUserId(String userId);
    
    Optional<UserPermission> findByUserIdAndPermissionName(String userId, Permission permissionName);
    
    boolean existsByUserIdAndPermissionName(String userId, Permission permissionName);
}