package com.devgo2003.docgo.contract_service.repository;

import com.devgo2003.docgo.contract_service.entity.ContractFavorableClause;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractFavorableClauseRepository extends MongoRepository<ContractFavorableClause, String> {
    List<ContractFavorableClause> findByContractId(String contractId);
}
