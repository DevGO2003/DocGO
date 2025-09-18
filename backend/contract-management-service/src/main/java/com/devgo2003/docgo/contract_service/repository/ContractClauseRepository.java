package com.devgo2003.docgo.contract_service.repository;

import com.devgo2003.docgo.contract_service.entity.ContractClause;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ContractClauseRepository extends MongoRepository<ContractClause, String> {
    List<ContractClause> findByContractId(String contractId);
}
