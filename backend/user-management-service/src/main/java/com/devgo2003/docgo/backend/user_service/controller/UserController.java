package com.devgo2003.docgo.backend.user_service.controller;

import com.devgo2003.docgo.backend.user_service.entity.User;
import com.devgo2003.docgo.backend.user_service.service.UserService;
import com.devgo2003.docgo.backend.user_service.common.response.RestResponse;
import com.devgo2003.docgo.backend.user_service.dto.UserSearchRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import java.util.List;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("/api/v1/user-management-service/v1/users")
@RequiredArgsConstructor
@Tag(name = "👤 APIs Quản lý Người dùng", description = "APIs quản lý người dùng")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping
    @Operation(
        summary = "Lấy danh sách người dùng với filter", 
        description = """
        🔹 Đầu vào
        
        👁️ view (tùy chọn, query)
        Loại: string
        Mô tả: Loại view dữ liệu (mặc định: full)
        
        🔍 searchTerm (tùy chọn, query)
        Loại: string
        Mô tả: Từ khóa tìm kiếm trong username, email, fullName
        
        📊 status (tùy chọn, query)
        Loại: User.UserStatus
        Mô tả: Trạng thái người dùng (ACTIVE, INACTIVE, SUSPENDED, LOCKED)
        
        🎭 roleId (tùy chọn, query)
        Loại: string
        Mô tả: ID của vai trò
        
        🏢 organizationId (tùy chọn, query)
        Loại: string
        Mô tả: ID của tổ chức
        
        👤 username (tùy chọn, query)
        Loại: string
        Mô tả: Username cụ thể (tìm kiếm chính xác)
        
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
        Loại: Page<User>
        Mô tả: Danh sách người dùng với phân trang
        
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
        
        📝 Ví dụ sử dụng:
        - GET /users - Lấy tất cả người dùng
        - GET /users?view=summary - Lấy view tóm tắt người dùng
        - GET /users?status=ACTIVE - Lấy người dùng đang hoạt động
        - GET /users?searchTerm=john&status=ACTIVE - Tìm kiếm "john" trong người dùng đang hoạt động
        - GET /users?roleId=admin-123&organizationId=org-456 - Lấy admin của tổ chức cụ thể
        - GET /users?username=john_doe - Tìm người dùng có username chính xác
        """
    )
    public ResponseEntity<RestResponse<Page<User>>> getAllUsers(
            @Parameter(description = "Loại view dữ liệu (table|card|detail|full). Mặc định: full") @RequestParam(defaultValue = "full") String view,
            @Parameter(description = "Từ khóa tìm kiếm") @RequestParam(required = false) String searchTerm,
            @Parameter(description = "Trạng thái người dùng") @RequestParam(required = false) User.UserStatus status,
            @Parameter(description = "ID vai trò") @RequestParam(required = false) String roleId,
            @Parameter(description = "ID tổ chức") @RequestParam(required = false) String organizationId,
            @Parameter(description = "Username") @RequestParam(required = false) String username,
            @Parameter(description = "Số trang (mặc định: 0)") @RequestParam(defaultValue = "0") @Min(value = 0, message = "Số trang phải >= 0") int pageNumber,
            @Parameter(description = "Kích thước trang (mặc định: 10)") @RequestParam(defaultValue = "10") @Min(value = 1, message = "Kích thước trang phải >= 1") @Max(value = 100, message = "Kích thước trang phải <= 100") int pageSize,
            @Parameter(description = "Trường sắp xếp (mặc định: createdAt)") @RequestParam(defaultValue = "createdAt") @Pattern(regexp = "^(createdAt|updatedAt|username|email|firstName|lastName|status)$", message = "Trường sắp xếp không hợp lệ") String sortBy,
            @Parameter(description = "Hướng sắp xếp (mặc định: DESC)") @RequestParam(defaultValue = "DESC") @Pattern(regexp = "^(ASC|DESC)$", message = "Hướng sắp xếp phải là ASC hoặc DESC") String sortDirection) {
        
        log.info("Getting users with filters - view: {}, searchTerm: {}, status: {}, roleId: {}, organizationId: {}, username: {}, pageNumber: {}, pageSize: {}, sortBy: {}, sortDirection: {}", 
                view, searchTerm, status, roleId, organizationId, username, pageNumber, pageSize, sortBy, sortDirection);
        
        // Tạo UserSearchRequest từ các parameters
        UserSearchRequest searchRequest = UserSearchRequest.builder()
                .view(view)
                .searchTerm(searchTerm)
                .status(status)
                .roleId(roleId)
                .organizationId(organizationId)
                .username(username)
                .pageNumber(pageNumber)
                .pageSize(pageSize)
                .sortBy(sortBy)
                .sortDirection(sortDirection)
                .build();
        
        // Chuẩn hóa dữ liệu
        searchRequest.normalize();
        
        Page<User> users = userService.searchUsers(searchRequest);
        
        return ResponseEntity.ok(RestResponse.<Page<User>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách người dùng thành công")
                .data(users)
                .build());
    }
    
    @GetMapping("/{id}")
    @Operation(
        summary = "Lấy thông tin người dùng", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của người dùng cần lấy thông tin
        
        🔹 Đầu ra
        
        📝 data
        Loại: User
        Mô tả: Thông tin chi tiết người dùng
        
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
    public ResponseEntity<RestResponse<User>> getUserById(
            @Parameter(description = "ID người dùng") @PathVariable String id) {
        
        log.info("Getting user by id: {}", id);
        
        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(RestResponse.<User>builder()
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Đã lấy thông tin người dùng thành công")
                        .data(user)
                        .build()))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search/simple")
    @Operation(
        summary = "Tìm kiếm người dùng đơn giản", 
        description = """
        🔹 Đầu vào
        
        🔍 q (bắt buộc, query)
        Loại: string
        Mô tả: Từ khóa tìm kiếm (username, email, tên)
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<User>
        Mô tả: Danh sách người dùng tìm được
        
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
    public ResponseEntity<RestResponse<List<User>>> searchUsersSimple(
            @Parameter(description = "Từ khóa tìm kiếm") @RequestParam String q) {
        
        log.info("Searching users with query: {}", q);
        
        List<User> users = userService.searchUsers(q);
        
        return ResponseEntity.ok(RestResponse.<List<User>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã tìm kiếm người dùng thành công")
                .data(users)
                .build());
    }
    
    @PostMapping
    @Operation(
        summary = "Tạo người dùng mới", 
        description = """
        🔹 Đầu vào
        
        📝 user (bắt buộc, body)
        Loại: User
        Mô tả: Thông tin người dùng mới cần tạo
        
        🔹 Đầu ra
        
        📝 data
        Loại: User
        Mô tả: Thông tin người dùng đã được tạo
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (201: Created, 400: Bad Request, 409: Conflict)
        
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
    public ResponseEntity<RestResponse<User>> createUser(
            @Parameter(description = "Thông tin người dùng") @Valid @RequestBody User user) {
        
        log.info("Creating new user: {}", user.getUsername());
        
        User createdUser = userService.createUser(user);
        
        return ResponseEntity.ok(RestResponse.<User>builder()
                .statusCode(201)
                .shortMessage("Created")
                .description("Đã tạo người dùng thành công")
                .data(createdUser)
                .build());
    }
    
    @GetMapping("/search")
    @Operation(
        summary = "Tìm kiếm người dùng", 
        description = """
        🔹 Đầu vào
        
        🔍 searchTerm (tùy chọn, query)
        Loại: string
        Mô tả: Từ khóa tìm kiếm
        
        📊 status (tùy chọn, query)
        Loại: User.UserStatus
        Mô tả: Trạng thái người dùng
        
        🎭 roleId (tùy chọn, query)
        Loại: string
        Mô tả: ID vai trò
        
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
        Loại: List<User>
        Mô tả: Kết quả tìm kiếm người dùng
        
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
    public ResponseEntity<RestResponse<List<User>>> searchUsers(
            @Parameter(description = "Từ khóa tìm kiếm") @RequestParam(required = false) String searchTerm,
            @Parameter(description = "Trạng thái người dùng") @RequestParam(required = false) User.UserStatus status,
            @Parameter(description = "ID vai trò") @RequestParam(required = false) String roleId,
            @Parameter(description = "Số trang (mặc định: 0)") @RequestParam(defaultValue = "0") int pageNumber,
            @Parameter(description = "Kích thước trang (mặc định: 10)") @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "Trường sắp xếp (mặc định: createdAt)") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Hướng sắp xếp (mặc định: DESC)") @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        log.info("Searching users - searchTerm: {}, status: {}, roleId: {}", searchTerm, status, roleId);
        
        List<User> users = userService.searchUsers(searchTerm);
        
        return ResponseEntity.ok(RestResponse.<List<User>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã tìm kiếm người dùng thành công")
                .data(users)
                .build());
    }
    
    @GetMapping("/count")
    @Operation(
        summary = "Đếm số lượng người dùng", 
        description = """
        🔹 Đầu vào
        
        📊 status (tùy chọn, query)
        Loại: User.UserStatus
        Mô tả: Trạng thái người dùng cần đếm
        
        🔹 Đầu ra
        
        📝 data
        Loại: Long
        Mô tả: Số lượng người dùng
        
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
    public ResponseEntity<RestResponse<Long>> countUsers(
            @Parameter(description = "Trạng thái người dùng") @RequestParam(required = false) User.UserStatus status) {
        
        log.info("Counting users by status: {}", status);
        
        long count = userService.getAllUsers(0, 1000, "createdAt", "DESC").getTotalElements();
        
        return ResponseEntity.ok(RestResponse.<Long>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã đếm số lượng người dùng thành công")
                .data(count)
                .build());
    }
    
    @GetMapping("/bulk")
    @Operation(
        summary = "Lấy danh sách người dùng theo danh sách ID", 
        description = """
        🔹 Đầu vào
        
        🆔 ids (bắt buộc, query)
        Loại: List<String>
        Mô tả: Danh sách ID người dùng cần lấy
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<User>
        Mô tả: Danh sách người dùng tìm được
        
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
    public ResponseEntity<RestResponse<List<User>>> getUsersByIds(
            @Parameter(description = "Danh sách ID người dùng") @RequestParam List<String> ids) {
        
        log.info("Getting users by IDs: {}", ids);
        
        List<User> users = userService.getAllUsers(0, 1000, "createdAt", "DESC").getContent();
        
        return ResponseEntity.ok(RestResponse.<List<User>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách người dùng theo ID thành công")
                .data(users)
                .build());
    }
    
    @PutMapping("/{id}")
    @Operation(
        summary = "Cập nhật người dùng", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của người dùng cần cập nhật
        
        📝 userDetails (bắt buộc, body)
        Loại: User
        Mô tả: Thông tin cập nhật cho người dùng
        
        🔹 Đầu ra
        
        📝 data
        Loại: User
        Mô tả: Thông tin người dùng đã được cập nhật
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)
        
        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái HTTP (200: OK, 400: Bad Request, 404: Not Found)
        
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
    public ResponseEntity<RestResponse<User>> updateUser(
            @Parameter(description = "ID người dùng") @PathVariable String id,
            @Parameter(description = "Thông tin cập nhật") @Valid @RequestBody User userDetails) {
        
        log.info("Updating user: {}", id);
        
        User updatedUser = userService.updateUser(id, userDetails);
        
        return ResponseEntity.ok(RestResponse.<User>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã cập nhật người dùng thành công")
                .data(updatedUser)
                .build());
    }
    
    @PutMapping("/{id}/status")
    @Operation(
        summary = "Cập nhật trạng thái người dùng", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của người dùng cần cập nhật trạng thái
        
        📊 status (bắt buộc, query)
        Loại: User.UserStatus
        Mô tả: Trạng thái mới (ACTIVE, INACTIVE, SUSPENDED, LOCKED)
        
        🔹 Đầu ra
        
        📝 data
        Loại: User
        Mô tả: Thông tin người dùng với trạng thái đã cập nhật
        
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
    public ResponseEntity<RestResponse<User>> updateUserStatus(
            @Parameter(description = "ID người dùng") @PathVariable String id,
            @Parameter(description = "Trạng thái mới") @RequestParam User.UserStatus status) {
        
        log.info("Updating user status: {} to {}", id, status);
        
        User updatedUser = userService.updateUserStatus(id, status);
        
        return ResponseEntity.ok(RestResponse.<User>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã cập nhật trạng thái người dùng thành công")
                .data(updatedUser)
                .build());
    }
    
    @PutMapping("/{id}/roles")
    @Operation(
        summary = "Gán vai trò cho người dùng", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của người dùng cần gán vai trò
        
        👥 roleIds (bắt buộc, body)
        Loại: Set<String>
        Mô tả: Danh sách ID các vai trò cần gán
        
        🔹 Đầu ra
        
        📝 data
        Loại: User
        Mô tả: Thông tin người dùng với vai trò đã được gán
        
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
    public ResponseEntity<RestResponse<User>> assignRoles(
            @Parameter(description = "ID người dùng") @PathVariable String id,
            @Parameter(description = "Danh sách ID vai trò") @RequestBody Set<String> roleIds) {
        
        log.info("Assigning roles to user: {}", id);
        
        User updatedUser = userService.assignRoles(id, roleIds);
        
        return ResponseEntity.ok(RestResponse.<User>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã gán vai trò cho người dùng thành công")
                .data(updatedUser)
                .build());
    }
    
    @PutMapping("/{id}/permissions")
    @Operation(
        summary = "Gán quyền cho người dùng", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của người dùng cần gán quyền
        
        🔐 permissionIds (bắt buộc, body)
        Loại: Set<String>
        Mô tả: Danh sách ID các quyền cần gán
        
        🔹 Đầu ra
        
        📝 data
        Loại: User
        Mô tả: Thông tin người dùng với quyền đã được gán
        
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
    public ResponseEntity<RestResponse<User>> assignPermissions(
            @Parameter(description = "ID người dùng") @PathVariable String id,
            @Parameter(description = "Danh sách ID quyền") @RequestBody Set<String> permissionIds) {
        
        log.info("Assigning permissions to user: {}", id);
        
        User updatedUser = userService.assignPermissions(id, permissionIds);
        
        return ResponseEntity.ok(RestResponse.<User>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã gán quyền cho người dùng thành công")
                .data(updatedUser)
                .build());
    }
    
    @PutMapping("/{id}/password")
    @Operation(
        summary = "Đổi mật khẩu", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của người dùng cần đổi mật khẩu
        
        🔑 newPassword (bắt buộc, query)
        Loại: string
        Mô tả: Mật khẩu mới
        
        🔹 Đầu ra
        
        📝 data
        Loại: User
        Mô tả: Thông tin người dùng với mật khẩu đã được cập nhật
        
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
    public ResponseEntity<RestResponse<User>> updatePassword(
            @Parameter(description = "ID người dùng") @PathVariable String id,
            @Parameter(description = "Mật khẩu mới") @RequestParam String newPassword) {
        
        log.info("Updating password for user: {}", id);
        
        User updatedUser = userService.updatePassword(id, newPassword);
        
        return ResponseEntity.ok(RestResponse.<User>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã đổi mật khẩu thành công")
                .data(updatedUser)
                .build());
    }
    
    @PutMapping("/{id}/two-factor/enable")
    @Operation(
        summary = "Bật xác thực hai yếu tố", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của người dùng cần bật 2FA
        
        🔐 secret (bắt buộc, query)
        Loại: string
        Mô tả: Mã bí mật để thiết lập 2FA
        
        🔹 Đầu ra
        
        📝 data
        Loại: User
        Mô tả: Thông tin người dùng với 2FA đã được bật
        
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
    public ResponseEntity<RestResponse<User>> enableTwoFactor(
            @Parameter(description = "ID người dùng") @PathVariable String id,
            @Parameter(description = "Mã bí mật") @RequestParam String secret) {
        
        log.info("Enabling two-factor authentication for user: {}", id);
        
        User updatedUser = userService.enableTwoFactor(id, secret);
        
        return ResponseEntity.ok(RestResponse.<User>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã bật xác thực hai yếu tố thành công")
                .data(updatedUser)
                .build());
    }
    
    @PutMapping("/{id}/two-factor/disable")
    @Operation(
        summary = "Tắt xác thực hai yếu tố", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của người dùng cần tắt 2FA
        
        🔹 Đầu ra
        
        📝 data
        Loại: User
        Mô tả: Thông tin người dùng với 2FA đã được tắt
        
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
    public ResponseEntity<RestResponse<User>> disableTwoFactor(
            @Parameter(description = "ID người dùng") @PathVariable String id) {
        
        log.info("Disabling two-factor authentication for user: {}", id);
        
        User updatedUser = userService.disableTwoFactor(id);
        
        return ResponseEntity.ok(RestResponse.<User>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã tắt xác thực hai yếu tố thành công")
                .data(updatedUser)
                .build());
    }
    
    @DeleteMapping("/{id}")
    @Operation(
        summary = "Xóa người dùng", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của người dùng cần xóa
        
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
    public ResponseEntity<RestResponse<Void>> deleteUser(
            @Parameter(description = "ID người dùng") @PathVariable String id) {
        
        log.info("Deleting user: {}", id);
        
        userService.deleteUser(id);
        
        return ResponseEntity.ok(RestResponse.<Void>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã xóa người dùng thành công")
                .data(null)
                .build());
    }
    
    @GetMapping("/locked")
    @Operation(
        summary = "Lấy danh sách tài khoản bị khóa", 
        description = """
        🔹 Đầu vào
        
        Không có tham số đầu vào
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<User>
        Mô tả: Danh sách tài khoản bị khóa do đăng nhập sai nhiều lần
        
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
    public ResponseEntity<RestResponse<List<User>>> getLockedUsers() {
        
        log.info("Getting locked users");
        
        List<User> lockedUsers = userService.getLockedUsers();
        
        return ResponseEntity.ok(RestResponse.<List<User>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách tài khoản bị khóa thành công")
                .data(lockedUsers)
                .build());
    }
}
