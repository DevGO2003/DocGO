package com.devgo2003.docgo.document_service.service;

import com.devgo2003.docgo.document_service.entity.ESignature;
import com.devgo2003.docgo.document_service.entity.Contract;
import com.devgo2003.docgo.document_service.dto.ESignatureCreateRequest;
import com.devgo2003.docgo.document_service.repository.ESignatureRepository;
import com.devgo2003.docgo.document_service.repository.ContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@Service
public class ESignatureService {

    @Autowired
    private ESignatureRepository eSignatureRepository;

    @Autowired
    private ContractRepository contractRepository;

    public ESignature createESignature(String contractId, String signerId, String signerName, 
                                     String signerEmail, String signerRole, ESignature.SignatureType signatureType) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        ESignature eSignature = new ESignature(contract, signerId, signerName, signerEmail, signerRole, signatureType);
        eSignature.setContractId(contractId);
        eSignature.initializeNewEntity();
        
        return eSignatureRepository.save(eSignature);
    }

    public List<ESignature> getESignaturesByContractId(String contractId) {
        return eSignatureRepository.findByContractIdAndIsDeletedFalse(contractId);
    }

    public Optional<ESignature> getESignatureById(String id) {
        return eSignatureRepository.findById(id);
    }

    public List<ESignature> getPendingSignaturesByContractId(String contractId) {
        return eSignatureRepository.findPendingSignaturesByContractId(contractId);
    }

    public List<ESignature> getSignedSignaturesByContractId(String contractId) {
        return eSignatureRepository.findSignedSignaturesByContractId(contractId);
    }

    public List<ESignature> getDeclinedSignaturesByContractId(String contractId) {
        return eSignatureRepository.findDeclinedSignaturesByContractId(contractId);
    }

    public List<ESignature> getExpiredSignaturesByContractId(String contractId) {
        return eSignatureRepository.findExpiredSignaturesByContractId(contractId);
    }

    public List<ESignature> getVerifiedSignaturesByContractId(String contractId) {
        return eSignatureRepository.findVerifiedSignaturesByContractId(contractId);
    }

    public List<ESignature> getRequiredSignaturesByContractId(String contractId) {
        return eSignatureRepository.findRequiredSignaturesByContractId(contractId);
    }

    public List<ESignature> getOptionalSignaturesByContractId(String contractId) {
        return eSignatureRepository.findOptionalSignaturesByContractId(contractId);
    }

    public List<ESignature> getConsentedSignaturesByContractId(String contractId) {
        return eSignatureRepository.findConsentedSignaturesByContractId(contractId);
    }

    public List<ESignature> getUnconsentedSignaturesByContractId(String contractId) {
        return eSignatureRepository.findUnconsentedSignaturesByContractId(contractId);
    }

    public List<ESignature> getComplianceVerifiedSignaturesByContractId(String contractId) {
        return eSignatureRepository.findComplianceVerifiedSignaturesByContractId(contractId);
    }

    public List<ESignature> getComplianceUnverifiedSignaturesByContractId(String contractId) {
        return eSignatureRepository.findComplianceUnverifiedSignaturesByContractId(contractId);
    }

    public List<ESignature> getESignaturesBySignerId(String signerId) {
        return eSignatureRepository.findBySignerIdAndIsDeletedFalse(signerId);
    }

    public List<ESignature> getESignaturesBySignerEmail(String signerEmail) {
        return eSignatureRepository.findBySignerEmailAndIsDeletedFalse(signerEmail);
    }

    public List<ESignature> getESignaturesBySignatureType(ESignature.SignatureType signatureType) {
        return eSignatureRepository.findBySignatureTypeAndIsDeletedFalse(signatureType);
    }

    public List<ESignature> getESignaturesByVerificationMethod(ESignature.VerificationMethod verificationMethod) {
        return eSignatureRepository.findByVerificationMethodAndIsDeletedFalse(verificationMethod);
    }

    public List<ESignature> getESignaturesByContractIdOrderBySignatureOrder(String contractId) {
        return eSignatureRepository.findByContractIdOrderBySignatureOrderAsc(contractId);
    }

    public List<ESignature> getESignaturesByContractIdOrderBySignedAt(String contractId) {
        return eSignatureRepository.findByContractIdOrderBySignedAtDesc(contractId);
    }

    public List<ESignature> getESignaturesBySignedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return eSignatureRepository.findBySignedAtBetween(startDate, endDate);
    }

    public List<ESignature> getExpiredSignatures(LocalDateTime currentTime) {
        return eSignatureRepository.findExpiredSignatures(currentTime);
    }

    public List<ESignature> getExpiringSignatures(LocalDateTime dueDate) {
        return eSignatureRepository.findExpiringSignatures(dueDate);
    }

    public List<ESignature> getSignaturesWithHighVerificationAttempts(Integer maxAttempts) {
        return eSignatureRepository.findSignaturesWithHighVerificationAttempts(maxAttempts);
    }

    public List<ESignature> getSignaturesWithReminders(Integer reminderCount) {
        return eSignatureRepository.findSignaturesWithReminders(reminderCount);
    }

    public ESignature signESignature(String id, String signatureData, String signatureImage, 
                                   String ipAddress, String userAgent, Map<String, Object> deviceInfo) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.sign(signatureData, signatureImage, ipAddress, userAgent, deviceInfo);
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public ESignature declineESignature(String id, String declineReason) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.decline(declineReason);
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public ESignature verifyESignature(String id) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.verify();
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public ESignature failVerificationESignature(String id) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.failVerification();
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public ESignature expireESignature(String id) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.expire();
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public ESignature cancelESignature(String id) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.cancel();
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public ESignature incrementReminderCount(String id) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.incrementReminderCount();
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public ESignature giveLegalConsent(String id) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.giveLegalConsent();
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public ESignature verifyCompliance(String id, String verifiedBy) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.verifyCompliance(verifiedBy);
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public ESignature setSignatureOrder(String id, Integer signatureOrder) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.setSignatureOrder(signatureOrder);
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public ESignature setIsRequired(String id, Boolean isRequired) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.setIsRequired(isRequired);
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public ESignature setExpiresAt(String id, LocalDateTime expiresAt) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.setExpiresAt(expiresAt);
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public ESignature setVerificationMethod(String id, ESignature.VerificationMethod verificationMethod) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.setVerificationMethod(verificationMethod);
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public ESignature setVerificationCode(String id, String verificationCode) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.setVerificationCode(verificationCode);
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public ESignature setCertificateData(String id, String certificateData, String certificateIssuer, 
                                       String certificateSerial, LocalDateTime validFrom, LocalDateTime validTo) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.setCertificateData(certificateData);
        eSignature.setCertificateIssuer(certificateIssuer);
        eSignature.setCertificateSerial(certificateSerial);
        eSignature.setCertificateValidFrom(validFrom);
        eSignature.setCertificateValidTo(validTo);
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public ESignature setLocationInfo(String id, Map<String, Object> locationInfo) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.setLocationInfo(locationInfo);
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public ESignature setAuditTrail(String id, String auditTrail) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.setAuditTrail(auditTrail);
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public void deleteESignature(String id, String deletedBy) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.markAsDeleted(deletedBy);
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        eSignatureRepository.save(eSignature);
    }

    public ESignature restoreESignature(String id) {
        ESignature eSignature = eSignatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ESignature not found"));
        
        eSignature.restore();
        eSignature.setUpdatedAt(LocalDateTime.now());
        
        return eSignatureRepository.save(eSignature);
    }

    public long countESignaturesByContractId(String contractId) {
        return eSignatureRepository.countByContractIdAndIsDeletedFalse(contractId);
    }

    public long countESignaturesByContractIdAndStatus(String contractId, ESignature.SignatureStatus status) {
        return eSignatureRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, status);
    }

    public long countESignaturesBySignerId(String signerId) {
        return eSignatureRepository.countBySignerIdAndIsDeletedFalse(signerId);
    }

    public long countPendingSignaturesByContractId(String contractId) {
        return eSignatureRepository.countPendingSignaturesByContractId(contractId);
    }

    public long countSignedSignaturesByContractId(String contractId) {
        return eSignatureRepository.countSignedSignaturesByContractId(contractId);
    }

    public long countDeclinedSignaturesByContractId(String contractId) {
        return eSignatureRepository.countDeclinedSignaturesByContractId(contractId);
    }

    public long countExpiredSignaturesByContractId(String contractId) {
        return eSignatureRepository.countExpiredSignaturesByContractId(contractId);
    }

    public long countVerifiedSignaturesByContractId(String contractId) {
        return eSignatureRepository.countVerifiedSignaturesByContractId(contractId);
    }

    public long countRequiredSignaturesByContractId(String contractId) {
        return eSignatureRepository.countRequiredSignaturesByContractId(contractId);
    }

    public long countOptionalSignaturesByContractId(String contractId) {
        return eSignatureRepository.countOptionalSignaturesByContractId(contractId);
    }

    public long countConsentedSignaturesByContractId(String contractId) {
        return eSignatureRepository.countConsentedSignaturesByContractId(contractId);
    }

    public long countUnconsentedSignaturesByContractId(String contractId) {
        return eSignatureRepository.countUnconsentedSignaturesByContractId(contractId);
    }

    public long countComplianceVerifiedSignaturesByContractId(String contractId) {
        return eSignatureRepository.countComplianceVerifiedSignaturesByContractId(contractId);
    }

    public long countComplianceUnverifiedSignaturesByContractId(String contractId) {
        return eSignatureRepository.countComplianceUnverifiedSignaturesByContractId(contractId);
    }

    public boolean existsESignaturesByContractId(String contractId) {
        return eSignatureRepository.existsByContractIdAndIsDeletedFalse(contractId);
    }

    public boolean existsPendingSignaturesByContractId(String contractId) {
        return eSignatureRepository.existsPendingSignaturesByContractId(contractId);
    }

    public boolean existsSignedSignaturesByContractId(String contractId) {
        return eSignatureRepository.existsSignedSignaturesByContractId(contractId);
    }

    public boolean existsDeclinedSignaturesByContractId(String contractId) {
        return eSignatureRepository.existsDeclinedSignaturesByContractId(contractId);
    }

    public boolean existsExpiredSignaturesByContractId(String contractId) {
        return eSignatureRepository.existsExpiredSignaturesByContractId(contractId);
    }

    public boolean existsVerifiedSignaturesByContractId(String contractId) {
        return eSignatureRepository.existsVerifiedSignaturesByContractId(contractId);
    }

    public boolean existsRequiredSignaturesByContractId(String contractId) {
        return eSignatureRepository.existsRequiredSignaturesByContractId(contractId);
    }

    public boolean existsOptionalSignaturesByContractId(String contractId) {
        return eSignatureRepository.existsOptionalSignaturesByContractId(contractId);
    }

    public boolean existsConsentedSignaturesByContractId(String contractId) {
        return eSignatureRepository.existsConsentedSignaturesByContractId(contractId);
    }

    public boolean existsUnconsentedSignaturesByContractId(String contractId) {
        return eSignatureRepository.existsUnconsentedSignaturesByContractId(contractId);
    }

    public boolean existsComplianceVerifiedSignaturesByContractId(String contractId) {
        return eSignatureRepository.existsComplianceVerifiedSignaturesByContractId(contractId);
    }

    public boolean existsComplianceUnverifiedSignaturesByContractId(String contractId) {
        return eSignatureRepository.existsComplianceUnverifiedSignaturesByContractId(contractId);
    }

    /**
     * Tạo e-signature mới từ ESignatureCreateRequest
     */
    public ESignature createESignature(ESignatureCreateRequest request) {
        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        ESignature eSignature = new ESignature(
                contract,
                request.getSignerId(),
                request.getSignerName(),
                request.getSignerEmail(),
                request.getSignerRole(),
                request.getSignatureType()
        );
        eSignature.setContractId(request.getContractId());
        eSignature.setSignatureImage(request.getSignatureImage());
        eSignature.setSignatureData(request.getSignatureData());
        eSignature.setCertificateData(request.getCertificateData());
        eSignature.setCertificateIssuer(request.getCertificateIssuer());
        eSignature.setSignedAt(request.getSignedAt());
        eSignature.setIpAddress(request.getIpAddress());
        eSignature.setUserAgent(request.getUserAgent());
        // Note: ESignature entity may not have setAdditionalData method, skip for now
        // eSignature.setAdditionalData(request.getAdditionalData());
        eSignature.initializeNewEntity();
        
        return eSignatureRepository.save(eSignature);
    }

    /**
     * Lấy tất cả e-signature
     */
    public List<ESignature> getAllESignatures() {
        return eSignatureRepository.findAll();
    }

    /**
     * Áp dụng view filter dựa trên loại view
     */
    public List<ESignature> applyViewFilter(List<ESignature> eSignatures, String viewType) {
        if (eSignatures == null || eSignatures.isEmpty()) {
            return eSignatures;
        }
        
        switch (viewType.toLowerCase()) {
            case "summary":
                return eSignatures.stream()
                    .map(this::createSummaryView)
                    .collect(java.util.stream.Collectors.toList());
            case "minimal":
                return eSignatures.stream()
                    .map(this::createMinimalView)
                    .collect(java.util.stream.Collectors.toList());
            case "full":
            default:
                return eSignatures; // Return full data
        }
    }
    
    /**
     * Tạo summary view của ESignature (chỉ các trường quan trọng)
     */
    private ESignature createSummaryView(ESignature eSignature) {
        ESignature summaryESignature = new ESignature();
        summaryESignature.setId(eSignature.getId());
        summaryESignature.setContractId(eSignature.getContractId());
        summaryESignature.setSignerId(eSignature.getSignerId());
        summaryESignature.setSignerName(eSignature.getSignerName());
        summaryESignature.setSignerEmail(eSignature.getSignerEmail());
        summaryESignature.setSignerRole(eSignature.getSignerRole());
        summaryESignature.setSignatureType(eSignature.getSignatureType());
        summaryESignature.setStatus(eSignature.getStatus());
        summaryESignature.setVerificationMethod(eSignature.getVerificationMethod());
        summaryESignature.setIsRequired(eSignature.getRequired());
        summaryESignature.setSignatureOrder(eSignature.getSignatureOrder());
        summaryESignature.setSignedAt(eSignature.getSignedAt());
        summaryESignature.setCreatedAt(eSignature.getCreatedAt());
        summaryESignature.setUpdatedAt(eSignature.getUpdatedAt());
        return summaryESignature;
    }
    
    /**
     * Tạo minimal view của ESignature (chỉ các trường cơ bản)
     */
    private ESignature createMinimalView(ESignature eSignature) {
        ESignature minimalESignature = new ESignature();
        minimalESignature.setId(eSignature.getId());
        minimalESignature.setContractId(eSignature.getContractId());
        minimalESignature.setSignerId(eSignature.getSignerId());
        minimalESignature.setSignerName(eSignature.getSignerName());
        minimalESignature.setSignerEmail(eSignature.getSignerEmail());
        minimalESignature.setStatus(eSignature.getStatus());
        minimalESignature.setSignatureType(eSignature.getSignatureType());
        minimalESignature.setIsRequired(eSignature.getRequired());
        return minimalESignature;
    }
}
