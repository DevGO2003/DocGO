package com.devgo2003.docgo.backend.user_service.dto;

import com.devgo2003.docgo.backend.user_service.entity.OrganizationMongo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationResponse {

    private String id;
    private String name;
    private String code;
    private String description;
    private String address;
    private String phone;
    private String email;
    private String website;
    private OrganizationMongo.OrganizationStatus status;
    private String createdBy;
    private String updatedBy;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private ZonedDateTime deletedAt;
    private List<String> userIds;

    public static OrganizationResponse fromEntity(OrganizationMongo organization) {
        if (organization == null) {
            return null;
        }

        OrganizationResponse response = new OrganizationResponse();
        response.setId(organization.getId());
        response.setName(organization.getName());
        response.setCode(organization.getCode());
        response.setDescription(organization.getDescription());
        response.setAddress(organization.getAddress());
        response.setPhone(organization.getPhone());
        response.setEmail(organization.getEmail());
        response.setWebsite(organization.getWebsite());
        response.setStatus(organization.getStatus());
        response.setCreatedBy(organization.getCreatedBy());
        response.setUpdatedBy(organization.getUpdatedBy());
        response.setCreatedAt(organization.getCreatedAt());
        response.setUpdatedAt(organization.getUpdatedAt());
        response.setDeletedAt(organization.getDeletedAt());
        response.setUserIds(organization.getUserIds());
        return response;
    }
}
