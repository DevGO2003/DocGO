package com.devgo2003.docgo.document_service.service.impl;

import com.devgo2003.docgo.document_service.dto.FileDownloadResponse;
import com.devgo2003.docgo.document_service.dto.FileListResponse;
import com.devgo2003.docgo.document_service.dto.FileUploadResponse;
import com.devgo2003.docgo.document_service.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${app.s3.bucket:docgo-files}")
    private String s3Bucket;

    @Override
    public FileUploadResponse uploadFile(MultipartFile file, String userId, String folder) {
        try {
            String fileId = UUID.randomUUID().toString();
            String s3Key = (folder != null && !folder.isEmpty() ? folder + "/" : "") + fileId + "_" + file.getOriginalFilename();

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
                .fileUrl("http://localhost:8002/documents/" + fileId)
                .build();
                
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage(), e);
        }
    }

    @Override
    public FileDownloadResponse downloadFile(String fileId, String userId) {
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
                .build();
                
        } catch (Exception e) {
            throw new RuntimeException("Failed to download file: " + e.getMessage(), e);
        }
    }

    @Override
    public FileListResponse getAllFiles(int page, int size, String userId) {
        try {
            // For now, we'll return empty list
            // In real implementation, you would query from database here
            
            List<FileListResponse.FileMetadata> files = new ArrayList<>();
            
            return FileListResponse.builder()
                .files(files)
                .currentPage(page)
                .pageSize(size)
                .totalElements(0)
                .totalPages(0)
                .build();
                
        } catch (Exception e) {
            throw new RuntimeException("Failed to get files: " + e.getMessage(), e);
        }
    }
}
