package com.devgo2003.docgo.document_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Entity quản lý chữ ký điện tử cho hợp đồng
 */
@Document(collection = "esignatures")
public class ESignature extends BaseEntity {

    @Id
    private String id;

    @Field("contract_id")
    @DBRef
    private Contract contract;

    @Field("signer_id")
    private String signerId;

    @Field("signer_name")
    private String signerName;

    @Field("signer_email")
    private String signerEmail;

    @Field("signer_role")
    private String signerRole;

    @Field("signature_type")
    private SignatureType signatureType;

    @Field("status")
    private SignatureStatus status;

    @Field("signature_order")
    private Integer signatureOrder;

    @Field("is_required")
    private Boolean isRequired = true;

    @Field("signed_at")
    private LocalDateTime signedAt;

    @Field("signature_data")
    private String signatureData;

    @Field("signature_image")
    private String signatureImage;

    @Field("certificate_data")
    private String certificateData;

    @Field("certificate_issuer")
    private String certificateIssuer;

    @Field("certificate_serial")
    private String certificateSerial;

    @Field("certificate_valid_from")
    private LocalDateTime certificateValidFrom;

    @Field("certificate_valid_to")
    private LocalDateTime certificateValidTo;

    @Field("ip_address")
    private String ipAddress;

    @Field("user_agent")
    private String userAgent;

    @Field("device_info")
    private Map<String, Object> deviceInfo;

    @Field("location_info")
    private Map<String, Object> locationInfo;

    @Field("verification_code")
    private String verificationCode;

    @Field("verification_method")
    private VerificationMethod verificationMethod;

    @Field("verification_attempts")
    private Integer verificationAttempts = 0;

    @Field("max_verification_attempts")
    private Integer maxVerificationAttempts = 3;

    @Field("expires_at")
    private LocalDateTime expiresAt;

    @Field("reminder_sent_count")
    private Integer reminderSentCount = 0;

    @Field("declined_at")
    private LocalDateTime declinedAt;

    @Field("decline_reason")
    private String declineReason;

    @Field("legal_consent")
    private Boolean legalConsent = false;

    @Field("consent_timestamp")
    private LocalDateTime consentTimestamp;

    @Field("audit_trail")
    private String auditTrail;

    @Field("compliance_verified")
    private Boolean complianceVerified = false;

    @Field("compliance_verified_at")
    private LocalDateTime complianceVerifiedAt;

    @Field("compliance_verified_by")
    private String complianceVerifiedBy;

    @Override
    public boolean isNew() {
        return this.id == null;
    }

    // Enums
    public enum SignatureType {
        ELECTRONIC, DIGITAL, BIOMETRIC, HANDWRITTEN, TYPED
    }

    public enum SignatureStatus {
        PENDING_REVIEW, SIGNED, DECLINED, EXPIRED, CANCELLED, VERIFIED, FAILED_VERIFICATION
    }

    public enum VerificationMethod {
        EMAIL, SMS, PHONE, BIOMETRIC, PASSWORD, OTP, CERTIFICATE
    }

    // Constructors
    public ESignature() {
        super();
    }

    public ESignature(Contract contract, String signerId, String signerName, 
                     String signerEmail, String signerRole, SignatureType signatureType) {
        super();
        this.contract = contract;
        this.signerId = signerId;
        this.signerName = signerName;
        this.signerEmail = signerEmail;
        this.signerRole = signerRole;
        this.signatureType = signatureType;
        this.status = SignatureStatus.PENDING_REVIEW;
        this.isRequired = true;
        this.verificationAttempts = 0;
        this.reminderSentCount = 0;
        this.legalConsent = false;
        this.complianceVerified = false;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Contract getContract() {
        return contract;
    }

    public void setContract(Contract contract) {
        this.contract = contract;
    }

    public void setContractId(String contractId) {
        if (this.contract == null) {
            this.contract = new Contract();
        }
        this.contract.setId(contractId);
    }

    public String getSignerId() {
        return signerId;
    }

    public void setSignerId(String signerId) {
        this.signerId = signerId;
    }

    public String getSignerName() {
        return signerName;
    }

    public void setSignerName(String signerName) {
        this.signerName = signerName;
    }

    public String getSignerEmail() {
        return signerEmail;
    }

    public void setSignerEmail(String signerEmail) {
        this.signerEmail = signerEmail;
    }

    public String getSignerRole() {
        return signerRole;
    }

    public void setSignerRole(String signerRole) {
        this.signerRole = signerRole;
    }

    public SignatureType getSignatureType() {
        return signatureType;
    }

    public void setSignatureType(SignatureType signatureType) {
        this.signatureType = signatureType;
    }

    public SignatureStatus getStatus() {
        return status;
    }

    public void setStatus(SignatureStatus status) {
        this.status = status;
    }

    public Integer getSignatureOrder() {
        return signatureOrder;
    }

    public void setSignatureOrder(Integer signatureOrder) {
        this.signatureOrder = signatureOrder;
    }

    public Boolean getIsRequired() {
        return isRequired;
    }

    public void setIsRequired(Boolean isRequired) {
        this.isRequired = isRequired;
    }

    public LocalDateTime getSignedAt() {
        return signedAt;
    }

    public void setSignedAt(LocalDateTime signedAt) {
        this.signedAt = signedAt;
    }

    public String getSignatureData() {
        return signatureData;
    }

    public void setSignatureData(String signatureData) {
        this.signatureData = signatureData;
    }

    public String getSignatureImage() {
        return signatureImage;
    }

    public void setSignatureImage(String signatureImage) {
        this.signatureImage = signatureImage;
    }

    public String getCertificateData() {
        return certificateData;
    }

    public void setCertificateData(String certificateData) {
        this.certificateData = certificateData;
    }

    public String getCertificateIssuer() {
        return certificateIssuer;
    }

    public void setCertificateIssuer(String certificateIssuer) {
        this.certificateIssuer = certificateIssuer;
    }

    public String getCertificateSerial() {
        return certificateSerial;
    }

    public void setCertificateSerial(String certificateSerial) {
        this.certificateSerial = certificateSerial;
    }

    public LocalDateTime getCertificateValidFrom() {
        return certificateValidFrom;
    }

    public void setCertificateValidFrom(LocalDateTime certificateValidFrom) {
        this.certificateValidFrom = certificateValidFrom;
    }

    public LocalDateTime getCertificateValidTo() {
        return certificateValidTo;
    }

    public void setCertificateValidTo(LocalDateTime certificateValidTo) {
        this.certificateValidTo = certificateValidTo;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public Map<String, Object> getDeviceInfo() {
        return deviceInfo;
    }

    public void setDeviceInfo(Map<String, Object> deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    public Map<String, Object> getLocationInfo() {
        return locationInfo;
    }

    public void setLocationInfo(Map<String, Object> locationInfo) {
        this.locationInfo = locationInfo;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public VerificationMethod getVerificationMethod() {
        return verificationMethod;
    }

    public void setVerificationMethod(VerificationMethod verificationMethod) {
        this.verificationMethod = verificationMethod;
    }

    public Integer getVerificationAttempts() {
        return verificationAttempts;
    }

    public void setVerificationAttempts(Integer verificationAttempts) {
        this.verificationAttempts = verificationAttempts;
    }

    public Integer getMaxVerificationAttempts() {
        return maxVerificationAttempts;
    }

    public void setMaxVerificationAttempts(Integer maxVerificationAttempts) {
        this.maxVerificationAttempts = maxVerificationAttempts;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Integer getReminderSentCount() {
        return reminderSentCount;
    }

    public void setReminderSentCount(Integer reminderSentCount) {
        this.reminderSentCount = reminderSentCount;
    }

    public LocalDateTime getDeclinedAt() {
        return declinedAt;
    }

    public void setDeclinedAt(LocalDateTime declinedAt) {
        this.declinedAt = declinedAt;
    }

    public String getDeclineReason() {
        return declineReason;
    }

    public void setDeclineReason(String declineReason) {
        this.declineReason = declineReason;
    }

    public Boolean getLegalConsent() {
        return legalConsent;
    }

    public void setLegalConsent(Boolean legalConsent) {
        this.legalConsent = legalConsent;
    }

    public LocalDateTime getConsentTimestamp() {
        return consentTimestamp;
    }

    public void setConsentTimestamp(LocalDateTime consentTimestamp) {
        this.consentTimestamp = consentTimestamp;
    }

    public String getAuditTrail() {
        return auditTrail;
    }

    public void setAuditTrail(String auditTrail) {
        this.auditTrail = auditTrail;
    }

    public Boolean getComplianceVerified() {
        return complianceVerified;
    }

    public void setComplianceVerified(Boolean complianceVerified) {
        this.complianceVerified = complianceVerified;
    }

    public LocalDateTime getComplianceVerifiedAt() {
        return complianceVerifiedAt;
    }

    public void setComplianceVerifiedAt(LocalDateTime complianceVerifiedAt) {
        this.complianceVerifiedAt = complianceVerifiedAt;
    }

    public String getComplianceVerifiedBy() {
        return complianceVerifiedBy;
    }

    public void setComplianceVerifiedBy(String complianceVerifiedBy) {
        this.complianceVerifiedBy = complianceVerifiedBy;
    }

    // Business methods
    public void sign(String signatureData, String signatureImage, String ipAddress, 
                    String userAgent, Map<String, Object> deviceInfo) {
        this.status = SignatureStatus.SIGNED;
        this.signedAt = LocalDateTime.now();
        this.signatureData = signatureData;
        this.signatureImage = signatureImage;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.deviceInfo = deviceInfo;
    }

    public void decline(String declineReason) {
        this.status = SignatureStatus.DECLINED;
        this.declinedAt = LocalDateTime.now();
        this.declineReason = declineReason;
    }

    public void verify() {
        this.status = SignatureStatus.VERIFIED;
    }

    public void failVerification() {
        this.status = SignatureStatus.FAILED_VERIFICATION;
        this.verificationAttempts++;
    }

    public void expire() {
        this.status = SignatureStatus.EXPIRED;
    }

    public void cancel() {
        this.status = SignatureStatus.CANCELLED;
    }

    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt) && status == SignatureStatus.PENDING_REVIEW;
    }

    public boolean canVerify() {
        return verificationAttempts < maxVerificationAttempts;
    }

    public void incrementReminderCount() {
        this.reminderSentCount++;
    }

    public void giveLegalConsent() {
        this.legalConsent = true;
        this.consentTimestamp = LocalDateTime.now();
    }

    public void verifyCompliance(String verifiedBy) {
        this.complianceVerified = true;
        this.complianceVerifiedAt = LocalDateTime.now();
        this.complianceVerifiedBy = verifiedBy;
    }

    public boolean isCertificateValid() {
        if (certificateValidFrom == null || certificateValidTo == null) {
            return false;
        }
        LocalDateTime now = LocalDateTime.now();
        return now.isAfter(certificateValidFrom) && now.isBefore(certificateValidTo);
    }

    // Additional getter methods for compatibility
    public String getContractId() {
        return contract != null ? contract.getId() : null;
    }

    public Boolean getRequired() {
        return isRequired;
    }
}
