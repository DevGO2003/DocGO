package com.devgo2003.docgo.document_service.repository;

import com.devgo2003.docgo.document_service.entity.Approval;
import com.devgo2003.docgo.document_service.entity.Contract;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository cho quản lý quy trình phê duyệt hợp đồng
 */
@Repository
public interface ApprovalRepository extends MongoRepository<Approval, String> {

    /**
     * Tìm tất cả approval chưa bị xóa
     */
    List<Approval> findByIsDeletedFalse();

    /**
     * Tìm tất cả approval theo contract ID
     */
    List<Approval> findByContractIdAndIsDeletedFalse(String contractId);

    /**
     * Tìm approval theo contract ID và status
     */
    List<Approval> findByContractIdAndStatusAndIsDeletedFalse(String contractId, Approval.ApprovalStatus status);

    /**
     * Tìm approval theo contract ID và approver ID
     */
    List<Approval> findByContractIdAndApproverIdAndIsDeletedFalse(String contractId, String approverId);

    /**
     * Tìm approval theo contract ID và priority
     */
    List<Approval> findByContractIdAndPriorityAndIsDeletedFalse(String contractId, Approval.ApprovalPriority priority);

    /**
     * Tìm approval đang PENDING_REVIEW theo contract ID
     */
    @Query("{ 'contractId': ?0, 'status': 'PENDING_REVIEW', 'isDeleted': false }")
    List<Approval> findPendingApprovalsByContractId(String contractId);

    /**
     * Tìm approval đã approved theo contract ID
     */
    @Query("{ 'contractId': ?0, 'status': 'APPROVED', 'isDeleted': false }")
    List<Approval> findApprovedApprovalsByContractId(String contractId);

    /**
     * Tìm approval đã rejected theo contract ID
     */
    @Query("{ 'contractId': ?0, 'status': 'REJECTED', 'isDeleted': false }")
    List<Approval> findRejectedApprovalsByContractId(String contractId);

    /**
     * Tìm approval theo approver ID và status
     */
    List<Approval> findByApproverIdAndStatusAndIsDeletedFalse(String approverId, Approval.ApprovalStatus status);

    /**
     * Tìm approval theo approver ID
     */
    List<Approval> findByApproverIdAndIsDeletedFalse(String approverId);

    /**
     * Tìm approval theo approver email và status
     */
    List<Approval> findByApproverEmailAndStatusAndIsDeletedFalse(String approverEmail, Approval.ApprovalStatus status);

    /**
     * Tìm approval theo approver email
     */
    List<Approval> findByApproverEmailAndIsDeletedFalse(String approverEmail);

    /**
     * Tìm approval theo approver role và status
     */
    List<Approval> findByApproverRoleAndStatusAndIsDeletedFalse(String approverRole, Approval.ApprovalStatus status);

    /**
     * Tìm approval theo approver role
     */
    List<Approval> findByApproverRoleAndIsDeletedFalse(String approverRole);

    /**
     * Tìm approval sắp hết hạn
     */
    @Query("{ 'dueDate': { $lte: ?0 }, 'status': 'PENDING_REVIEW', 'isDeleted': false }")
    List<Approval> findExpiringApprovals(LocalDateTime dueDate);

    /**
     * Tìm approval đã hết hạn
     */
    @Query("{ 'dueDate': { $lt: ?0 }, 'status': 'PENDING_REVIEW', 'isDeleted': false }")
    List<Approval> findExpiredApprovals(LocalDateTime currentTime);

    /**
     * Tìm approval theo priority và status
     */
    List<Approval> findByPriorityAndStatusAndIsDeletedFalse(Approval.ApprovalPriority priority, Approval.ApprovalStatus status);

    /**
     * Tìm approval theo approval order
     */
    List<Approval> findByContractIdAndApprovalOrderAndIsDeletedFalse(String contractId, Integer approvalOrder);

    /**
     * Tìm approval theo isRequired
     */
    List<Approval> findByContractIdAndIsRequiredAndIsDeletedFalse(String contractId, Boolean isRequired);

    /**
     * Đếm số approval theo contract ID và status
     */
    long countByContractIdAndStatusAndIsDeletedFalse(String contractId, Approval.ApprovalStatus status);
    
    /**
     * Đếm số approval theo contract ID
     */
    long countByContractIdAndIsDeletedFalse(String contractId);

    /**
     * Đếm số approval theo approver ID và status
     */
    long countByApproverIdAndStatusAndIsDeletedFalse(String approverId, Approval.ApprovalStatus status);

    /**
     * Tìm approval theo contract ID và approval order (sắp xếp theo thứ tự)
     */
    @Query("{ 'contractId': ?0, 'isDeleted': false }")
    List<Approval> findByContractIdOrderByApprovalOrderAsc(String contractId);

    /**
     * Tìm approval theo contract ID và status (sắp xếp theo thời gian tạo)
     */
    @Query("{ 'contractId': ?0, 'status': ?1, 'isDeleted': false }")
    List<Approval> findByContractIdAndStatusOrderByCreatedAtDesc(String contractId, Approval.ApprovalStatus status);

    /**
     * Tìm approval theo approver ID (sắp xếp theo thời gian tạo)
     */
    @Query("{ 'approverId': ?0, 'isDeleted': false }")
    List<Approval> findByApproverIdOrderByCreatedAtDesc(String approverId);

    /**
     * Tìm approval theo contract ID và priority (sắp xếp theo thứ tự ưu tiên)
     */
    @Query("{ 'contractId': ?0, 'priority': ?1, 'isDeleted': false }")
    List<Approval> findByContractIdAndPriorityOrderByApprovalOrderAsc(String contractId, Approval.ApprovalPriority priority);

    /**
     * Tìm approval theo thời gian tạo trong khoảng
     */
    @Query("{ 'createdAt': { $gte: ?0, $lte: ?1 }, 'isDeleted': false }")
    List<Approval> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Tìm approval theo thời gian approved trong khoảng
     */
    @Query("{ 'approvedAt': { $gte: ?0, $lte: ?1 }, 'status': 'APPROVED', 'isDeleted': false }")
    List<Approval> findByApprovedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Tìm approval theo thời gian rejected trong khoảng
     */
    @Query("{ 'rejectedAt': { $gte: ?0, $lte: ?1 }, 'status': 'REJECTED', 'isDeleted': false }")
    List<Approval> findByRejectedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Tìm approval có reminder count lớn hơn giá trị cho trước
     */
    @Query("{ 'reminderCount': { $gt: ?0 }, 'status': 'PENDING_REVIEW', 'isDeleted': false }")
    List<Approval> findApprovalsWithHighReminderCount(Integer reminderCount);

    /**
     * Tìm approval theo contract ID và approver role
     */
    List<Approval> findByContractIdAndApproverRoleAndIsDeletedFalse(String contractId, String approverRole);

    /**
     * Tìm approval theo contract ID và approver role và status
     */
    List<Approval> findByContractIdAndApproverRoleAndStatusAndIsDeletedFalse(String contractId, String approverRole, Approval.ApprovalStatus status);

    /**
     * Kiểm tra xem có approval nào đang PENDING_REVIEW cho contract không
     */
    @Query("{ 'contractId': ?0, 'status': 'PENDING_REVIEW', 'isDeleted': false }")
    boolean existsByContractIdAndStatusPending(String contractId);

    /**
     * Kiểm tra xem có approval nào đã approved cho contract không
     */
    @Query("{ 'contractId': ?0, 'status': 'APPROVED', 'isDeleted': false }")
    boolean existsByContractIdAndStatusApproved(String contractId);

    /**
     * Kiểm tra xem có approval nào đã rejected cho contract không
     */
    @Query("{ 'contractId': ?0, 'status': 'REJECTED', 'isDeleted': false }")
    boolean existsByContractIdAndStatusRejected(String contractId);

    /**
     * Tìm approval theo contract ID và isRequired = true
     */
    @Query("{ 'contractId': ?0, 'isRequired': true, 'isDeleted': false }")
    List<Approval> findRequiredApprovalsByContractId(String contractId);

    /**
     * Tìm approval theo contract ID và isRequired = false
     */
    @Query("{ 'contractId': ?0, 'isRequired': false, 'isDeleted': false }")
    List<Approval> findOptionalApprovalsByContractId(String contractId);

    /**
     * Tìm approval theo contract ID và due date trong khoảng
     */
    @Query("{ 'contractId': ?0, 'dueDate': { $gte: ?1, $lte: ?2 }, 'isDeleted': false }")
    List<Approval> findByContractIdAndDueDateBetween(String contractId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Tìm approval theo contract ID và due date sắp tới
     */
    @Query("{ 'contractId': ?0, 'dueDate': { $lte: ?1 }, 'status': 'PENDING_REVIEW', 'isDeleted': false }")
    List<Approval> findUpcomingDueApprovalsByContractId(String contractId, LocalDateTime dueDate);

    /**
     * Tìm approval theo contract ID và notification status
     */
    @Query("{ 'contractId': ?0, 'notifiedAt': { $exists: true }, 'isDeleted': false }")
    List<Approval> findNotifiedApprovalsByContractId(String contractId);

    /**
     * Tìm approval theo contract ID và chưa được notify
     */
    @Query("{ 'contractId': ?0, 'notifiedAt': { $exists: false }, 'status': 'PENDING_REVIEW', 'isDeleted': false }")
    List<Approval> findUnnotifiedApprovalsByContractId(String contractId);
}
