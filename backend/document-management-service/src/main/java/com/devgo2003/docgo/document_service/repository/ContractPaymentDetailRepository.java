package com.devgo2003.docgo.document_service.repository;

import com.devgo2003.docgo.document_service.entity.ContractPaymentDetail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractPaymentDetailRepository extends MongoRepository<ContractPaymentDetail, String> {
    List<ContractPaymentDetail> findByContractId(String contractId);
}
