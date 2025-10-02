package com.devgo2003.docgo.document_service.service;

import com.devgo2003.docgo.document_service.entity.Version;
import com.devgo2003.docgo.document_service.entity.Contract;
import com.devgo2003.docgo.document_service.dto.VersionCreateRequest;
import com.devgo2003.docgo.document_service.repository.VersionRepository;
import com.devgo2003.docgo.document_service.repository.ContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@Service
public class VersionService {

    @Autowired
    private VersionRepository versionRepository;

    @Autowired
    private ContractRepository contractRepository;

    /**
     * Tạo version mới cho contract
     */
    public Version createVersion(String contractId, String versionNumber, String versionName, 
                               Version.ChangeType changeType, String changesSummary) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        Version version = new Version(contract, versionNumber, versionName, changeType, changesSummary);
        version.setContractId(contractId);
        version.initializeNewEntity();
        
        return versionRepository.save(version);
    }

    /**
     * Lấy tất cả version theo contract ID
     */
    public List<Version> getVersionsByContractId(String contractId) {
        return versionRepository.findByContractIdAndIsDeletedFalse(contractId);
    }

    /**
     * Lấy version theo ID
     */
    public Optional<Version> getVersionById(String id) {
        return versionRepository.findById(id);
    }

    /**
     * Lấy version theo contract ID và version number
     */
    public Optional<Version> getVersionByContractIdAndVersionNumber(String contractId, String versionNumber) {
        return versionRepository.findByContractIdAndVersionNumberAndIsDeletedFalse(contractId, versionNumber);
    }

    /**
     * Lấy version hiện tại của contract
     */
    public Optional<Version> getCurrentVersionByContractId(String contractId) {
        return versionRepository.findCurrentVersionByContractId(contractId);
    }

    /**
     * Lấy version đã published
     */
    public List<Version> getPublishedVersionsByContractId(String contractId) {
        return versionRepository.findPublishedVersionsByContractId(contractId);
    }

    /**
     * Lấy version chưa published
     */
    public List<Version> getUnpublishedVersionsByContractId(String contractId) {
        return versionRepository.findUnpublishedVersionsByContractId(contractId);
    }

    /**
     * Lấy version theo change type
     */
    public List<Version> getVersionsByChangeType(String contractId, Version.ChangeType changeType) {
        return versionRepository.findByContractIdAndChangeTypeAndIsDeletedFalse(contractId, changeType);
    }

    /**
     * Lấy version theo isCurrent
     */
    public List<Version> getCurrentVersionsByContractId(String contractId) {
        return versionRepository.findCurrentVersionsByContractId(contractId);
    }


    /**
     * Lấy version theo approval required
     */
    public List<Version> getApprovalRequiredVersionsByContractId(String contractId) {
        return versionRepository.findApprovalRequiredVersionsByContractId(contractId);
    }

    /**
     * Lấy version không cần approval
     */
    public List<Version> getNoApprovalRequiredVersionsByContractId(String contractId) {
        return versionRepository.findNoApprovalRequiredVersionsByContractId(contractId);
    }

    /**
     * Lấy version theo previous version ID
     */
    public List<Version> getVersionsByPreviousVersionId(String previousVersionId) {
        return versionRepository.findByPreviousVersionIdAndIsDeletedFalse(previousVersionId);
    }

    /**
     * Lấy version theo contract ID (sắp xếp theo version number)
     */
    public List<Version> getVersionsByContractIdOrderByVersionNumber(String contractId) {
        return versionRepository.findByContractIdOrderByVersionNumberDesc(contractId);
    }

    /**
     * Lấy version theo contract ID (sắp xếp theo thời gian tạo)
     */
    public List<Version> getVersionsByContractIdOrderByCreatedAt(String contractId) {
        return versionRepository.findByContractIdOrderByCreatedAtDesc(contractId);
    }

    /**
     * Lấy version theo thời gian tạo trong khoảng
     */
    public List<Version> getVersionsByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return versionRepository.findByCreatedAtBetween(startDate, endDate);
    }

    /**
     * Lấy version theo thời gian published trong khoảng
     */
    public List<Version> getVersionsByPublishedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return versionRepository.findByPublishedAtBetween(startDate, endDate);
    }

    /**
     * Lấy version theo thời gian approved trong khoảng
     */
    public List<Version> getVersionsByApprovedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return versionRepository.findByApprovedAtBetween(startDate, endDate);
    }

    /**
     * Lấy version theo published by
     */
    public List<Version> getVersionsByPublishedBy(String publishedBy) {
        return versionRepository.findByPublishedBy(publishedBy);
    }

    /**
     * Lấy version theo approved by
     */
    public List<Version> getVersionsByApprovedBy(String approvedBy) {
        return versionRepository.findByApprovedBy(approvedBy);
    }

    /**
     * Lấy version theo tags
     */
    public List<Version> getVersionsByTags(String[] tags) {
        return versionRepository.findByTagsIn(tags);
    }

    /**
     * Lấy version theo contract ID và tags
     */
    public List<Version> getVersionsByContractIdAndTags(String contractId, String[] tags) {
        return versionRepository.findByContractIdAndTagsIn(contractId, tags);
    }

    /**
     * Lấy version theo change type (sắp xếp theo thời gian tạo)
     */
    public List<Version> getVersionsByChangeTypeOrderByCreatedAt(Version.ChangeType changeType) {
        return versionRepository.findByChangeTypeOrderByCreatedAtDesc(changeType);
    }

    /**
     * Lấy version theo contract ID và change type (sắp xếp theo thời gian tạo)
     */
    public List<Version> getVersionsByContractIdAndChangeTypeOrderByCreatedAt(String contractId, Version.ChangeType changeType) {
        return versionRepository.findByContractIdAndChangeTypeOrderByCreatedAtDesc(contractId, changeType);
    }

    /**
     * Lấy version theo contract ID và change type (sắp xếp theo version number)
     */
    public List<Version> getVersionsByContractIdAndChangeTypeOrderByVersionNumber(String contractId, Version.ChangeType changeType) {
        return versionRepository.findByContractIdAndChangeTypeOrderByVersionNumberDesc(contractId, changeType);
    }

    /**
     * Lấy version theo contract ID và previous version ID
     */
    public List<Version> getVersionsByContractIdAndPreviousVersionId(String contractId, String previousVersionId) {
        return versionRepository.findByContractIdAndPreviousVersionIdAndIsDeletedFalse(contractId, previousVersionId);
    }

    /**
     * Lấy version theo contract ID và file path
     */
    public List<Version> getVersionsByContractIdAndFilePath(String contractId, String filePath) {
        return versionRepository.findByContractIdAndFilePathAndIsDeletedFalse(contractId, filePath);
    }

    /**
     * Lấy version theo contract ID và checksum
     */
    public List<Version> getVersionsByContractIdAndChecksum(String contractId, String checksum) {
        return versionRepository.findByContractIdAndChecksumAndIsDeletedFalse(contractId, checksum);
    }

    /**
     * Lấy version theo contract ID và file size
     */
    public List<Version> getVersionsByContractIdAndFileSize(String contractId, Long fileSize) {
        return versionRepository.findByContractIdAndFileSizeAndIsDeletedFalse(contractId, fileSize);
    }

    /**
     * Lấy version theo contract ID và file size trong khoảng
     */
    public List<Version> getVersionsByContractIdAndFileSizeBetween(String contractId, Long minSize, Long maxSize) {
        return versionRepository.findByContractIdAndFileSizeBetween(contractId, minSize, maxSize);
    }

    /**
     * Lấy version rollback theo contract ID
     */
    public List<Version> getRollbackVersionsByContractId(String contractId) {
        return versionRepository.findRollbackVersionsByContractId(contractId);
    }

    /**
     * Lấy version rollback theo contract ID và change type
     */
    public List<Version> getRollbackVersionsByContractIdAndChangeType(String contractId) {
        return versionRepository.findRollbackVersionsByContractIdAndChangeType(contractId);
    }

    /**
     * Lấy version draft theo contract ID
     */
    public List<Version> getDraftVersionsByContractId(String contractId) {
        return versionRepository.findDraftVersionsByContractId(contractId);
    }

    /**
     * Lấy version major theo contract ID
     */
    public List<Version> getMajorVersionsByContractId(String contractId) {
        return versionRepository.findMajorVersionsByContractId(contractId);
    }

    /**
     * Lấy version minor theo contract ID
     */
    public List<Version> getMinorVersionsByContractId(String contractId) {
        return versionRepository.findMinorVersionsByContractId(contractId);
    }

    /**
     * Lấy version patch theo contract ID
     */
    public List<Version> getPatchVersionsByContractId(String contractId) {
        return versionRepository.findPatchVersionsByContractId(contractId);
    }

    /**
     * Lấy version hotfix theo contract ID
     */
    public List<Version> getHotfixVersionsByContractId(String contractId) {
        return versionRepository.findHotfixVersionsByContractId(contractId);
    }

    /**
     * Publish version
     */
    public Version publishVersion(String id, String publishedBy) {
        Version version = versionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        
        version.publish(publishedBy);
        version.setUpdatedAt(LocalDateTime.now());
        
        return versionRepository.save(version);
    }

    /**
     * Approve version
     */
    public Version approveVersion(String id, String approvedBy) {
        Version version = versionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        
        version.approve(approvedBy);
        version.setUpdatedAt(LocalDateTime.now());
        
        return versionRepository.save(version);
    }

    /**
     * Mark version as current
     */
    public Version markVersionAsCurrent(String id) {
        Version version = versionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        
        version.markAsCurrent();
        version.setUpdatedAt(LocalDateTime.now());
        
        return versionRepository.save(version);
    }

    /**
     * Unmark version as current
     */
    public Version unmarkVersionAsCurrent(String id) {
        Version version = versionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        
        version.unmarkAsCurrent();
        version.setUpdatedAt(LocalDateTime.now());
        
        return versionRepository.save(version);
    }

    /**
     * Rollback version
     */
    public Version rollbackVersion(String id, String rollbackReason) {
        Version version = versionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        
        version.rollback(rollbackReason);
        version.setUpdatedAt(LocalDateTime.now());
        
        return versionRepository.save(version);
    }

    /**
     * Set previous version ID
     */
    public Version setPreviousVersionId(String id, String previousVersionId) {
        Version version = versionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        
        version.setPreviousVersionId(previousVersionId);
        version.setUpdatedAt(LocalDateTime.now());
        
        return versionRepository.save(version);
    }

    /**
     * Set file path
     */
    public Version setFilePath(String id, String filePath) {
        Version version = versionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        
        version.setFilePath(filePath);
        version.setUpdatedAt(LocalDateTime.now());
        
        return versionRepository.save(version);
    }

    /**
     * Set file size
     */
    public Version setFileSize(String id, Long fileSize) {
        Version version = versionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        
        version.setFileSize(fileSize);
        version.setUpdatedAt(LocalDateTime.now());
        
        return versionRepository.save(version);
    }

    /**
     * Set checksum
     */
    public Version setChecksum(String id, String checksum) {
        Version version = versionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        
        version.setChecksum(checksum);
        version.setUpdatedAt(LocalDateTime.now());
        
        return versionRepository.save(version);
    }

    /**
     * Set approval required
     */
    public Version setApprovalRequired(String id, Boolean approvalRequired) {
        Version version = versionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        
        version.setApprovalRequired(approvalRequired);
        version.setUpdatedAt(LocalDateTime.now());
        
        return versionRepository.save(version);
    }

    /**
     * Set tags
     */
    public Version setTags(String id, String[] tags) {
        Version version = versionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        
        version.setTags(tags);
        version.setUpdatedAt(LocalDateTime.now());
        
        return versionRepository.save(version);
    }

    /**
     * Set detailed changes
     */
    public Version setDetailedChanges(String id, Map<String, Object> detailedChanges) {
        Version version = versionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        
        version.setDetailedChanges(detailedChanges);
        version.setUpdatedAt(LocalDateTime.now());
        
        return versionRepository.save(version);
    }

    /**
     * Soft delete version
     */
    public void deleteVersion(String id, String deletedBy) {
        Version version = versionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        
        version.markAsDeleted(deletedBy);
        version.setUpdatedAt(LocalDateTime.now());
        
        versionRepository.save(version);
    }

    /**
     * Restore version
     */
    public Version restoreVersion(String id) {
        Version version = versionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        
        version.restore();
        version.setUpdatedAt(LocalDateTime.now());
        
        return versionRepository.save(version);
    }

    /**
     * Đếm số version theo contract ID
     */
    public long countVersionsByContractId(String contractId) {
        return versionRepository.countByContractIdAndIsDeletedFalse(contractId);
    }

    /**
     * Đếm số version theo contract ID và change type
     */
    public long countVersionsByContractIdAndChangeType(String contractId, Version.ChangeType changeType) {
        return versionRepository.countByContractIdAndChangeTypeAndIsDeletedFalse(contractId, changeType);
    }

    /**
     * Đếm số version theo contract ID và isPublished
     */
    public long countVersionsByContractIdAndIsPublished(String contractId, Boolean isPublished) {
        return versionRepository.countByContractIdAndIsPublishedAndIsDeletedFalse(contractId, isPublished);
    }

    /**
     * Đếm số version theo contract ID và isCurrent
     */
    public long countVersionsByContractIdAndIsCurrent(String contractId, Boolean isCurrent) {
        return versionRepository.countByContractIdAndIsCurrentAndIsDeletedFalse(contractId, isCurrent);
    }

    /**
     * Kiểm tra xem có version nào với version number cho trước không
     */
    public boolean existsVersionByContractIdAndVersionNumber(String contractId, String versionNumber) {
        return versionRepository.existsByContractIdAndVersionNumberAndIsDeletedFalse(contractId, versionNumber);
    }

    /**
     * Kiểm tra xem có version nào đang là current không
     */
    public boolean existsCurrentVersionByContractId(String contractId) {
        return versionRepository.existsByContractIdAndIsCurrent(contractId);
    }

    /**
     * Kiểm tra xem có version nào đã published không
     */
    public boolean existsPublishedVersionByContractId(String contractId) {
        return versionRepository.existsByContractIdAndIsPublished(contractId);
    }

    /**
     * Kiểm tra xem có version nào theo change type không
     */
    public boolean existsVersionByChangeType(String contractId, Version.ChangeType changeType) {
        List<Version> versions = versionRepository.findByContractIdAndChangeTypeAndIsDeletedFalse(contractId, changeType);
        return !versions.isEmpty();
    }

    /**
     * Kiểm tra xem có version nào theo tags không
     */
    public boolean existsVersionByTags(String contractId, String[] tags) {
        List<Version> versions = versionRepository.findByContractIdAndTagsIn(contractId, tags);
        return !versions.isEmpty();
    }

    /**
     * Kiểm tra xem có version nào theo file path không
     */
    public boolean existsVersionByFilePath(String contractId, String filePath) {
        List<Version> versions = versionRepository.findByContractIdAndFilePathAndIsDeletedFalse(contractId, filePath);
        return !versions.isEmpty();
    }

    /**
     * Kiểm tra xem có version nào theo checksum không
     */
    public boolean existsVersionByChecksum(String contractId, String checksum) {
        List<Version> versions = versionRepository.findByContractIdAndChecksumAndIsDeletedFalse(contractId, checksum);
        return !versions.isEmpty();
    }

    /**
     * Kiểm tra xem có version nào theo file size không
     */
    public boolean existsVersionByFileSize(String contractId, Long fileSize) {
        List<Version> versions = versionRepository.findByContractIdAndFileSizeAndIsDeletedFalse(contractId, fileSize);
        return !versions.isEmpty();
    }

    /**
     * Kiểm tra xem có version nào theo previous version ID không
     */
    public boolean existsVersionByPreviousVersionId(String contractId, String previousVersionId) {
        List<Version> versions = versionRepository.findByContractIdAndPreviousVersionIdAndIsDeletedFalse(contractId, previousVersionId);
        return !versions.isEmpty();
    }

    /**
     * Kiểm tra xem có version nào theo published by không
     */
    public boolean existsVersionByPublishedBy(String contractId, String publishedBy) {
        List<Version> versions = versionRepository.findByPublishedBy(publishedBy);
        return !versions.isEmpty();
    }

    /**
     * Kiểm tra xem có version nào theo approved by không
     */
    public boolean existsVersionByApprovedBy(String contractId, String approvedBy) {
        List<Version> versions = versionRepository.findByApprovedBy(approvedBy);
        return !versions.isEmpty();
    }

    /**
     * Kiểm tra xem có version nào theo description chứa từ khóa không
     */
    public boolean existsVersionByDescriptionContaining(String contractId, String keyword) {
        List<Version> versions = versionRepository.findByContractIdAndDescriptionContainingIgnoreCase(contractId, keyword);
        return !versions.isEmpty();
    }

    /**
     * Kiểm tra xem có version nào theo changes summary chứa từ khóa không
     */
    public boolean existsVersionByChangesSummaryContaining(String contractId, String keyword) {
        List<Version> versions = versionRepository.findByContractIdAndChangesSummaryContainingIgnoreCase(contractId, keyword);
        return !versions.isEmpty();
    }

    /**
     * Tạo version mới từ VersionCreateRequest
     */
    public Version createVersion(VersionCreateRequest request) {
        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        Version version = new Version(
                contract,
                request.getVersionNumber(),
                request.getVersionName(),
                request.getChangeType(),
                request.getChangeSummary()
        );
        version.setContractId(request.getContractId());
        version.setDescription(request.getChangeDescription());
        version.setPreviousVersionId(request.getPreviousVersionId());
        version.initializeNewEntity();
        
        return versionRepository.save(version);
    }

    /**
     * Lấy tất cả version
     */
    public List<Version> getAllVersions() {
        return versionRepository.findByIsDeletedFalse();
    }

    /**
     * Áp dụng view filter dựa trên loại view
     */
    public List<Version> applyViewFilter(List<Version> versions, String viewType) {
        if (versions == null || versions.isEmpty()) {
            return versions;
        }
        
        switch (viewType.toLowerCase()) {
            case "summary":
                return versions.stream()
                    .map(this::createSummaryView)
                    .collect(java.util.stream.Collectors.toList());
            case "minimal":
                return versions.stream()
                    .map(this::createMinimalView)
                    .collect(java.util.stream.Collectors.toList());
            case "full":
            default:
                return versions; // Return full data
        }
    }
    
    /**
     * Tạo summary view của Version (chỉ các trường quan trọng)
     */
    private Version createSummaryView(Version version) {
        Version summaryVersion = new Version();
        summaryVersion.setId(version.getId());
        summaryVersion.setContractId(version.getContractId());
        summaryVersion.setVersionNumber(version.getVersionNumber());
        summaryVersion.setVersionName(version.getVersionName());
        summaryVersion.setChangeType(version.getChangeType());
        summaryVersion.setChangesSummary(version.getChangesSummary());
        summaryVersion.setIsPublished(version.getIsPublished());
        summaryVersion.setIsCurrent(version.getIsCurrent());
        summaryVersion.setCreatedAt(version.getCreatedAt());
        summaryVersion.setUpdatedAt(version.getUpdatedAt());
        return summaryVersion;
    }
    
    /**
     * Tạo minimal view của Version (chỉ các trường cơ bản)
     */
    private Version createMinimalView(Version version) {
        Version minimalVersion = new Version();
        minimalVersion.setId(version.getId());
        minimalVersion.setContractId(version.getContractId());
        minimalVersion.setVersionNumber(version.getVersionNumber());
        minimalVersion.setVersionName(version.getVersionName());
        minimalVersion.setChangeType(version.getChangeType());
        minimalVersion.setIsPublished(version.getIsPublished());
        minimalVersion.setIsCurrent(version.getIsCurrent());
        return minimalVersion;
    }
}
