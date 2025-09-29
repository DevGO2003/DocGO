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

@Document(collection = "org_roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@CompoundIndexes({
        @CompoundIndex(name = "org_name_unique", def = "{ 'organization_id': 1, 'name': 1 }", unique = true)
})
public class OrgRole {

    @org.springframework.data.annotation.Id
    private String id;

    @Field("organization_id")
    @Indexed
    private String organizationId;

    @Field("name")
    private String name;

    @Field("display_name")
    private String displayName;

    @Field("description")
    private String description;

    @Field("is_system")
    private Boolean isSystem = false;

    @Field("permissions")
    private Set<Permission> permissions;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;
}


