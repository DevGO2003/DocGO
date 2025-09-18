package com.devgo2003.docgo.contract_service.repository;

import com.devgo2003.docgo.contract_service.entity.ContractParty;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractPartyRepository extends MongoRepository<ContractParty, String> {
    List<ContractParty> findByContractId(String contractId);
    void deleteByContractId(String contractId);
}
