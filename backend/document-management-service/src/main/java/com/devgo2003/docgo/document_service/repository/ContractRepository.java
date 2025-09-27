package com.devgo2003.docgo.document_service.repository;

import com.devgo2003.docgo.document_service.entity.Contract;
import com.devgo2003.docgo.document_service.enums.ContractStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends MongoRepository<Contract, String> {
    List<Contract> findByIsDeletedFalse();

    Page<Contract> findByIsDeletedFalse(Pageable pageable);

    List<Contract> findByStatusAndIsDeletedFalse(ContractStatus status);
    
    Optional<Contract> findBySystemId(String systemId);
    
    // Search methods
    @Query("{ $or: [ " +
           "{ 'title': { $regex: ?0, $options: 'i' } }, " +
           "{ 'summary': { $regex: ?0, $options: 'i' } }, " +
           "{ 'contractNumber': { $regex: ?0, $options: 'i' } }, " +
           "{ 'partiesJson': { $regex: ?0, $options: 'i' } }, " +
           "{ 'keyTerms': { $regex: ?0, $options: 'i' } } " +
           "] }")
    Page<Contract> findBySearchTerm(String searchTerm, Pageable pageable);
    
    @Query("{ $and: [ " +
           "{ 'isDeleted': false }, " +
           "{ $or: [ " +
           "{ 'title': { $regex: ?0, $options: 'i' } }, " +
           "{ 'summary': { $regex: ?0, $options: 'i' } }, " +
           "{ 'contractNumber': { $regex: ?0, $options: 'i' } }, " +
           "{ 'partiesJson': { $regex: ?0, $options: 'i' } }, " +
           "{ 'keyTerms': { $regex: ?0, $options: 'i' } } " +
           "] } " +
           "] }")
    Page<Contract> findBySearchTermAndIsDeletedFalse(String searchTerm, Pageable pageable);
    
    // Migration methods
    List<Contract> findByOrganizationIdIsNull();
    
    // Validation methods
    boolean existsByContractNumber(String contractNumber);
    
    boolean existsByContractNumberAndIdNot(String contractNumber, String id);
}
