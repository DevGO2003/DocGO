package com.devgo2003.docgo.contract_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Document(collection = "audit_events")
@Getter
@Setter
public class AuditEvent {

    @Id
    @MongoId
    private String id;

    @Field("correlation_id")
    private String correlationId;

    @Field("event_id")
    private String eventId;

    @Field("event_type")
    private String eventType;

    @Field("user_id")
    private String userId;

    @Field("user_role")
    private String userRole;

    @Field("ip_address")
    private String ipAddress;

    @Field("source_service")
    private String sourceService;

    @Field("target_entity")
    private String targetEntity;

    @Field("target_entity_id")
    private String targetEntityId;

    @Field("timestamp")
    private Instant timestamp;

    public static AuditEvent createFromEvent(java.util.Map<String, Object> event, String targetEntity, String targetEntityId) {
        AuditEvent audit = new AuditEvent();
        audit.setEventId((String) event.get("eventId"));
        audit.setEventType((String) event.get("eventType"));
        audit.setCorrelationId((String) event.get("correlationId"));
        audit.setSourceService((String) event.get("source"));
        audit.setTimestamp(Instant.parse((String) event.get("timestamp")));
        audit.setTargetEntity(targetEntity);
        audit.setTargetEntityId(targetEntityId);

        Object actorObj = event.get("actor");
        if (actorObj instanceof java.util.Map) {
            java.util.Map<String, Object> actor = (java.util.Map<String, Object>) actorObj;
            audit.setUserId((String) actor.get("userId"));
            audit.setUserRole((String) actor.get("userRole"));
            audit.setIpAddress((String) actor.get("ip"));
        }

        return audit;
    }
}

