package com.devgo2003.docgo.backend.user_service.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.ZonedDateTime;
import java.util.List;

@Document(collection = "organizations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationMongo {

    @Id
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

    @Field("created_by")
    private String createdBy;

    @Field("updated_by")
    private String updatedBy;

    @CreatedDate
    @Field("created_at")
    private ZonedDateTime createdAt;

    @LastModifiedDate
    @Field("updated_at")
    private ZonedDateTime updatedAt;

    @Field("deleted_at")
    private ZonedDateTime deletedAt;

    // Quan hệ với UserMongo
    @Field("user_ids")
    private List<String> userIds;

    public enum OrganizationStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED,
        DELETED
    }
}
