package com.devgo2003.docgo.backend.user_service.repository;

import com.devgo2003.docgo.backend.user_service.entity.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends MongoRepository<Role, String> {
    Optional<Role> findByName(String name);
    List<Role> findByIsActive(Boolean isActive);
    List<Role> findByIsSystem(Boolean isSystem);
    List<Role> findByParentRoleId(String parentRoleId);
    List<Role> findByLevel(Integer level);
    @Query("{'$or': [{'name': {$regex: ?0, $options: 'i'}}, {'displayName': {$regex: ?0, $options: 'i'}}, {'description': {$regex: ?0, $options: 'i'}}]}")
    List<Role> findBySearchTerm(String searchTerm);
    List<Role> findByPermissionIdsContaining(String permissionId);
    @Query("{'isActive': true, 'level': {$gte: ?0}}")
    List<Role> findActiveRolesWithLevelGreaterThanOrEqual(Integer level);
    boolean existsByName(String name);
}




