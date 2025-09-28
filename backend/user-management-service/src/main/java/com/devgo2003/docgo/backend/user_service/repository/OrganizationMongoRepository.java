package com.devgo2003.docgo.backend.user_service.repository;

import com.devgo2003.docgo.backend.user_service.entity.OrganizationMongo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationMongoRepository extends MongoRepository<OrganizationMongo, String> {

    // Tìm organization theo code
    Optional<OrganizationMongo> findByCode(String code);

    // Tìm organization theo name
    Optional<OrganizationMongo> findByName(String name);

    // Tìm organization theo status
    List<OrganizationMongo> findByStatus(OrganizationMongo.OrganizationStatus status);

    // Tìm organization theo status với phân trang
    Page<OrganizationMongo> findByStatus(OrganizationMongo.OrganizationStatus status, Pageable pageable);

    // Tìm kiếm organization theo tên (không phân biệt hoa thường)
    @Query("{ 'name': { $regex: ?0, $options: 'i' }, 'deletedAt': null }")
    Page<OrganizationMongo> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Tìm kiếm organization theo code (không phân biệt hoa thường)
    @Query("{ 'code': { $regex: ?0, $options: 'i' }, 'deletedAt': null }")
    Page<OrganizationMongo> findByCodeContainingIgnoreCase(String code, Pageable pageable);

    // Tìm kiếm tổng hợp
    @Query("{ $and: [" +
           "{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { $expr: { $eq: [?0, null] } } ] }," +
           "{ $or: [ { 'code': { $regex: ?1, $options: 'i' } }, { $expr: { $eq: [?1, null] } } ] }," +
           "{ $or: [ { 'status': ?2 }, { $expr: { $eq: [?2, null] } } ] }," +
           "{ 'deletedAt': null }" +
           "] }")
    Page<OrganizationMongo> findBySearchCriteria(String name, String code, OrganizationMongo.OrganizationStatus status, Pageable pageable);

    // Đếm số organization theo status
    long countByStatus(OrganizationMongo.OrganizationStatus status);

    // Kiểm tra tồn tại theo code
    boolean existsByCode(String code);

    // Kiểm tra tồn tại theo name
    boolean existsByName(String name);

    // Tìm organization chưa bị xóa
    @Query("{ 'deletedAt': null }")
    Page<OrganizationMongo> findAllActive(Pageable pageable);

    // Tìm organization đã bị xóa
    @Query("{ 'deletedAt': { $ne: null } }")
    Page<OrganizationMongo> findAllDeleted(Pageable pageable);

    // Tìm organization theo user ID
    @Query("{ 'userIds': ?0, 'deletedAt': null }")
    List<OrganizationMongo> findByUserId(String userId);

    // Tìm organization theo user ID với phân trang
    @Query("{ 'userIds': ?0, 'deletedAt': null }")
    Page<OrganizationMongo> findByUserId(String userId, Pageable pageable);
}
