package com.devgo2003.docgo.document_service.service;

import com.devgo2003.docgo.document_service.dto.CategoryResponse;
import com.devgo2003.docgo.document_service.enums.ContractCategory;
import com.devgo2003.docgo.document_service.enums.ContractStatus;
import com.devgo2003.docgo.document_service.enums.ContractType;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service cho quản lý categories, statuses và types
 */
@Service
public class CategoryService {
    
    /**
     * Lấy tất cả categories
     */
    @Cacheable(value = "categories", key = "'all'")
    public CategoryResponse getAllCategories() {
        List<CategoryResponse.CategoryItem> categories = Arrays.stream(ContractCategory.values())
                .map(CategoryResponse.CategoryItem::fromContractCategory)
                .collect(Collectors.toList());
        
        List<String> mainCategories = Arrays.stream(ContractCategory.getMainCategories())
                .collect(Collectors.toList());
        
        return new CategoryResponse(categories, mainCategories, categories.size());
    }
    
    /**
     * Lấy categories theo main category
     */
    @Cacheable(value = "categories", key = "#mainCategory")
    public CategoryResponse getCategoriesByMainCategory(String mainCategory) {
        ContractCategory[] categories = ContractCategory.getByMainCategory(mainCategory);
        
        List<CategoryResponse.CategoryItem> categoryItems = Arrays.stream(categories)
                .map(CategoryResponse.CategoryItem::fromContractCategory)
                .collect(Collectors.toList());
        
        List<String> subCategories = Arrays.stream(ContractCategory.getSubCategories(mainCategory))
                .collect(Collectors.toList());
        
        return new CategoryResponse(categoryItems, subCategories, categoryItems.size());
    }
    
    /**
     * Lấy categories theo sub category
     */
    @Cacheable(value = "categories", key = "#mainCategory + '_' + #subCategory")
    public CategoryResponse getCategoriesBySubCategory(String mainCategory, String subCategory) {
        ContractCategory[] categories = ContractCategory.getBySubCategory(mainCategory, subCategory);
        
        List<CategoryResponse.CategoryItem> categoryItems = Arrays.stream(categories)
                .map(CategoryResponse.CategoryItem::fromContractCategory)
                .collect(Collectors.toList());
        
        return new CategoryResponse(categoryItems, null, categoryItems.size());
    }
    
    /**
     * Tìm kiếm categories
     */
    public CategoryResponse searchCategories(String keyword) {
        ContractCategory[] categories = ContractCategory.search(keyword);
        
        List<CategoryResponse.CategoryItem> categoryItems = Arrays.stream(categories)
                .map(CategoryResponse.CategoryItem::fromContractCategory)
                .collect(Collectors.toList());
        
        return new CategoryResponse(categoryItems, null, categoryItems.size());
    }
    
    /**
     * Lấy tất cả statuses
     */
    @Cacheable(value = "statuses", key = "'all'")
    public CategoryResponse.StatusResponse getAllStatuses() {
        List<CategoryResponse.StatusResponse.StatusItem> statuses = Arrays.stream(ContractStatus.values())
                .map(CategoryResponse.StatusResponse.StatusItem::fromContractStatus)
                .collect(Collectors.toList());
        
        return new CategoryResponse.StatusResponse(statuses, statuses.size());
    }
    
    /**
     * Lấy statuses có thể chuyển từ status hiện tại
     */
    public CategoryResponse.StatusResponse getPossibleNextStatuses(String currentStatus) {
        try {
            ContractStatus status = ContractStatus.fromValue(currentStatus);
            ContractStatus[] possibleStatuses = status.getPossibleNextStatuses();
            
            List<CategoryResponse.StatusResponse.StatusItem> statusItems = Arrays.stream(possibleStatuses)
                    .map(CategoryResponse.StatusResponse.StatusItem::fromContractStatus)
                    .collect(Collectors.toList());
            
            return new CategoryResponse.StatusResponse(statusItems, statusItems.size());
        } catch (IllegalArgumentException e) {
            return new CategoryResponse.StatusResponse(List.of(), 0);
        }
    }
    
    /**
     * Lấy tất cả types
     */
    @Cacheable(value = "types", key = "'all'")
    public CategoryResponse.TypeResponse getAllTypes() {
        List<CategoryResponse.TypeResponse.TypeItem> types = Arrays.stream(ContractType.values())
                .map(CategoryResponse.TypeResponse.TypeItem::fromContractType)
                .collect(Collectors.toList());
        
        List<String> groups = Arrays.stream(ContractType.getGroups())
                .collect(Collectors.toList());
        
        return new CategoryResponse.TypeResponse(types, groups, types.size());
    }
    
    /**
     * Lấy types theo group
     */
    @Cacheable(value = "types", key = "#group")
    public CategoryResponse.TypeResponse getTypesByGroup(String group) {
        ContractType[] types = ContractType.getByGroup(group);
        
        List<CategoryResponse.TypeResponse.TypeItem> typeItems = Arrays.stream(types)
                .map(CategoryResponse.TypeResponse.TypeItem::fromContractType)
                .collect(Collectors.toList());
        
        return new CategoryResponse.TypeResponse(typeItems, null, typeItems.size());
    }
    
    /**
     * Tìm kiếm types
     */
    public CategoryResponse.TypeResponse searchTypes(String keyword) {
        ContractType[] types = ContractType.search(keyword);
        
        List<CategoryResponse.TypeResponse.TypeItem> typeItems = Arrays.stream(types)
                .map(CategoryResponse.TypeResponse.TypeItem::fromContractType)
                .collect(Collectors.toList());
        
        return new CategoryResponse.TypeResponse(typeItems, null, typeItems.size());
    }
    
    /**
     * Validate category có tồn tại không
     */
    public boolean isValidCategory(String category) {
        try {
            ContractCategory.fromValue(category);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
    
    /**
     * Validate status có tồn tại không
     */
    public boolean isValidStatus(String status) {
        try {
            ContractStatus.fromValue(status);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
    
    /**
     * Validate type có tồn tại không
     */
    public boolean isValidType(String type) {
        try {
            ContractType.fromValue(type);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
    
    /**
     * Validate transition từ status hiện tại sang status mới
     */
    public boolean isValidStatusTransition(String currentStatus, String newStatus) {
        try {
            ContractStatus current = ContractStatus.fromValue(currentStatus);
            ContractStatus target = ContractStatus.fromValue(newStatus);
            return current.canTransitionTo(target);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
    
    /**
     * Lấy thống kê categories
     */
    public CategoryStats getCategoryStats() {
        return new CategoryStats(
            ContractCategory.values().length,
            ContractCategory.getMainCategories().length,
            ContractStatus.values().length,
            ContractType.values().length,
            ContractType.getGroups().length
        );
    }
    
    /**
     * Inner class cho Category Stats
     */
    public static class CategoryStats {
        private final int totalCategories;
        private final int totalMainCategories;
        private final int totalStatuses;
        private final int totalTypes;
        private final int totalGroups;
        
        public CategoryStats(int totalCategories, int totalMainCategories, 
                           int totalStatuses, int totalTypes, int totalGroups) {
            this.totalCategories = totalCategories;
            this.totalMainCategories = totalMainCategories;
            this.totalStatuses = totalStatuses;
            this.totalTypes = totalTypes;
            this.totalGroups = totalGroups;
        }
        
        // Getters
        public int getTotalCategories() {
            return totalCategories;
        }
        
        public int getTotalMainCategories() {
            return totalMainCategories;
        }
        
        public int getTotalStatuses() {
            return totalStatuses;
        }
        
        public int getTotalTypes() {
            return totalTypes;
        }
        
        public int getTotalGroups() {
            return totalGroups;
        }
    }
}

