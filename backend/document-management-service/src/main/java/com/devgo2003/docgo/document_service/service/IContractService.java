package com.devgo2003.docgo.document_service.service;

import com.devgo2003.docgo.document_service.entity.Contract;
import com.devgo2003.docgo.document_service.entity.ContractAttachment;
import com.devgo2003.docgo.document_service.entity.ContractEvent;
import com.devgo2003.docgo.document_service.dto.ContractWithSummaryDto;
import com.devgo2003.docgo.document_service.dto.ContractDetailDto;
import com.devgo2003.docgo.document_service.dto.ContractDetailResponseDto;
import com.devgo2003.docgo.document_service.dto.ContractResponseDto;
import com.devgo2003.docgo.document_service.dto.ContractSummaryDto;
import com.devgo2003.docgo.document_service.dto.BulkDeleteResponse;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;

public interface IContractService {
    
    // CRUD operations
    Contract createContract(Contract contract);
    Contract updateContract(String id, Contract contract);
    void softDeleteContract(String id);
    BulkDeleteResponse bulkSoftDeleteContracts(List<String> ids);
    void restoreContract(String id);
    
    // Get operations
    ContractDetailResponseDto getContractWithDetailFormat(String id);
    ContractWithSummaryDto getContractWithSummary(String id);
    ContractDetailDto getContractWithDetails(String id);
    
    // New API response format
    ContractResponseDto getContractWithNewFormat(String id);
    Page<ContractResponseDto> getAllContractsWithNewFormat(int pageNumber, int pageSize, List<String> sortBy, List<String> sortDirection, String searchTerm, boolean includeDeleted);
    
    // Get all operations with pagination
    Page<ContractDetailResponseDto> getAllContractsWithDetailFormat(int pageNumber, int pageSize, List<String> sortBy, List<String> sortDirection, String searchTerm, boolean includeDeleted);
    Page<ContractWithSummaryDto> getAllContractsWithSummary(int pageNumber, int pageSize, List<String> sortBy, List<String> sortDirection, String searchTerm, boolean includeDeleted);
    Page<ContractDetailDto> getAllContractsWithDetails(int pageNumber, int pageSize, List<String> sortBy, List<String> sortDirection, String searchTerm, boolean includeDeleted);
    
    // Related entities
    List<ContractEvent> getContractEvents(String id);
    List<ContractAttachment> getAttachments(String id);
    
    // Business logic
    boolean existsByContractNumber(String contractNumber);
    boolean existsBySystemId(String systemId);
    
    // AI Processing methods
    void createOrUpdateContractSummary(String contractId, String fileId, String filename, String summary, 
                                      Integer summaryLength, List<String> keyPoints, String extractionMethod, 
                                      BigDecimal confidence, String classification, BigDecimal classificationConfidence, 
                                      List<String> categories);
    
    void createOrUpdateContractFile(String contractId, String fileId, String filename, String fileType, 
                                   String fileKey, String bucket, String summary, Integer summaryLength, 
                                   List<String> keyPoints, String extractionMethod, BigDecimal confidence, 
                                   String classification, BigDecimal classificationConfidence, List<String> categories);
    
    void createOrUpdateContractParty(String contractId, String partyName, String partyRole, 
                                    String representative, String taxCode, String contact);
    
    void createOrUpdateContractClause(String contractId, String clauseName, String description, 
                                     String source, String clauseType);
    
    void createOrUpdateContractPayment(String contractId, String totalValue, String schedule, String currency);
    
    void updateContractDetails(String contractId, String object, String effectiveDate, String term, String terminationConditions);

    void createOrUpdateContractReminder(String contractId, String type, String date, String content);

    void createOrUpdateContractRiskAssessment(String contractId, String riskLevel, List<String> riskFactors, List<String> mitigationMeasures);

    void createOrUpdateContractComplianceStatus(String contractId, String status, List<String> issues, List<String> recommendations);

    void createOrUpdateContractFromSummary(java.util.Map<String, Object> summaryData);
}
