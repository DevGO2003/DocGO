package com.devgo2003.docgo.auth_service.controller;

import com.devgo2003.docgo.auth_service.entity.UserMongo;
import com.devgo2003.docgo.auth_service.entity.UserStatus;
import com.devgo2003.docgo.auth_service.service.UserService;
import com.devgo2003.docgo.auth_service.common.response.RestResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("/api/v1/authentication-identity-service/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "API quản lý người dùng")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping
    @Operation(
        summary = "Lấy danh sách người dùng", 
        description = """
        🔹 Đầu vào
        
        📄 page (tùy chọn, query)
        Loại: integer
        Mô tả: Số trang (mặc định: 0)
        
        📄 size (tùy chọn, query)
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
        Loại: Page<UserMongo>
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
        """
    )
    public ResponseEntity<RestResponse<Page<UserMongo>>> getAllUsers(
            @Parameter(description = "Số trang (mặc định: 0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Kích thước trang (mặc định: 10)") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Trường sắp xếp (mặc định: createdAt)") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Hướng sắp xếp (mặc định: DESC)") @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        log.info("Getting all users - page: {}, size: {}, sortBy: {}, sortDirection: {}", page, size, sortBy, sortDirection);
        
        Page<UserMongo> users = userService.getAllUsers(page, size, sortBy, sortDirection);
        
        return ResponseEntity.ok(RestResponse.<Page<UserMongo>>builder()
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
        Loại: UserMongo
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
    public ResponseEntity<RestResponse<UserMongo>> getUserById(
            @Parameter(description = "ID người dùng") @PathVariable String id) {
        
        log.info("Getting user by id: {}", id);
        
        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(RestResponse.<UserMongo>builder()
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Đã lấy thông tin người dùng thành công")
                        .data(user)
                        .build()))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/username/{username}")
    @Operation(
        summary = "Lấy người dùng theo username", 
        description = """
        🔹 Đầu vào
        
        👤 username (bắt buộc, path)
        Loại: string
        Mô tả: Username của người dùng cần tìm
        
        🔹 Đầu ra
        
        📝 data
        Loại: UserMongo
        Mô tả: Thông tin người dùng tìm được
        
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
    public ResponseEntity<RestResponse<UserMongo>> getUserByUsername(
            @Parameter(description = "Username") @PathVariable String username) {
        
        log.info("Getting user by username: {}", username);
        
        return userService.getUserByUsername(username)
                .map(user -> ResponseEntity.ok(RestResponse.<UserMongo>builder()
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Đã lấy thông tin người dùng thành công")
                        .data(user)
                        .build()))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/email/{email}")
    @Operation(
        summary = "Lấy người dùng theo email", 
        description = """
        🔹 Đầu vào
        
        📧 email (bắt buộc, path)
        Loại: string
        Mô tả: Email của người dùng cần tìm
        
        🔹 Đầu ra
        
        📝 data
        Loại: UserMongo
        Mô tả: Thông tin người dùng tìm được
        
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
    public ResponseEntity<RestResponse<UserMongo>> getUserByEmail(
            @Parameter(description = "Email") @PathVariable String email) {
        
        log.info("Getting user by email: {}", email);
        
        return userService.getUserByEmail(email)
                .map(user -> ResponseEntity.ok(RestResponse.<UserMongo>builder()
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Đã lấy thông tin người dùng thành công")
                        .data(user)
                        .build()))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    @Operation(
        summary = "Tìm kiếm người dùng", 
        description = """
        🔹 Đầu vào
        
        🔍 q (bắt buộc, query)
        Loại: string
        Mô tả: Từ khóa tìm kiếm (username, email, tên)
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<UserMongo>
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
    public ResponseEntity<RestResponse<List<UserMongo>>> searchUsers(
            @Parameter(description = "Từ khóa tìm kiếm") @RequestParam String q) {
        
        log.info("Searching users with query: {}", q);
        
        List<UserMongo> users = userService.searchUsers(q);
        
        return ResponseEntity.ok(RestResponse.<List<UserMongo>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã tìm kiếm người dùng thành công")
                .data(users)
                .build());
    }
    
    @GetMapping("/status/{status}")
    @Operation(
        summary = "Lấy người dùng theo trạng thái", 
        description = """
        🔹 Đầu vào
        
        📊 status (bắt buộc, path)
        Loại: UserStatus
        Mô tả: Trạng thái người dùng (ACTIVE, INACTIVE, SUSPENDED, LOCKED)
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<UserMongo>
        Mô tả: Danh sách người dùng theo trạng thái
        
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
    public ResponseEntity<RestResponse<List<UserMongo>>> getUsersByStatus(
            @Parameter(description = "Trạng thái người dùng") @PathVariable UserStatus status) {
        
        log.info("Getting users by status: {}", status);
        
        List<UserMongo> users = userService.getUsersByStatus(status);
        
        return ResponseEntity.ok(RestResponse.<List<UserMongo>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách người dùng theo trạng thái thành công")
                .data(users)
                .build());
    }
    
    @PostMapping
    @Operation(
        summary = "Tạo người dùng mới", 
        description = """
        🔹 Đầu vào
        
        📝 user (bắt buộc, body)
        Loại: UserMongo
        Mô tả: Thông tin người dùng mới cần tạo
        
        🔹 Đầu ra
        
        📝 data
        Loại: UserMongo
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
    public ResponseEntity<RestResponse<UserMongo>> createUser(
            @Parameter(description = "Thông tin người dùng") @Valid @RequestBody UserMongo user) {
        
        log.info("Creating new user: {}", user.getUsername());
        
        UserMongo createdUser = userService.createUser(user);
        
        return ResponseEntity.ok(RestResponse.<UserMongo>builder()
                .statusCode(201)
                .shortMessage("Created")
                .description("Đã tạo người dùng thành công")
                .data(createdUser)
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
        Loại: UserMongo
        Mô tả: Thông tin cập nhật cho người dùng
        
        🔹 Đầu ra
        
        📝 data
        Loại: UserMongo
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
    public ResponseEntity<RestResponse<UserMongo>> updateUser(
            @Parameter(description = "ID người dùng") @PathVariable String id,
            @Parameter(description = "Thông tin cập nhật") @Valid @RequestBody UserMongo userDetails) {
        
        log.info("Updating user: {}", id);
        
        UserMongo updatedUser = userService.updateUser(id, userDetails);
        
        return ResponseEntity.ok(RestResponse.<UserMongo>builder()
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
        Loại: UserStatus
        Mô tả: Trạng thái mới (ACTIVE, INACTIVE, SUSPENDED, LOCKED)
        
        🔹 Đầu ra
        
        📝 data
        Loại: UserMongo
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
    public ResponseEntity<RestResponse<UserMongo>> updateUserStatus(
            @Parameter(description = "ID người dùng") @PathVariable String id,
            @Parameter(description = "Trạng thái mới") @RequestParam UserStatus status) {
        
        log.info("Updating user status: {} to {}", id, status);
        
        UserMongo updatedUser = userService.updateUserStatus(id, status);
        
        return ResponseEntity.ok(RestResponse.<UserMongo>builder()
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
        Loại: UserMongo
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
    public ResponseEntity<RestResponse<UserMongo>> assignRoles(
            @Parameter(description = "ID người dùng") @PathVariable String id,
            @Parameter(description = "Danh sách ID vai trò") @RequestBody Set<String> roleIds) {
        
        log.info("Assigning roles to user: {}", id);
        
        UserMongo updatedUser = userService.assignRoles(id, roleIds);
        
        return ResponseEntity.ok(RestResponse.<UserMongo>builder()
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
        Loại: UserMongo
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
    public ResponseEntity<RestResponse<UserMongo>> assignPermissions(
            @Parameter(description = "ID người dùng") @PathVariable String id,
            @Parameter(description = "Danh sách ID quyền") @RequestBody Set<String> permissionIds) {
        
        log.info("Assigning permissions to user: {}", id);
        
        UserMongo updatedUser = userService.assignPermissions(id, permissionIds);
        
        return ResponseEntity.ok(RestResponse.<UserMongo>builder()
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
        Loại: UserMongo
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
    public ResponseEntity<RestResponse<UserMongo>> updatePassword(
            @Parameter(description = "ID người dùng") @PathVariable String id,
            @Parameter(description = "Mật khẩu mới") @RequestParam String newPassword) {
        
        log.info("Updating password for user: {}", id);
        
        UserMongo updatedUser = userService.updatePassword(id, newPassword);
        
        return ResponseEntity.ok(RestResponse.<UserMongo>builder()
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
        Loại: UserMongo
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
    public ResponseEntity<RestResponse<UserMongo>> enableTwoFactor(
            @Parameter(description = "ID người dùng") @PathVariable String id,
            @Parameter(description = "Mã bí mật") @RequestParam String secret) {
        
        log.info("Enabling two-factor authentication for user: {}", id);
        
        UserMongo updatedUser = userService.enableTwoFactor(id, secret);
        
        return ResponseEntity.ok(RestResponse.<UserMongo>builder()
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
        Loại: UserMongo
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
    public ResponseEntity<RestResponse<UserMongo>> disableTwoFactor(
            @Parameter(description = "ID người dùng") @PathVariable String id) {
        
        log.info("Disabling two-factor authentication for user: {}", id);
        
        UserMongo updatedUser = userService.disableTwoFactor(id);
        
        return ResponseEntity.ok(RestResponse.<UserMongo>builder()
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
        Loại: List<UserMongo>
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
    public ResponseEntity<RestResponse<List<UserMongo>>> getLockedUsers() {
        
        log.info("Getting locked users");
        
        List<UserMongo> lockedUsers = userService.getLockedUsers();
        
        return ResponseEntity.ok(RestResponse.<List<UserMongo>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách tài khoản bị khóa thành công")
                .data(lockedUsers)
                .build());
    }
}
