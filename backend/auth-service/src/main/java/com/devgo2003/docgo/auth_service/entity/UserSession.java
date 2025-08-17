package com.devgo2003.docgo.auth_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity để theo dõi phiên đăng nhập của người dùng
 */
@Entity
@Table(name = "user_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSession extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    /**
     * ID của người dùng
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * Token session
     */
    @Column(name = "session_token", nullable = false, unique = true)
    private String sessionToken;

    /**
     * Refresh token
     */
    @Column(name = "refresh_token", unique = true)
    private String refreshToken;

    /**
     * Thời gian bắt đầu phiên
     */
    @Column(name = "session_start", nullable = false)
    private LocalDateTime sessionStart;

    /**
     * Thời gian kết thúc phiên
     */
    @Column(name = "session_end")
    private LocalDateTime sessionEnd;

    /**
     * Thời gian hết hạn token
     */
    @Column(name = "token_expires_at")
    private LocalDateTime tokenExpiresAt;

    /**
     * Thời gian hết hạn refresh token
     */
    @Column(name = "refresh_token_expires_at")
    private LocalDateTime refreshTokenExpiresAt;

    /**
     * IP address của người dùng
     */
    @Column(name = "ip_address")
    private String ipAddress;

    /**
     * User agent của trình duyệt
     */
    @Column(name = "user_agent")
    private String userAgent;

    /**
     * Trạng thái phiên
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "session_status", nullable = false)
    private SessionStatus sessionStatus = SessionStatus.ACTIVE;

    /**
     * Lý do kết thúc phiên
     */
    @Column(name = "termination_reason")
    private String terminationReason;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (this.sessionStart == null) {
            this.sessionStart = LocalDateTime.now();
        }
    }

    /**
     * Kiểm tra xem phiên có còn hoạt động không
     */
    public boolean isActive() {
        return this.sessionStatus == SessionStatus.ACTIVE && 
               (this.sessionEnd == null || LocalDateTime.now().isBefore(this.sessionEnd)) &&
               (this.tokenExpiresAt == null || LocalDateTime.now().isBefore(this.tokenExpiresAt));
    }

    /**
     * Kết thúc phiên
     */
    public void terminateSession(String reason) {
        this.sessionStatus = SessionStatus.TERMINATED;
        this.sessionEnd = LocalDateTime.now();
        this.terminationReason = reason;
    }

    /**
     * Làm mới phiên
     */
    public void refreshSession(LocalDateTime newExpiry) {
        this.tokenExpiresAt = newExpiry;
        this.sessionStatus = SessionStatus.ACTIVE;
    }
}
