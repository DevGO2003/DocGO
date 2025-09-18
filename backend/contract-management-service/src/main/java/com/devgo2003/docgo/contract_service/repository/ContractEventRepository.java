package com.devgo2003.docgo.contract_service.repository;

import com.devgo2003.docgo.contract_service.entity.ContractEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractEventRepository extends MongoRepository<ContractEvent, String> {
    List<ContractEvent> findByContractIdOrderByTimestampDesc(String contractId);
    
    Page<ContractEvent> findByContractIdOrderByTimestampDesc(String contractId, Pageable pageable);
    
    List<ContractEvent> findByEventTypeOrderByTimestampDesc(String eventType);
}