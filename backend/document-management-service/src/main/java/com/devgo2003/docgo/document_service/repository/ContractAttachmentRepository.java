package com.devgo2003.docgo.document_service.repository;

import com.devgo2003.docgo.document_service.entity.ContractAttachment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractAttachmentRepository extends MongoRepository<ContractAttachment, String> {
    List<ContractAttachment> findByContractId(String contractId);
}
