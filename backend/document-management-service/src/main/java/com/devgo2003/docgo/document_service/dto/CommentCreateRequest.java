package com.devgo2003.docgo.document_service.dto;

import com.devgo2003.docgo.document_service.entity.Comment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentCreateRequest {
    
    @NotBlank(message = "Contract ID không được để trống")
    private String contractId;
    
    @NotBlank(message = "Author ID không được để trống")
    private String authorId;
    
    @NotBlank(message = "Tên tác giả không được để trống")
    private String authorName;
    
    @NotBlank(message = "Email tác giả không được để trống")
    private String authorEmail;
    
    @NotBlank(message = "Nội dung bình luận không được để trống")
    private String content;
    
    @NotNull(message = "Loại bình luận không được để trống")
    private Comment.CommentType commentType;
    
    private String parentCommentId;
    
    private String mentions;
    
    private String attachments;
    
    @Builder.Default
    private Boolean isPrivate = false;
    
    @Builder.Default
    private Boolean isPinned = false;
}
