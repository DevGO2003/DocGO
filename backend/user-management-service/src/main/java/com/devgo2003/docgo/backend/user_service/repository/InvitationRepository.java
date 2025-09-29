package com.devgo2003.docgo.backend.user_service.repository;

import com.devgo2003.docgo.backend.user_service.entity.Invitation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvitationRepository extends MongoRepository<Invitation, String> {
    Optional<Invitation> findByToken(String token);
    List<Invitation> findByOrganizationId(String organizationId);
    List<Invitation> findByOrganizationIdAndEmail(String organizationId, String email);
}


