package com.devgo2003.docgo.document_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadResponse {
    private String fileId;
    private String filename;
    private long fileSize;
    private String fileType;
    private String status;
    private LocalDateTime uploadTime;
    private String message;
    private String s3Key;
    private String bucket;
    private String fileUrl;
}
