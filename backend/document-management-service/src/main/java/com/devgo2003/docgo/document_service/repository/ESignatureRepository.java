package com.devgo2003.docgo.document_service.repository;

import com.devgo2003.docgo.document_service.entity.ESignature;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ESignatureRepository extends MongoRepository<ESignature, String> {

    List<ESignature> findByContractIdAndIsDeletedFalse(String contractId);
    
    List<ESignature> findByContractIdAndStatusAndIsDeletedFalse(String contractId, ESignature.SignatureStatus status);
    
    List<ESignature> findBySignerIdAndIsDeletedFalse(String signerId);
    
    List<ESignature> findBySignerEmailAndIsDeletedFalse(String signerEmail);
    
    List<ESignature> findBySignatureTypeAndIsDeletedFalse(ESignature.SignatureType signatureType);
    
    List<ESignature> findByVerificationMethodAndIsDeletedFalse(ESignature.VerificationMethod verificationMethod);
    
    @Query("{ 'contractId': ?0, 'status': 'PENDING_REVIEW', 'isDeleted': false }")
    List<ESignature> findPendingSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'SIGNED', 'isDeleted': false }")
    List<ESignature> findSignedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'DECLINED', 'isDeleted': false }")
    List<ESignature> findDeclinedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'EXPIRED', 'isDeleted': false }")
    List<ESignature> findExpiredSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'VERIFIED', 'isDeleted': false }")
    List<ESignature> findVerifiedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isRequired': true, 'isDeleted': false }")
    List<ESignature> findRequiredSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isRequired': false, 'isDeleted': false }")
    List<ESignature> findOptionalSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'legalConsent': true, 'isDeleted': false }")
    List<ESignature> findConsentedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'legalConsent': false, 'isDeleted': false }")
    List<ESignature> findUnconsentedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'complianceVerified': true, 'isDeleted': false }")
    List<ESignature> findComplianceVerifiedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'complianceVerified': false, 'isDeleted': false }")
    List<ESignature> findComplianceUnverifiedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'signatureOrder': ?1, 'isDeleted': false }")
    List<ESignature> findByContractIdAndSignatureOrder(String contractId, Integer signatureOrder);
    
    @Query("{ 'contractId': ?0, 'isDeleted': false }")
    List<ESignature> findByContractIdOrderBySignatureOrderAsc(String contractId);
    
    @Query("{ 'contractId': ?0, 'isDeleted': false }")
    List<ESignature> findByContractIdOrderBySignedAtDesc(String contractId);
    
    @Query("{ 'signedAt': { $gte: ?0, $lte: ?1 }, 'status': 'SIGNED', 'isDeleted': false }")
    List<ESignature> findBySignedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{ 'expiresAt': { $lte: ?0 }, 'status': 'PENDING_REVIEW', 'isDeleted': false }")
    List<ESignature> findExpiredSignatures(LocalDateTime currentTime);
    
    @Query("{ 'expiresAt': { $lte: ?0 }, 'status': 'PENDING_REVIEW', 'isDeleted': false }")
    List<ESignature> findExpiringSignatures(LocalDateTime dueDate);
    
    @Query("{ 'verificationAttempts': { $gte: ?0 }, 'isDeleted': false }")
    List<ESignature> findSignaturesWithHighVerificationAttempts(Integer maxAttempts);
    
    @Query("{ 'reminderSentCount': { $gt: ?0 }, 'status': 'PENDING_REVIEW', 'isDeleted': false }")
    List<ESignature> findSignaturesWithReminders(Integer reminderCount);
    
    @Query("{ 'contractId': ?0, 'certificateIssuer': ?1, 'isDeleted': false }")
    List<ESignature> findByContractIdAndCertificateIssuer(String contractId, String certificateIssuer);
    
    @Query("{ 'contractId': ?0, 'certificateSerial': ?1, 'isDeleted': false }")
    List<ESignature> findByContractIdAndCertificateSerial(String contractId, String certificateSerial);
    
    @Query("{ 'contractId': ?0, 'ipAddress': ?1, 'isDeleted': false }")
    List<ESignature> findByContractIdAndIpAddress(String contractId, String ipAddress);
    
    @Query("{ 'contractId': ?0, 'userAgent': ?1, 'isDeleted': false }")
    List<ESignature> findByContractIdAndUserAgent(String contractId, String userAgent);
    
    @Query("{ 'contractId': ?0, 'verificationCode': ?1, 'isDeleted': false }")
    List<ESignature> findByContractIdAndVerificationCode(String contractId, String verificationCode);
    
    @Query("{ 'contractId': ?0, 'status': 'PENDING_REVIEW', 'isRequired': true, 'isDeleted': false }")
    List<ESignature> findPendingRequiredSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'SIGNED', 'isRequired': true, 'isDeleted': false }")
    List<ESignature> findSignedRequiredSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'DECLINED', 'isRequired': true, 'isDeleted': false }")
    List<ESignature> findDeclinedRequiredSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'EXPIRED', 'isRequired': true, 'isDeleted': false }")
    List<ESignature> findExpiredRequiredSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'VERIFIED', 'isRequired': true, 'isDeleted': false }")
    List<ESignature> findVerifiedRequiredSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'PENDING_REVIEW', 'isRequired': false, 'isDeleted': false }")
    List<ESignature> findPendingOptionalSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'SIGNED', 'isRequired': false, 'isDeleted': false }")
    List<ESignature> findSignedOptionalSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'DECLINED', 'isRequired': false, 'isDeleted': false }")
    List<ESignature> findDeclinedOptionalSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'EXPIRED', 'isRequired': false, 'isDeleted': false }")
    List<ESignature> findExpiredOptionalSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'VERIFIED', 'isRequired': false, 'isDeleted': false }")
    List<ESignature> findVerifiedOptionalSignaturesByContractId(String contractId);
    
    long countByContractIdAndIsDeletedFalse(String contractId);
    
    long countByContractIdAndStatusAndIsDeletedFalse(String contractId, ESignature.SignatureStatus status);
    
    long countBySignerIdAndIsDeletedFalse(String signerId);
    
    @Query("{ 'contractId': ?0, 'status': 'PENDING_REVIEW', 'isDeleted': false }")
    long countPendingSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'SIGNED', 'isDeleted': false }")
    long countSignedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'DECLINED', 'isDeleted': false }")
    long countDeclinedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'EXPIRED', 'isDeleted': false }")
    long countExpiredSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'VERIFIED', 'isDeleted': false }")
    long countVerifiedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isRequired': true, 'isDeleted': false }")
    long countRequiredSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isRequired': false, 'isDeleted': false }")
    long countOptionalSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'legalConsent': true, 'isDeleted': false }")
    long countConsentedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'legalConsent': false, 'isDeleted': false }")
    long countUnconsentedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'complianceVerified': true, 'isDeleted': false }")
    long countComplianceVerifiedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'complianceVerified': false, 'isDeleted': false }")
    long countComplianceUnverifiedSignaturesByContractId(String contractId);
    
    long countBySignatureTypeAndIsDeletedFalse(ESignature.SignatureType signatureType);
    
    long countByVerificationMethodAndIsDeletedFalse(ESignature.VerificationMethod verificationMethod);
    
    boolean existsByContractIdAndIsDeletedFalse(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'PENDING_REVIEW', 'isDeleted': false }")
    boolean existsPendingSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'SIGNED', 'isDeleted': false }")
    boolean existsSignedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'DECLINED', 'isDeleted': false }")
    boolean existsDeclinedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'EXPIRED', 'isDeleted': false }")
    boolean existsExpiredSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'status': 'VERIFIED', 'isDeleted': false }")
    boolean existsVerifiedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isRequired': true, 'isDeleted': false }")
    boolean existsRequiredSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isRequired': false, 'isDeleted': false }")
    boolean existsOptionalSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'legalConsent': true, 'isDeleted': false }")
    boolean existsConsentedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'legalConsent': false, 'isDeleted': false }")
    boolean existsUnconsentedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'complianceVerified': true, 'isDeleted': false }")
    boolean existsComplianceVerifiedSignaturesByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'complianceVerified': false, 'isDeleted': false }")
    boolean existsComplianceUnverifiedSignaturesByContractId(String contractId);
}
