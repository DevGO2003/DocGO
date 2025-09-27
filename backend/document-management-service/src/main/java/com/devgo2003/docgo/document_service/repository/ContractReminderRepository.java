package com.devgo2003.docgo.document_service.repository;

import com.devgo2003.docgo.document_service.entity.ContractReminder;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ContractReminderRepository extends MongoRepository<ContractReminder, String> {
    List<ContractReminder> findByContractId(String contractId);
}

