package com.devgo2003.docgo.document_service.file;

import com.devgo2003.docgo.document_service.common.response.RestResponse;
import com.devgo2003.docgo.document_service.file.dto.FileUploadResponse;
import com.devgo2003.docgo.document_service.file.dto.FileDownloadResponse;
import com.devgo2003.docgo.document_service.file.dto.FileListResponse;
import com.devgo2003.docgo.document_service.file.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/document-management-service/files")
@Tag(name = "File Storage", description = "API quản lý file storage và assets")
public class FileStorageController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
        summary = "Upload file với scan và versioning", 
        description = """
        🔹 Đầu vào
        
        📁 file (bắt buộc, multipart/form-data)
        Loại: MultipartFile
        Mô tả: File cần upload với scan malware và versioning
        
        📂 folder (tùy chọn, query)
        Loại: string
        Mô tả: Thư mục con tùy chọn trong bucket
        
        👤 user_id (tùy chọn, query)
        Loại: string
        Mô tả: ID của user upload file (mặc định: public)
        
        🔹 Đầu ra
        
        📄 data
        Loại: FileUploadResponse
        Mô tả: Thông tin file đã upload bao gồm file_id, filename, file_size, file_type, status, upload_time, s3_key, bucket, file_url
        """
    )
    public ResponseEntity<RestResponse<FileUploadResponse>> uploadFile(
        @Parameter(description = "File cần upload") @RequestParam("file") MultipartFile file,
        @Parameter(description = "Thư mục con tùy chọn trong bucket") @RequestParam(value = "folder", required = false) String folder,
        @Parameter(description = "ID của user upload file (mặc định: public)") @RequestParam(value = "user_id", required = false) String userId
    ) {
        try {
            FileUploadResponse response = fileStorageService.uploadFile(file, folder, userId);
            return ResponseEntity.ok(RestResponse.<FileUploadResponse>builder()
                .statusCode(201)
                .shortMessage("Created")
                .description("File đã được upload thành công.")
                .data(response)
                .build());
        } catch (Exception e) {
            return ResponseEntity.ok(RestResponse.<FileUploadResponse>builder()
                .statusCode(500)
                .shortMessage("Internal Server Error")
                .description("Lỗi upload file: " + e.getMessage())
                .data(null)
                .build());
        }
    }

    @GetMapping("/{fileId}/download")
    @Operation(
        summary = "Download file",
        description = """
        🔹 Đầu vào
        
        🆔 fileId (bắt buộc, path)
        Loại: string
        Mô tả: ID của file cần download
        
        👤 user_id (tùy chọn, query)
        Loại: string
        Mô tả: ID của user download file (mặc định: public)
        
        🔢 version (tùy chọn, query)
        Loại: integer
        Mô tả: Phiên bản file cụ thể (nếu không có, tải bản mới nhất)
        
        🔹 Đầu ra
        
        📄 Response
        Loại: File content (application/octet-stream)
        Mô tả: Nội dung file với header Content-Disposition để download
        """
    )
    public ResponseEntity<Resource> downloadFile(
        @Parameter(description = "ID của file cần download") @PathVariable String fileId,
        @Parameter(description = "ID của user download file (mặc định: public)") @RequestParam(value = "user_id", required = false) String userId,
        @Parameter(description = "Phiên bản file cụ thể (nếu không có, tải bản mới nhất)") @RequestParam(value = "version", required = false) Integer version
    ) {
        try {
            FileDownloadResponse response = fileStorageService.downloadFile(fileId, userId, version);
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(response.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + response.getFilename() + "\"")
                .body(response.getResource());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    @Operation(
        summary = "Lấy danh sách files với pagination chuẩn",
        description = """
        🔹 Đầu vào
        
        📄 page_number (tùy chọn, query)
        Loại: integer
        Mô tả: Số trang (mặc định: 0)
        
        📄 page_size (tùy chọn, query)
        Loại: integer
        Mô tả: Kích thước trang (mặc định: 10)
        
        📄 sort_by (tùy chọn, query)
        Loại: List<String>
        Mô tả: Danh sách các trường để sắp xếp (filename, size, created_at, updated_at, content_type)
        
        📄 sort_direction (tùy chọn, query)
        Loại: List<String>
        Mô tả: Hướng sắp xếp (ASC/DESC)
        
        📄 include_deleted (tùy chọn, query)
        Loại: boolean
        Mô tả: Có bao gồm files đã xóa không (mặc định: false)
        
        🔹 Đầu ra
        
        📄 data
        Loại: FileListResponse
        Mô tả: Danh sách files với cấu trúc response chuẩn
        """
    )
    public ResponseEntity<RestResponse<FileListResponse>> getAllFiles(
        @Parameter(description = "Số trang (mặc định: 0)") @RequestParam(defaultValue = "0") int pageNumber,
        @Parameter(description = "Kích thước trang (mặc định: 10)") @RequestParam(defaultValue = "10") int pageSize,
        @Parameter(description = "Danh sách các trường để sắp xếp") @RequestParam(required = false) List<String> sortBy,
        @Parameter(description = "Hướng sắp xếp (ASC/DESC)") @RequestParam(required = false) List<String> sortDirection,
        @Parameter(description = "Có bao gồm files đã xóa không (mặc định: false)") @RequestParam(defaultValue = "false") boolean includeDeleted
    ) {
        try {
            FileListResponse response = fileStorageService.getAllFiles(pageNumber, pageSize, sortBy, sortDirection, includeDeleted);
            return ResponseEntity.ok(RestResponse.<FileListResponse>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách files thành công")
                .data(response)
                .build());
        } catch (Exception e) {
            return ResponseEntity.ok(RestResponse.<FileListResponse>builder()
                .statusCode(500)
                .shortMessage("Internal Server Error")
                .description("Lỗi lấy danh sách files: " + e.getMessage())
                .data(null)
                .build());
        }
    }

    @GetMapping("/{fileId}")
    @Operation(
        summary = "Lấy thông tin chi tiết file",
        description = """
        🔹 Đầu vào
        
        🆔 fileId (bắt buộc, path)
        Loại: string
        Mô tả: ID của file cần lấy thông tin
        
        🔹 Đầu ra
        
        📄 data
        Loại: FileDetailResponse
        Mô tả: Thông tin chi tiết của file bao gồm metadata, checksum, access count
        """
    )
    public ResponseEntity<RestResponse<Map<String, Object>>> getFileDetails(
        @Parameter(description = "ID của file cần lấy thông tin") @PathVariable String fileId
    ) {
        try {
            Map<String, Object> response = fileStorageService.getFileDetails(fileId);
            return ResponseEntity.ok(RestResponse.<Map<String, Object>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy thông tin chi tiết file thành công")
                .data(response)
                .build());
        } catch (Exception e) {
            return ResponseEntity.ok(RestResponse.<Map<String, Object>>builder()
                .statusCode(500)
                .shortMessage("Internal Server Error")
                .description("Lỗi lấy thông tin file: " + e.getMessage())
                .data(null)
                .build());
        }
    }

    @DeleteMapping("/{fileId}")
    @Operation(
        summary = "Xóa file hoặc phiên bản cụ thể",
        description = """
        🔹 Đầu vào
        
        🆔 fileId (bắt buộc, path)
        Loại: string
        Mô tả: ID của file cần xóa
        
        👤 user_id (tùy chọn, query)
        Loại: string
        Mô tả: ID của user xóa file (mặc định: public)
        
        🔢 version (tùy chọn, query)
        Loại: integer
        Mô tả: Phiên bản cụ thể cần xóa (nếu không có thì xóa tất cả)
        
        🔹 Đầu ra
        
        📄 data
        Loại: object
        Mô tả: Kết quả xóa file với thông tin xác nhận
        """
    )
    public ResponseEntity<RestResponse<Map<String, Object>>> deleteFile(
        @Parameter(description = "ID của file cần xóa") @PathVariable String fileId,
        @Parameter(description = "ID của user xóa file (mặc định: public)") @RequestParam(value = "user_id", required = false) String userId,
        @Parameter(description = "Phiên bản cụ thể cần xóa (nếu không có thì xóa tất cả)") @RequestParam(value = "version", required = false) Integer version
    ) {
        try {
            boolean result = fileStorageService.deleteFile(fileId, userId, version);
            Map<String, Object> response = Map.of("success", result);
            return ResponseEntity.ok(RestResponse.<Map<String, Object>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description(version != null ? 
                    "Đã xóa phiên bản " + version + " của file thành công" : 
                    "Đã xóa toàn bộ file thành công")
                .data(response)
                .build());
        } catch (Exception e) {
            return ResponseEntity.ok(RestResponse.<Map<String, Object>>builder()
                .statusCode(500)
                .shortMessage("Internal Server Error")
                .description("Lỗi xóa file: " + e.getMessage())
                .data(null)
                .build());
        }
    }
}
