package com.devgo2003.docgo.contract_service.repository;

import com.devgo2003.docgo.contract_service.entity.ContractKeyTerm;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractKeyTermRepository extends MongoRepository<ContractKeyTerm, String> {
    List<ContractKeyTerm> findByContractId(String contractId);
}
