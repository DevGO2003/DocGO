package com.devgo2003.docgo.backend.user_service.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Set;

@Document(collection = "invitations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invitation {

    @org.springframework.data.annotation.Id
    private String id;

    @Field("organization_id")
    @Indexed
    private String organizationId;

    @Field("email")
    @Indexed
    private String email;

    @Field("role_names")
    private Set<String> roleNames;

    @Field("token")
    @Indexed(unique = true)
    private String token;

    @Field("expires_at")
    @Indexed(expireAfterSeconds = 0) // TTL index created in DB; value from document time
    private LocalDateTime expiresAt;

    @Field("status")
    @Builder.Default
    private InvitationStatus status = InvitationStatus.PENDING;

    @Field("invited_by")
    private String invitedBy;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum InvitationStatus {
        PENDING,
        ACCEPTED,
        EXPIRED,
        REVOKED
    }
}



