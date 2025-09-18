package com.devgo2003.docgo.contract_service.repository;

import com.devgo2003.docgo.contract_service.entity.ContractSummary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContractSummaryRepository extends MongoRepository<ContractSummary, String> {
    Optional<ContractSummary> findByContractId(String contractId);
}
