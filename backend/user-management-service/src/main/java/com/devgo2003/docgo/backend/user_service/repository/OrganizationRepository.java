package com.devgo2003.docgo.backend.user_service.repository;

import com.devgo2003.docgo.backend.user_service.entity.Organization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends MongoRepository<Organization, String> {

    // Tìm organization theo code
    Optional<Organization> findByCode(String code);

    // Tìm organization theo name
    Optional<Organization> findByName(String name);

    // Tìm organization theo status
    List<Organization> findByStatus(Organization.OrganizationStatus status);

    // Tìm organization theo status với phân trang
    Page<Organization> findByStatus(Organization.OrganizationStatus status, Pageable pageable);

    // Tìm kiếm organization theo tên (không phân biệt hoa thường)
    @Query("{'name': {$regex: ?0, $options: 'i'}, 'deletedAt': null}")
    Page<Organization> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Tìm kiếm organization theo code (không phân biệt hoa thường)
    @Query("{'code': {$regex: ?0, $options: 'i'}, 'deletedAt': null}")
    Page<Organization> findByCodeContainingIgnoreCase(String code, Pageable pageable);

    // Tìm kiếm tổng hợp
    @Query("{'$and': [" +
           "{'$or': [{'name': null}, {'name': {$regex: ?0, $options: 'i'}}]}," +
           "{'$or': [{'code': null}, {'code': {$regex: ?1, $options: 'i'}}]}," +
           "{'$or': [{'status': null}, {'status': ?2}]}," +
           "{'deletedAt': null}" +
           "]}")
    Page<Organization> findBySearchCriteria(String name, String code, Organization.OrganizationStatus status, Pageable pageable);

    // Đếm số organization theo status
    long countByStatus(Organization.OrganizationStatus status);

    // Kiểm tra tồn tại theo code
    boolean existsByCode(String code);

    // Kiểm tra tồn tại theo name
    boolean existsByName(String name);

    // Tìm organization chưa bị xóa
    @Query("{'deletedAt': null}")
    Page<Organization> findAllActive(Pageable pageable);

    // Tìm organization đã bị xóa
    @Query("{'deletedAt': {$ne: null}}")
    Page<Organization> findAllDeleted(Pageable pageable);

    // Tìm organization theo userId
    @Query("{'userIds': {$in: [?0]}}")
    List<Organization> findByUserId(String userId);
}