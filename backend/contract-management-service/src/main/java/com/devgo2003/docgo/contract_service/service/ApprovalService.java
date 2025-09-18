package com.devgo2003.docgo.contract_service.service;

import com.devgo2003.docgo.contract_service.entity.Approval;
import com.devgo2003.docgo.contract_service.entity.Contract;
import com.devgo2003.docgo.contract_service.dto.ApprovalCreateRequest;
import com.devgo2003.docgo.contract_service.repository.ApprovalRepository;
import com.devgo2003.docgo.contract_service.repository.ContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ApprovalService {

    @Autowired
    private ApprovalRepository approvalRepository;

    @Autowired
    private ContractRepository contractRepository;

    /**
     * Tạo approval mới cho contract
     */
    public Approval createApproval(String contractId, String approverId, String approverName, 
                                 String approverEmail, String approverRole, Approval.ApprovalPriority priority) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        Approval approval = new Approval(contract, approverId, approverName, approverEmail, approverRole, priority);
        approval.setContractId(contractId);
        approval.initializeNewEntity();
        
        return approvalRepository.save(approval);
    }

    /**
     * Tạo approval mới từ ApprovalCreateRequest
     */
    public Approval createApproval(ApprovalCreateRequest request) {
        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        Approval approval = new Approval(contract, request.getApproverId(), request.getApproverName(), 
                                       request.getApproverEmail(), request.getApproverRole(), request.getPriority());
        approval.setContractId(request.getContractId());
        approval.setDueDate(request.getDueDate());
        approval.setApprovalOrder(request.getApprovalOrder());
        approval.setIsRequired(request.getIsRequired());
        approval.setComments(request.getComments());
        approval.initializeNewEntity();
        
        return approvalRepository.save(approval);
    }

    /**
     * Lấy tất cả approval
     */
    public List<Approval> getAllApprovals() {
        return approvalRepository.findByIsDeletedFalse();
    }

    /**
     * Lấy tất cả approval theo contract ID
     */
    public List<Approval> getApprovalsByContractId(String contractId) {
        return approvalRepository.findByContractIdAndIsDeletedFalse(contractId);
    }

    /**
     * Lấy approval theo ID
     */
    public Optional<Approval> getApprovalById(String id) {
        return approvalRepository.findById(id);
    }

    /**
     * Lấy approval đang pending theo contract ID
     */
    public List<Approval> getPendingApprovalsByContractId(String contractId) {
        return approvalRepository.findPendingApprovalsByContractId(contractId);
    }

    /**
     * Lấy approval đã approved theo contract ID
     */
    public List<Approval> getApprovedApprovalsByContractId(String contractId) {
        return approvalRepository.findApprovedApprovalsByContractId(contractId);
    }

    /**
     * Lấy approval đã rejected theo contract ID
     */
    public List<Approval> getRejectedApprovalsByContractId(String contractId) {
        return approvalRepository.findRejectedApprovalsByContractId(contractId);
    }

    /**
     * Lấy approval theo approver ID
     */
    public List<Approval> getApprovalsByApproverId(String approverId) {
        return approvalRepository.findByApproverIdAndIsDeletedFalse(approverId);
    }

    /**
     * Lấy approval theo approver email
     */
    public List<Approval> getApprovalsByApproverEmail(String approverEmail) {
        return approvalRepository.findByApproverEmailAndIsDeletedFalse(approverEmail);
    }

    /**
     * Lấy approval theo approver role
     */
    public List<Approval> getApprovalsByApproverRole(String approverRole) {
        return approvalRepository.findByApproverRoleAndIsDeletedFalse(approverRole);
    }

    /**
     * Lấy approval sắp hết hạn
     */
    public List<Approval> getExpiringApprovals(LocalDateTime dueDate) {
        return approvalRepository.findExpiringApprovals(dueDate);
    }

    /**
     * Lấy approval đã hết hạn
     */
    public List<Approval> getExpiredApprovals(LocalDateTime currentTime) {
        return approvalRepository.findExpiredApprovals(currentTime);
    }

    /**
     * Lấy approval theo priority
     */
    public List<Approval> getApprovalsByPriority(Approval.ApprovalPriority priority) {
        return approvalRepository.findByPriorityAndStatusAndIsDeletedFalse(priority, Approval.ApprovalStatus.PENDING);
    }

    /**
     * Lấy approval theo approval order
     */
    public List<Approval> getApprovalsByOrder(String contractId, Integer approvalOrder) {
        return approvalRepository.findByContractIdAndApprovalOrderAndIsDeletedFalse(contractId, approvalOrder);
    }

    /**
     * Lấy approval theo isRequired
     */
    public List<Approval> getRequiredApprovalsByContractId(String contractId) {
        return approvalRepository.findRequiredApprovalsByContractId(contractId);
    }

    /**
     * Lấy approval theo isRequired = false
     */
    public List<Approval> getOptionalApprovalsByContractId(String contractId) {
        return approvalRepository.findOptionalApprovalsByContractId(contractId);
    }

    /**
     * Lấy approval theo due date trong khoảng
     */
    public List<Approval> getApprovalsByDueDateRange(String contractId, LocalDateTime startDate, LocalDateTime endDate) {
        return approvalRepository.findByContractIdAndDueDateBetween(contractId, startDate, endDate);
    }

    /**
     * Lấy approval sắp đến hạn
     */
    public List<Approval> getUpcomingDueApprovals(String contractId, LocalDateTime dueDate) {
        return approvalRepository.findUpcomingDueApprovalsByContractId(contractId, dueDate);
    }

    /**
     * Lấy approval đã được notify
     */
    public List<Approval> getNotifiedApprovals(String contractId) {
        return approvalRepository.findNotifiedApprovalsByContractId(contractId);
    }

    /**
     * Lấy approval chưa được notify
     */
    public List<Approval> getUnnotifiedApprovals(String contractId) {
        return approvalRepository.findUnnotifiedApprovalsByContractId(contractId);
    }

    /**
     * Approve approval
     */
    public Approval approveApproval(String id, String comments) {
        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approval not found"));
        
        approval.approve(comments);
        approval.setUpdatedAt(LocalDateTime.now());
        
        return approvalRepository.save(approval);
    }

    /**
     * Reject approval
     */
    public Approval rejectApproval(String id, String rejectionReason) {
        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approval not found"));
        
        approval.reject(rejectionReason);
        approval.setUpdatedAt(LocalDateTime.now());
        
        return approvalRepository.save(approval);
    }

    /**
     * Cancel approval
     */
    public Approval cancelApproval(String id) {
        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approval not found"));
        
        approval.cancel();
        approval.setUpdatedAt(LocalDateTime.now());
        
        return approvalRepository.save(approval);
    }

    /**
     * Mark approval as expired
     */
    public Approval markApprovalAsExpired(String id) {
        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approval not found"));
        
        approval.markAsExpired();
        approval.setUpdatedAt(LocalDateTime.now());
        
        return approvalRepository.save(approval);
    }

    /**
     * Increment reminder count
     */
    public Approval incrementReminderCount(String id) {
        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approval not found"));
        
        approval.incrementReminderCount();
        approval.setUpdatedAt(LocalDateTime.now());
        
        return approvalRepository.save(approval);
    }

    /**
     * Set notification time
     */
    public Approval setNotificationTime(String id) {
        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approval not found"));
        
        approval.setNotifiedAt(LocalDateTime.now());
        approval.setUpdatedAt(LocalDateTime.now());
        
        return approvalRepository.save(approval);
    }

    /**
     * Set due date
     */
    public Approval setDueDate(String id, LocalDateTime dueDate) {
        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approval not found"));
        
        approval.setDueDate(dueDate);
        approval.setUpdatedAt(LocalDateTime.now());
        
        return approvalRepository.save(approval);
    }

    /**
     * Set priority
     */
    public Approval setPriority(String id, Approval.ApprovalPriority priority) {
        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approval not found"));
        
        approval.setPriority(priority);
        approval.setUpdatedAt(LocalDateTime.now());
        
        return approvalRepository.save(approval);
    }

    /**
     * Set approval order
     */
    public Approval setApprovalOrder(String id, Integer approvalOrder) {
        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approval not found"));
        
        approval.setApprovalOrder(approvalOrder);
        approval.setUpdatedAt(LocalDateTime.now());
        
        return approvalRepository.save(approval);
    }

    /**
     * Set isRequired
     */
    public Approval setIsRequired(String id, Boolean isRequired) {
        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approval not found"));
        
        approval.setIsRequired(isRequired);
        approval.setUpdatedAt(LocalDateTime.now());
        
        return approvalRepository.save(approval);
    }

    /**
     * Soft delete approval
     */
    public void deleteApproval(String id, String deletedBy) {
        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approval not found"));
        
        approval.markAsDeleted(deletedBy);
        approval.setUpdatedAt(LocalDateTime.now());
        
        approvalRepository.save(approval);
    }

    /**
     * Restore approval
     */
    public Approval restoreApproval(String id) {
        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Approval not found"));
        
        approval.restore();
        approval.setUpdatedAt(LocalDateTime.now());
        
        return approvalRepository.save(approval);
    }

    /**
     * Đếm số approval theo contract ID và status
     */
    public long countApprovalsByContractIdAndStatus(String contractId, Approval.ApprovalStatus status) {
        return approvalRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, status);
    }

    /**
     * Đếm số approval theo approver ID và status
     */
    public long countApprovalsByApproverIdAndStatus(String approverId, Approval.ApprovalStatus status) {
        return approvalRepository.countByApproverIdAndStatusAndIsDeletedFalse(approverId, status);
    }

    /**
     * Kiểm tra xem có approval nào đang pending cho contract không
     */
    public boolean hasPendingApprovals(String contractId) {
        return approvalRepository.existsByContractIdAndStatusPending(contractId);
    }

    /**
     * Kiểm tra xem có approval nào đã approved cho contract không
     */
    public boolean hasApprovedApprovals(String contractId) {
        return approvalRepository.existsByContractIdAndStatusApproved(contractId);
    }

    /**
     * Kiểm tra xem có approval nào đã rejected cho contract không
     */
    public boolean hasRejectedApprovals(String contractId) {
        return approvalRepository.existsByContractIdAndStatusRejected(contractId);
    }

    /**
     * Kiểm tra xem có approval nào đã hết hạn không
     */
    public boolean hasExpiredApprovals(String contractId) {
        List<Approval> expiredApprovals = approvalRepository.findExpiredApprovals(LocalDateTime.now());
        return !expiredApprovals.isEmpty();
    }

    /**
     * Kiểm tra xem có approval nào sắp hết hạn không
     */
    public boolean hasExpiringApprovals(String contractId, LocalDateTime dueDate) {
        List<Approval> expiringApprovals = approvalRepository.findExpiringApprovals(dueDate);
        return !expiringApprovals.isEmpty();
    }

    /**
     * Kiểm tra xem có approval nào cần reminder không
     */
    public boolean hasApprovalsNeedingReminder(String contractId, Integer reminderCount) {
        List<Approval> remindersNeeded = approvalRepository.findApprovalsWithHighReminderCount(reminderCount);
        return !remindersNeeded.isEmpty();
    }

    /**
     * Kiểm tra xem có approval nào theo approver role không
     */
    public boolean hasApprovalsByRole(String contractId, String approverRole) {
        List<Approval> roleApprovals = approvalRepository.findByContractIdAndApproverRoleAndIsDeletedFalse(contractId, approverRole);
        return !roleApprovals.isEmpty();
    }

    /**
     * Kiểm tra xem có approval nào theo approver role và status không
     */
    public boolean hasApprovalsByRoleAndStatus(String contractId, String approverRole, Approval.ApprovalStatus status) {
        List<Approval> roleStatusApprovals = approvalRepository.findByContractIdAndApproverRoleAndStatusAndIsDeletedFalse(contractId, approverRole, status);
        return !roleStatusApprovals.isEmpty();
    }
}
