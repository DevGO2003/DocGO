package com.devgo2003.docgo.document_service.controller;

import com.devgo2003.docgo.document_service.common.response.RestResponse;
import com.devgo2003.docgo.document_service.dto.FileDownloadResponse;
import com.devgo2003.docgo.document_service.dto.FileListResponse;
import com.devgo2003.docgo.document_service.dto.FileUploadResponse;
import com.devgo2003.docgo.document_service.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/document-management-service/documents")
@Tag(name = "APIs Document Management", description = "APIs for document and file management")
public class DocumentController {

    private final FileStorageService fileStorageService;

    @Autowired
    public DocumentController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @Operation(
            summary = "Upload document file",
            description = """
            🔹 Đầu vào
            
            📄 file (bắt buộc, multipart/form-data)
            Loại: MultipartFile
            Mô tả: File tài liệu cần upload (txt, pdf, docx, etc.)
            
            📄 userId (tùy chọn, query)
            Loại: string
            Mô tả: ID của người dùng upload file
            
            📄 folder (tùy chọn, query)
            Loại: string
            Mô tả: Thư mục lưu trữ file
            
            🔹 Đầu ra
            
            📝 data
            Loại: FileUploadResponse
            Mô tả: Thông tin file đã upload thành công
            
            📊 apiVersion
            Loại: string
            Mô tả: Phiên bản API (v1)
            
            🔢 statusCode
            Loại: integer
            Mô tả: Mã trạng thái HTTP (201: Created)
            
            📋 shortMessage
            Loại: string
            Mô tả: Thông báo ngắn gọn về kết quả
            
            📖 description
            Loại: string
            Mô tả: Mô tả chi tiết về kết quả xử lý
            
            🕒 timestamp
            Loại: string (ISO-8601)
            Mô tả: Thời gian xử lý yêu cầu
            
            🆔 requestId
            Loại: string (UUID)
            Mô tả: Định danh duy nhất của yêu cầu
            
            🛣️ path
            Loại: string
            Mô tả: Đường dẫn API được gọi
            """,
            responses = {
                    @ApiResponse(responseCode = "201", description = "File uploaded successfully",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = FileUploadResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid input"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RestResponse<FileUploadResponse>> uploadDocument(
            @Parameter(description = "File to upload", required = true) @RequestPart("file") MultipartFile file,
            @Parameter(description = "User ID (optional)") @RequestParam(value = "userId", required = false) String userId,
            @Parameter(description = "Folder path (optional)") @RequestParam(value = "folder", required = false) String folder
    ) {
        FileUploadResponse response = fileStorageService.uploadFile(file, userId, folder);
        return ResponseEntity.status(HttpStatus.CREATED).body(RestResponse.success(response, "Document uploaded successfully"));
    }

    @Operation(
            summary = "Download document file",
            description = """
            🔹 Đầu vào
            
            📄 fileId (bắt buộc, path)
            Loại: string
            Mô tả: ID của file cần download
            
            📄 userId (tùy chọn, query)
            Loại: string
            Mô tả: ID của người dùng yêu cầu download
            
            🔹 Đầu ra
            
            📝 data
            Loại: FileDownloadResponse
            Mô tả: File content và metadata
            
            📊 apiVersion
            Loại: string
            Mô tả: Phiên bản API (v1)
            
            🔢 statusCode
            Loại: integer
            Mô tả: Mã trạng thái HTTP (200: OK, 404: Not Found)
            
            📋 shortMessage
            Loại: string
            Mô tả: Thông báo ngắn gọn về kết quả
            
            📖 description
            Loại: string
            Mô tả: Mô tả chi tiết về kết quả xử lý
            
            🕒 timestamp
            Loại: string (ISO-8601)
            Mô tả: Thời gian xử lý yêu cầu
            
            🆔 requestId
            Loại: string (UUID)
            Mô tả: Định danh duy nhất của yêu cầu
            
            🛣️ path
            Loại: string
            Mô tả: Đường dẫn API được gọi
            """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "File downloaded successfully",
                            content = @Content(mediaType = "application/octet-stream")),
                    @ApiResponse(responseCode = "404", description = "File not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/{fileId}/download")
    public ResponseEntity<Resource> downloadDocument(
            @Parameter(description = "ID of the file to download", required = true) @PathVariable String fileId,
            @Parameter(description = "User ID (optional)") @RequestParam(value = "userId", required = false) String userId
    ) {
        FileDownloadResponse download = fileStorageService.downloadFile(fileId, userId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(download.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + download.getFilename() + "\"")
                .body(download.getResource());
    }

    @Operation(
            summary = "Get all documents",
            description = """
            🔹 Đầu vào
            
            📄 page (tùy chọn, query)
            Loại: integer
            Mô tả: Số trang (mặc định: 0)
            
            📄 size (tùy chọn, query)  
            Loại: integer
            Mô tả: Kích thước trang (mặc định: 10)
            
            📄 userId (tùy chọn, query)
            Loại: string
            Mô tả: ID của người dùng để lọc documents
            
            🔹 Đầu ra
            
            📝 data
            Loại: FileListResponse
            Mô tả: Danh sách documents với phân trang
            
            📊 apiVersion
            Loại: string
            Mô tả: Phiên bản API (v1)
            
            🔢 statusCode
            Loại: integer
            Mô tả: Mã trạng thái HTTP (200: OK, 204: No Content)
            
            📋 shortMessage
            Loại: string
            Mô tả: Thông báo ngắn gọn về kết quả
            
            📖 description
            Loại: string
            Mô tả: Mô tả chi tiết về kết quả xử lý
            
            🕒 timestamp
            Loại: string (ISO-8601)
            Mô tả: Thời gian xử lý yêu cầu
            
            🆔 requestId
            Loại: string (UUID)
            Mô tả: Định danh duy nhất của yêu cầu
            
            🛣️ path
            Loại: string
            Mô tả: Đường dẫn API được gọi
            """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "Documents retrieved successfully",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = FileListResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping
    public ResponseEntity<RestResponse<FileListResponse>> getAllDocuments(
            @Parameter(description = "Page number (default: 0)") @RequestParam(value = "page", defaultValue = "0") int page,
            @Parameter(description = "Page size (default: 10)") @RequestParam(value = "size", defaultValue = "10") int size,
            @Parameter(description = "User ID (optional)") @RequestParam(value = "userId", required = false) String userId
    ) {
        FileListResponse documents = fileStorageService.getAllFiles(page, size, userId);
        return ResponseEntity.ok(RestResponse.success(documents, "Documents retrieved successfully"));
    }
}
