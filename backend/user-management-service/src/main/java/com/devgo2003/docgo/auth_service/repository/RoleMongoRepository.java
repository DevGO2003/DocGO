package com.devgo2003.docgo.auth_service.repository;

import com.devgo2003.docgo.auth_service.entity.RoleMongo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleMongoRepository extends MongoRepository<RoleMongo, String> {
    
    Optional<RoleMongo> findByName(String name);
    
    List<RoleMongo> findByIsActive(Boolean isActive);
    
    List<RoleMongo> findByIsSystem(Boolean isSystem);
    
    List<RoleMongo> findByParentRoleId(String parentRoleId);
    
    List<RoleMongo> findByLevel(Integer level);
    
    @Query("{'$or': [{'name': {'$regex': ?0, '$options': 'i'}}, {'displayName': {'$regex': ?0, '$options': 'i'}}, {'description': {'$regex': ?0, '$options': 'i'}}]}")
    List<RoleMongo> findBySearchTerm(String searchTerm);
    
    @Query("{'permissions': {'$in': [?0]}}")
    List<RoleMongo> findByPermissionIdsContaining(String permissionId);
    
    @Query("{'$and': [{'isActive': true}, {'level': {'$gte': ?0}}]}")
    List<RoleMongo> findActiveRolesWithLevelGreaterThanOrEqual(Integer level);
    
    boolean existsByName(String name);
}
