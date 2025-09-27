package com.devgo2003.docgo.auth_service.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "permissions")
public class PermissionMongo {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    @Field("name")
    private String name;
    
    @Field("display_name")
    private String displayName;
    
    @Field("description")
    private String description;
    
    @Field("resource")
    private String resource;
    
    @Field("action")
    private String action;
    
    @Field("module")
    private String module;
    
    @Field("is_system")
    private Boolean isSystem;
    
    @Field("is_active")
    private Boolean isActive;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    @Field("created_by")
    private String createdBy;
    
    @Field("updated_by")
    private String updatedBy;
}
