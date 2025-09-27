package com.devgo2003.docgo.document_service.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * ENUM cho loại hợp đồng
 */
public enum ContractType {
    
    // SERVICE AGREEMENTS
    SERVICE_AGREEMENT("SERVICE_AGREEMENT", "Hợp đồng dịch vụ", "Hợp đồng cung cấp dịch vụ"),
    CONSULTING_AGREEMENT("CONSULTING_AGREEMENT", "Hợp đồng tư vấn", "Hợp đồng dịch vụ tư vấn"),
    MAINTENANCE_AGREEMENT("MAINTENANCE_AGREEMENT", "Hợp đồng bảo trì", "Hợp đồng dịch vụ bảo trì"),
    SUPPORT_AGREEMENT("SUPPORT_AGREEMENT", "Hợp đồng hỗ trợ", "Hợp đồng dịch vụ hỗ trợ"),
    TRAINING_AGREEMENT("TRAINING_AGREEMENT", "Hợp đồng đào tạo", "Hợp đồng dịch vụ đào tạo"),
    
    // PURCHASE AGREEMENTS
    PURCHASE_AGREEMENT("PURCHASE_AGREEMENT", "Hợp đồng mua bán", "Hợp đồng mua bán hàng hóa"),
    SUPPLY_AGREEMENT("SUPPLY_AGREEMENT", "Hợp đồng cung ứng", "Hợp đồng cung ứng hàng hóa"),
    PROCUREMENT_AGREEMENT("PROCUREMENT_AGREEMENT", "Hợp đồng mua sắm", "Hợp đồng mua sắm công"),
    
    // LEASE AGREEMENTS
    LEASE_AGREEMENT("LEASE_AGREEMENT", "Hợp đồng thuê", "Hợp đồng thuê tài sản"),
    RENTAL_AGREEMENT("RENTAL_AGREEMENT", "Hợp đồng cho thuê", "Hợp đồng cho thuê tài sản"),
    EQUIPMENT_LEASE("EQUIPMENT_LEASE", "Hợp đồng thuê thiết bị", "Hợp đồng thuê thiết bị"),
    
    // EMPLOYMENT CONTRACTS
    EMPLOYMENT_CONTRACT("EMPLOYMENT_CONTRACT", "Hợp đồng lao động", "Hợp đồng lao động"),
    CONSULTANT_CONTRACT("CONSULTANT_CONTRACT", "Hợp đồng tư vấn viên", "Hợp đồng tư vấn viên"),
    FREELANCER_CONTRACT("FREELANCER_CONTRACT", "Hợp đồng freelancer", "Hợp đồng freelancer"),
    INTERN_AGREEMENT("INTERN_AGREEMENT", "Hợp đồng thực tập", "Hợp đồng thực tập sinh"),
    
    // CONFIDENTIALITY AGREEMENTS
    CONFIDENTIALITY_AGREEMENT("CONFIDENTIALITY_AGREEMENT", "Hợp đồng bảo mật", "Hợp đồng bảo mật thông tin"),
    NON_DISCLOSURE_AGREEMENT("NON_DISCLOSURE_AGREEMENT", "Thỏa thuận bảo mật", "Thỏa thuận không tiết lộ thông tin"),
    NON_COMPETE_AGREEMENT("NON_COMPETE_AGREEMENT", "Thỏa thuận không cạnh tranh", "Thỏa thuận không cạnh tranh"),
    
    // PARTNERSHIP AGREEMENTS
    PARTNERSHIP_AGREEMENT("PARTNERSHIP_AGREEMENT", "Hợp đồng đối tác", "Hợp đồng hợp tác đối tác"),
    JOINT_VENTURE_AGREEMENT("JOINT_VENTURE_AGREEMENT", "Hợp đồng liên doanh", "Hợp đồng liên doanh"),
    DISTRIBUTION_AGREEMENT("DISTRIBUTION_AGREEMENT", "Hợp đồng phân phối", "Hợp đồng phân phối sản phẩm"),
    FRANCHISE_AGREEMENT("FRANCHISE_AGREEMENT", "Hợp đồng nhượng quyền", "Hợp đồng nhượng quyền thương mại"),
    
    // LICENSING AGREEMENTS
    LICENSING_AGREEMENT("LICENSING_AGREEMENT", "Hợp đồng cấp phép", "Hợp đồng cấp phép sử dụng"),
    SOFTWARE_LICENSE("SOFTWARE_LICENSE", "Giấy phép phần mềm", "Giấy phép sử dụng phần mềm"),
    TRADEMARK_LICENSE("TRADEMARK_LICENSE", "Giấy phép thương hiệu", "Giấy phép sử dụng thương hiệu"),
    PATENT_LICENSE("PATENT_LICENSE", "Giấy phép bằng sáng chế", "Giấy phép sử dụng bằng sáng chế"),
    
    // FINANCIAL AGREEMENTS
    LOAN_AGREEMENT("LOAN_AGREEMENT", "Hợp đồng vay", "Hợp đồng vay vốn"),
    CREDIT_AGREEMENT("CREDIT_AGREEMENT", "Hợp đồng tín dụng", "Hợp đồng tín dụng"),
    INVESTMENT_AGREEMENT("INVESTMENT_AGREEMENT", "Hợp đồng đầu tư", "Hợp đồng đầu tư"),
    INSURANCE_AGREEMENT("INSURANCE_AGREEMENT", "Hợp đồng bảo hiểm", "Hợp đồng bảo hiểm"),
    
    // TECHNOLOGY AGREEMENTS
    SAAS_AGREEMENT("SAAS_AGREEMENT", "Hợp đồng SaaS", "Hợp đồng dịch vụ SaaS"),
    CLOUD_AGREEMENT("CLOUD_AGREEMENT", "Hợp đồng đám mây", "Hợp đồng dịch vụ đám mây"),
    HOSTING_AGREEMENT("HOSTING_AGREEMENT", "Hợp đồng hosting", "Hợp đồng dịch vụ hosting"),
    DEVELOPMENT_AGREEMENT("DEVELOPMENT_AGREEMENT", "Hợp đồng phát triển", "Hợp đồng phát triển phần mềm"),
    
    // MARKETING AGREEMENTS
    ADVERTISING_AGREEMENT("ADVERTISING_AGREEMENT", "Hợp đồng quảng cáo", "Hợp đồng dịch vụ quảng cáo"),
    MARKETING_AGREEMENT("MARKETING_AGREEMENT", "Hợp đồng marketing", "Hợp đồng dịch vụ marketing"),
    SPONSORSHIP_AGREEMENT("SPONSORSHIP_AGREEMENT", "Hợp đồng tài trợ", "Hợp đồng tài trợ sự kiện"),
    
    // REAL ESTATE AGREEMENTS
    PROPERTY_LEASE("PROPERTY_LEASE", "Hợp đồng thuê bất động sản", "Hợp đồng thuê bất động sản"),
    PROPERTY_PURCHASE("PROPERTY_PURCHASE", "Hợp đồng mua bất động sản", "Hợp đồng mua bán bất động sản"),
    CONSTRUCTION_AGREEMENT("CONSTRUCTION_AGREEMENT", "Hợp đồng xây dựng", "Hợp đồng thi công xây dựng"),
    
    // LEGAL AGREEMENTS
    SETTLEMENT_AGREEMENT("SETTLEMENT_AGREEMENT", "Thỏa thuận dàn xếp", "Thỏa thuận dàn xếp tranh chấp"),
    ARBITRATION_AGREEMENT("ARBITRATION_AGREEMENT", "Thỏa thuận trọng tài", "Thỏa thuận giải quyết tranh chấp bằng trọng tài"),
    MEDIATION_AGREEMENT("MEDIATION_AGREEMENT", "Thỏa thuận hòa giải", "Thỏa thuận giải quyết tranh chấp bằng hòa giải"),
    
    // OTHER AGREEMENTS
    AMENDMENT_AGREEMENT("AMENDMENT_AGREEMENT", "Phụ lục hợp đồng", "Phụ lục sửa đổi hợp đồng"),
    TERMINATION_AGREEMENT("TERMINATION_AGREEMENT", "Thỏa thuận chấm dứt", "Thỏa thuận chấm dứt hợp đồng"),
    RENEWAL_AGREEMENT("RENEWAL_AGREEMENT", "Thỏa thuận gia hạn", "Thỏa thuận gia hạn hợp đồng"),
    ASSIGNMENT_AGREEMENT("ASSIGNMENT_AGREEMENT", "Thỏa thuận chuyển nhượng", "Thỏa thuận chuyển nhượng quyền lợi"),
    
    // GENERAL TYPES
    OTHER("OTHER", "Khác", "Loại hợp đồng khác"),
    GENERAL("GENERAL", "Chung", "Hợp đồng chung"),
    NDA("NDA", "Thỏa thuận bảo mật", "Non-Disclosure Agreement");
    
    private final String value;
    private final String displayName;
    private final String description;
    
    ContractType(String value, String displayName, String description) {
        this.value = value;
        this.displayName = displayName;
        this.description = description;
    }
    
    @JsonValue
    public String getValue() {
        return value;
    }
    
    @JsonCreator
    public static ContractType fromValue(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("ContractType cannot be null or empty");
        }
        
        String trimmedValue = value.trim();
        
        // Only accept English constants (case-insensitive)
        for (ContractType type : ContractType.values()) {
            if (type.value.equalsIgnoreCase(trimmedValue)) {
                return type;
            }
        }
        
        // If not found, provide helpful error message with available English constants
        throw new IllegalArgumentException("Unknown ContractType: '" + value + "'. " +
                "Only English constants are accepted. Valid values are: " + getValidValuesString());
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public String getDescription() {
        return description;
    }
    
    /**
     * Lấy loại hợp đồng theo nhóm
     */
    public String getGroup() {
        if (value.startsWith("SERVICE_") || value.contains("CONSULTING") || 
            value.contains("MAINTENANCE") || value.contains("SUPPORT") || 
            value.contains("TRAINING")) {
            return "SERVICE";
        } else if (value.startsWith("PURCHASE_") || value.contains("SUPPLY") || 
                   value.contains("PROCUREMENT")) {
            return "PURCHASE";
        } else if (value.contains("LEASE") || value.contains("RENTAL") || 
                   value.contains("EQUIPMENT")) {
            return "LEASE";
        } else if (value.contains("EMPLOYMENT") || value.contains("CONSULTANT") || 
                   value.contains("FREELANCER") || value.contains("INTERN")) {
            return "EMPLOYMENT";
        } else if (value.contains("CONFIDENTIALITY") || value.contains("NON_DISCLOSURE") || 
                   value.contains("NON_COMPETE")) {
            return "CONFIDENTIALITY";
        } else if (value.contains("PARTNERSHIP") || value.contains("JOINT_VENTURE") || 
                   value.contains("DISTRIBUTION") || value.contains("FRANCHISE")) {
            return "PARTNERSHIP";
        } else if (value.contains("LICENSING") || value.contains("SOFTWARE") || 
                   value.contains("TRADEMARK") || value.contains("PATENT")) {
            return "LICENSING";
        } else if (value.contains("LOAN") || value.contains("CREDIT") || 
                   value.contains("INVESTMENT") || value.contains("INSURANCE")) {
            return "FINANCIAL";
        } else if (value.contains("SAAS") || value.contains("CLOUD") || 
                   value.contains("HOSTING") || value.contains("DEVELOPMENT")) {
            return "TECHNOLOGY";
        } else if (value.contains("ADVERTISING") || value.contains("MARKETING") || 
                   value.contains("SPONSORSHIP")) {
            return "MARKETING";
        } else if (value.contains("PROPERTY") || value.contains("CONSTRUCTION")) {
            return "REAL_ESTATE";
        } else if (value.contains("SETTLEMENT") || value.contains("ARBITRATION") || 
                   value.contains("MEDIATION")) {
            return "LEGAL";
        } else {
            return "OTHER";
        }
    }
    
    /**
     * Lấy tất cả loại hợp đồng theo nhóm
     */
    public static ContractType[] getByGroup(String group) {
        return java.util.Arrays.stream(values())
                .filter(type -> type.getGroup().equals(group))
                .toArray(ContractType[]::new);
    }
    
    /**
     * Lấy tất cả nhóm
     */
    public static String[] getGroups() {
        return java.util.Arrays.stream(values())
                .map(ContractType::getGroup)
                .distinct()
                .sorted()
                .toArray(String[]::new);
    }
    
    /**
     * Tìm kiếm loại hợp đồng theo từ khóa
     */
    public static ContractType[] search(String keyword) {
        String lowerKeyword = keyword.toLowerCase();
        return java.util.Arrays.stream(values())
                .filter(type -> 
                    type.value.toLowerCase().contains(lowerKeyword) ||
                    type.displayName.toLowerCase().contains(lowerKeyword) ||
                    type.description.toLowerCase().contains(lowerKeyword) ||
                    type.getGroup().toLowerCase().contains(lowerKeyword)
                )
                .toArray(ContractType[]::new);
    }
    
    /**
     * Lấy danh sách các giá trị hợp lệ cho error message
     */
    private static String getValidValuesString() {
        return java.util.Arrays.stream(values())
                .map(ContractType::getValue)
                .limit(15) // Hiển thị 15 giá trị đầu để user có thể thấy các options
                .collect(java.util.stream.Collectors.joining(", ")) + "...";
    }
    
    /**
     * Lấy danh sách các display name hợp lệ cho error message
     */
    private static String getValidDisplayNamesString() {
        return java.util.Arrays.stream(values())
                .map(ContractType::getDisplayName)
                .limit(5) // Chỉ hiển thị 5 display name đầu
                .collect(java.util.stream.Collectors.joining(", ")) + "...";
    }
}

