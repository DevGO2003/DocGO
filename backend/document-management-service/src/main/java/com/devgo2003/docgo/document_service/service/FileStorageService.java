package com.devgo2003.docgo.document_service.service;

import com.devgo2003.docgo.document_service.dto.FileDownloadResponse;
import com.devgo2003.docgo.document_service.dto.FileListResponse;
import com.devgo2003.docgo.document_service.dto.FileUploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    FileUploadResponse uploadFile(MultipartFile file, String userId, String folder);
    FileDownloadResponse downloadFile(String fileId, String userId);
    FileListResponse getAllFiles(int page, int size, String userId);
}
