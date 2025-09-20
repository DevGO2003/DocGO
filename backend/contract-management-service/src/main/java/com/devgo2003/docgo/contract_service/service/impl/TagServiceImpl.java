package com.devgo2003.docgo.contract_service.service.impl;

import com.devgo2003.docgo.contract_service.dto.TagDto;
import com.devgo2003.docgo.contract_service.service.ITagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TagServiceImpl implements ITagService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<TagDto> getPopularTags() {
        // Aggregation pipeline để đếm số lần xuất hiện của mỗi tag
        Aggregation aggregation = Aggregation.newAggregation(
            Aggregation.match(Criteria.where("deleted").is(false)), // Chỉ lấy contracts chưa xóa
            Aggregation.unwind("tags"), // Tách tags thành các document riêng biệt
            Aggregation.group("tags").count().as("count"), // Nhóm theo tag và đếm
            Aggregation.sort(org.springframework.data.domain.Sort.Direction.DESC, "count"), // Sắp xếp theo số lần xuất hiện
            Aggregation.limit(10) // Chỉ lấy 10 tags đầu
        );

        AggregationResults<Map<String, Object>> results = mongoTemplate.aggregate(
            aggregation, 
            "contracts", 
            Map.class
        );

        List<TagDto> popularTags = new ArrayList<>();
        for (Map<String, Object> result : results.getMappedResults()) {
            String tagName = (String) result.get("_id");
            Long count = ((Number) result.get("count")).longValue();
            
            TagDto tagDto = TagDto.builder()
                .name(tagName)
                .displayName(formatTagDisplayName(tagName))
                .count(count)
                .isPopular(true)
                .build();
            
            popularTags.add(tagDto);
        }

        return popularTags;
    }

    @Override
    public List<TagDto> getAllTags() {
        // Aggregation pipeline để lấy tất cả tags và đếm số lần xuất hiện
        Aggregation aggregation = Aggregation.newAggregation(
            Aggregation.match(Criteria.where("deleted").is(false)), // Chỉ lấy contracts chưa xóa
            Aggregation.unwind("tags"), // Tách tags thành các document riêng biệt
            Aggregation.group("tags").count().as("count"), // Nhóm theo tag và đếm
            Aggregation.sort(org.springframework.data.domain.Sort.Direction.ASC, "_id") // Sắp xếp theo tên tag
        );

        AggregationResults<Map<String, Object>> results = mongoTemplate.aggregate(
            aggregation, 
            "contracts", 
            Map.class
        );

        List<TagDto> allTags = new ArrayList<>();
        for (Map<String, Object> result : results.getMappedResults()) {
            String tagName = (String) result.get("_id");
            Long count = ((Number) result.get("count")).longValue();
            
            TagDto tagDto = TagDto.builder()
                .name(tagName)
                .displayName(formatTagDisplayName(tagName))
                .count(count)
                .isPopular(false) // Tất cả tags trong danh sách đầy đủ đều không phải popular
                .build();
            
            allTags.add(tagDto);
        }

        return allTags;
    }

    @Override
    public List<TagDto> searchTags(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllTags();
        }

        // Aggregation pipeline để tìm kiếm tags
        Aggregation aggregation = Aggregation.newAggregation(
            Aggregation.match(Criteria.where("deleted").is(false)), // Chỉ lấy contracts chưa xóa
            Aggregation.unwind("tags"), // Tách tags thành các document riêng biệt
            Aggregation.match(Criteria.where("tags").regex(searchTerm, "i")), // Tìm kiếm không phân biệt hoa thường
            Aggregation.group("tags").count().as("count"), // Nhóm theo tag và đếm
            Aggregation.sort(org.springframework.data.domain.Sort.Direction.ASC, "_id") // Sắp xếp theo tên tag
        );

        AggregationResults<Map<String, Object>> results = mongoTemplate.aggregate(
            aggregation, 
            "contracts", 
            Map.class
        );

        List<TagDto> searchResults = new ArrayList<>();
        for (Map<String, Object> result : results.getMappedResults()) {
            String tagName = (String) result.get("_id");
            Long count = ((Number) result.get("count")).longValue();
            
            TagDto tagDto = TagDto.builder()
                .name(tagName)
                .displayName(formatTagDisplayName(tagName))
                .count(count)
                .isPopular(false)
                .build();
            
            searchResults.add(tagDto);
        }

        return searchResults;
    }

    /**
     * Format tag name để hiển thị (bỏ dấu gạch dưới, viết hoa chữ cái đầu)
     * @param tagName tên tag gốc
     * @return tên tag đã format
     */
    private String formatTagDisplayName(String tagName) {
        if (tagName == null || tagName.trim().isEmpty()) {
            return tagName;
        }
        
        // Bỏ dấu gạch dưới và thay bằng khoảng trắng
        String formatted = tagName.replace("_", " ");
        
        // Viết hoa chữ cái đầu của mỗi từ
        String[] words = formatted.split("\\s+");
        StringBuilder result = new StringBuilder();
        
        for (int i = 0; i < words.length; i++) {
            if (i > 0) {
                result.append(" ");
            }
            if (!words[i].isEmpty()) {
                result.append(Character.toUpperCase(words[i].charAt(0)))
                      .append(words[i].substring(1).toLowerCase());
            }
        }
        
        return result.toString();
    }
}
