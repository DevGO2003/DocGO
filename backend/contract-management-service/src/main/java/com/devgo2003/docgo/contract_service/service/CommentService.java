package com.devgo2003.docgo.contract_service.service;

import com.devgo2003.docgo.contract_service.entity.Comment;
import com.devgo2003.docgo.contract_service.entity.Contract;
import com.devgo2003.docgo.contract_service.dto.CommentCreateRequest;
import com.devgo2003.docgo.contract_service.repository.CommentRepository;
import com.devgo2003.docgo.contract_service.repository.ContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ContractRepository contractRepository;

    public Comment createComment(String contractId, String authorId, String authorName, 
                               String authorEmail, String content, Comment.CommentType commentType) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        Comment comment = new Comment(contract, authorId, authorName, authorEmail, content, commentType);
        comment.setContractId(contractId);
        comment.initializeNewEntity();
        
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByContractId(String contractId) {
        return commentRepository.findByContractIdAndIsDeletedFalse(contractId);
    }

    public Optional<Comment> getCommentById(String id) {
        return commentRepository.findById(id);
    }

    public List<Comment> getUnresolvedCommentsByContractId(String contractId) {
        return commentRepository.findUnresolvedCommentsByContractId(contractId);
    }

    public List<Comment> getResolvedCommentsByContractId(String contractId) {
        return commentRepository.findResolvedCommentsByContractId(contractId);
    }

    public List<Comment> getPinnedCommentsByContractId(String contractId) {
        return commentRepository.findPinnedCommentsByContractId(contractId);
    }

    public List<Comment> getCommentsByAuthorId(String authorId) {
        return commentRepository.findByAuthorIdAndIsDeletedFalse(authorId);
    }

    public List<Comment> getCommentsByParentCommentId(String parentCommentId) {
        return commentRepository.findByParentCommentIdAndIsDeletedFalse(parentCommentId);
    }

    public List<Comment> getCommentsByCommentType(String contractId, Comment.CommentType commentType) {
        return commentRepository.findByContractIdAndCommentTypeAndIsDeletedFalse(contractId, commentType);
    }

    public List<Comment> getCommentsByPriority(String contractId, Comment.CommentPriority priority) {
        return commentRepository.findByContractIdAndPriorityAndIsDeletedFalse(contractId, priority);
    }

    public List<Comment> getPublicCommentsByContractId(String contractId) {
        return commentRepository.findPublicCommentsByContractId(contractId);
    }

    public List<Comment> getPrivateCommentsByContractId(String contractId) {
        return commentRepository.findPrivateCommentsByContractId(contractId);
    }

    public List<Comment> getCommentsByVisibility(String contractId, Comment.CommentVisibility visibility) {
        return commentRepository.findByContractIdAndVisibility(contractId, visibility);
    }

    public List<Comment> getMentionedCommentsByContractId(String contractId, String userId) {
        return commentRepository.findMentionedCommentsByContractId(contractId, userId);
    }

    public List<Comment> getCommentsBySectionReference(String contractId, String sectionReference) {
        return commentRepository.findByContractIdAndSectionReference(contractId, sectionReference);
    }

    public List<Comment> getCommentsByLineNumber(String contractId, Integer lineNumber) {
        return commentRepository.findByContractIdAndLineNumber(contractId, lineNumber);
    }

    public List<Comment> getCommentsByContractIdOrderByCreatedAt(String contractId) {
        return commentRepository.findByContractIdOrderByCreatedAtDesc(contractId);
    }

    public List<Comment> getCommentsByContractIdOrderByReactionCount(String contractId) {
        return commentRepository.findByContractIdOrderByReactionCountDesc(contractId);
    }

    public List<Comment> getCommentsByContractIdOrderByReplyCount(String contractId) {
        return commentRepository.findByContractIdOrderByReplyCountDesc(contractId);
    }

    public List<Comment> getCommentsByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return commentRepository.findByCreatedAtBetween(startDate, endDate);
    }

    public List<Comment> getCommentsByResolvedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return commentRepository.findByResolvedAtBetween(startDate, endDate);
    }

    public List<Comment> getCommentsWithHighReactionCount(Integer reactionCount) {
        return commentRepository.findCommentsWithHighReactionCount(reactionCount);
    }

    public List<Comment> getCommentsWithReplies(Integer replyCount) {
        return commentRepository.findCommentsWithReplies(replyCount);
    }

    public Comment resolveComment(String id, String resolvedBy, String resolutionNote) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        comment.resolve(resolvedBy, resolutionNote);
        comment.setUpdatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }

    public Comment unresolveComment(String id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        comment.unresolve();
        comment.setUpdatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }

    public Comment pinComment(String id, String pinnedBy) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        comment.pin(pinnedBy);
        comment.setUpdatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }

    public Comment unpinComment(String id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        comment.unpin();
        comment.setUpdatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }

    public Comment incrementReactionCount(String id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        comment.incrementReactionCount();
        comment.setUpdatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }

    public Comment decrementReactionCount(String id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        comment.decrementReactionCount();
        comment.setUpdatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }

    public Comment incrementReplyCount(String id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        comment.incrementReplyCount();
        comment.setUpdatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }

    public Comment decrementReplyCount(String id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        comment.decrementReplyCount();
        comment.setUpdatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }

    public Comment hideComment(String id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        comment.hide();
        comment.setUpdatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }

    public Comment showComment(String id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        comment.show();
        comment.setUpdatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }

    public void deleteComment(String id, String deletedBy) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        comment.markAsDeleted(deletedBy);
        comment.setUpdatedAt(LocalDateTime.now());
        
        commentRepository.save(comment);
    }

    public Comment restoreComment(String id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        comment.restore();
        comment.setUpdatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }

    public long countCommentsByContractId(String contractId) {
        return commentRepository.countByContractIdAndIsDeletedFalse(contractId);
    }

    public long countCommentsByContractIdAndStatus(String contractId, Comment.CommentStatus status) {
        return commentRepository.countByContractIdAndStatusAndIsDeletedFalse(contractId, status);
    }

    public long countCommentsByAuthorId(String authorId) {
        return commentRepository.countByAuthorIdAndIsDeletedFalse(authorId);
    }

    public long countUnresolvedCommentsByContractId(String contractId) {
        return commentRepository.countUnresolvedCommentsByContractId(contractId);
    }

    public long countResolvedCommentsByContractId(String contractId) {
        return commentRepository.countResolvedCommentsByContractId(contractId);
    }

    public long countPinnedCommentsByContractId(String contractId) {
        return commentRepository.countPinnedCommentsByContractId(contractId);
    }

    public boolean existsCommentsByContractId(String contractId) {
        return commentRepository.existsByContractIdAndIsDeletedFalse(contractId);
    }

    public boolean existsUnresolvedCommentsByContractId(String contractId) {
        return commentRepository.existsUnresolvedCommentsByContractId(contractId);
    }

    public boolean existsPinnedCommentsByContractId(String contractId) {
        return commentRepository.existsPinnedCommentsByContractId(contractId);
    }

    /**
     * Tạo comment mới từ CommentCreateRequest
     */
    public Comment createComment(CommentCreateRequest request) {
        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        Comment comment = new Comment(contract, request.getAuthorId(), request.getAuthorName(), 
                                    request.getAuthorEmail(), request.getContent(), request.getCommentType());
        comment.setContractId(request.getContractId());
        comment.setParentCommentId(request.getParentCommentId());
        // Set mentions if provided
        if (request.getMentions() != null && !request.getMentions().isEmpty()) {
            // Note: Comment entity may not have setMentions method, skip for now
            // comment.setMentions(List.of(request.getMentions().split(",")));
        }
        // Note: Comment entity may not have setAttachments method, skip for now
        // comment.setAttachments(request.getAttachments());
        comment.setIsPrivate(request.getIsPrivate());
        comment.setIsPinned(request.getIsPinned());
        comment.initializeNewEntity();
        
        return commentRepository.save(comment);
    }

    /**
     * Lấy tất cả comment
     */
    public List<Comment> getAllComments() {
        return commentRepository.findByIsDeletedFalse();
    }
}
