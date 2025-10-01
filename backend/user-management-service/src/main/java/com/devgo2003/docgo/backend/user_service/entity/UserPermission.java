package com.devgo2003.docgo.backend.user_service.entity;

import lombok.*;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

/**
 * Entity để lưu trữ quyền hạn của người dùng
 */
@Document(collection = "user_permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPermission {

    @org.springframework.data.annotation.Id
    private String id;

    @Field("user_id")
    private String userId;

    @Field("permission_name")
    private Permission permissionName;

    @Field("permission_description")
    private String permissionDescription;

    @Field("is_granted")
    @Builder.Default
    private Boolean isGranted = true;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
