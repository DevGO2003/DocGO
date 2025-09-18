package com.devgo2003.docgo.contract_service.repository;

import com.devgo2003.docgo.contract_service.entity.ContractComplianceStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ContractComplianceStatusRepository extends MongoRepository<ContractComplianceStatus, String> {
    List<ContractComplianceStatus> findByContractId(String contractId);
}
