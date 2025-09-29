package com.devgo2003.docgo.backend.user_service.entity;

import lombok.*;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

/**
 * Entity để theo dõi các sự kiện của người dùng (audit trail)
 */
@Document(collection = "user_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEvent {

    @org.springframework.data.annotation.Id
    private String id;

    @Field("user_id")
    private String userId;

    @Field("event_type")
    private EventType eventType;

    @Field("event_description")
    private String eventDescription;

    @Field("ip_address")
    private String ipAddress;

    @Field("user_agent")
    private String userAgent;

    @Field("event_data")
    private String eventData;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum EventType {
        LOGIN,
        LOGOUT,
        REGISTER,
        UPDATE_PROFILE,
        CHANGE_PASSWORD,
        DELETE_ACCOUNT,
        OTHER
    }
}