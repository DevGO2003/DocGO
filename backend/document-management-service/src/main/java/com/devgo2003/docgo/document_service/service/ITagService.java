package com.devgo2003.docgo.document_service.service;

import com.devgo2003.docgo.document_service.dto.TagDto;
import com.devgo2003.docgo.document_service.entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ITagService {
    /**
     * Lấy danh sách 10 tags phổ biến nhất
     * @return List<TagDto> danh sách tags phổ biến
     */
    List<TagDto> getPopularTags();
    
    /**
     * Lấy tất cả tags được sắp xếp theo tên
     * @return List<TagDto> danh sách tất cả tags
     */
    List<TagDto> getAllTags();
    
    /**
     * Lấy tags theo tên (tìm kiếm)
     * @param searchTerm từ khóa tìm kiếm
     * @return List<TagDto> danh sách tags phù hợp
     */
    List<TagDto> searchTags(String searchTerm);
    
    /**
     * Lấy top 5 tags được sử dụng gần đây nhất
     * @return List<TagDto> danh sách tags
     */
    List<TagDto> getTop5LastUsedTags();
    
    /**
     * Lấy top 5 tags được tạo mới gần đây nhất
     * @return List<TagDto> danh sách tags
     */
    List<TagDto> getTop5LastCreatedTags();
    
    /**
     * Tạo hoặc cập nhật tag
     * @param tagName tên tag
     * @return Tag entity
     */
    Tag createOrUpdateTag(String tagName);
    
    /**
     * Cập nhật thống kê tags từ contracts
     */
    void updateTagStatistics();
    
    /**
     * Lấy tất cả tags với phân trang
     * @param pageable thông tin phân trang
     * @return Page<TagDto> danh sách tags có phân trang
     */
    Page<TagDto> getAllTags(Pageable pageable);
    
    /**
     * Tìm kiếm tags với phân trang
     * @param searchTerm từ khóa tìm kiếm
     * @param pageable thông tin phân trang
     * @return Page<TagDto> kết quả tìm kiếm có phân trang
     */
    Page<TagDto> searchTags(String searchTerm, Pageable pageable);
}
