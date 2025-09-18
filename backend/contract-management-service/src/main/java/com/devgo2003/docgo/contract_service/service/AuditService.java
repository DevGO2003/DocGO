package com.devgo2003.docgo.contract_service.service;

import com.devgo2003.docgo.contract_service.entity.AuditLog;
import com.devgo2003.docgo.contract_service.entity.Contract;
import com.devgo2003.docgo.contract_service.dto.AuditLogCreateRequest;
import com.devgo2003.docgo.contract_service.repository.AuditLogRepository;
import com.devgo2003.docgo.contract_service.repository.ContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private ContractRepository contractRepository;

    public AuditLog createAuditLog(String eventType, AuditLog.EventCategory eventCategory, String action, 
                                 String description, String userId, String userName) {
        AuditLog auditLog = new AuditLog(eventType, eventCategory, action, description, userId, userName);
        auditLog.initializeNewEntity();
        
        return auditLogRepository.save(auditLog);
    }

    public AuditLog createAuditLogForContract(String contractId, String eventType, AuditLog.EventCategory eventCategory, 
                                            String action, String description, String userId, String userName) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        AuditLog auditLog = new AuditLog(eventType, eventCategory, action, description, userId, userName);
        auditLog.setContract(contract);
        auditLog.setContractId(contractId);
        auditLog.initializeNewEntity();
        
        return auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getAuditLogsByContractId(String contractId) {
        return auditLogRepository.findByContractIdAndIsDeletedFalse(contractId);
    }

    public Optional<AuditLog> getAuditLogById(String id) {
        return auditLogRepository.findById(id);
    }

    public List<AuditLog> getAuditLogsByEventCategory(String contractId, AuditLog.EventCategory eventCategory) {
        return auditLogRepository.findByContractIdAndEventCategoryAndIsDeletedFalse(contractId, eventCategory);
    }

    public List<AuditLog> getAuditLogsByUserId(String userId) {
        return auditLogRepository.findByUserIdAndIsDeletedFalse(userId);
    }

    public List<AuditLog> getAuditLogsByUserEmail(String userEmail) {
        return auditLogRepository.findByUserEmailAndIsDeletedFalse(userEmail);
    }

    public List<AuditLog> getAuditLogsByEventType(String eventType) {
        return auditLogRepository.findByEventTypeAndIsDeletedFalse(eventType);
    }

    public List<AuditLog> getAuditLogsByEventCategory(AuditLog.EventCategory eventCategory) {
        return auditLogRepository.findByEventCategoryAndIsDeletedFalse(eventCategory);
    }

    public List<AuditLog> getAuditLogsByAction(String action) {
        return auditLogRepository.findByActionAndIsDeletedFalse(action);
    }

    public List<AuditLog> getAuditLogsByStatus(AuditLog.AuditStatus status) {
        return auditLogRepository.findByStatusAndIsDeletedFalse(status);
    }

    public List<AuditLog> getAuditLogsBySeverity(AuditLog.SeverityLevel severity) {
        return auditLogRepository.findBySeverityAndIsDeletedFalse(severity);
    }

    public List<AuditLog> getSuccessfulLogsByContractId(String contractId) {
        return auditLogRepository.findSuccessfulLogsByContractId(contractId);
    }

    public List<AuditLog> getFailedLogsByContractId(String contractId) {
        return auditLogRepository.findFailedLogsByContractId(contractId);
    }

    public List<AuditLog> getWarningLogsByContractId(String contractId) {
        return auditLogRepository.findWarningLogsByContractId(contractId);
    }

    public List<AuditLog> getInfoLogsByContractId(String contractId) {
        return auditLogRepository.findInfoLogsByContractId(contractId);
    }

    public List<AuditLog> getHighSeverityLogsByContractId(String contractId) {
        return auditLogRepository.findHighSeverityLogsByContractId(contractId);
    }

    public List<AuditLog> getCriticalSeverityLogsByContractId(String contractId) {
        return auditLogRepository.findCriticalSeverityLogsByContractId(contractId);
    }

    public List<AuditLog> getSensitiveLogsByContractId(String contractId) {
        return auditLogRepository.findSensitiveLogsByContractId(contractId);
    }

    public List<AuditLog> getNonSensitiveLogsByContractId(String contractId) {
        return auditLogRepository.findNonSensitiveLogsByContractId(contractId);
    }

    public List<AuditLog> getComplianceRequiredLogsByContractId(String contractId) {
        return auditLogRepository.findComplianceRequiredLogsByContractId(contractId);
    }

    public List<AuditLog> getNonComplianceRequiredLogsByContractId(String contractId) {
        return auditLogRepository.findNonComplianceRequiredLogsByContractId(contractId);
    }

    public List<AuditLog> getExportedLogsByContractId(String contractId) {
        return auditLogRepository.findExportedLogsByContractId(contractId);
    }

    public List<AuditLog> getUnexportedLogsByContractId(String contractId) {
        return auditLogRepository.findUnexportedLogsByContractId(contractId);
    }

    public List<AuditLog> getAuditLogsByContractIdOrderByCreatedAt(String contractId) {
        return auditLogRepository.findByContractIdOrderByCreatedAtDesc(contractId);
    }

    public List<AuditLog> getAuditLogsByContractIdOrderBySeverity(String contractId) {
        return auditLogRepository.findByContractIdOrderBySeverityDesc(contractId);
    }

    public List<AuditLog> getAuditLogsByContractIdOrderByStatus(String contractId) {
        return auditLogRepository.findByContractIdOrderByStatusAsc(contractId);
    }

    public List<AuditLog> getAuditLogsByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByCreatedAtBetween(startDate, endDate);
    }

    public List<AuditLog> getAuditLogsByContractIdAndCreatedAtBetween(String contractId, LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByContractIdAndCreatedAtBetween(contractId, startDate, endDate);
    }

    public List<AuditLog> getAuditLogsByUserIdAndCreatedAtBetween(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByUserIdAndCreatedAtBetween(userId, startDate, endDate);
    }

    public List<AuditLog> getAuditLogsByEventCategoryAndCreatedAtBetween(AuditLog.EventCategory eventCategory, LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByEventCategoryAndCreatedAtBetween(eventCategory, startDate, endDate);
    }

    public List<AuditLog> getAuditLogsByStatusAndCreatedAtBetween(AuditLog.AuditStatus status, LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByStatusAndCreatedAtBetween(status, startDate, endDate);
    }

    public List<AuditLog> getAuditLogsBySeverityAndCreatedAtBetween(AuditLog.SeverityLevel severity, LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findBySeverityAndCreatedAtBetween(severity, startDate, endDate);
    }

    public List<AuditLog> getAuditLogsByTags(String contractId, String[] tags) {
        return auditLogRepository.findByContractIdAndTagsIn(contractId, tags);
    }

    public List<AuditLog> getAuditLogsByResourceType(String contractId, String resourceType) {
        return auditLogRepository.findByContractIdAndResourceType(contractId, resourceType);
    }

    public List<AuditLog> getAuditLogsByResourceId(String contractId, String resourceId) {
        return auditLogRepository.findByContractIdAndResourceId(contractId, resourceId);
    }

    public List<AuditLog> getAuditLogsByRequestId(String contractId, String requestId) {
        return auditLogRepository.findByContractIdAndRequestId(contractId, requestId);
    }

    public List<AuditLog> getAuditLogsByCorrelationId(String contractId, String correlationId) {
        return auditLogRepository.findByContractIdAndCorrelationId(contractId, correlationId);
    }

    public List<AuditLog> getAuditLogsBySessionId(String contractId, String sessionId) {
        return auditLogRepository.findByContractIdAndSessionId(contractId, sessionId);
    }

    public List<AuditLog> getAuditLogsByIpAddress(String contractId, String ipAddress) {
        return auditLogRepository.findByContractIdAndIpAddress(contractId, ipAddress);
    }

    public List<AuditLog> getAuditLogsByUserAgent(String contractId, String userAgent) {
        return auditLogRepository.findByContractIdAndUserAgent(contractId, userAgent);
    }

    public List<AuditLog> getAuditLogsByErrorCode(String contractId, String errorCode) {
        return auditLogRepository.findByContractIdAndErrorCode(contractId, errorCode);
    }

    public List<AuditLog> getAuditLogsByComplianceStandard(String contractId, String complianceStandard) {
        return auditLogRepository.findByContractIdAndComplianceStandard(contractId, complianceStandard);
    }

    public List<AuditLog> getAuditLogsByExecutionTimeMsGreaterThan(String contractId, Long executionTimeMs) {
        return auditLogRepository.findByContractIdAndExecutionTimeMsGreaterThan(contractId, executionTimeMs);
    }

    public List<AuditLog> getAuditLogsByExecutionTimeMsLessThan(String contractId, Long executionTimeMs) {
        return auditLogRepository.findByContractIdAndExecutionTimeMsLessThan(contractId, executionTimeMs);
    }

    public List<AuditLog> getAuditLogsByExecutionTimeMsBetween(String contractId, Long minTime, Long maxTime) {
        return auditLogRepository.findByContractIdAndExecutionTimeMsBetween(contractId, minTime, maxTime);
    }

    public List<AuditLog> getExpiredLogsByContractId(String contractId, LocalDateTime currentTime) {
        return auditLogRepository.findExpiredLogsByContractId(contractId, currentTime);
    }

    public List<AuditLog> getNonExpiredLogsByContractId(String contractId, LocalDateTime currentTime) {
        return auditLogRepository.findNonExpiredLogsByContractId(contractId, currentTime);
    }

    public List<AuditLog> getAuditLogsByExportedAtBetween(String contractId, LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByContractIdAndExportedAtBetween(contractId, startDate, endDate);
    }

    public List<AuditLog> getAuditLogsByExportedBy(String contractId, String exportedBy) {
        return auditLogRepository.findByContractIdAndExportedBy(contractId, exportedBy);
    }

    public AuditLog markAsSuccess(String id) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.markAsSuccess();
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        return auditLogRepository.save(auditLog);
    }

    public AuditLog markAsFailure(String id, String errorCode, String errorMessage) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.markAsFailure(errorCode, errorMessage);
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        return auditLogRepository.save(auditLog);
    }

    public AuditLog markAsWarning(String id) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.markAsWarning();
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        return auditLogRepository.save(auditLog);
    }

    public AuditLog markAsInfo(String id) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.markAsInfo();
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        return auditLogRepository.save(auditLog);
    }

    public AuditLog setSeverityLevel(String id, AuditLog.SeverityLevel severity) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.setSeverityLevel(severity);
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        return auditLogRepository.save(auditLog);
    }

    public AuditLog markAsSensitive(String id) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.markAsSensitive();
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        return auditLogRepository.save(auditLog);
    }

    public AuditLog setComplianceRequirement(String id, String complianceStandard) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.setComplianceRequirement(complianceStandard);
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        return auditLogRepository.save(auditLog);
    }

    public AuditLog markAsExported(String id, String exportedBy) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.markAsExported(exportedBy);
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        return auditLogRepository.save(auditLog);
    }

    public AuditLog setExecutionTime(String id, long startTime) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.setExecutionTime(startTime);
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        return auditLogRepository.save(auditLog);
    }

    public AuditLog setOldValues(String id, Map<String, Object> oldValues) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.setOldValues(oldValues);
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        return auditLogRepository.save(auditLog);
    }

    public AuditLog setNewValues(String id, Map<String, Object> newValues) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.setNewValues(newValues);
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        return auditLogRepository.save(auditLog);
    }

    public AuditLog setChangesSummary(String id, String changesSummary) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.setChangesSummary(changesSummary);
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        return auditLogRepository.save(auditLog);
    }

    public AuditLog setAdditionalData(String id, Map<String, Object> additionalData) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.setAdditionalData(additionalData);
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        return auditLogRepository.save(auditLog);
    }

    public AuditLog addTag(String id, String tag) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.addTag(tag);
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        return auditLogRepository.save(auditLog);
    }

    public AuditLog setRetentionUntil(String id, LocalDateTime retentionUntil) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.setRetentionUntil(retentionUntil);
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        return auditLogRepository.save(auditLog);
    }

    public void deleteAuditLog(String id, String deletedBy) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.markAsDeleted(deletedBy);
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        auditLogRepository.save(auditLog);
    }

    public AuditLog restoreAuditLog(String id) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AuditLog not found"));
        
        auditLog.restore();
        auditLog.setUpdatedAt(LocalDateTime.now());
        
        return auditLogRepository.save(auditLog);
    }

    public long countAuditLogsByContractId(String contractId) {
        return auditLogRepository.countByContractIdAndIsDeletedFalse(contractId);
    }

    public long countAuditLogsByContractIdAndEventCategory(String contractId, AuditLog.EventCategory eventCategory) {
        return auditLogRepository.countByContractIdAndEventCategoryAndIsDeletedFalse(contractId, eventCategory);
    }

    public long countAuditLogsByUserId(String userId) {
        return auditLogRepository.countByUserIdAndIsDeletedFalse(userId);
    }

    public long countAuditLogsByUserEmail(String userEmail) {
        return auditLogRepository.countByUserEmailAndIsDeletedFalse(userEmail);
    }

    public long countAuditLogsByEventType(String eventType) {
        return auditLogRepository.countByEventTypeAndIsDeletedFalse(eventType);
    }

    public long countAuditLogsByEventCategory(AuditLog.EventCategory eventCategory) {
        return auditLogRepository.countByEventCategoryAndIsDeletedFalse(eventCategory);
    }

    public long countAuditLogsByAction(String action) {
        return auditLogRepository.countByActionAndIsDeletedFalse(action);
    }

    public long countAuditLogsByStatus(AuditLog.AuditStatus status) {
        return auditLogRepository.countByStatusAndIsDeletedFalse(status);
    }

    public long countAuditLogsBySeverity(AuditLog.SeverityLevel severity) {
        return auditLogRepository.countBySeverityAndIsDeletedFalse(severity);
    }

    public long countSuccessfulLogsByContractId(String contractId) {
        return auditLogRepository.countSuccessfulLogsByContractId(contractId);
    }

    public long countFailedLogsByContractId(String contractId) {
        return auditLogRepository.countFailedLogsByContractId(contractId);
    }

    public long countWarningLogsByContractId(String contractId) {
        return auditLogRepository.countWarningLogsByContractId(contractId);
    }

    public long countInfoLogsByContractId(String contractId) {
        return auditLogRepository.countInfoLogsByContractId(contractId);
    }

    public long countHighSeverityLogsByContractId(String contractId) {
        return auditLogRepository.countHighSeverityLogsByContractId(contractId);
    }

    public long countCriticalSeverityLogsByContractId(String contractId) {
        return auditLogRepository.countCriticalSeverityLogsByContractId(contractId);
    }

    public long countSensitiveLogsByContractId(String contractId) {
        return auditLogRepository.countSensitiveLogsByContractId(contractId);
    }

    public long countNonSensitiveLogsByContractId(String contractId) {
        return auditLogRepository.countNonSensitiveLogsByContractId(contractId);
    }

    public long countComplianceRequiredLogsByContractId(String contractId) {
        return auditLogRepository.countComplianceRequiredLogsByContractId(contractId);
    }

    public long countNonComplianceRequiredLogsByContractId(String contractId) {
        return auditLogRepository.countNonComplianceRequiredLogsByContractId(contractId);
    }

    public long countExportedLogsByContractId(String contractId) {
        return auditLogRepository.countExportedLogsByContractId(contractId);
    }

    public long countUnexportedLogsByContractId(String contractId) {
        return auditLogRepository.countUnexportedLogsByContractId(contractId);
    }

    public boolean existsAuditLogsByContractId(String contractId) {
        return auditLogRepository.existsByContractIdAndIsDeletedFalse(contractId);
    }

    public boolean existsSuccessfulLogsByContractId(String contractId) {
        return auditLogRepository.existsSuccessfulLogsByContractId(contractId);
    }

    public boolean existsFailedLogsByContractId(String contractId) {
        return auditLogRepository.existsFailedLogsByContractId(contractId);
    }

    public boolean existsWarningLogsByContractId(String contractId) {
        return auditLogRepository.existsWarningLogsByContractId(contractId);
    }

    public boolean existsInfoLogsByContractId(String contractId) {
        return auditLogRepository.existsInfoLogsByContractId(contractId);
    }

    public boolean existsHighSeverityLogsByContractId(String contractId) {
        return auditLogRepository.existsHighSeverityLogsByContractId(contractId);
    }

    public boolean existsCriticalSeverityLogsByContractId(String contractId) {
        return auditLogRepository.existsCriticalSeverityLogsByContractId(contractId);
    }

    public boolean existsSensitiveLogsByContractId(String contractId) {
        return auditLogRepository.existsSensitiveLogsByContractId(contractId);
    }

    public boolean existsNonSensitiveLogsByContractId(String contractId) {
        return auditLogRepository.existsNonSensitiveLogsByContractId(contractId);
    }

    public boolean existsComplianceRequiredLogsByContractId(String contractId) {
        return auditLogRepository.existsComplianceRequiredLogsByContractId(contractId);
    }

    public boolean existsNonComplianceRequiredLogsByContractId(String contractId) {
        return auditLogRepository.existsNonComplianceRequiredLogsByContractId(contractId);
    }

    public boolean existsExportedLogsByContractId(String contractId) {
        return auditLogRepository.existsExportedLogsByContractId(contractId);
    }

    public boolean existsUnexportedLogsByContractId(String contractId) {
        return auditLogRepository.existsUnexportedLogsByContractId(contractId);
    }

    /**
     * Tạo audit log mới từ AuditLogCreateRequest
     */
    public AuditLog createAuditLog(AuditLogCreateRequest request) {
        AuditLog auditLog = new AuditLog(request.getEventType(), request.getEventCategory(), 
                                       request.getAction(), request.getDescription(), 
                                       request.getUserId(), request.getUserName());
        auditLog.setContractId(request.getContractId());
        auditLog.setIpAddress(request.getIpAddress());
        auditLog.setUserAgent(request.getUserAgent());
        // Convert additionalData string to map if needed
        if (request.getAdditionalData() != null && !request.getAdditionalData().isEmpty()) {
            Map<String, Object> additionalDataMap = new HashMap<>();
            additionalDataMap.put("data", request.getAdditionalData());
            auditLog.setAdditionalData(additionalDataMap);
        }
        auditLog.initializeNewEntity();
        
        return auditLogRepository.save(auditLog);
    }

    /**
     * Lấy tất cả audit log
     */
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findByIsDeletedFalse();
    }
}
