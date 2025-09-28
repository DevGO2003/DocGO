package com.devgo2003.docgo.auth_service.repository;

import com.devgo2003.docgo.auth_service.entity.PermissionMongo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionMongoRepository extends MongoRepository<PermissionMongo, String> {
    
    Optional<PermissionMongo> findByName(String name);
    
    List<PermissionMongo> findByIsActive(Boolean isActive);
    
    List<PermissionMongo> findByIsSystem(Boolean isSystem);
    
    List<PermissionMongo> findByModule(String module);
    
    List<PermissionMongo> findByResource(String resource);
    
    List<PermissionMongo> findByAction(String action);
    
    @Query("{'$or': [{'name': {'$regex': ?0, '$options': 'i'}}, {'displayName': {'$regex': ?0, '$options': 'i'}}, {'description': {'$regex': ?0, '$options': 'i'}}]}")
    List<PermissionMongo> findBySearchTerm(String searchTerm);
    
    @Query("{'$and': [{'resource': ?0}, {'action': ?1}]}")
    Optional<PermissionMongo> findByResourceAndAction(String resource, String action);
    
    @Query("{'module': ?0, 'isActive': true}")
    List<PermissionMongo> findActivePermissionsByModule(String module);
    
    boolean existsByName(String name);
    
    boolean existsByResourceAndAction(String resource, String action);
}
