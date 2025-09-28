package com.devgo2003.docgo.document_service.file.service.impl;

import com.devgo2003.docgo.document_service.file.dto.FileDownloadResponse;
import com.devgo2003.docgo.document_service.file.dto.FileListResponse;
import com.devgo2003.docgo.document_service.file.dto.FileUploadResponse;
import com.devgo2003.docgo.document_service.file.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${app.upload.directory:uploads}")
    private String uploadDirectory;

    @Value("${app.s3.bucket:docgo-files}")
    private String s3Bucket;

    @Override
    public FileUploadResponse uploadFile(MultipartFile file, String folder, String userId) {
        try {
            // Generate unique file ID
            String fileId = UUID.randomUUID().toString();
            
            // Generate S3 key
            String s3Key = generateS3Key(fileId, file.getOriginalFilename(), folder, userId);
            
            // For now, we'll simulate file upload
            // In real implementation, you would upload to S3 here
            
            return FileUploadResponse.builder()
                .fileId(fileId)
                .filename(file.getOriginalFilename())
                .fileSize(file.getSize())
                .fileType(file.getContentType())
                .status("uploaded")
                .uploadTime(LocalDateTime.now())
                .message("File đã được upload thành công")
                .s3Key(s3Key)
                .bucket(s3Bucket)
                .fileUrl("http://localhost:8002/files/" + fileId)
                .version(1)
                .build();
                
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage(), e);
        }
    }

    @Override
    public FileDownloadResponse downloadFile(String fileId, String userId, Integer version) {
        try {
            // For now, we'll simulate file download
            // In real implementation, you would download from S3 here
            
            // Create a dummy resource for demonstration
            byte[] dummyContent = "This is a dummy file content for demonstration".getBytes();
            Resource resource = new ByteArrayResource(dummyContent);
            
            return FileDownloadResponse.builder()
                .resource(resource)
                .filename("downloaded_file_" + fileId + ".txt")
                .contentType("text/plain")
                .fileSize((long) dummyContent.length)
                .s3Key("files/" + fileId + "/version_" + (version != null ? version : 1))
                .build();
                
        } catch (Exception e) {
            throw new RuntimeException("Failed to download file: " + e.getMessage(), e);
        }
    }

    @Override
    public FileListResponse getAllFiles(int pageNumber, int pageSize, List<String> sortBy, List<String> sortDirection, boolean includeDeleted) {
        try {
            // For now, we'll return empty list
            // In real implementation, you would query from database here
            
            List<FileListResponse.FileInfo> files = new ArrayList<>();
            
            return FileListResponse.builder()
                .files(files)
                .pageNumber(pageNumber)
                .pageSize(pageSize)
                .totalElements(0)
                .totalPages(0)
                .first(true)
                .last(true)
                .numberOfElements(0)
                .build();
                
        } catch (Exception e) {
            throw new RuntimeException("Failed to get files: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> getFileDetails(String fileId) {
        try {
            // For now, we'll return dummy data
            // In real implementation, you would query from database here
            
            Map<String, Object> details = new HashMap<>();
            details.put("fileId", fileId);
            details.put("filename", "sample_file.txt");
            details.put("fileSize", 1024L);
            details.put("contentType", "text/plain");
            details.put("uploadTime", LocalDateTime.now());
            details.put("checksum", "abc123def456");
            details.put("accessCount", 0);
            details.put("tags", Arrays.asList("document", "sample"));
            
            return details;
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to get file details: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean deleteFile(String fileId, String userId, Integer version) {
        try {
            // For now, we'll simulate successful deletion
            // In real implementation, you would delete from S3 and database here
            
            return true;
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file: " + e.getMessage(), e);
        }
    }

    private String generateS3Key(String fileId, String originalFilename, String folder, String userId) {
        StringBuilder keyBuilder = new StringBuilder();
        
        if (folder != null && !folder.isEmpty()) {
            keyBuilder.append(folder).append("/");
        }
        
        if (userId != null && !userId.isEmpty()) {
            keyBuilder.append("user_").append(userId).append("/");
        }
        
        keyBuilder.append(fileId);
        
        if (originalFilename != null && !originalFilename.isEmpty()) {
            String extension = getFileExtension(originalFilename);
            if (extension != null) {
                keyBuilder.append(".").append(extension);
            }
        }
        
        return keyBuilder.toString();
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return null;
        }
        
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            return null;
        }
        
        return filename.substring(lastDotIndex + 1).toLowerCase();
    }
}
