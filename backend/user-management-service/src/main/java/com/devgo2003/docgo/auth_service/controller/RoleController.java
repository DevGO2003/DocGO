package com.devgo2003.docgo.auth_service.controller;

import com.devgo2003.docgo.auth_service.entity.RoleMongo;
import com.devgo2003.docgo.auth_service.service.RoleService;
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
@RequestMapping("/api/v1/authentication-identity-service/roles")
@RequiredArgsConstructor
@Tag(name = "Role Management", description = "API quản lý vai trò")
public class RoleController {
    
    private final RoleService roleService;
    
    @GetMapping
    @Operation(
        summary = "Lấy danh sách vai trò", 
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
        Loại: Page<RoleMongo>
        Mô tả: Danh sách vai trò với phân trang
        
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
    public ResponseEntity<RestResponse<Page<RoleMongo>>> getAllRoles(
            @Parameter(description = "Số trang (mặc định: 0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Kích thước trang (mặc định: 10)") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Trường sắp xếp (mặc định: createdAt)") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Hướng sắp xếp (mặc định: DESC)") @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        log.info("Getting all roles - page: {}, size: {}, sortBy: {}, sortDirection: {}", page, size, sortBy, sortDirection);
        
        Page<RoleMongo> roles = roleService.getAllRoles(page, size, sortBy, sortDirection);
        
        return ResponseEntity.ok(RestResponse.<Page<RoleMongo>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách vai trò thành công")
                .data(roles)
                .build());
    }
    
    @GetMapping("/{id}")
    @Operation(
        summary = "Lấy thông tin vai trò", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của vai trò cần lấy thông tin
        
        🔹 Đầu ra
        
        📝 data
        Loại: RoleMongo
        Mô tả: Thông tin chi tiết vai trò
        
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
    public ResponseEntity<RestResponse<RoleMongo>> getRoleById(
            @Parameter(description = "ID vai trò") @PathVariable String id) {
        
        log.info("Getting role by id: {}", id);
        
        return roleService.getRoleById(id)
                .map(role -> ResponseEntity.ok(RestResponse.<RoleMongo>builder()
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Đã lấy thông tin vai trò thành công")
                        .data(role)
                        .build()))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/name/{name}")
    @Operation(
        summary = "Lấy vai trò theo tên", 
        description = """
        🔹 Đầu vào
        
        📝 name (bắt buộc, path)
        Loại: string
        Mô tả: Tên vai trò cần tìm
        
        🔹 Đầu ra
        
        📝 data
        Loại: RoleMongo
        Mô tả: Thông tin vai trò tìm được
        
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
    public ResponseEntity<RestResponse<RoleMongo>> getRoleByName(
            @Parameter(description = "Tên vai trò") @PathVariable String name) {
        
        log.info("Getting role by name: {}", name);
        
        return roleService.getRoleByName(name)
                .map(role -> ResponseEntity.ok(RestResponse.<RoleMongo>builder()
                        .statusCode(200)
                        .shortMessage("Success")
                        .description("Đã lấy thông tin vai trò thành công")
                        .data(role)
                        .build()))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/active")
    @Operation(
        summary = "Lấy danh sách vai trò hoạt động", 
        description = """
        🔹 Đầu vào
        
        Không có tham số đầu vào
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<RoleMongo>
        Mô tả: Danh sách vai trò đang hoạt động
        
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
    public ResponseEntity<RestResponse<List<RoleMongo>>> getActiveRoles() {
        
        log.info("Getting active roles");
        
        List<RoleMongo> roles = roleService.getActiveRoles();
        
        return ResponseEntity.ok(RestResponse.<List<RoleMongo>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách vai trò hoạt động thành công")
                .data(roles)
                .build());
    }
    
    @GetMapping("/system")
    @Operation(
        summary = "Lấy danh sách vai trò hệ thống", 
        description = """
        🔹 Đầu vào
        
        Không có tham số đầu vào
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<RoleMongo>
        Mô tả: Danh sách vai trò hệ thống
        
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
    public ResponseEntity<RestResponse<List<RoleMongo>>> getSystemRoles() {
        
        log.info("Getting system roles");
        
        List<RoleMongo> roles = roleService.getSystemRoles();
        
        return ResponseEntity.ok(RestResponse.<List<RoleMongo>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách vai trò hệ thống thành công")
                .data(roles)
                .build());
    }
    
    @GetMapping("/parent/{parentRoleId}")
    @Operation(
        summary = "Lấy vai trò con", 
        description = """
        🔹 Đầu vào
        
        🆔 parentRoleId (bắt buộc, path)
        Loại: string
        Mô tả: ID của vai trò cha
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<RoleMongo>
        Mô tả: Danh sách vai trò con
        
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
    public ResponseEntity<RestResponse<List<RoleMongo>>> getRolesByParent(
            @Parameter(description = "ID vai trò cha") @PathVariable String parentRoleId) {
        
        log.info("Getting roles by parent: {}", parentRoleId);
        
        List<RoleMongo> roles = roleService.getRolesByParent(parentRoleId);
        
        return ResponseEntity.ok(RestResponse.<List<RoleMongo>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách vai trò con thành công")
                .data(roles)
                .build());
    }
    
    @GetMapping("/level/{level}")
    @Operation(
        summary = "Lấy vai trò theo cấp độ", 
        description = """
        🔹 Đầu vào
        
        📊 level (bắt buộc, path)
        Loại: integer
        Mô tả: Cấp độ vai trò
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<RoleMongo>
        Mô tả: Danh sách vai trò theo cấp độ
        
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
    public ResponseEntity<RestResponse<List<RoleMongo>>> getRolesByLevel(
            @Parameter(description = "Cấp độ vai trò") @PathVariable Integer level) {
        
        log.info("Getting roles by level: {}", level);
        
        List<RoleMongo> roles = roleService.getRolesByLevel(level);
        
        return ResponseEntity.ok(RestResponse.<List<RoleMongo>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách vai trò theo cấp độ thành công")
                .data(roles)
                .build());
    }
    
    @GetMapping("/search")
    @Operation(
        summary = "Tìm kiếm vai trò", 
        description = """
        🔹 Đầu vào
        
        🔍 q (bắt buộc, query)
        Loại: string
        Mô tả: Từ khóa tìm kiếm (tên, mô tả vai trò)
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<RoleMongo>
        Mô tả: Danh sách vai trò tìm được
        
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
    public ResponseEntity<RestResponse<List<RoleMongo>>> searchRoles(
            @Parameter(description = "Từ khóa tìm kiếm") @RequestParam String q) {
        
        log.info("Searching roles with query: {}", q);
        
        List<RoleMongo> roles = roleService.searchRoles(q);
        
        return ResponseEntity.ok(RestResponse.<List<RoleMongo>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã tìm kiếm vai trò thành công")
                .data(roles)
                .build());
    }
    
    @GetMapping("/permission/{permissionId}")
    @Operation(
        summary = "Lấy vai trò theo quyền", 
        description = """
        🔹 Đầu vào
        
        🔐 permissionId (bắt buộc, path)
        Loại: string
        Mô tả: ID của quyền cần tìm
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<RoleMongo>
        Mô tả: Danh sách vai trò có quyền này
        
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
    public ResponseEntity<RestResponse<List<RoleMongo>>> getRolesByPermission(
            @Parameter(description = "ID quyền") @PathVariable String permissionId) {
        
        log.info("Getting roles by permission: {}", permissionId);
        
        List<RoleMongo> roles = roleService.getRolesByPermission(permissionId);
        
        return ResponseEntity.ok(RestResponse.<List<RoleMongo>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy danh sách vai trò theo quyền thành công")
                .data(roles)
                .build());
    }
    
    @PostMapping
    @Operation(
        summary = "Tạo vai trò mới", 
        description = """
        🔹 Đầu vào
        
        📝 role (bắt buộc, body)
        Loại: RoleMongo
        Mô tả: Thông tin vai trò mới cần tạo
        
        🔹 Đầu ra
        
        📝 data
        Loại: RoleMongo
        Mô tả: Thông tin vai trò đã được tạo
        
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
    public ResponseEntity<RestResponse<RoleMongo>> createRole(
            @Parameter(description = "Thông tin vai trò") @Valid @RequestBody RoleMongo role) {
        
        log.info("Creating new role: {}", role.getName());
        
        RoleMongo createdRole = roleService.createRole(role);
        
        return ResponseEntity.ok(RestResponse.<RoleMongo>builder()
                .statusCode(201)
                .shortMessage("Created")
                .description("Đã tạo vai trò thành công")
                .data(createdRole)
                .build());
    }
    
    @PutMapping("/{id}")
    @Operation(
        summary = "Cập nhật vai trò", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của vai trò cần cập nhật
        
        📝 roleDetails (bắt buộc, body)
        Loại: RoleMongo
        Mô tả: Thông tin cập nhật cho vai trò
        
        🔹 Đầu ra
        
        📝 data
        Loại: RoleMongo
        Mô tả: Thông tin vai trò đã được cập nhật
        
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
    public ResponseEntity<RestResponse<RoleMongo>> updateRole(
            @Parameter(description = "ID vai trò") @PathVariable String id,
            @Parameter(description = "Thông tin cập nhật") @Valid @RequestBody RoleMongo roleDetails) {
        
        log.info("Updating role: {}", id);
        
        RoleMongo updatedRole = roleService.updateRole(id, roleDetails);
        
        return ResponseEntity.ok(RestResponse.<RoleMongo>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã cập nhật vai trò thành công")
                .data(updatedRole)
                .build());
    }
    
    @PutMapping("/{id}/permissions")
    @Operation(
        summary = "Gán quyền cho vai trò", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của vai trò cần gán quyền
        
        🔐 permissionIds (bắt buộc, body)
        Loại: Set<String>
        Mô tả: Danh sách ID các quyền cần gán
        
        🔹 Đầu ra
        
        📝 data
        Loại: RoleMongo
        Mô tả: Thông tin vai trò với quyền đã được gán
        
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
    public ResponseEntity<RestResponse<RoleMongo>> assignPermissions(
            @Parameter(description = "ID vai trò") @PathVariable String id,
            @Parameter(description = "Danh sách ID quyền") @RequestBody Set<String> permissionIds) {
        
        log.info("Assigning permissions to role: {}", id);
        
        RoleMongo updatedRole = roleService.assignPermissions(id, permissionIds);
        
        return ResponseEntity.ok(RestResponse.<RoleMongo>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã gán quyền cho vai trò thành công")
                .data(updatedRole)
                .build());
    }
    
    @PutMapping("/{id}/permissions/add")
    @Operation(
        summary = "Thêm quyền cho vai trò", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của vai trò cần thêm quyền
        
        🔐 permissionId (bắt buộc, query)
        Loại: string
        Mô tả: ID của quyền cần thêm
        
        🔹 Đầu ra
        
        📝 data
        Loại: RoleMongo
        Mô tả: Thông tin vai trò với quyền đã được thêm
        
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
    public ResponseEntity<RestResponse<RoleMongo>> addPermission(
            @Parameter(description = "ID vai trò") @PathVariable String id,
            @Parameter(description = "ID quyền") @RequestParam String permissionId) {
        
        log.info("Adding permission to role: {}", id);
        
        RoleMongo updatedRole = roleService.addPermission(id, permissionId);
        
        return ResponseEntity.ok(RestResponse.<RoleMongo>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã thêm quyền cho vai trò thành công")
                .data(updatedRole)
                .build());
    }
    
    @PutMapping("/{id}/permissions/remove")
    @Operation(
        summary = "Xóa quyền khỏi vai trò", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của vai trò cần xóa quyền
        
        🔐 permissionId (bắt buộc, query)
        Loại: string
        Mô tả: ID của quyền cần xóa
        
        🔹 Đầu ra
        
        📝 data
        Loại: RoleMongo
        Mô tả: Thông tin vai trò với quyền đã được xóa
        
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
    public ResponseEntity<RestResponse<RoleMongo>> removePermission(
            @Parameter(description = "ID vai trò") @PathVariable String id,
            @Parameter(description = "ID quyền") @RequestParam String permissionId) {
        
        log.info("Removing permission from role: {}", id);
        
        RoleMongo updatedRole = roleService.removePermission(id, permissionId);
        
        return ResponseEntity.ok(RestResponse.<RoleMongo>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã xóa quyền khỏi vai trò thành công")
                .data(updatedRole)
                .build());
    }
    
    @PutMapping("/{id}/status")
    @Operation(
        summary = "Cập nhật trạng thái vai trò", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của vai trò cần cập nhật trạng thái
        
        📊 isActive (bắt buộc, query)
        Loại: boolean
        Mô tả: Trạng thái mới (true: hoạt động, false: không hoạt động)
        
        🔹 Đầu ra
        
        📝 data
        Loại: RoleMongo
        Mô tả: Thông tin vai trò với trạng thái đã cập nhật
        
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
    public ResponseEntity<RestResponse<RoleMongo>> updateRoleStatus(
            @Parameter(description = "ID vai trò") @PathVariable String id,
            @Parameter(description = "Trạng thái mới") @RequestParam Boolean isActive) {
        
        log.info("Updating role status: {} to {}", id, isActive);
        
        RoleMongo updatedRole = roleService.updateRoleStatus(id, isActive);
        
        return ResponseEntity.ok(RestResponse.<RoleMongo>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã cập nhật trạng thái vai trò thành công")
                .data(updatedRole)
                .build());
    }
    
    @GetMapping("/{id}/hierarchy")
    @Operation(
        summary = "Lấy cây phân cấp vai trò", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của vai trò gốc để lấy cây phân cấp
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<RoleMongo>
        Mô tả: Cây phân cấp vai trò từ vai trò gốc
        
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
    public ResponseEntity<RestResponse<List<RoleMongo>>> getRoleHierarchy(
            @Parameter(description = "ID vai trò") @PathVariable String id) {
        
        log.info("Getting role hierarchy for: {}", id);
        
        List<RoleMongo> hierarchy = roleService.getRoleHierarchy(id);
        
        return ResponseEntity.ok(RestResponse.<List<RoleMongo>>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã lấy cây phân cấp vai trò thành công")
                .data(hierarchy)
                .build());
    }
    
    @DeleteMapping("/{id}")
    @Operation(
        summary = "Xóa vai trò", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của vai trò cần xóa
        
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
    public ResponseEntity<RestResponse<Void>> deleteRole(
            @Parameter(description = "ID vai trò") @PathVariable String id) {
        
        log.info("Deleting role: {}", id);
        
        roleService.deleteRole(id);
        
        return ResponseEntity.ok(RestResponse.<Void>builder()
                .statusCode(200)
                .shortMessage("Success")
                .description("Đã xóa vai trò thành công")
                .data(null)
                .build());
    }
}
