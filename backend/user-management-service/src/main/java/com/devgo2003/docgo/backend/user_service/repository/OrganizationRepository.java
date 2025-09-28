package com.devgo2003.docgo.backend.user_service.repository;

import com.devgo2003.docgo.backend.user_service.entity.Organization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, String> {

    // Tìm organization theo code
    Optional<Organization> findByCode(String code);

    // Tìm organization theo name
    Optional<Organization> findByName(String name);

    // Tìm organization theo status
    List<Organization> findByStatus(Organization.OrganizationStatus status);

    // Tìm organization theo status với phân trang
    Page<Organization> findByStatus(Organization.OrganizationStatus status, Pageable pageable);

    // Tìm kiếm organization theo tên (không phân biệt hoa thường)
    @Query("SELECT o FROM Organization o WHERE LOWER(o.name) LIKE LOWER(CONCAT('%', :name, '%')) AND o.deletedAt IS NULL")
    Page<Organization> findByNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);

    // Tìm kiếm organization theo code (không phân biệt hoa thường)
    @Query("SELECT o FROM Organization o WHERE LOWER(o.code) LIKE LOWER(CONCAT('%', :code, '%')) AND o.deletedAt IS NULL")
    Page<Organization> findByCodeContainingIgnoreCase(@Param("code") String code, Pageable pageable);

    // Tìm kiếm tổng hợp
    @Query("SELECT o FROM Organization o WHERE " +
           "(:name IS NULL OR LOWER(o.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:code IS NULL OR LOWER(o.code) LIKE LOWER(CONCAT('%', :code, '%'))) AND " +
           "(:status IS NULL OR o.status = :status) AND " +
           "o.deletedAt IS NULL")
    Page<Organization> findBySearchCriteria(@Param("name") String name, 
                                          @Param("code") String code, 
                                          @Param("status") Organization.OrganizationStatus status, 
                                          Pageable pageable);

    // Đếm số organization theo status
    long countByStatus(Organization.OrganizationStatus status);

    // Kiểm tra tồn tại theo code
    boolean existsByCode(String code);

    // Kiểm tra tồn tại theo name
    boolean existsByName(String name);

    // Tìm organization chưa bị xóa
    @Query("SELECT o FROM Organization o WHERE o.deletedAt IS NULL")
    Page<Organization> findAllActive(Pageable pageable);

    // Tìm organization đã bị xóa
    @Query("SELECT o FROM Organization o WHERE o.deletedAt IS NOT NULL")
    Page<Organization> findAllDeleted(Pageable pageable);
}
