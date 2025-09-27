package com.devgo2003.docgo.document_service.repository;

import com.devgo2003.docgo.document_service.entity.Version;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository cho quản lý phiên bản và lịch sử thay đổi hợp đồng
 */
@Repository
public interface VersionRepository extends MongoRepository<Version, String> {
    /**
     * Lấy tất cả version chưa bị xóa mềm
     */
    List<Version> findByIsDeletedFalse();

    /**
     * Tìm tất cả version theo contract ID
     */
    List<Version> findByContractIdAndIsDeletedFalse(String contractId);

    /**
     * Tìm version theo contract ID và version number
     */
    Optional<Version> findByContractIdAndVersionNumberAndIsDeletedFalse(String contractId, String versionNumber);

    /**
     * Tìm version hiện tại của contract
     */
    @Query("{ 'contractId': ?0, 'isCurrent': true, 'isDeleted': false }")
    Optional<Version> findCurrentVersionByContractId(String contractId);

    /**
     * Tìm version đã published
     */
    @Query("{ 'contractId': ?0, 'isPublished': true, 'isDeleted': false }")
    List<Version> findPublishedVersionsByContractId(String contractId);

    /**
     * Tìm version chưa published
     */
    @Query("{ 'contractId': ?0, 'isPublished': false, 'isDeleted': false }")
    List<Version> findUnpublishedVersionsByContractId(String contractId);

    /**
     * Tìm version theo change type
     */
    List<Version> findByContractIdAndChangeTypeAndIsDeletedFalse(String contractId, Version.ChangeType changeType);

    /**
     * Tìm version theo contract ID và isCurrent
     */
    List<Version> findByContractIdAndIsCurrentAndIsDeletedFalse(String contractId, Boolean isCurrent);

    /**
     * Tìm version theo contract ID và isPublished
     */
    List<Version> findByContractIdAndIsPublishedAndIsDeletedFalse(String contractId, Boolean isPublished);

    /**
     * Tìm version theo contract ID và approval required
     */
    @Query("{ 'contractId': ?0, 'approvalRequired': true, 'isDeleted': false }")
    List<Version> findApprovalRequiredVersionsByContractId(String contractId);

    /**
     * Tìm version theo contract ID và approval required = false
     */
    @Query("{ 'contractId': ?0, 'approvalRequired': false, 'isDeleted': false }")
    List<Version> findNoApprovalRequiredVersionsByContractId(String contractId);

    /**
     * Tìm version theo previous version ID
     */
    List<Version> findByPreviousVersionIdAndIsDeletedFalse(String previousVersionId);

    /**
     * Tìm version theo contract ID (sắp xếp theo version number)
     */
    @Query("{ 'contractId': ?0, 'isDeleted': false }")
    List<Version> findByContractIdOrderByVersionNumberDesc(String contractId);

    /**
     * Tìm version theo contract ID (sắp xếp theo thời gian tạo)
     */
    @Query("{ 'contractId': ?0, 'isDeleted': false }")
    List<Version> findByContractIdOrderByCreatedAtDesc(String contractId);

    /**
     * Tìm version theo contract ID và change type (sắp xếp theo thời gian tạo)
     */
    @Query("{ 'contractId': ?0, 'changeType': ?1, 'isDeleted': false }")
    List<Version> findByContractIdAndChangeTypeOrderByCreatedAtDesc(String contractId, Version.ChangeType changeType);

    /**
     * Tìm version theo thời gian tạo trong khoảng
     */
    @Query("{ 'createdAt': { $gte: ?0, $lte: ?1 }, 'isDeleted': false }")
    List<Version> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Tìm version theo thời gian published trong khoảng
     */
    @Query("{ 'publishedAt': { $gte: ?0, $lte: ?1 }, 'isPublished': true, 'isDeleted': false }")
    List<Version> findByPublishedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Tìm version theo thời gian approved trong khoảng
     */
    @Query("{ 'approvedAt': { $gte: ?0, $lte: ?1 }, 'isDeleted': false }")
    List<Version> findByApprovedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Tìm version theo published by
     */
    @Query("{ 'publishedBy': ?0, 'isPublished': true, 'isDeleted': false }")
    List<Version> findByPublishedBy(String publishedBy);

    /**
     * Tìm version theo approved by
     */
    @Query("{ 'approvedBy': ?0, 'isDeleted': false }")
    List<Version> findByApprovedBy(String approvedBy);

    /**
     * Tìm version theo tags
     */
    @Query("{ 'tags': { $in: ?0 }, 'isDeleted': false }")
    List<Version> findByTagsIn(String[] tags);

    /**
     * Tìm version theo contract ID và tags
     */
    @Query("{ 'contractId': ?0, 'tags': { $in: ?1 }, 'isDeleted': false }")
    List<Version> findByContractIdAndTagsIn(String contractId, String[] tags);

    /**
     * Tìm version theo change type (sắp xếp theo thời gian tạo)
     */
    @Query("{ 'changeType': ?0, 'isDeleted': false }")
    List<Version> findByChangeTypeOrderByCreatedAtDesc(Version.ChangeType changeType);

    /**
     * Tìm version theo contract ID và change type (sắp xếp theo version number)
     */
    @Query("{ 'contractId': ?0, 'changeType': ?1, 'isDeleted': false }")
    List<Version> findByContractIdAndChangeTypeOrderByVersionNumberDesc(String contractId, Version.ChangeType changeType);

    /**
     * Tìm version theo contract ID và isCurrent = true
     */
    @Query("{ 'contractId': ?0, 'isCurrent': true, 'isDeleted': false }")
    List<Version> findCurrentVersionsByContractId(String contractId);


    /**
     * Tìm version theo contract ID và previous version ID
     */
    List<Version> findByContractIdAndPreviousVersionIdAndIsDeletedFalse(String contractId, String previousVersionId);

    /**
     * Tìm version theo contract ID và file path
     */
    List<Version> findByContractIdAndFilePathAndIsDeletedFalse(String contractId, String filePath);

    /**
     * Tìm version theo contract ID và checksum
     */
    List<Version> findByContractIdAndChecksumAndIsDeletedFalse(String contractId, String checksum);

    /**
     * Tìm version theo contract ID và file size
     */
    List<Version> findByContractIdAndFileSizeAndIsDeletedFalse(String contractId, Long fileSize);

    /**
     * Tìm version theo contract ID và file size trong khoảng
     */
    @Query("{ 'contractId': ?0, 'fileSize': { $gte: ?1, $lte: ?2 }, 'isDeleted': false }")
    List<Version> findByContractIdAndFileSizeBetween(String contractId, Long minSize, Long maxSize);

    /**
     * Tìm version theo contract ID và rollback reason
     */
    @Query("{ 'contractId': ?0, 'rollbackReason': { $exists: true }, 'isDeleted': false }")
    List<Version> findRollbackVersionsByContractId(String contractId);

    /**
     * Tìm version theo contract ID và change type = ROLLBACK
     */
    @Query("{ 'contractId': ?0, 'changeType': 'ROLLBACK', 'isDeleted': false }")
    List<Version> findRollbackVersionsByContractIdAndChangeType(String contractId);

    /**
     * Tìm version theo contract ID và change type = DRAFT
     */
    @Query("{ 'contractId': ?0, 'changeType': 'DRAFT', 'isDeleted': false }")
    List<Version> findDraftVersionsByContractId(String contractId);

    /**
     * Tìm version theo contract ID và change type = MAJOR
     */
    @Query("{ 'contractId': ?0, 'changeType': 'MAJOR', 'isDeleted': false }")
    List<Version> findMajorVersionsByContractId(String contractId);

    /**
     * Tìm version theo contract ID và change type = MINOR
     */
    @Query("{ 'contractId': ?0, 'changeType': 'MINOR', 'isDeleted': false }")
    List<Version> findMinorVersionsByContractId(String contractId);

    /**
     * Tìm version theo contract ID và change type = PATCH
     */
    @Query("{ 'contractId': ?0, 'changeType': 'PATCH', 'isDeleted': false }")
    List<Version> findPatchVersionsByContractId(String contractId);

    /**
     * Tìm version theo contract ID và change type = HOTFIX
     */
    @Query("{ 'contractId': ?0, 'changeType': 'HOTFIX', 'isDeleted': false }")
    List<Version> findHotfixVersionsByContractId(String contractId);

    /**
     * Đếm số version theo contract ID
     */
    long countByContractIdAndIsDeletedFalse(String contractId);

    /**
     * Đếm số version theo contract ID và change type
     */
    long countByContractIdAndChangeTypeAndIsDeletedFalse(String contractId, Version.ChangeType changeType);

    /**
     * Đếm số version theo contract ID và isPublished
     */
    long countByContractIdAndIsPublishedAndIsDeletedFalse(String contractId, Boolean isPublished);

    /**
     * Đếm số version theo contract ID và isCurrent
     */
    long countByContractIdAndIsCurrentAndIsDeletedFalse(String contractId, Boolean isCurrent);

    /**
     * Kiểm tra xem có version nào với version number cho trước không
     */
    boolean existsByContractIdAndVersionNumberAndIsDeletedFalse(String contractId, String versionNumber);

    /**
     * Kiểm tra xem có version nào đang là current không
     */
    @Query("{ 'contractId': ?0, 'isCurrent': true, 'isDeleted': false }")
    boolean existsByContractIdAndIsCurrent(String contractId);

    /**
     * Kiểm tra xem có version nào đã published không
     */
    @Query("{ 'contractId': ?0, 'isPublished': true, 'isDeleted': false }")
    boolean existsByContractIdAndIsPublished(String contractId);

    /**
     * Tìm version theo contract ID và version name
     */
    List<Version> findByContractIdAndVersionNameAndIsDeletedFalse(String contractId, String versionName);

    /**
     * Tìm version theo contract ID và description chứa từ khóa
     */
    @Query("{ 'contractId': ?0, 'description': { $regex: ?1, $options: 'i' }, 'isDeleted': false }")
    List<Version> findByContractIdAndDescriptionContainingIgnoreCase(String contractId, String keyword);

    /**
     * Tìm version theo contract ID và changes summary chứa từ khóa
     */
    @Query("{ 'contractId': ?0, 'changesSummary': { $regex: ?1, $options: 'i' }, 'isDeleted': false }")
    List<Version> findByContractIdAndChangesSummaryContainingIgnoreCase(String contractId, String keyword);
}
