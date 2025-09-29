package com.devgo2003.docgo.backend.user_service.service;

import com.devgo2003.docgo.backend.user_service.dto.OrganizationCreateRequest;
import com.devgo2003.docgo.backend.user_service.dto.OrganizationResponse;
import com.devgo2003.docgo.backend.user_service.dto.OrganizationUpdateRequest;
import com.devgo2003.docgo.backend.user_service.entity.Organization;
import com.devgo2003.docgo.backend.user_service.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    public Page<OrganizationResponse> getAllOrganizations(int pageNumber, int pageSize, String sortBy, String sortDirection) {
        log.info("Getting all organizations - page: {}, size: {}, sortBy: {}, sortDirection: {}", 
                pageNumber, pageSize, sortBy, sortDirection);

        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        
        Page<Organization> organizations = organizationRepository.findAllActive(pageable);
        
        return organizations.map(OrganizationResponse::fromEntity);
    }

    public Optional<OrganizationResponse> getOrganizationById(String id) {
        log.info("Getting organization by id: {}", id);
        
        return organizationRepository.findById(id)
                .filter(org -> org.getDeletedAt() == null)
                .map(OrganizationResponse::fromEntity);
    }

    public Optional<OrganizationResponse> getOrganizationByCode(String code) {
        log.info("Getting organization by code: {}", code);
        
        return organizationRepository.findByCode(code)
                .filter(org -> org.getDeletedAt() == null)
                .map(OrganizationResponse::fromEntity);
    }

    public OrganizationResponse createOrganization(OrganizationCreateRequest request) {
        log.info("Creating organization with name: {}", request.getName());

        // Kiểm tra trùng lặp
        if (request.getCode() != null && !request.getCode().trim().isEmpty()) {
            if (organizationRepository.existsByCode(request.getCode())) {
                throw new IllegalArgumentException("Mã tổ chức đã tồn tại: " + request.getCode());
            }
        }

        if (organizationRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Tên tổ chức đã tồn tại: " + request.getName());
        }

        Organization organization = new Organization();
        organization.setId(UUID.randomUUID().toString());
        organization.setName(request.getName());
        organization.setCode(request.getCode());
        organization.setDescription(request.getDescription());
        organization.setAddress(request.getAddress());
        organization.setPhone(request.getPhone());
        organization.setEmail(request.getEmail());
        organization.setWebsite(request.getWebsite());
        organization.setStatus(Organization.OrganizationStatus.ACTIVE);

        Organization savedOrganization = organizationRepository.save(organization);
        log.info("Created organization with id: {}", savedOrganization.getId());

        return OrganizationResponse.fromEntity(savedOrganization);
    }

    public Optional<OrganizationResponse> updateOrganization(String id, OrganizationUpdateRequest request) {
        log.info("Updating organization with id: {}", id);

        return organizationRepository.findById(id)
                .filter(org -> org.getDeletedAt() == null)
                .map(organization -> {
                    // Kiểm tra trùng lặp nếu có thay đổi
                    if (request.getName() != null && !request.getName().equals(organization.getName())) {
                        if (organizationRepository.existsByName(request.getName())) {
                            throw new IllegalArgumentException("Tên tổ chức đã tồn tại: " + request.getName());
                        }
                        organization.setName(request.getName());
                    }

                    if (request.getCode() != null && !request.getCode().equals(organization.getCode())) {
                        if (organizationRepository.existsByCode(request.getCode())) {
                            throw new IllegalArgumentException("Mã tổ chức đã tồn tại: " + request.getCode());
                        }
                        organization.setCode(request.getCode());
                    }

                    if (request.getDescription() != null) {
                        organization.setDescription(request.getDescription());
                    }
                    if (request.getAddress() != null) {
                        organization.setAddress(request.getAddress());
                    }
                    if (request.getPhone() != null) {
                        organization.setPhone(request.getPhone());
                    }
                    if (request.getEmail() != null) {
                        organization.setEmail(request.getEmail());
                    }
                    if (request.getWebsite() != null) {
                        organization.setWebsite(request.getWebsite());
                    }


                    Organization savedOrganization = organizationRepository.save(organization);
                    log.info("Updated organization with id: {}", savedOrganization.getId());

                    return OrganizationResponse.fromEntity(savedOrganization);
                });
    }

    public boolean deleteOrganization(String id) {
        log.info("Soft deleting organization with id: {}", id);

        return organizationRepository.findById(id)
                .filter(org -> org.getDeletedAt() == null)
                .map(organization -> {
                    organization.setStatus(Organization.OrganizationStatus.DELETED);
                    organization.setDeletedAt(LocalDateTime.now());
                    
                    organizationRepository.save(organization);
                    log.info("Soft deleted organization with id: {}", id);
                    return true;
                })
                .orElse(false);
    }

    public boolean restoreOrganization(String id) {
        log.info("Restoring organization with id: {}", id);

        return organizationRepository.findById(id)
                .filter(org -> org.getDeletedAt() != null)
                .map(organization -> {
                    organization.setStatus(Organization.OrganizationStatus.ACTIVE);
                    organization.setDeletedAt(null);
                    
                    organizationRepository.save(organization);
                    log.info("Restored organization with id: {}", id);
                    return true;
                })
                .orElse(false);
    }

    public Page<OrganizationResponse> searchOrganizations(String name, String code, String status, 
                                                         int pageNumber, int pageSize, String sortBy, String sortDirection) {
        log.info("Searching organizations - name: {}, code: {}, status: {}, page: {}, size: {}", 
                name, code, status, pageNumber, pageSize);

        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Organization.OrganizationStatus statusEnum = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                statusEnum = Organization.OrganizationStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status: {}", status);
            }
        }

        Page<Organization> organizations = organizationRepository.findBySearchCriteria(
                name, code, statusEnum, pageable);

        return organizations.map(OrganizationResponse::fromEntity);
    }

    public List<OrganizationResponse> getOrganizationsByUserId(String userId) {
        log.info("Getting organizations by user id: {}", userId);

        List<Organization> organizations = organizationRepository.findByUserId(userId);
        return organizations.stream()
                .map(OrganizationResponse::fromEntity)
                .toList();
    }

    public long countOrganizationsByStatus(String status) {
        log.info("Counting organizations by status: {}", status);

        Organization.OrganizationStatus statusEnum = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                statusEnum = Organization.OrganizationStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status: {}", status);
            }
        }

        return statusEnum != null ? 
                organizationRepository.countByStatus(statusEnum) : 
                organizationRepository.count();
    }
}


