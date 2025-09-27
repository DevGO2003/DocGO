package com.devgo2003.docgo.document_service.dto;

import com.devgo2003.docgo.document_service.enums.ContractCategory;
import com.devgo2003.docgo.document_service.enums.ContractStatus;
import com.devgo2003.docgo.document_service.enums.ContractType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * DTO cho response của Category API
 */
@Schema(description = "Response cho Category API")
public class CategoryResponse {
    
    @Schema(description = "Danh sách categories", example = "[\"COMMERCIAL_SALES_DIRECT\", \"LEGAL_COMPLIANCE_GDPR\"]")
    private List<CategoryItem> categories;
    
    @Schema(description = "Danh sách main categories", example = "[\"COMMERCIAL\", \"LEGAL\", \"FINANCIAL\"]")
    private List<String> mainCategories;
    
    @Schema(description = "Tổng số categories", example = "100")
    private int totalCount;
    
    public CategoryResponse() {}
    
    public CategoryResponse(List<CategoryItem> categories, List<String> mainCategories, int totalCount) {
        this.categories = categories;
        this.mainCategories = mainCategories;
        this.totalCount = totalCount;
    }
    
    // Getters and Setters
    public List<CategoryItem> getCategories() {
        return categories;
    }
    
    public void setCategories(List<CategoryItem> categories) {
        this.categories = categories;
    }
    
    public List<String> getMainCategories() {
        return mainCategories;
    }
    
    public void setMainCategories(List<String> mainCategories) {
        this.mainCategories = mainCategories;
    }
    
    public int getTotalCount() {
        return totalCount;
    }
    
    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }
    
    /**
     * Inner class cho Category Item
     */
    @Schema(description = "Category item")
    public static class CategoryItem {
        
        @Schema(description = "Giá trị category", example = "COMMERCIAL_SALES_DIRECT")
        private String value;
        
        @Schema(description = "Tên hiển thị", example = "Bán hàng trực tiếp")
        private String displayName;
        
        @Schema(description = "Main category", example = "COMMERCIAL")
        private String mainCategory;
        
        @Schema(description = "Sub category", example = "SALES")
        private String subCategory;
        
        @Schema(description = "Specific category", example = "DIRECT_SALES")
        private String specificCategory;
        
        @Schema(description = "Mô tả", example = "Hợp đồng bán hàng trực tiếp")
        private String description;
        
        public CategoryItem() {}
        
        public CategoryItem(String value, String displayName, String mainCategory, 
                           String subCategory, String specificCategory, String description) {
            this.value = value;
            this.displayName = displayName;
            this.mainCategory = mainCategory;
            this.subCategory = subCategory;
            this.specificCategory = specificCategory;
            this.description = description;
        }
        
        // Getters and Setters
        public String getValue() {
            return value;
        }
        
        public void setValue(String value) {
            this.value = value;
        }
        
        public String getDisplayName() {
            return displayName;
        }
        
        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }
        
        public String getMainCategory() {
            return mainCategory;
        }
        
        public void setMainCategory(String mainCategory) {
            this.mainCategory = mainCategory;
        }
        
        public String getSubCategory() {
            return subCategory;
        }
        
        public void setSubCategory(String subCategory) {
            this.subCategory = subCategory;
        }
        
        public String getSpecificCategory() {
            return specificCategory;
        }
        
        public void setSpecificCategory(String specificCategory) {
            this.specificCategory = specificCategory;
        }
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
        
        /**
         * Tạo CategoryItem từ ContractCategory
         */
        public static CategoryItem fromContractCategory(ContractCategory category) {
            return new CategoryItem(
                category.name(),
                category.getDisplayName(),
                category.getMainCategory(),
                category.getSubCategory(),
                category.getSpecificCategory(),
                category.getDisplayName()
            );
        }
    }
    
    /**
     * DTO cho Status Response
     */
    @Schema(description = "Response cho Status API")
    public static class StatusResponse {
        
        @Schema(description = "Danh sách statuses")
        private List<StatusItem> statuses;
        
        @Schema(description = "Tổng số statuses")
        private int totalCount;
        
        public StatusResponse() {}
        
        public StatusResponse(List<StatusItem> statuses, int totalCount) {
            this.statuses = statuses;
            this.totalCount = totalCount;
        }
        
        // Getters and Setters
        public List<StatusItem> getStatuses() {
            return statuses;
        }
        
        public void setStatuses(List<StatusItem> statuses) {
            this.statuses = statuses;
        }
        
        public int getTotalCount() {
            return totalCount;
        }
        
        public void setTotalCount(int totalCount) {
            this.totalCount = totalCount;
        }
        
        /**
         * Inner class cho Status Item
         */
        @Schema(description = "Status item")
        public static class StatusItem {
            
            @Schema(description = "Giá trị status", example = "ACTIVE")
            private String value;
            
            @Schema(description = "Tên hiển thị", example = "Đang hiệu lực")
            private String displayName;
            
            @Schema(description = "Mô tả", example = "Hợp đồng đang có hiệu lực")
            private String description;
            
            @Schema(description = "Có thể chỉnh sửa không", example = "false")
            private boolean editable;
            
            @Schema(description = "Có hiệu lực không", example = "true")
            private boolean active;
            
            @Schema(description = "Trạng thái cuối cùng", example = "false")
            private boolean finalStatus;
            
            public StatusItem() {}
            
            public StatusItem(String value, String displayName, String description, 
                             boolean editable, boolean active, boolean finalStatus) {
                this.value = value;
                this.displayName = displayName;
                this.description = description;
                this.editable = editable;
                this.active = active;
                this.finalStatus = finalStatus;
            }
            
            // Getters and Setters
            public String getValue() {
                return value;
            }
            
            public void setValue(String value) {
                this.value = value;
            }
            
            public String getDisplayName() {
                return displayName;
            }
            
            public void setDisplayName(String displayName) {
                this.displayName = displayName;
            }
            
            public String getDescription() {
                return description;
            }
            
            public void setDescription(String description) {
                this.description = description;
            }
            
            public boolean isEditable() {
                return editable;
            }
            
            public void setEditable(boolean editable) {
                this.editable = editable;
            }
            
            public boolean isActive() {
                return active;
            }
            
            public void setActive(boolean active) {
                this.active = active;
            }
            
            public boolean isFinalStatus() {
                return finalStatus;
            }
            
            public void setFinalStatus(boolean finalStatus) {
                this.finalStatus = finalStatus;
            }
            
            /**
             * Tạo StatusItem từ ContractStatus
             */
            public static StatusItem fromContractStatus(ContractStatus status) {
                return new StatusItem(
                    status.getValue(),
                    status.getDisplayName(),
                    status.getDescription(),
                    status.isEditable(),
                    status.isActive(),
                    status.isFinal()
                );
            }
        }
    }
    
    /**
     * DTO cho Type Response
     */
    @Schema(description = "Response cho Type API")
    public static class TypeResponse {
        
        @Schema(description = "Danh sách types")
        private List<TypeItem> types;
        
        @Schema(description = "Danh sách groups")
        private List<String> groups;
        
        @Schema(description = "Tổng số types")
        private int totalCount;
        
        public TypeResponse() {}
        
        public TypeResponse(List<TypeItem> types, List<String> groups, int totalCount) {
            this.types = types;
            this.groups = groups;
            this.totalCount = totalCount;
        }
        
        // Getters and Setters
        public List<TypeItem> getTypes() {
            return types;
        }
        
        public void setTypes(List<TypeItem> types) {
            this.types = types;
        }
        
        public List<String> getGroups() {
            return groups;
        }
        
        public void setGroups(List<String> groups) {
            this.groups = groups;
        }
        
        public int getTotalCount() {
            return totalCount;
        }
        
        public void setTotalCount(int totalCount) {
            this.totalCount = totalCount;
        }
        
        /**
         * Inner class cho Type Item
         */
        @Schema(description = "Type item")
        public static class TypeItem {
            
            @Schema(description = "Giá trị type", example = "SERVICE_AGREEMENT")
            private String value;
            
            @Schema(description = "Tên hiển thị", example = "Hợp đồng dịch vụ")
            private String displayName;
            
            @Schema(description = "Mô tả", example = "Hợp đồng cung cấp dịch vụ")
            private String description;
            
            @Schema(description = "Nhóm", example = "SERVICE")
            private String group;
            
            public TypeItem() {}
            
            public TypeItem(String value, String displayName, String description, String group) {
                this.value = value;
                this.displayName = displayName;
                this.description = description;
                this.group = group;
            }
            
            // Getters and Setters
            public String getValue() {
                return value;
            }
            
            public void setValue(String value) {
                this.value = value;
            }
            
            public String getDisplayName() {
                return displayName;
            }
            
            public void setDisplayName(String displayName) {
                this.displayName = displayName;
            }
            
            public String getDescription() {
                return description;
            }
            
            public void setDescription(String description) {
                this.description = description;
            }
            
            public String getGroup() {
                return group;
            }
            
            public void setGroup(String group) {
                this.group = group;
            }
            
            /**
             * Tạo TypeItem từ ContractType
             */
            public static TypeItem fromContractType(ContractType type) {
                return new TypeItem(
                    type.getValue(),
                    type.getDisplayName(),
                    type.getDescription(),
                    type.getGroup()
                );
            }
        }
    }
}

