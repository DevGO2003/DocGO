package com.devgo2003.docgo.backend.user_service.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Set;

@Document(collection = "organization_memberships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@CompoundIndexes({
        @CompoundIndex(name = "org_user_unique", def = "{ 'organization_id': 1, 'user_id': 1 }", unique = true),
        @CompoundIndex(name = "org_status_idx", def = "{ 'organization_id': 1, 'status': 1 }")
})
public class OrganizationMembership {

    @org.springframework.data.annotation.Id
    private String id;

    @Field("organization_id")
    @Indexed
    private String organizationId;

    @Field("user_id")
    @Indexed
    private String userId;

    @Field("role_ids")
    private Set<String> roleIds;

    @Field("status")
    private MembershipStatus status = MembershipStatus.ACTIVE;

    @Field("joined_at")
    private LocalDateTime joinedAt;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum MembershipStatus {
        INVITED,
        ACTIVE,
        SUSPENDED,
        LEFT
    }
}



