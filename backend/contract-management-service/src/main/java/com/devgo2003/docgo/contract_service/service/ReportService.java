package com.devgo2003.docgo.contract_service.service;

import com.devgo2003.docgo.contract_service.entity.Contract;
import com.devgo2003.docgo.contract_service.entity.Approval;
import com.devgo2003.docgo.contract_service.entity.Version;
import com.devgo2003.docgo.contract_service.entity.Comment;
import com.devgo2003.docgo.contract_service.entity.ESignature;
import com.devgo2003.docgo.contract_service.entity.Reminder;
import com.devgo2003.docgo.contract_service.entity.AuditLog;
import com.devgo2003.docgo.contract_service.repository.ContractRepository;
import com.devgo2003.docgo.contract_service.repository.ApprovalRepository;
import com.devgo2003.docgo.contract_service.repository.VersionRepository;
import com.devgo2003.docgo.contract_service.repository.CommentRepository;
import com.devgo2003.docgo.contract_service.repository.ESignatureRepository;
import com.devgo2003.docgo.contract_service.repository.ReminderRepository;
import com.devgo2003.docgo.contract_service.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class ReportService {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private ApprovalRepository approvalRepository;

    @Autowired
    private VersionRepository versionRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ESignatureRepository eSignatureRepository;

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    /**
     * Tạo báo cáo tổng quan cho contract
     */
    public Map<String, Object> generateContractOverviewReport(String contractId) {
        Map<String, Object> report = new HashMap<>();
        
        // Thông tin contract cơ bản
        Contract contract = contractRepository.findById(contractId).orElse(null);
        if (contract != null) {
            report.put("contract", contract);
        }
        
        // Thống kê approval
        long totalApprovals = approvalRepository.countByContractIdAndIsDeletedFalse(contractId);
        long pendingApprovals = approvalRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Approval.ApprovalStatus.PENDING);
        long approvedApprovals = approvalRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Approval.ApprovalStatus.APPROVED);
        long rejectedApprovals = approvalRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Approval.ApprovalStatus.REJECTED);
        
        Map<String, Object> approvalStats = new HashMap<>();
        approvalStats.put("total", totalApprovals);
        approvalStats.put("pending", pendingApprovals);
        approvalStats.put("approved", approvedApprovals);
        approvalStats.put("rejected", rejectedApprovals);
        report.put("approvalStats", approvalStats);
        
        // Thống kê version
        long totalVersions = versionRepository.countByContractIdAndIsDeletedFalse(contractId);
        long publishedVersions = versionRepository.countByContractIdAndIsPublishedAndIsDeletedFalse(contractId, true);
        long currentVersions = versionRepository.countByContractIdAndIsCurrentAndIsDeletedFalse(contractId, true);
        
        Map<String, Object> versionStats = new HashMap<>();
        versionStats.put("total", totalVersions);
        versionStats.put("published", publishedVersions);
        versionStats.put("current", currentVersions);
        report.put("versionStats", versionStats);
        
        // Thống kê comment
        long totalComments = commentRepository.countByContractIdAndIsDeletedFalse(contractId);
        long unresolvedComments = commentRepository.countUnresolvedCommentsByContractId(contractId);
        long resolvedComments = commentRepository.countResolvedCommentsByContractId(contractId);
        long pinnedComments = commentRepository.countPinnedCommentsByContractId(contractId);
        
        Map<String, Object> commentStats = new HashMap<>();
        commentStats.put("total", totalComments);
        commentStats.put("unresolved", unresolvedComments);
        commentStats.put("resolved", resolvedComments);
        commentStats.put("pinned", pinnedComments);
        report.put("commentStats", commentStats);
        
        // Thống kê e-signature
        long totalSignatures = eSignatureRepository.countByContractIdAndIsDeletedFalse(contractId);
        long pendingSignatures = eSignatureRepository.countPendingSignaturesByContractId(contractId);
        long signedSignatures = eSignatureRepository.countSignedSignaturesByContractId(contractId);
        long declinedSignatures = eSignatureRepository.countDeclinedSignaturesByContractId(contractId);
        long expiredSignatures = eSignatureRepository.countExpiredSignaturesByContractId(contractId);
        long verifiedSignatures = eSignatureRepository.countVerifiedSignaturesByContractId(contractId);
        
        Map<String, Object> signatureStats = new HashMap<>();
        signatureStats.put("total", totalSignatures);
        signatureStats.put("pending", pendingSignatures);
        signatureStats.put("signed", signedSignatures);
        signatureStats.put("declined", declinedSignatures);
        signatureStats.put("expired", expiredSignatures);
        signatureStats.put("verified", verifiedSignatures);
        report.put("signatureStats", signatureStats);
        
        // Thống kê reminder
        long totalReminders = reminderRepository.countByContractIdAndIsDeletedFalse(contractId);
        long pendingReminders = reminderRepository.countPendingRemindersByContractId(contractId);
        long sentReminders = reminderRepository.countSentRemindersByContractId(contractId);
        long completedReminders = reminderRepository.countCompletedRemindersByContractId(contractId);
        long cancelledReminders = reminderRepository.countCancelledRemindersByContractId(contractId);
        long failedReminders = reminderRepository.countFailedRemindersByContractId(contractId);
        long escalatedReminders = reminderRepository.countEscalatedRemindersByContractId(contractId);
        
        Map<String, Object> reminderStats = new HashMap<>();
        reminderStats.put("total", totalReminders);
        reminderStats.put("pending", pendingReminders);
        reminderStats.put("sent", sentReminders);
        reminderStats.put("completed", completedReminders);
        reminderStats.put("cancelled", cancelledReminders);
        reminderStats.put("failed", failedReminders);
        reminderStats.put("escalated", escalatedReminders);
        report.put("reminderStats", reminderStats);
        
        // Thống kê audit log
        long totalAuditLogs = auditLogRepository.countByContractIdAndIsDeletedFalse(contractId);
        long successfulLogs = auditLogRepository.countSuccessfulLogsByContractId(contractId);
        long failedLogs = auditLogRepository.countFailedLogsByContractId(contractId);
        long warningLogs = auditLogRepository.countWarningLogsByContractId(contractId);
        long infoLogs = auditLogRepository.countInfoLogsByContractId(contractId);
        long highSeverityLogs = auditLogRepository.countHighSeverityLogsByContractId(contractId);
        long criticalSeverityLogs = auditLogRepository.countCriticalSeverityLogsByContractId(contractId);
        
        Map<String, Object> auditLogStats = new HashMap<>();
        auditLogStats.put("total", totalAuditLogs);
        auditLogStats.put("successful", successfulLogs);
        auditLogStats.put("failed", failedLogs);
        auditLogStats.put("warning", warningLogs);
        auditLogStats.put("info", infoLogs);
        auditLogStats.put("highSeverity", highSeverityLogs);
        auditLogStats.put("criticalSeverity", criticalSeverityLogs);
        report.put("auditLogStats", auditLogStats);
        
        // Thời gian tạo báo cáo
        report.put("generatedAt", LocalDateTime.now());
        
        return report;
    }

    /**
     * Tạo báo cáo approval cho contract
     */
    public Map<String, Object> generateApprovalReport(String contractId) {
        Map<String, Object> report = new HashMap<>();
        
        // Thông tin contract
        Contract contract = contractRepository.findById(contractId).orElse(null);
        if (contract != null) {
            report.put("contract", contract);
        }
        
        // Danh sách approval
        List<Approval> approvals = approvalRepository.findByContractIdAndIsDeletedFalse(contractId);
        report.put("approvals", approvals);
        
        // Thống kê theo status
        Map<String, Long> statusStats = new HashMap<>();
        statusStats.put("PENDING", approvalRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Approval.ApprovalStatus.PENDING));
        statusStats.put("APPROVED", approvalRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Approval.ApprovalStatus.APPROVED));
        statusStats.put("REJECTED", approvalRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Approval.ApprovalStatus.REJECTED));
        statusStats.put("CANCELLED", approvalRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Approval.ApprovalStatus.CANCELLED));
        statusStats.put("EXPIRED", approvalRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Approval.ApprovalStatus.EXPIRED));
        report.put("statusStats", statusStats);
        
        // Thống kê theo priority
        Map<String, Long> priorityStats = new HashMap<>();
        priorityStats.put("LOW", approvalRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Approval.ApprovalStatus.PENDING));
        priorityStats.put("MEDIUM", approvalRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Approval.ApprovalStatus.PENDING));
        priorityStats.put("HIGH", approvalRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Approval.ApprovalStatus.PENDING));
        priorityStats.put("URGENT", approvalRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Approval.ApprovalStatus.PENDING));
        report.put("priorityStats", priorityStats);
        
        // Thống kê theo approver role
        Map<String, Long> roleStats = new HashMap<>();
        // Có thể thêm logic để group theo role
        report.put("roleStats", roleStats);
        
        // Thời gian tạo báo cáo
        report.put("generatedAt", LocalDateTime.now());
        
        return report;
    }

    /**
     * Tạo báo cáo version cho contract
     */
    public Map<String, Object> generateVersionReport(String contractId) {
        Map<String, Object> report = new HashMap<>();
        
        // Thông tin contract
        Contract contract = contractRepository.findById(contractId).orElse(null);
        if (contract != null) {
            report.put("contract", contract);
        }
        
        // Danh sách version
        List<Version> versions = versionRepository.findByContractIdAndIsDeletedFalse(contractId);
        report.put("versions", versions);
        
        // Thống kê theo change type
        Map<String, Long> changeTypeStats = new HashMap<>();
        changeTypeStats.put("MAJOR", versionRepository.countByContractIdAndChangeTypeAndIsDeletedFalse(contractId, Version.ChangeType.MAJOR));
        changeTypeStats.put("MINOR", versionRepository.countByContractIdAndChangeTypeAndIsDeletedFalse(contractId, Version.ChangeType.MINOR));
        changeTypeStats.put("PATCH", versionRepository.countByContractIdAndChangeTypeAndIsDeletedFalse(contractId, Version.ChangeType.PATCH));
        changeTypeStats.put("HOTFIX", versionRepository.countByContractIdAndChangeTypeAndIsDeletedFalse(contractId, Version.ChangeType.HOTFIX));
        changeTypeStats.put("DRAFT", versionRepository.countByContractIdAndChangeTypeAndIsDeletedFalse(contractId, Version.ChangeType.DRAFT));
        changeTypeStats.put("ROLLBACK", versionRepository.countByContractIdAndChangeTypeAndIsDeletedFalse(contractId, Version.ChangeType.ROLLBACK));
        report.put("changeTypeStats", changeTypeStats);
        
        // Thống kê theo published status
        Map<String, Long> publishedStats = new HashMap<>();
        publishedStats.put("published", versionRepository.countByContractIdAndIsPublishedAndIsDeletedFalse(contractId, true));
        publishedStats.put("unpublished", versionRepository.countByContractIdAndIsPublishedAndIsDeletedFalse(contractId, false));
        report.put("publishedStats", publishedStats);
        
        // Thống kê theo current status
        Map<String, Long> currentStats = new HashMap<>();
        currentStats.put("current", versionRepository.countByContractIdAndIsCurrentAndIsDeletedFalse(contractId, true));
        currentStats.put("nonCurrent", versionRepository.countByContractIdAndIsCurrentAndIsDeletedFalse(contractId, false));
        report.put("currentStats", currentStats);
        
        // Thời gian tạo báo cáo
        report.put("generatedAt", LocalDateTime.now());
        
        return report;
    }

    /**
     * Tạo báo cáo comment cho contract
     */
    public Map<String, Object> generateCommentReport(String contractId) {
        Map<String, Object> report = new HashMap<>();
        
        // Thông tin contract
        Contract contract = contractRepository.findById(contractId).orElse(null);
        if (contract != null) {
            report.put("contract", contract);
        }
        
        // Danh sách comment
        List<Comment> comments = commentRepository.findByContractIdAndIsDeletedFalse(contractId);
        report.put("comments", comments);
        
        // Thống kê theo status
        Map<String, Long> statusStats = new HashMap<>();
        statusStats.put("ACTIVE", commentRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Comment.CommentStatus.ACTIVE));
        statusStats.put("RESOLVED", commentRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Comment.CommentStatus.RESOLVED));
        statusStats.put("HIDDEN", commentRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Comment.CommentStatus.HIDDEN));
        statusStats.put("DELETED", commentRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Comment.CommentStatus.DELETED));
        report.put("statusStats", statusStats);
        
        // Thống kê theo comment type
        Map<String, Long> typeStats = new HashMap<>();
        typeStats.put("GENERAL", commentRepository.countByContractIdAndCommentTypeAndIsDeletedFalse(contractId, Comment.CommentType.GENERAL));
        typeStats.put("QUESTION", commentRepository.countByContractIdAndCommentTypeAndIsDeletedFalse(contractId, Comment.CommentType.QUESTION));
        typeStats.put("SUGGESTION", commentRepository.countByContractIdAndCommentTypeAndIsDeletedFalse(contractId, Comment.CommentType.SUGGESTION));
        typeStats.put("ISSUE", commentRepository.countByContractIdAndCommentTypeAndIsDeletedFalse(contractId, Comment.CommentType.ISSUE));
        typeStats.put("APPROVAL", commentRepository.countByContractIdAndCommentTypeAndIsDeletedFalse(contractId, Comment.CommentType.APPROVAL));
        typeStats.put("REJECTION", commentRepository.countByContractIdAndCommentTypeAndIsDeletedFalse(contractId, Comment.CommentType.REJECTION));
        typeStats.put("CLARIFICATION", commentRepository.countByContractIdAndCommentTypeAndIsDeletedFalse(contractId, Comment.CommentType.CLARIFICATION));
        typeStats.put("FEEDBACK", commentRepository.countByContractIdAndCommentTypeAndIsDeletedFalse(contractId, Comment.CommentType.FEEDBACK));
        report.put("typeStats", typeStats);
        
        // Thống kê theo priority
        Map<String, Long> priorityStats = new HashMap<>();
        priorityStats.put("LOW", commentRepository.countByContractIdAndPriorityAndIsDeletedFalse(contractId, Comment.CommentPriority.LOW));
        priorityStats.put("MEDIUM", commentRepository.countByContractIdAndPriorityAndIsDeletedFalse(contractId, Comment.CommentPriority.MEDIUM));
        priorityStats.put("HIGH", commentRepository.countByContractIdAndPriorityAndIsDeletedFalse(contractId, Comment.CommentPriority.HIGH));
        priorityStats.put("URGENT", commentRepository.countByContractIdAndPriorityAndIsDeletedFalse(contractId, Comment.CommentPriority.URGENT));
        report.put("priorityStats", priorityStats);
        
        // Thống kê theo visibility
        Map<String, Long> visibilityStats = new HashMap<>();
        visibilityStats.put("PUBLIC", commentRepository.countByContractIdAndVisibility(contractId, Comment.CommentVisibility.PUBLIC));
        visibilityStats.put("PRIVATE", commentRepository.countByContractIdAndVisibility(contractId, Comment.CommentVisibility.PRIVATE));
        visibilityStats.put("INTERNAL", commentRepository.countByContractIdAndVisibility(contractId, Comment.CommentVisibility.INTERNAL));
        visibilityStats.put("RESTRICTED", commentRepository.countByContractIdAndVisibility(contractId, Comment.CommentVisibility.RESTRICTED));
        report.put("visibilityStats", visibilityStats);
        
        // Thời gian tạo báo cáo
        report.put("generatedAt", LocalDateTime.now());
        
        return report;
    }

    /**
     * Tạo báo cáo e-signature cho contract
     */
    public Map<String, Object> generateESignatureReport(String contractId) {
        Map<String, Object> report = new HashMap<>();
        
        // Thông tin contract
        Contract contract = contractRepository.findById(contractId).orElse(null);
        if (contract != null) {
            report.put("contract", contract);
        }
        
        // Danh sách e-signature
        List<ESignature> eSignatures = eSignatureRepository.findByContractIdAndIsDeletedFalse(contractId);
        report.put("eSignatures", eSignatures);
        
        // Thống kê theo status
        Map<String, Long> statusStats = new HashMap<>();
        statusStats.put("PENDING", eSignatureRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, ESignature.SignatureStatus.PENDING));
        statusStats.put("SIGNED", eSignatureRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, ESignature.SignatureStatus.SIGNED));
        statusStats.put("DECLINED", eSignatureRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, ESignature.SignatureStatus.DECLINED));
        statusStats.put("EXPIRED", eSignatureRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, ESignature.SignatureStatus.EXPIRED));
        statusStats.put("CANCELLED", eSignatureRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, ESignature.SignatureStatus.CANCELLED));
        statusStats.put("VERIFIED", eSignatureRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, ESignature.SignatureStatus.VERIFIED));
        statusStats.put("FAILED_VERIFICATION", eSignatureRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, ESignature.SignatureStatus.FAILED_VERIFICATION));
        report.put("statusStats", statusStats);
        
        // Thống kê theo signature type
        Map<String, Long> typeStats = new HashMap<>();
        typeStats.put("ELECTRONIC", eSignatureRepository.countBySignatureTypeAndIsDeletedFalse(ESignature.SignatureType.ELECTRONIC));
        typeStats.put("DIGITAL", eSignatureRepository.countBySignatureTypeAndIsDeletedFalse(ESignature.SignatureType.DIGITAL));
        typeStats.put("BIOMETRIC", eSignatureRepository.countBySignatureTypeAndIsDeletedFalse(ESignature.SignatureType.BIOMETRIC));
        typeStats.put("HANDWRITTEN", eSignatureRepository.countBySignatureTypeAndIsDeletedFalse(ESignature.SignatureType.HANDWRITTEN));
        typeStats.put("TYPED", eSignatureRepository.countBySignatureTypeAndIsDeletedFalse(ESignature.SignatureType.TYPED));
        report.put("typeStats", typeStats);
        
        // Thống kê theo verification method
        Map<String, Long> verificationStats = new HashMap<>();
        verificationStats.put("EMAIL", eSignatureRepository.countByVerificationMethodAndIsDeletedFalse(ESignature.VerificationMethod.EMAIL));
        verificationStats.put("SMS", eSignatureRepository.countByVerificationMethodAndIsDeletedFalse(ESignature.VerificationMethod.SMS));
        verificationStats.put("PHONE", eSignatureRepository.countByVerificationMethodAndIsDeletedFalse(ESignature.VerificationMethod.PHONE));
        verificationStats.put("BIOMETRIC", eSignatureRepository.countByVerificationMethodAndIsDeletedFalse(ESignature.VerificationMethod.BIOMETRIC));
        verificationStats.put("PASSWORD", eSignatureRepository.countByVerificationMethodAndIsDeletedFalse(ESignature.VerificationMethod.PASSWORD));
        verificationStats.put("OTP", eSignatureRepository.countByVerificationMethodAndIsDeletedFalse(ESignature.VerificationMethod.OTP));
        verificationStats.put("CERTIFICATE", eSignatureRepository.countByVerificationMethodAndIsDeletedFalse(ESignature.VerificationMethod.CERTIFICATE));
        report.put("verificationStats", verificationStats);
        
        // Thời gian tạo báo cáo
        report.put("generatedAt", LocalDateTime.now());
        
        return report;
    }

    /**
     * Tạo báo cáo reminder cho contract
     */
    public Map<String, Object> generateReminderReport(String contractId) {
        Map<String, Object> report = new HashMap<>();
        
        // Thông tin contract
        Contract contract = contractRepository.findById(contractId).orElse(null);
        if (contract != null) {
            report.put("contract", contract);
        }
        
        // Danh sách reminder
        List<Reminder> reminders = reminderRepository.findByContractIdAndIsDeletedFalse(contractId);
        report.put("reminders", reminders);
        
        // Thống kê theo status
        Map<String, Long> statusStats = new HashMap<>();
        statusStats.put("PENDING", reminderRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Reminder.ReminderStatus.PENDING));
        statusStats.put("SENT", reminderRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Reminder.ReminderStatus.SENT));
        statusStats.put("ACKNOWLEDGED", reminderRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Reminder.ReminderStatus.ACKNOWLEDGED));
        statusStats.put("COMPLETED", reminderRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Reminder.ReminderStatus.COMPLETED));
        statusStats.put("CANCELLED", reminderRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Reminder.ReminderStatus.CANCELLED));
        statusStats.put("FAILED", reminderRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Reminder.ReminderStatus.FAILED));
        statusStats.put("ESCALATED", reminderRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, Reminder.ReminderStatus.ESCALATED));
        report.put("statusStats", statusStats);
        
        // Thống kê theo reminder type
        Map<String, Long> typeStats = new HashMap<>();
        typeStats.put("DEADLINE", reminderRepository.countByContractIdAndReminderTypeAndIsDeletedFalse(contractId, Reminder.ReminderType.DEADLINE));
        typeStats.put("APPROVAL", reminderRepository.countByContractIdAndReminderTypeAndIsDeletedFalse(contractId, Reminder.ReminderType.APPROVAL));
        typeStats.put("REVIEW", reminderRepository.countByContractIdAndReminderTypeAndIsDeletedFalse(contractId, Reminder.ReminderType.REVIEW));
        typeStats.put("RENEWAL", reminderRepository.countByContractIdAndReminderTypeAndIsDeletedFalse(contractId, Reminder.ReminderType.RENEWAL));
        typeStats.put("PAYMENT", reminderRepository.countByContractIdAndReminderTypeAndIsDeletedFalse(contractId, Reminder.ReminderType.PAYMENT));
        typeStats.put("MEETING", reminderRepository.countByContractIdAndReminderTypeAndIsDeletedFalse(contractId, Reminder.ReminderType.MEETING));
        typeStats.put("FOLLOW_UP", reminderRepository.countByContractIdAndReminderTypeAndIsDeletedFalse(contractId, Reminder.ReminderType.FOLLOW_UP));
        typeStats.put("CUSTOM", reminderRepository.countByContractIdAndReminderTypeAndIsDeletedFalse(contractId, Reminder.ReminderType.CUSTOM));
        report.put("typeStats", typeStats);
        
        // Thống kê theo priority
        Map<String, Long> priorityStats = new HashMap<>();
        priorityStats.put("LOW", reminderRepository.countByContractIdAndPriorityAndIsDeletedFalse(contractId, Reminder.ReminderPriority.LOW));
        priorityStats.put("MEDIUM", reminderRepository.countByContractIdAndPriorityAndIsDeletedFalse(contractId, Reminder.ReminderPriority.MEDIUM));
        priorityStats.put("HIGH", reminderRepository.countByContractIdAndPriorityAndIsDeletedFalse(contractId, Reminder.ReminderPriority.HIGH));
        priorityStats.put("URGENT", reminderRepository.countByContractIdAndPriorityAndIsDeletedFalse(contractId, Reminder.ReminderPriority.URGENT));
        priorityStats.put("CRITICAL", reminderRepository.countByContractIdAndPriorityAndIsDeletedFalse(contractId, Reminder.ReminderPriority.CRITICAL));
        report.put("priorityStats", priorityStats);
        
        // Thời gian tạo báo cáo
        report.put("generatedAt", LocalDateTime.now());
        
        return report;
    }

    /**
     * Tạo báo cáo audit log cho contract
     */
    public Map<String, Object> generateAuditLogReport(String contractId) {
        Map<String, Object> report = new HashMap<>();
        
        // Thông tin contract
        Contract contract = contractRepository.findById(contractId).orElse(null);
        if (contract != null) {
            report.put("contract", contract);
        }
        
        // Danh sách audit log
        List<AuditLog> auditLogs = auditLogRepository.findByContractIdAndIsDeletedFalse(contractId);
        report.put("auditLogs", auditLogs);
        
        // Thống kê theo event category
        Map<String, Long> categoryStats = new HashMap<>();
        categoryStats.put("AUTHENTICATION", auditLogRepository.countByContractIdAndEventCategoryAndIsDeletedFalse(contractId, AuditLog.EventCategory.AUTHENTICATION));
        categoryStats.put("AUTHORIZATION", auditLogRepository.countByContractIdAndEventCategoryAndIsDeletedFalse(contractId, AuditLog.EventCategory.AUTHORIZATION));
        categoryStats.put("DATA_ACCESS", auditLogRepository.countByContractIdAndEventCategoryAndIsDeletedFalse(contractId, AuditLog.EventCategory.DATA_ACCESS));
        categoryStats.put("DATA_MODIFICATION", auditLogRepository.countByContractIdAndEventCategoryAndIsDeletedFalse(contractId, AuditLog.EventCategory.DATA_MODIFICATION));
        categoryStats.put("SYSTEM_EVENT", auditLogRepository.countByContractIdAndEventCategoryAndIsDeletedFalse(contractId, AuditLog.EventCategory.SYSTEM_EVENT));
        categoryStats.put("SECURITY_EVENT", auditLogRepository.countByContractIdAndEventCategoryAndIsDeletedFalse(contractId, AuditLog.EventCategory.SECURITY_EVENT));
        categoryStats.put("BUSINESS_EVENT", auditLogRepository.countByContractIdAndEventCategoryAndIsDeletedFalse(contractId, AuditLog.EventCategory.BUSINESS_EVENT));
        categoryStats.put("ERROR_EVENT", auditLogRepository.countByContractIdAndEventCategoryAndIsDeletedFalse(contractId, AuditLog.EventCategory.ERROR_EVENT));
        report.put("categoryStats", categoryStats);
        
        // Thống kê theo status
        Map<String, Long> statusStats = new HashMap<>();
        statusStats.put("SUCCESS", auditLogRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, AuditLog.AuditStatus.SUCCESS));
        statusStats.put("FAILURE", auditLogRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, AuditLog.AuditStatus.FAILURE));
        statusStats.put("WARNING", auditLogRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, AuditLog.AuditStatus.WARNING));
        statusStats.put("INFO", auditLogRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, AuditLog.AuditStatus.INFO));
        report.put("statusStats", statusStats);
        
        // Thống kê theo severity
        Map<String, Long> severityStats = new HashMap<>();
        severityStats.put("LOW", auditLogRepository.countByContractIdAndSeverityAndIsDeletedFalse(contractId, AuditLog.SeverityLevel.LOW));
        severityStats.put("MEDIUM", auditLogRepository.countByContractIdAndSeverityAndIsDeletedFalse(contractId, AuditLog.SeverityLevel.MEDIUM));
        severityStats.put("HIGH", auditLogRepository.countByContractIdAndSeverityAndIsDeletedFalse(contractId, AuditLog.SeverityLevel.HIGH));
        severityStats.put("CRITICAL", auditLogRepository.countByContractIdAndSeverityAndIsDeletedFalse(contractId, AuditLog.SeverityLevel.CRITICAL));
        report.put("severityStats", severityStats);
        
        // Thời gian tạo báo cáo
        report.put("generatedAt", LocalDateTime.now());
        
        return report;
    }

    /**
     * Tạo báo cáo tổng hợp cho tất cả contracts
     */
    public Map<String, Object> generateOverallReport() {
        Map<String, Object> report = new HashMap<>();
        
        // Thống kê tổng quan
        long totalContracts = contractRepository.count();
        long totalApprovals = approvalRepository.count();
        long totalVersions = versionRepository.count();
        long totalComments = commentRepository.count();
        long totalESignatures = eSignatureRepository.count();
        long totalReminders = reminderRepository.count();
        long totalAuditLogs = auditLogRepository.count();
        
        Map<String, Long> overallStats = new HashMap<>();
        overallStats.put("totalContracts", totalContracts);
        overallStats.put("totalApprovals", totalApprovals);
        overallStats.put("totalVersions", totalVersions);
        overallStats.put("totalComments", totalComments);
        overallStats.put("totalESignatures", totalESignatures);
        overallStats.put("totalReminders", totalReminders);
        overallStats.put("totalAuditLogs", totalAuditLogs);
        report.put("overallStats", overallStats);
        
        // Thời gian tạo báo cáo
        report.put("generatedAt", LocalDateTime.now());
        
        return report;
    }
}
