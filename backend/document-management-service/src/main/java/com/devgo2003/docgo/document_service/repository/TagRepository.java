package com.devgo2003.docgo.document_service.repository;

import com.devgo2003.docgo.document_service.entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends MongoRepository<Tag, String> {
    
    List<Tag> findByIsDeletedFalse();
    
    Page<Tag> findByIsDeletedFalse(Pageable pageable);
    
    Optional<Tag> findByNameAndIsDeletedFalse(String name);
    
    List<Tag> findTop10ByIsDeletedFalseOrderByCountDesc();
    
    List<Tag> findByIsDeletedFalseOrderByNameAsc();
    
    @Query("{ $and: [ " +
           "{ 'isDeleted': false }, " +
           "{ 'name': { $regex: ?0, $options: 'i' } } " +
           "] }")
    List<Tag> findByNameContainingIgnoreCaseAndIsDeletedFalse(String searchTerm);
    
    @Query("{ $and: [ " +
           "{ 'isDeleted': false }, " +
           "{ 'name': { $regex: ?0, $options: 'i' } } " +
           "] }")
    Page<Tag> findByNameContainingIgnoreCaseAndIsDeletedFalse(String searchTerm, Pageable pageable);
    
    List<Tag> findTop5ByIsDeletedFalseOrderByLastUsedAtDesc();
    
    List<Tag> findTop5ByIsDeletedFalseOrderByCreatedAtDesc();
    
    boolean existsByNameAndIsDeletedFalse(String name);
    
    boolean existsByNameAndIsDeletedFalseAndIdNot(String name, String id);
}
