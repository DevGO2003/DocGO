package com.devgo2003.docgo.contract_service.repository;

import com.devgo2003.docgo.contract_service.entity.ContractRiskAssessment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ContractRiskAssessmentRepository extends MongoRepository<ContractRiskAssessment, String> {
    List<ContractRiskAssessment> findByContractId(String contractId);
}
