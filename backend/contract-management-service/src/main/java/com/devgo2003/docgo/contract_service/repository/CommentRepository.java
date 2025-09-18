package com.devgo2003.docgo.contract_service.repository;

import com.devgo2003.docgo.contract_service.entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {

    /**
     * Tìm tất cả comment chưa bị xóa
     */
    List<Comment> findByIsDeletedFalse();

    List<Comment> findByContractIdAndIsDeletedFalse(String contractId);
    
    List<Comment> findByContractIdAndStatusAndIsDeletedFalse(String contractId, Comment.CommentStatus status);
    
    List<Comment> findByAuthorIdAndIsDeletedFalse(String authorId);
    
    List<Comment> findByParentCommentIdAndIsDeletedFalse(String parentCommentId);
    
    @Query("{ 'contractId': ?0, 'isResolved': false, 'isDeleted': false }")
    List<Comment> findUnresolvedCommentsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isResolved': true, 'isDeleted': false }")
    List<Comment> findResolvedCommentsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isPinned': true, 'isDeleted': false }")
    List<Comment> findPinnedCommentsByContractId(String contractId);
    
    List<Comment> findByContractIdAndCommentTypeAndIsDeletedFalse(String contractId, Comment.CommentType commentType);
    
    List<Comment> findByContractIdAndPriorityAndIsDeletedFalse(String contractId, Comment.CommentPriority priority);
    
    @Query("{ 'contractId': ?0, 'isPrivate': false, 'isDeleted': false }")
    List<Comment> findPublicCommentsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isPrivate': true, 'isDeleted': false }")
    List<Comment> findPrivateCommentsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'visibility': ?1, 'isDeleted': false }")
    List<Comment> findByContractIdAndVisibility(String contractId, Comment.CommentVisibility visibility);
    
    @Query("{ 'contractId': ?0, 'mentionedUsers': { $in: [?1] }, 'isDeleted': false }")
    List<Comment> findMentionedCommentsByContractId(String contractId, String userId);
    
    @Query("{ 'contractId': ?0, 'sectionReference': ?1, 'isDeleted': false }")
    List<Comment> findByContractIdAndSectionReference(String contractId, String sectionReference);
    
    @Query("{ 'contractId': ?0, 'lineNumber': ?1, 'isDeleted': false }")
    List<Comment> findByContractIdAndLineNumber(String contractId, Integer lineNumber);
    
    @Query("{ 'contractId': ?0, 'isDeleted': false }")
    List<Comment> findByContractIdOrderByCreatedAtDesc(String contractId);
    
    @Query("{ 'contractId': ?0, 'isDeleted': false }")
    List<Comment> findByContractIdOrderByReactionCountDesc(String contractId);
    
    @Query("{ 'contractId': ?0, 'isDeleted': false }")
    List<Comment> findByContractIdOrderByReplyCountDesc(String contractId);
    
    @Query("{ 'createdAt': { $gte: ?0, $lte: ?1 }, 'isDeleted': false }")
    List<Comment> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{ 'resolvedAt': { $gte: ?0, $lte: ?1 }, 'isResolved': true, 'isDeleted': false }")
    List<Comment> findByResolvedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{ 'reactionCount': { $gt: ?0 }, 'isDeleted': false }")
    List<Comment> findCommentsWithHighReactionCount(Integer reactionCount);
    
    @Query("{ 'replyCount': { $gt: ?0 }, 'isDeleted': false }")
    List<Comment> findCommentsWithReplies(Integer replyCount);
    
    long countByContractIdAndIsDeletedFalse(String contractId);
    
    long countByContractIdAndStatusAndIsDeletedFalse(String contractId, Comment.CommentStatus status);
    
    long countByAuthorIdAndIsDeletedFalse(String authorId);
    
    @Query("{ 'contractId': ?0, 'isResolved': false, 'isDeleted': false }")
    long countUnresolvedCommentsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isResolved': true, 'isDeleted': false }")
    long countResolvedCommentsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isPinned': true, 'isDeleted': false }")
    long countPinnedCommentsByContractId(String contractId);
    
    long countByContractIdAndCommentTypeAndIsDeletedFalse(String contractId, Comment.CommentType commentType);
    
    long countByContractIdAndPriorityAndIsDeletedFalse(String contractId, Comment.CommentPriority priority);
    
    long countByContractIdAndVisibility(String contractId, Comment.CommentVisibility visibility);
    
    boolean existsByContractIdAndIsDeletedFalse(String contractId);
    
    @Query("{ 'contractId': ?0, 'isResolved': false, 'isDeleted': false }")
    boolean existsUnresolvedCommentsByContractId(String contractId);
    
    @Query("{ 'contractId': ?0, 'isPinned': true, 'isDeleted': false }")
    boolean existsPinnedCommentsByContractId(String contractId);
}
