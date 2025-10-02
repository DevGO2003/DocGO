package com.devgo2003.docgo.backend.user_service.controller;

import com.devgo2003.docgo.backend.user_service.entity.UserSession;
import com.devgo2003.docgo.backend.user_service.service.SessionService;
import com.devgo2003.docgo.backend.user_service.common.response.RestResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/user-management-service/v1/sessions")
@RequiredArgsConstructor
@Tag(name = "🕐 APIs Quản lý Phiên đăng nhập", description = "APIs quản lý phiên đăng nhập")
public class SessionController {
    
    private final SessionService sessionService;
    
    @GetMapping
    @Operation(
        summary = "Lấy danh sách phiên đăng nhập", 
        description = """
        🔹 Đầu vào
        
        👁️ view (tùy chọn, query)
        Loại: string
        Mô tả: Loại view dữ liệu (mặc định: full)
        
        📄 pageNumber (tùy chọn, query)
        Loại: integer
        Mô tả: Số trang (mặc định: 0)
        
        📄 pageSize (tùy chọn, query)
        Loại: integer
        Mô tả: Kích thước trang (mặc định: 10)
        
        📄 sortBy (tùy chọn, query)
        Loại: string
        Mô tả: Trường sắp xếp (mặc định: createdAt)
        
        📄 sortDirection (tùy chọn, query)
        Loại: string
        Mô tả: Hướng sắp xếp: ASC hoặc DESC (mặc định: DESC)
        
        🔹 Đầu ra
        
        📝 data
        Loại: Page<UserSession>
        Mô tả: Danh sách phiên đăng nhập với phân trang
        
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
        """
    )
    public ResponseEntity<RestResponse<Page<UserSession>>> getAllSessions(
            @Parameter(description = "Loại view dữ liệu (mặc định: full)") @RequestParam(defaultValue = "full") String view,
            @Parameter(description = "Số trang (mặc định: 0)") @RequestParam(defaultValue = "0") int pageNumber,
            @Parameter(description = "Kích thước trang (mặc định: 10)") @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "Trường sắp xếp (mặc định: createdAt)") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Hướng sắp xếp (mặc định: DESC)") @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        log.info("Getting all sessions - view: {}, pageNumber: {}, pageSize: {}, sortBy: {}, sortDirection: {}", view, pageNumber, pageSize, sortBy, sortDirection);
        
        Page<UserSession> sessions = sessionService.getAllSessions(pageNumber, pageSize, sortBy, sortDirection);
        
        return ResponseEntity.ok(RestResponse.<Page<UserSession>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách phiên đăng nhập thành công")
                .data(sessions)
                .build());
    }
    
    @GetMapping("/{id}")
    @Operation(
        summary = "Lấy thông tin phiên đăng nhập", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của phiên đăng nhập cần lấy thông tin
        
        🔹 Đầu ra
        
        📝 data
        Loại: UserSession
        Mô tả: Thông tin chi tiết phiên đăng nhập
        
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
        """
    )
    public ResponseEntity<RestResponse<UserSession>> getSessionById(
            @Parameter(description = "ID phiên đăng nhập") @PathVariable String id) {
        
        log.info("Getting session by id: {}", id);
        
        return sessionService.getSessionById(id)
                .map(session -> ResponseEntity.ok(RestResponse.<UserSession>builder()
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Đã lấy thông tin phiên đăng nhập thành công")
                        .data(session)
                        .build()))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/token/{sessionToken}")
    @Operation(
        summary = "Lấy phiên đăng nhập theo token", 
        description = """
        🔹 Đầu vào
        
        🔑 sessionToken (bắt buộc, path)
        Loại: string
        Mô tả: Session token cần tìm
        
        🔹 Đầu ra
        
        📝 data
        Loại: UserSession
        Mô tả: Thông tin phiên đăng nhập tìm được
        
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
        """
    )
    public ResponseEntity<RestResponse<UserSession>> getSessionByToken(
            @Parameter(description = "Session token") @PathVariable String sessionToken) {
        
        log.info("Getting session by token: {}", sessionToken);
        
        return sessionService.getSessionByToken(sessionToken)
                .map(session -> ResponseEntity.ok(RestResponse.<UserSession>builder()
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Đã lấy thông tin phiên đăng nhập thành công")
                        .data(session)
                        .build()))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/status/{status}")
    @Operation(
        summary = "Lấy phiên đăng nhập theo trạng thái", 
        description = """
        🔹 Đầu vào
        
        📊 status (bắt buộc, path)
        Loại: UserSession.SessionStatus
        Mô tả: Trạng thái phiên đăng nhập (ACTIVE, EXPIRED, TERMINATED)
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<UserSession>
        Mô tả: Danh sách phiên đăng nhập theo trạng thái
        
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
        """
    )
    public ResponseEntity<RestResponse<List<UserSession>>> getSessionsByStatus(
            @Parameter(description = "Trạng thái phiên đăng nhập") @PathVariable UserSession.SessionStatus status) {
        
        log.info("Getting sessions by status: {}", status);
        
        List<UserSession> sessions = sessionService.getSessionsByStatus(status);
        
        return ResponseEntity.ok(RestResponse.<List<UserSession>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách phiên đăng nhập theo trạng thái thành công")
                .data(sessions)
                .build());
    }
    
    @GetMapping("/ip/{ipAddress}")
    @Operation(
        summary = "Lấy phiên đăng nhập theo IP", 
        description = """
        🔹 Đầu vào
        
        🌐 ipAddress (bắt buộc, path)
        Loại: string
        Mô tả: Địa chỉ IP cần tìm
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<UserSession>
        Mô tả: Danh sách phiên đăng nhập từ IP này
        
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
        """
    )
    public ResponseEntity<RestResponse<List<UserSession>>> getSessionsByIp(
            @Parameter(description = "Địa chỉ IP") @PathVariable String ipAddress) {
        
        log.info("Getting sessions by IP: {}", ipAddress);
        
        List<UserSession> sessions = sessionService.getSessionsByIpAddress(ipAddress);
        
        return ResponseEntity.ok(RestResponse.<List<UserSession>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách phiên đăng nhập theo IP thành công")
                .data(sessions)
                .build());
    }
    
    @GetMapping("/device")
    @Operation(
        summary = "Lấy phiên đăng nhập theo thiết bị", 
        description = """
        🔹 Đầu vào
        
        📱 deviceInfo (bắt buộc, query)
        Loại: string
        Mô tả: Thông tin thiết bị cần tìm
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<UserSession>
        Mô tả: Danh sách phiên đăng nhập từ thiết bị này
        
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
        """
    )
    public ResponseEntity<RestResponse<List<UserSession>>> getSessionsByDevice(
            @Parameter(description = "Thông tin thiết bị") @RequestParam String deviceInfo) {
        
        log.info("Getting sessions by device: {}", deviceInfo);
        
        List<UserSession> sessions = sessionService.getSessionsByDevice(deviceInfo);
        
        return ResponseEntity.ok(RestResponse.<List<UserSession>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách phiên đăng nhập theo thiết bị thành công")
                .data(sessions)
                .build());
    }
    
    @PostMapping
    @Operation(
        summary = "Tạo phiên đăng nhập mới", 
        description = """
        🔹 Đầu vào
        
        👤 userId (bắt buộc, query)
        Loại: string
        Mô tả: ID của người dùng
        
        📱 deviceInfo (bắt buộc, query)
        Loại: string
        Mô tả: Thông tin thiết bị
        
        🌐 ipAddress (bắt buộc, query)
        Loại: string
        Mô tả: Địa chỉ IP
        
        🌐 userAgent (bắt buộc, query)
        Loại: string
        Mô tả: User Agent string
        
        🔹 Đầu ra
        
        📝 data
        Loại: UserSession
        Mô tả: Thông tin phiên đăng nhập đã được tạo
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (201: Created, 400: Bad Request)
        
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
        """
    )
    public ResponseEntity<RestResponse<UserSession>> createSession(
            @Parameter(description = "ID người dùng") @RequestParam String userId,
            @Parameter(description = "Thông tin thiết bị") @RequestParam String deviceInfo,
            @Parameter(description = "Địa chỉ IP") @RequestParam String ipAddress,
            @Parameter(description = "User Agent") @RequestParam String userAgent) {
        
        log.info("Creating new session for user: {}", userId);
        
        UserSession session = sessionService.createSession(userId, deviceInfo, ipAddress, userAgent);
        
        return ResponseEntity.ok(RestResponse.<UserSession>builder()
                .statusCode(201)
                .shortMessage("Created")
                .description("Đã tạo phiên đăng nhập thành công")
                .data(session)
                .build());
    }
    
    @GetMapping("/user/{userId}")
    @Operation(
        summary = "Lấy phiên đăng nhập của người dùng", 
        description = """
        🔹 Đầu vào
        
        👤 userId (bắt buộc, path)
        Loại: string
        Mô tả: ID của người dùng
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<UserSession>
        Mô tả: Danh sách phiên đăng nhập của người dùng
        
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
        """
    )
    public ResponseEntity<RestResponse<List<UserSession>>> getUserSessions(
            @Parameter(description = "ID người dùng") @PathVariable String userId) {
        
        log.info("Getting sessions for user: {}", userId);
        
        List<UserSession> sessions = sessionService.getUserSessions(userId);
        
        return ResponseEntity.ok(RestResponse.<List<UserSession>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách phiên đăng nhập của người dùng thành công")
                .data(sessions)
                .build());
    }
    
    @GetMapping("/user/{userId}/active")
    @Operation(
        summary = "Lấy phiên đăng nhập hoạt động của người dùng", 
        description = """
        🔹 Đầu vào
        
        👤 userId (bắt buộc, path)
        Loại: string
        Mô tả: ID của người dùng
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<UserSession>
        Mô tả: Danh sách phiên đăng nhập đang hoạt động
        
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
        """
    )
    public ResponseEntity<RestResponse<List<UserSession>>> getActiveUserSessions(
            @Parameter(description = "ID người dùng") @PathVariable String userId) {
        
        log.info("Getting active sessions for user: {}", userId);
        
        List<UserSession> sessions = sessionService.getActiveUserSessions(userId);
        
        return ResponseEntity.ok(RestResponse.<List<UserSession>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách phiên đăng nhập hoạt động của người dùng thành công")
                .data(sessions)
                .build());
    }
    
    @PutMapping("/{id}/activity")
    @Operation(
        summary = "Cập nhật hoạt động phiên đăng nhập", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của phiên đăng nhập cần cập nhật
        
        🔹 Đầu ra
        
        📝 data
        Loại: UserSession
        Mô tả: Thông tin phiên đăng nhập đã được cập nhật
        
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
        """
    )
    public ResponseEntity<RestResponse<UserSession>> updateSessionActivity(
            @Parameter(description = "ID phiên đăng nhập") @PathVariable String id) {
        
        log.info("Updating session activity: {}", id);
        
        UserSession updatedSession = sessionService.updateSessionActivity(id);
        
        return ResponseEntity.ok(RestResponse.<UserSession>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã cập nhật hoạt động phiên đăng nhập thành công")
                .data(updatedSession)
                .build());
    }
    
    @PutMapping("/{id}/status")
    @Operation(
        summary = "Cập nhật trạng thái phiên đăng nhập", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của phiên đăng nhập cần cập nhật
        
        📊 status (bắt buộc, query)
        Loại: UserSession.SessionStatus
        Mô tả: Trạng thái mới (ACTIVE, EXPIRED, TERMINATED)
        
        🔹 Đầu ra
        
        📝 data
        Loại: UserSession
        Mô tả: Thông tin phiên đăng nhập với trạng thái đã cập nhật
        
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
        """
    )
    public ResponseEntity<RestResponse<UserSession>> updateSessionStatus(
            @Parameter(description = "ID phiên đăng nhập") @PathVariable String id,
            @Parameter(description = "Trạng thái mới") @RequestParam UserSession.SessionStatus status) {
        
        log.info("Updating session status: {} to {}", id, status);
        
        UserSession updatedSession = sessionService.updateSessionStatus(id, status);
        
        return ResponseEntity.ok(RestResponse.<UserSession>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã cập nhật trạng thái phiên đăng nhập thành công")
                .data(updatedSession)
                .build());
    }
    
    @PutMapping("/{id}/extend")
    @Operation(
        summary = "Gia hạn phiên đăng nhập", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của phiên đăng nhập cần gia hạn
        
        ⏰ hours (bắt buộc, query)
        Loại: integer
        Mô tả: Số giờ gia hạn
        
        🔹 Đầu ra
        
        📝 data
        Loại: UserSession
        Mô tả: Thông tin phiên đăng nhập đã được gia hạn
        
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
        """
    )
    public ResponseEntity<RestResponse<UserSession>> extendSession(
            @Parameter(description = "ID phiên đăng nhập") @PathVariable String id,
            @Parameter(description = "Số giờ gia hạn") @RequestParam int hours) {
        
        log.info("Extending session: {} by {} hours", id, hours);
        
        UserSession updatedSession = sessionService.extendSession(id, hours);
        
        return ResponseEntity.ok(RestResponse.<UserSession>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã gia hạn phiên đăng nhập thành công")
                .data(updatedSession)
                .build());
    }
    
    @PutMapping("/{id}/terminate")
    @Operation(
        summary = "Kết thúc phiên đăng nhập", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của phiên đăng nhập cần kết thúc
        
        🔹 Đầu ra
        
        📝 data
        Loại: null
        Mô tả: Không có dữ liệu trả về khi kết thúc thành công
        
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
        """
    )
    public ResponseEntity<RestResponse<Void>> terminateSession(
            @Parameter(description = "ID phiên đăng nhập") @PathVariable String id) {
        
        log.info("Terminating session: {}", id);
        
        sessionService.terminateSession(id);
        
        return ResponseEntity.ok(RestResponse.<Void>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã kết thúc phiên đăng nhập thành công")
                .data(null)
                .build());
    }
    
    @PutMapping("/user/{userId}/terminate-all")
    @Operation(
        summary = "Kết thúc tất cả phiên đăng nhập của người dùng", 
        description = """
        🔹 Đầu vào
        
        👤 userId (bắt buộc, path)
        Loại: string
        Mô tả: ID của người dùng
        
        🔹 Đầu ra
        
        📝 data
        Loại: null
        Mô tả: Không có dữ liệu trả về khi kết thúc thành công
        
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
        """
    )
    public ResponseEntity<RestResponse<Void>> terminateUserSessions(
            @Parameter(description = "ID người dùng") @PathVariable String userId) {
        
        log.info("Terminating all sessions for user: {}", userId);
        
        sessionService.terminateUserSessions(userId);
        
        return ResponseEntity.ok(RestResponse.<Void>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã kết thúc tất cả phiên đăng nhập của người dùng thành công")
                .data(null)
                .build());
    }
    
    @PutMapping("/ip/{ipAddress}/terminate")
    @Operation(
        summary = "Kết thúc phiên đăng nhập theo IP", 
        description = """
        🔹 Đầu vào
        
        🌐 ipAddress (bắt buộc, path)
        Loại: string
        Mô tả: Địa chỉ IP cần kết thúc phiên
        
        🔹 Đầu ra
        
        📝 data
        Loại: null
        Mô tả: Không có dữ liệu trả về khi kết thúc thành công
        
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
        """
    )
    public ResponseEntity<RestResponse<Void>> terminateSessionsByIp(
            @Parameter(description = "Địa chỉ IP") @PathVariable String ipAddress) {
        
        log.info("Terminating sessions by IP: {}", ipAddress);
        
        sessionService.terminateSessionsByIp(ipAddress);
        
        return ResponseEntity.ok(RestResponse.<Void>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã kết thúc phiên đăng nhập theo IP thành công")
                .data(null)
                .build());
    }
    
    @GetMapping("/validate/{sessionToken}")
    @Operation(
        summary = "Kiểm tra tính hợp lệ phiên đăng nhập", 
        description = """
        🔹 Đầu vào
        
        🔑 sessionToken (bắt buộc, path)
        Loại: string
        Mô tả: Session token cần kiểm tra
        
        🔹 Đầu ra
        
        📝 data
        Loại: boolean
        Mô tả: true nếu phiên hợp lệ, false nếu không
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (200: OK)
        
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
        """
    )
    public ResponseEntity<RestResponse<Boolean>> validateSession(
            @Parameter(description = "Session token") @PathVariable String sessionToken) {
        
        log.info("Validating session: {}", sessionToken);
        
        boolean isValid = sessionService.isSessionValid(sessionToken);
        
        return ResponseEntity.ok(RestResponse.<Boolean>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã kiểm tra tính hợp lệ phiên đăng nhập thành công")
                .data(isValid)
                .build());
    }
    
    @GetMapping("/refresh-validate/{refreshToken}")
    @Operation(
        summary = "Kiểm tra tính hợp lệ refresh token", 
        description = """
        🔹 Đầu vào
        
        🔄 refreshToken (bắt buộc, path)
        Loại: string
        Mô tả: Refresh token cần kiểm tra
        
        🔹 Đầu ra
        
        📝 data
        Loại: boolean
        Mô tả: true nếu refresh token hợp lệ, false nếu không
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (200: OK)
        
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
        """
    )
    public ResponseEntity<RestResponse<Boolean>> validateRefreshToken(
            @Parameter(description = "Refresh token") @PathVariable String refreshToken) {
        
        log.info("Validating refresh token: {}", refreshToken);
        
        boolean isValid = sessionService.isRefreshTokenValid(refreshToken);
        
        return ResponseEntity.ok(RestResponse.<Boolean>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã kiểm tra tính hợp lệ refresh token thành công")
                .data(isValid)
                .build());
    }
    
    @DeleteMapping("/{id}")
    @Operation(
        summary = "Xóa phiên đăng nhập", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của phiên đăng nhập cần xóa
        
        🔹 Đầu ra
        
        📝 data
        Loại: null
        Mô tả: Không có dữ liệu trả về khi xóa thành công
        
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
        """
    )
    public ResponseEntity<RestResponse<Void>> deleteSession(
            @Parameter(description = "ID phiên đăng nhập") @PathVariable String id) {
        
        log.info("Deleting session: {}", id);
        
        sessionService.deleteSession(id);
        
        return ResponseEntity.ok(RestResponse.<Void>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã xóa phiên đăng nhập thành công")
                .data(null)
                .build());
    }
    
    @PostMapping("/cleanup/expired")
    @Operation(
        summary = "Dọn dẹp phiên đăng nhập hết hạn", 
        description = """
        🔹 Đầu vào
        
        Không có tham số đầu vào
        
        🔹 Đầu ra
        
        📝 data
        Loại: null
        Mô tả: Không có dữ liệu trả về khi dọn dẹp thành công
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (200: OK)
        
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
        """
    )
    public ResponseEntity<RestResponse<Void>> cleanupExpiredSessions() {
        
        log.info("Cleaning up expired sessions");
        
        sessionService.cleanupExpiredSessions();
        
        return ResponseEntity.ok(RestResponse.<Void>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã dọn dẹp phiên đăng nhập hết hạn thành công")
                .data(null)
                .build());
    }
    
    @PostMapping("/cleanup/inactive")
    @Operation(
        summary = "Dọn dẹp phiên đăng nhập không hoạt động", 
        description = """
        🔹 Đầu vào
        
        ⏰ hours (bắt buộc, query)
        Loại: integer
        Mô tả: Số giờ không hoạt động để xem xét dọn dẹp
        
        🔹 Đầu ra
        
        📝 data
        Loại: null
        Mô tả: Không có dữ liệu trả về khi dọn dẹp thành công
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (200: OK)
        
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
        """
    )
    public ResponseEntity<RestResponse<Void>> cleanupInactiveSessions(
            @Parameter(description = "Số giờ không hoạt động") @RequestParam int hours) {
        
        log.info("Cleaning up inactive sessions older than {} hours", hours);
        
        sessionService.cleanupInactiveSessions(hours);
        
        return ResponseEntity.ok(RestResponse.<Void>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã dọn dẹp phiên đăng nhập không hoạt động thành công")
                .data(null)
                .build());
    }
}
