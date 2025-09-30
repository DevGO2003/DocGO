package com.devgo2003.docgo.backend.user_service.entity;

import lombok.*;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Set;

@Document(collection = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @org.springframework.data.annotation.Id
    private String id;

    @Field("name")
    private String name;

    @Field("display_name")
    private String displayName;

    @Field("description")
    private String description;

    @Field("parent_role_id")
    private String parentRoleId;

    @Field("level")
    private Integer level;

    @Field("is_active")
    private Boolean isActive = true;

    @Field("is_system")
    private Boolean isSystem = false;

    @Field("permission_ids")
    private Set<String> permissionIds;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Field("created_by")
    private String createdBy;

    @Field("updated_by")
    private String updatedBy;
}
