package com.devgo2003.docgo.document_service.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "tags")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tag {
    
    @Id
    private String id;
    
    @Field("name")
    private String name;
    
    @Field("display_name")
    private String displayName;
    
    @Field("count")
    private Long count;
    
    @Field("is_popular")
    private Boolean isPopular;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    @Field("last_used_at")
    private LocalDateTime lastUsedAt;
    
    @Field("top5_last_used")
    private List<String> top5LastUsed;
    
    @Field("top5_last_created")
    private List<String> top5LastCreated;
    
    @Field("is_deleted")
    private Boolean isDeleted;
    
    @Field("deleted_at")
    private LocalDateTime deletedAt;
}
