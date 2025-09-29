package com.devgo2003.docgo.document_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileListResponse {
    private List<FileMetadata> files;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FileMetadata {
        private String fileId;
        private String filename;
        private String s3Key;
        private String bucket;
        private long fileSize;
        private String fileType;
        private String status;
        private LocalDateTime uploadTime;
        private String uploadedBy;
        private Map<String, String> metadata;
    }
}
