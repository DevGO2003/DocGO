package com.devgo2003.docgo.document_service.repository;

import com.devgo2003.docgo.document_service.entity.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends MongoRepository<AuditLog, String> {

    /**
     * Tìm tất cả audit log chưa bị xóa
     */
    List<AuditLog> findByIsDeletedFalse();

    List<AuditLog> findByContractIdAndIsDeletedFalse(String contractId);
    
    List<AuditLog> findByContractIdAndEventCategoryAndIsDeletedFalse(String contractId, AuditLog.EventCategory eventCategory);
    
    List<AuditLog> findByUserIdAndIsDeletedFalse(String userId);
    
    List<AuditLog> findByUserEmailAndIsDeletedFalse(String userEmail);
    
    List<AuditLog> findByEventTypeAndIsDeletedFalse(String eventType);
    
    List<AuditLog> findByEventCategoryAndIsDeletedFalse(AuditLog.EventCategory eventCategory);
    
    List<AuditLog> findByActionAndIsDeletedFalse(String action);
    
    List<AuditLog> findByStatusAndIsDeletedFalse(AuditLog.AuditStatus status);
    
    List<AuditLog> findBySeverityAndIsDeletedFalse(AuditLog.SeverityLevel severity);
    
    @Query("{ 'contractId': ?0, 'status': 'SUCCESS', 'isDeleted': false }")
    List<AuditLog> findSuccessfulLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'FAILURE', 'isDeleted': false }")
    List<AuditLog> findFailedLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'WARNING', 'isDeleted': false }")
    List<AuditLog> findWarningLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'INFO', 'isDeleted': false }")
    List<AuditLog> findInfoLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'severity': 'HIGH', 'isDeleted': false }")
    List<AuditLog> findHighSeverityLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'severity': 'CRITICAL', 'isDeleted': false }")
    List<AuditLog> findCriticalSeverityLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isSensitive': true, 'isDeleted': false }")
    List<AuditLog> findSensitiveLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isSensitive': false, 'isDeleted': false }")
    List<AuditLog> findNonSensitiveLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'complianceRequired': true, 'isDeleted': false }")
    List<AuditLog> findComplianceRequiredLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'complianceRequired': false, 'isDeleted': false }")
    List<AuditLog> findNonComplianceRequiredLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isExported': true, 'isDeleted': false }")
    List<AuditLog> findExportedLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isExported': false, 'isDeleted': false }")
    List<AuditLog> findUnexportedLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isDeleted': false }")
    List<AuditLog> findByContractIdOrderByCreatedAtDesc(String contractId);
    
    @Query("{ 'contractId': ?0, 'isDeleted': false }")
    List<AuditLog> findByContractIdOrderBySeverityDesc(String contractId);
    
    @Query("{ 'contractId': ?0, 'isDeleted': false }")
    List<AuditLog> findByContractIdOrderByStatusAsc(String contractId);
    
    @Query("{ 'createdAt': { $gte: ?0, $lte: ?1 }, 'isDeleted': false }")
    List<AuditLog> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{ 'contractId': ?0, 'createdAt': { $gte: ?1, $lte: ?2 }, 'isDeleted': false }")
    List<AuditLog> findByContractIdAndCreatedAtBetween(String contractId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{ 'userId': ?0, 'createdAt': { $gte: ?1, $lte: ?2 }, 'isDeleted': false }")
    List<AuditLog> findByUserIdAndCreatedAtBetween(String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{ 'eventCategory': ?0, 'createdAt': { $gte: ?1, $lte: ?2 }, 'isDeleted': false }")
    List<AuditLog> findByEventCategoryAndCreatedAtBetween(AuditLog.EventCategory eventCategory, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{ 'status': ?0, 'createdAt': { $gte: ?1, $lte: ?2 }, 'isDeleted': false }")
    List<AuditLog> findByStatusAndCreatedAtBetween(AuditLog.AuditStatus status, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{ 'severity': ?0, 'createdAt': { $gte: ?1, $lte: ?2 }, 'isDeleted': false }")
    List<AuditLog> findBySeverityAndCreatedAtBetween(AuditLog.SeverityLevel severity, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{ 'contractId': ?0, 'tags': { $in: [?1] }, 'isDeleted': false }")
    List<AuditLog> findByContractIdAndTagsIn(String contractId, String[] tags);
    
    @Query("{ 'contractId': ?0, 'resourceType': ?1, 'isDeleted': false }")
    List<AuditLog> findByContractIdAndResourceType(String contractId, String resourceType);
    
    @Query("{ 'contractId': ?0, 'resourceId': ?1, 'isDeleted': false }")
    List<AuditLog> findByContractIdAndResourceId(String contractId, String resourceId);
    
    @Query("{ 'contractId': ?0, 'requestId': ?1, 'isDeleted': false }")
    List<AuditLog> findByContractIdAndRequestId(String contractId, String requestId);
    
    @Query("{ 'contractId': ?0, 'correlationId': ?1, 'isDeleted': false }")
    List<AuditLog> findByContractIdAndCorrelationId(String contractId, String correlationId);
    
    @Query("{ 'contractId': ?0, 'sessionId': ?1, 'isDeleted': false }")
    List<AuditLog> findByContractIdAndSessionId(String contractId, String sessionId);
    
    @Query("{ 'contractId': ?0, 'ipAddress': ?1, 'isDeleted': false }")
    List<AuditLog> findByContractIdAndIpAddress(String contractId, String ipAddress);
    
    @Query("{ 'contractId': ?0, 'userAgent': ?1, 'isDeleted': false }")
    List<AuditLog> findByContractIdAndUserAgent(String contractId, String userAgent);
    
    @Query("{ 'contractId': ?0, 'errorCode': ?1, 'isDeleted': false }")
    List<AuditLog> findByContractIdAndErrorCode(String contractId, String errorCode);
    
    @Query("{ 'contractId': ?0, 'complianceStandard': ?1, 'isDeleted': false }")
    List<AuditLog> findByContractIdAndComplianceStandard(String contractId, String complianceStandard);
    
    @Query("{ 'contractId': ?0, 'executionTimeMs': { $gte: ?1 }, 'isDeleted': false }")
    List<AuditLog> findByContractIdAndExecutionTimeMsGreaterThan(String contractId, Long executionTimeMs);
    
    @Query("{ 'contractId': ?0, 'executionTimeMs': { $lte: ?1 }, 'isDeleted': false }")
    List<AuditLog> findByContractIdAndExecutionTimeMsLessThan(String contractId, Long executionTimeMs);
    
    @Query("{ 'contractId': ?0, 'executionTimeMs': { $gte: ?1, $lte: ?2 }, 'isDeleted': false }")
    List<AuditLog> findByContractIdAndExecutionTimeMsBetween(String contractId, Long minTime, Long maxTime);
    
    @Query("{ 'contractId': ?0, 'retentionUntil': { $lte: ?1 }, 'isDeleted': false }")
    List<AuditLog> findExpiredLogsByContractId(String contractId, LocalDateTime currentTime);
    
    @Query("{ 'contractId': ?0, 'retentionUntil': { $gt: ?1 }, 'isDeleted': false }")
    List<AuditLog> findNonExpiredLogsByContractId(String contractId, LocalDateTime currentTime);
    
    @Query("{ 'contractId': ?0, 'exportedAt': { $gte: ?1, $lte: ?2 }, 'isExported': true, 'isDeleted': false }")
    List<AuditLog> findByContractIdAndExportedAtBetween(String contractId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{ 'contractId': ?0, 'exportedBy': ?1, 'isDeleted': false }")
    List<AuditLog> findByContractIdAndExportedBy(String contractId, String exportedBy);
    
    long countByContractIdAndIsDeletedFalse(String contractId);
    
    long countByContractIdAndEventCategoryAndIsDeletedFalse(String contractId, AuditLog.EventCategory eventCategory);
    
    long countByUserIdAndIsDeletedFalse(String userId);
    
    long countByUserEmailAndIsDeletedFalse(String userEmail);
    
    long countByEventTypeAndIsDeletedFalse(String eventType);
    
    long countByEventCategoryAndIsDeletedFalse(AuditLog.EventCategory eventCategory);
    
    long countByActionAndIsDeletedFalse(String action);
    
    long countByStatusAndIsDeletedFalse(AuditLog.AuditStatus status);
    
    long countBySeverityAndIsDeletedFalse(AuditLog.SeverityLevel severity);
    
    @Query("{ 'contractId': ?0, 'status': 'SUCCESS', 'isDeleted': false }")
    long countSuccessfulLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'FAILURE', 'isDeleted': false }")
    long countFailedLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'WARNING', 'isDeleted': false }")
    long countWarningLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'INFO', 'isDeleted': false }")
    long countInfoLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'severity': 'HIGH', 'isDeleted': false }")
    long countHighSeverityLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'severity': 'CRITICAL', 'isDeleted': false }")
    long countCriticalSeverityLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isSensitive': true, 'isDeleted': false }")
    long countSensitiveLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isSensitive': false, 'isDeleted': false }")
    long countNonSensitiveLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'complianceRequired': true, 'isDeleted': false }")
    long countComplianceRequiredLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'complianceRequired': false, 'isDeleted': false }")
    long countNonComplianceRequiredLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isExported': true, 'isDeleted': false }")
    long countExportedLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isExported': false, 'isDeleted': false }")
    long countUnexportedLogsByContractId(String contractId);
    
    long countByContractIdAndStatusAndIsDeletedFalse(String contractId, AuditLog.AuditStatus status);
    
    long countByContractIdAndSeverityAndIsDeletedFalse(String contractId, AuditLog.SeverityLevel severity);
    
    boolean existsByContractIdAndIsDeletedFalse(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'SUCCESS', 'isDeleted': false }")
    boolean existsSuccessfulLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'FAILURE', 'isDeleted': false }")
    boolean existsFailedLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'WARNING', 'isDeleted': false }")
    boolean existsWarningLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'INFO', 'isDeleted': false }")
    boolean existsInfoLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'severity': 'HIGH', 'isDeleted': false }")
    boolean existsHighSeverityLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'severity': 'CRITICAL', 'isDeleted': false }")
    boolean existsCriticalSeverityLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isSensitive': true, 'isDeleted': false }")
    boolean existsSensitiveLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isSensitive': false, 'isDeleted': false }")
    boolean existsNonSensitiveLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'complianceRequired': true, 'isDeleted': false }")
    boolean existsComplianceRequiredLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'complianceRequired': false, 'isDeleted': false }")
    boolean existsNonComplianceRequiredLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isExported': true, 'isDeleted': false }")
    boolean existsExportedLogsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isExported': false, 'isDeleted': false }")
    boolean existsUnexportedLogsByContractId(String contractId);
}
