package com.devgo2003.docgo.document_service.service.impl;

import com.devgo2003.docgo.document_service.dto.TagDto;
import com.devgo2003.docgo.document_service.entity.Tag;
import com.devgo2003.docgo.document_service.repository.TagRepository;
import com.devgo2003.docgo.document_service.service.ITagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TagServiceImpl implements ITagService {

    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Autowired
    private TagRepository tagRepository;

    @Override
    public List<TagDto> getPopularTags() {
        // Aggregation pipeline để đếm số lần xuất hiện của mỗi tag
        Aggregation aggregation = Aggregation.newAggregation(
            Aggregation.match(Criteria.where("isDeleted").is(false)), // Chỉ lấy contracts chưa xóa
            Aggregation.unwind("tags"), // Tách tags thành các document riêng biệt
            Aggregation.group("tags").count().as("count"), // Nhóm theo tag và đếm
            Aggregation.sort(org.springframework.data.domain.Sort.Direction.DESC, "count"), // Sắp xếp theo số lần xuất hiện
            Aggregation.limit(10) // Chỉ lấy 10 tags đầu
        );

        @SuppressWarnings("unchecked")
        AggregationResults<Map<String, Object>> results = mongoTemplate.aggregate(
            aggregation, 
            "contracts", 
            (Class<Map<String, Object>>) (Class<?>) Map.class
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
            Aggregation.match(Criteria.where("isDeleted").is(false)), // Chỉ lấy contracts chưa xóa
            Aggregation.unwind("tags"), // Tách tags thành các document riêng biệt
            Aggregation.group("tags").count().as("count"), // Nhóm theo tag và đếm
            Aggregation.sort(org.springframework.data.domain.Sort.Direction.ASC, "_id") // Sắp xếp theo tên tag
        );

        @SuppressWarnings("unchecked")
        AggregationResults<Map<String, Object>> results = mongoTemplate.aggregate(
            aggregation, 
            "contracts", 
            (Class<Map<String, Object>>) (Class<?>) Map.class
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
            Aggregation.match(Criteria.where("isDeleted").is(false)), // Chỉ lấy contracts chưa xóa
            Aggregation.unwind("tags"), // Tách tags thành các document riêng biệt
            Aggregation.match(Criteria.where("tags").regex(searchTerm, "i")), // Tìm kiếm không phân biệt hoa thường
            Aggregation.group("tags").count().as("count"), // Nhóm theo tag và đếm
            Aggregation.sort(org.springframework.data.domain.Sort.Direction.ASC, "_id") // Sắp xếp theo tên tag
        );

        @SuppressWarnings("unchecked")
        AggregationResults<Map<String, Object>> results = mongoTemplate.aggregate(
            aggregation, 
            "contracts", 
            (Class<Map<String, Object>>) (Class<?>) Map.class
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
    
    @Override
    public List<TagDto> getTop5LastUsedTags() {
        List<Tag> tags = tagRepository.findTop5ByIsDeletedFalseOrderByLastUsedAtDesc();
        return tags.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<TagDto> getTop5LastCreatedTags() {
        List<Tag> tags = tagRepository.findTop5ByIsDeletedFalseOrderByCreatedAtDesc();
        return tags.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public Tag createOrUpdateTag(String tagName) {
        Optional<Tag> existingTag = tagRepository.findByNameAndIsDeletedFalse(tagName);
        
        if (existingTag.isPresent()) {
            Tag tag = existingTag.get();
            tag.setCount(tag.getCount() + 1);
            tag.setLastUsedAt(LocalDateTime.now());
            tag.setUpdatedAt(LocalDateTime.now());
            return tagRepository.save(tag);
        } else {
            Tag newTag = Tag.builder()
                    .name(tagName)
                    .displayName(formatTagDisplayName(tagName))
                    .count(1L)
                    .isPopular(false)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .lastUsedAt(LocalDateTime.now())
                    .isDeleted(false)
                    .build();
            return tagRepository.save(newTag);
        }
    }
    
    @Override
    @Transactional
    public void updateTagStatistics() {
        // Lấy tất cả tags từ contracts
        List<TagDto> allTagsFromContracts = getAllTags();
        
        // Cập nhật hoặc tạo tags trong collection riêng
        for (TagDto tagDto : allTagsFromContracts) {
            createOrUpdateTag(tagDto.getName());
        }
        
        // Cập nhật top5LastUsed và top5LastCreated
        updateTop5Lists();
    }
    
    @Override
    public Page<TagDto> getAllTags(Pageable pageable) {
        Page<Tag> tags = tagRepository.findByIsDeletedFalse(pageable);
        return tags.map(this::convertToDto);
    }
    
    @Override
    public Page<TagDto> searchTags(String searchTerm, Pageable pageable) {
        Page<Tag> tags = tagRepository.findByNameContainingIgnoreCaseAndIsDeletedFalse(searchTerm, pageable);
        return tags.map(this::convertToDto);
    }
    
    private void updateTop5Lists() {
        // Lấy top 5 last used tags
        List<Tag> top5LastUsed = tagRepository.findTop5ByIsDeletedFalseOrderByLastUsedAtDesc();
        List<String> top5LastUsedNames = top5LastUsed.stream()
                .map(Tag::getName)
                .collect(Collectors.toList());
        
        // Lấy top 5 last created tags
        List<Tag> top5LastCreated = tagRepository.findTop5ByIsDeletedFalseOrderByCreatedAtDesc();
        List<String> top5LastCreatedNames = top5LastCreated.stream()
                .map(Tag::getName)
                .collect(Collectors.toList());
        
        // Cập nhật tất cả tags với top5 lists
        List<Tag> allTags = tagRepository.findByIsDeletedFalse();
        for (Tag tag : allTags) {
            tag.setTop5LastUsed(top5LastUsedNames);
            tag.setTop5LastCreated(top5LastCreatedNames);
            tag.setUpdatedAt(LocalDateTime.now());
        }
        
        tagRepository.saveAll(allTags);
    }
    
    private TagDto convertToDto(Tag tag) {
        return TagDto.builder()
                .name(tag.getName())
                .displayName(tag.getDisplayName())
                .count(tag.getCount())
                .isPopular(tag.getIsPopular())
                .build();
    }
}
