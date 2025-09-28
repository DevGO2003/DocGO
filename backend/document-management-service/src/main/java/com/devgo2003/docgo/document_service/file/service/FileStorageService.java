package com.devgo2003.docgo.document_service.file.service;

import com.devgo2003.docgo.document_service.file.dto.FileDownloadResponse;
import com.devgo2003.docgo.document_service.file.dto.FileListResponse;
import com.devgo2003.docgo.document_service.file.dto.FileUploadResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface FileStorageService {
    
    /**
     * Upload file to storage
     */
    FileUploadResponse uploadFile(MultipartFile file, String folder, String userId);
    
    /**
     * Download file from storage
     */
    FileDownloadResponse downloadFile(String fileId, String userId, Integer version);
    
    /**
     * Get all files with pagination
     */
    FileListResponse getAllFiles(int pageNumber, int pageSize, List<String> sortBy, List<String> sortDirection, boolean includeDeleted);
    
    /**
     * Get file details
     */
    Map<String, Object> getFileDetails(String fileId);
    
    /**
     * Delete file or specific version
     */
    boolean deleteFile(String fileId, String userId, Integer version);
}
