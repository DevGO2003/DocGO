package com.devgo2003.docgo.auth_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity để theo dõi các sự kiện của người dùng (audit trail)
 */
@Entity
@Table(name = "user_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEvent extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    /**
     * ID của người dùng liên quan đến sự kiện
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * Loại sự kiện
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private UserEventType eventType;

    /**
     * Mô tả chi tiết sự kiện
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Dữ liệu bổ sung của sự kiện (JSON)
     */
    @Column(name = "event_data", columnDefinition = "TEXT")
    private String eventData;

    /**
     * IP address của người dùng khi thực hiện sự kiện
     */
    @Column(name = "ip_address")
    private String ipAddress;

    /**
     * User agent của trình duyệt
     */
    @Column(name = "user_agent")
    private String userAgent;

    /**
     * Thời gian xảy ra sự kiện
     */
    @Column(name = "event_timestamp", nullable = false)
    private LocalDateTime eventTimestamp;

    /**
     * Kết quả của sự kiện
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "event_result")
    private EventResult eventResult;

    /**
     * Thông báo lỗi nếu có
     */
    @Column(name = "error_message")
    private String errorMessage;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (this.eventTimestamp == null) {
            this.eventTimestamp = LocalDateTime.now();
        }
    }
}
