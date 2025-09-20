package com.devgo2003.docgo.contract_service.service;

import com.devgo2003.docgo.contract_service.dto.TagDto;
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
}
