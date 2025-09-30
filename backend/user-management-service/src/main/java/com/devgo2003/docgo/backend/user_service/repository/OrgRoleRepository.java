package com.devgo2003.docgo.backend.user_service.repository;

import com.devgo2003.docgo.backend.user_service.entity.OrgRole;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrgRoleRepository extends MongoRepository<OrgRole, String> {
    Optional<OrgRole> findByOrganizationIdAndName(String organizationId, String name);
    List<OrgRole> findByOrganizationId(String organizationId);
}



