package com.devgo2003.docgo.contract_service.repository;

import com.devgo2003.docgo.contract_service.entity.ContractUnfavorableClause;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractUnfavorableClauseRepository extends MongoRepository<ContractUnfavorableClause, String> {
    List<ContractUnfavorableClause> findByContractId(String contractId);
}
