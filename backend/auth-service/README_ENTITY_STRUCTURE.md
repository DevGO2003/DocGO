# Cấu trúc Entity - Auth Service

## Tổng quan
Auth Service đã được cập nhật để có cấu trúc entity **giống hệt** như contract-management-service với `BaseEntity` làm foundation cho tất cả các entity.

## BaseEntity

### Mô tả
`BaseEntity` là abstract class chứa các trường audit cơ bản, soft-delete và version control. Tất cả entity trong hệ thống đều kế thừa từ class này.

### Các trường cơ bản
```java
@MappedSuperclass
public abstract class BaseEntity {
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;           // Thời gian tạo
    
    @Column(name = "created_by")
    private String createdBy;                 // Người tạo
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;          // Thời gian xóa
    
    @Column(name = "deleted_by")
    private String deletedBy;                 // Người xóa
    
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;        // Trạng thái xóa
    
    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;                // Phiên bản (optimistic locking)
}
```

### Các method chính
- `markAsDeleted(String deletedBy)` - Đánh dấu soft-delete
- `restore()` - Khôi phục bản ghi đã xóa
- `onCreate()` - Tự động set thời gian tạo

## Các Entity chính

### 1. User Entity
```java
@Entity
@Table(name = "users")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    private String username;                  // Tên đăng nhập
    private String email;                     // Email
    private String passwordHash;              // Mật khẩu đã hash
    private Role role;                        // Vai trò
    private UserStatus status;                // Trạng thái tài khoản
    
    // Audit fields
    private LocalDateTime lastLoginAt;        // Lần đăng nhập cuối
    private Integer failedLoginAttempts;      // Số lần đăng nhập thất bại
    private LocalDateTime accountLockedUntil; // Thời gian khóa tài khoản
}
```

### 2. UserEvent Entity
```java
@Entity
@Table(name = "user_events")
public class UserEvent extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;
    
    private Long userId;                      // ID người dùng
    private UserEventType eventType;          // Loại sự kiện
    private String description;               // Mô tả sự kiện
    private String eventData;                 // Dữ liệu bổ sung (JSON)
    private String ipAddress;                 // IP address
    private String userAgent;                 // User agent
    private LocalDateTime eventTimestamp;     // Thời gian sự kiện
    private EventResult eventResult;          // Kết quả sự kiện
    private String errorMessage;              // Thông báo lỗi
}
```

### 3. UserSession Entity
```java
@Entity
@Table(name = "user_sessions")
public class UserSession extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;
    
    private Long userId;                      // ID người dùng
    private String sessionToken;              // Token phiên
    private String refreshToken;              // Refresh token
    private LocalDateTime sessionStart;       // Thời gian bắt đầu
    private LocalDateTime sessionEnd;         // Thời gian kết thúc
    private LocalDateTime tokenExpiresAt;     // Thời gian hết hạn token
    private LocalDateTime refreshTokenExpiresAt; // Thời gian hết hạn refresh token
    private String ipAddress;                 // IP address
    private String userAgent;                 // User agent
    private SessionStatus sessionStatus;      // Trạng thái phiên
    private String terminationReason;         // Lý do kết thúc
}
```

## Các Enum

### 1. Role
```java
public enum Role {
    ADMIN,      // Quản trị viên
    USER        // Người dùng thường
}
```

### 2. UserStatus
```java
public enum UserStatus {
    ACTIVE,                 // Đang hoạt động
    LOCKED,                 // Bị khóa tạm thời
    INACTIVE,               // Bị vô hiệu hóa
    PENDING_VERIFICATION,   // Chờ xác thực email
    DELETED                 // Bị xóa mềm
}
```

### 3. UserEventType
```java
public enum UserEventType {
    REGISTRATION,           // Đăng ký
    LOGIN,                  // Đăng nhập
    LOGOUT,                 // Đăng xuất
    PASSWORD_CHANGE,        // Thay đổi mật khẩu
    PASSWORD_RESET,         // Đặt lại mật khẩu
    PROFILE_UPDATE,         // Cập nhật thông tin
    ACCOUNT_LOCKED,         // Khóa tài khoản
    ACCOUNT_UNLOCKED,       // Mở khóa tài khoản
    ACCOUNT_DELETED,        // Xóa tài khoản
    ACCOUNT_RESTORED,       // Khôi phục tài khoản
    EMAIL_VERIFICATION,     // Xác thực email
    ROLE_CHANGE,            // Thay đổi vai trò
    LOGIN_FAILED,           // Đăng nhập thất bại
    TOKEN_REFRESH           // Làm mới token
}
```

### 4. EventResult
```java
public enum EventResult {
    SUCCESS,    // Thành công
    FAILED,     // Thất bại
    PENDING,    // Đang xử lý
    REJECTED,   // Bị từ chối
    CANCELLED,  // Hủy bỏ
    EXPIRED     // Hết hạn
}
```

### 5. SessionStatus
```java
public enum SessionStatus {
    ACTIVE,                 // Đang hoạt động
    TERMINATED,             // Đã kết thúc
    EXPIRED,                // Đã hết hạn
    REVOKED,                // Bị vô hiệu hóa
    PENDING_VERIFICATION    // Chờ xác thực
}
```

## So sánh với Contract Management Service

### Tương đồng
- ✅ **BaseEntity:** Cùng cấu trúc audit fields
- ✅ **Soft Delete:** Sử dụng `isDeleted` flag
- ✅ **Version Control:** Optimistic locking với `@Version`
- ✅ **Audit Trail:** Theo dõi người tạo, người xóa
- ✅ **Event Tracking:** Entity riêng để theo dõi sự kiện

### Khác biệt
- **Domain:** Auth vs Contract Management
- **Business Logic:** User management vs Contract management
- **Relationships:** User-centric vs Contract-centric

## Lợi ích của cấu trúc mới

### 1. **Audit Trail hoàn chỉnh**
- Theo dõi mọi thay đổi của user
- Lưu trữ lịch sử đăng nhập/đăng xuất
- Tracking các sự kiện bảo mật

### 2. **Soft Delete**
- Không mất dữ liệu khi xóa
- Có thể khôi phục dễ dàng
- Duy trì referential integrity

### 3. **Optimistic Locking**
- Tránh conflict khi update đồng thời
- Version control tự động
- Performance tốt hơn pessimistic locking

### 4. **Security Enhancement**
- Tracking failed login attempts
- Account locking mechanism
- Session management
- IP address logging

## Database Schema

### Bảng users
```sql
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'USER') NOT NULL,
    status ENUM('ACTIVE', 'LOCKED', 'INACTIVE', 'PENDING_VERIFICATION', 'DELETED') NOT NULL,
    last_login_at DATETIME,
    failed_login_attempts INT DEFAULT 0,
    account_locked_until DATETIME,
    
    -- BaseEntity fields
    created_at DATETIME NOT NULL,
    created_by VARCHAR(255),
    deleted_at DATETIME,
    deleted_by VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);
```

### Bảng user_events
```sql
CREATE TABLE user_events (
    event_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    event_type ENUM('REGISTRATION', 'LOGIN', 'LOGOUT', ...) NOT NULL,
    description TEXT,
    event_data TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    event_timestamp DATETIME NOT NULL,
    event_result ENUM('SUCCESS', 'FAILED', 'PENDING', ...),
    error_message TEXT,
    
    -- BaseEntity fields
    created_at DATETIME NOT NULL,
    created_by VARCHAR(255),
    deleted_at DATETIME,
    deleted_by VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);
```

### Bảng user_sessions
```sql
CREATE TABLE user_sessions (
    session_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    session_start DATETIME NOT NULL,
    session_end DATETIME,
    token_expires_at DATETIME,
    refresh_token_expires_at DATETIME,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_status ENUM('ACTIVE', 'TERMINATED', 'EXPIRED', 'REVOKED', 'PENDING_VERIFICATION') NOT NULL,
    termination_reason TEXT,
    
    -- BaseEntity fields
    created_at DATETIME NOT NULL,
    created_by VARCHAR(255),
    deleted_at DATETIME,
    deleted_by VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);
```

## Lưu ý quan trọng
- Tất cả entity đều kế thừa từ `BaseEntity`
- Sử dụng `@MappedSuperclass` để chia sẻ fields
- Soft delete được implement sẵn
- Audit trail tự động với `@PrePersist`
- Optimistic locking với `@Version`
- Tất cả enum đều có documentation rõ ràng
