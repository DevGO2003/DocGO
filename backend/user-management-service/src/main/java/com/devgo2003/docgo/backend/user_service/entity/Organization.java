package com.devgo2003.docgo.backend.user_service.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "organizations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Organization {

    @org.springframework.data.annotation.Id
    private String id;

    @Field("name")
    private String name;

    @Field("code")
    private String code;

    @Field("description")
    private String description;

    @Field("address")
    private String address;

    @Field("phone")
    private String phone;

    @Field("email")
    private String email;

    @Field("website")
    private String website;

    @Field("status")
    private OrganizationStatus status = OrganizationStatus.ACTIVE;

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

    @Field("deleted_at")
    private LocalDateTime deletedAt;

    @Field("user_ids")
    private List<String> userIds;

    public enum OrganizationStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED,
        DELETED
    }
}