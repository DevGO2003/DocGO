package com.devgo2003.docgo.contract_service.repository;

import com.devgo2003.docgo.contract_service.entity.Contract;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends MongoRepository<Contract, String> {
    List<Contract> findByIsDeletedFalse();

    Page<Contract> findByIsDeletedFalse(Pageable pageable);

    List<Contract> findByStatusAndIsDeletedFalse(Contract.ContractStatus status);
    
    Optional<Contract> findBySystemId(String systemId);
    
    // Validation methods
    boolean existsByContractNumber(String contractNumber);
    
    boolean existsByContractNumberAndIdNot(String contractNumber, String id);
}
