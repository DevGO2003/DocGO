package com.devgo2003.docgo.document_service.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * ENUM cho các danh mục hợp đồng
 * Hỗ trợ 100+ categories được tổ chức theo hierarchy
 */
public enum ContractCategory {
    
    // ========== COMMERCIAL CATEGORIES ==========
    
    // SALES
    COMMERCIAL_SALES_DIRECT("COMMERCIAL", "SALES", "DIRECT_SALES", "Bán hàng trực tiếp"),
    COMMERCIAL_SALES_PARTNER("COMMERCIAL", "SALES", "PARTNER_SALES", "Bán hàng đối tác"),
    COMMERCIAL_SALES_RESELLER("COMMERCIAL", "SALES", "RESELLER_AGREEMENT", "Hợp đồng đại lý"),
    COMMERCIAL_SALES_DISTRIBUTION("COMMERCIAL", "SALES", "DISTRIBUTION_AGREEMENT", "Hợp đồng phân phối"),
    COMMERCIAL_SALES_FRANCHISE("COMMERCIAL", "SALES", "FRANCHISE_AGREEMENT", "Hợp đồng nhượng quyền"),
    
    // MARKETING
    COMMERCIAL_MARKETING_ADVERTISING("COMMERCIAL", "MARKETING", "ADVERTISING", "Quảng cáo"),
    COMMERCIAL_MARKETING_PROMOTIONAL("COMMERCIAL", "MARKETING", "PROMOTIONAL", "Khuyến mại"),
    COMMERCIAL_MARKETING_SPONSORSHIP("COMMERCIAL", "MARKETING", "SPONSORSHIP", "Tài trợ"),
    COMMERCIAL_MARKETING_EVENT("COMMERCIAL", "MARKETING", "EVENT_MARKETING", "Marketing sự kiện"),
    COMMERCIAL_MARKETING_DIGITAL("COMMERCIAL", "MARKETING", "DIGITAL_MARKETING", "Marketing số"),
    
    // PROCUREMENT
    COMMERCIAL_PROCUREMENT_PURCHASE("COMMERCIAL", "PROCUREMENT", "PURCHASE_ORDER", "Đơn hàng mua"),
    COMMERCIAL_PROCUREMENT_SUPPLY("COMMERCIAL", "PROCUREMENT", "SUPPLY_AGREEMENT", "Hợp đồng cung ứng"),
    COMMERCIAL_PROCUREMENT_VENDOR("COMMERCIAL", "PROCUREMENT", "VENDOR_CONTRACT", "Hợp đồng nhà cung cấp"),
    COMMERCIAL_PROCUREMENT_SERVICES("COMMERCIAL", "PROCUREMENT", "PROCUREMENT_SERVICES", "Dịch vụ mua sắm"),
    COMMERCIAL_PROCUREMENT_EQUIPMENT("COMMERCIAL", "PROCUREMENT", "EQUIPMENT_LEASE", "Thuê thiết bị"),
    
    // SERVICES
    COMMERCIAL_SERVICES_CONSULTING("COMMERCIAL", "SERVICES", "CONSULTING", "Tư vấn"),
    COMMERCIAL_SERVICES_MAINTENANCE("COMMERCIAL", "SERVICES", "MAINTENANCE", "Bảo trì"),
    COMMERCIAL_SERVICES_SUPPORT("COMMERCIAL", "SERVICES", "SUPPORT", "Hỗ trợ"),
    COMMERCIAL_SERVICES_TRAINING("COMMERCIAL", "SERVICES", "TRAINING", "Đào tạo"),
    COMMERCIAL_SERVICES_OUTSOURCING("COMMERCIAL", "SERVICES", "OUTSOURCING", "Thuê ngoài"),
    
    // ========== LEGAL CATEGORIES ==========
    
    // COMPLIANCE
    LEGAL_COMPLIANCE_GDPR("LEGAL", "COMPLIANCE", "GDPR", "Tuân thủ GDPR"),
    LEGAL_COMPLIANCE_SOX("LEGAL", "COMPLIANCE", "SOX", "Tuân thủ SOX"),
    LEGAL_COMPLIANCE_HIPAA("LEGAL", "COMPLIANCE", "HIPAA", "Tuân thủ HIPAA"),
    LEGAL_COMPLIANCE_PCI_DSS("LEGAL", "COMPLIANCE", "PCI_DSS", "Tuân thủ PCI DSS"),
    LEGAL_COMPLIANCE_ISO27001("LEGAL", "COMPLIANCE", "ISO_27001", "Tuân thủ ISO 27001"),
    LEGAL_COMPLIANCE_SOC2("LEGAL", "COMPLIANCE", "SOC2", "Tuân thủ SOC 2"),
    LEGAL_COMPLIANCE_FERPA("LEGAL", "COMPLIANCE", "FERPA", "Tuân thủ FERPA"),
    LEGAL_COMPLIANCE_CCPA("LEGAL", "COMPLIANCE", "CCPA", "Tuân thủ CCPA"),
    LEGAL_COMPLIANCE_PIPEDA("LEGAL", "COMPLIANCE", "PIPEDA", "Tuân thủ PIPEDA"),
    LEGAL_COMPLIANCE_LGPD("LEGAL", "COMPLIANCE", "LGPD", "Tuân thủ LGPD"),
    
    // INTELLECTUAL PROPERTY
    LEGAL_IP_PATENT("LEGAL", "INTELLECTUAL_PROPERTY", "PATENT", "Bằng sáng chế"),
    LEGAL_IP_TRADEMARK("LEGAL", "INTELLECTUAL_PROPERTY", "TRADEMARK", "Thương hiệu"),
    LEGAL_IP_COPYRIGHT("LEGAL", "INTELLECTUAL_PROPERTY", "COPYRIGHT", "Bản quyền"),
    LEGAL_IP_TRADE_SECRET("LEGAL", "INTELLECTUAL_PROPERTY", "TRADE_SECRET", "Bí mật thương mại"),
    LEGAL_IP_LICENSING("LEGAL", "INTELLECTUAL_PROPERTY", "LICENSING", "Cấp phép"),
    LEGAL_IP_ASSIGNMENT("LEGAL", "INTELLECTUAL_PROPERTY", "ASSIGNMENT", "Chuyển nhượng"),
    LEGAL_IP_NON_DISCLOSURE("LEGAL", "INTELLECTUAL_PROPERTY", "NON_DISCLOSURE", "Bảo mật"),
    
    // LITIGATION
    LEGAL_LITIGATION_SETTLEMENT("LEGAL", "LITIGATION", "SETTLEMENT", "Dàn xếp"),
    LEGAL_LITIGATION_ARBITRATION("LEGAL", "LITIGATION", "ARBITRATION", "Trọng tài"),
    LEGAL_LITIGATION_MEDIATION("LEGAL", "LITIGATION", "MEDIATION", "Hòa giải"),
    LEGAL_LITIGATION_REPRESENTATION("LEGAL", "LITIGATION", "LEGAL_REPRESENTATION", "Đại diện pháp lý"),
    LEGAL_LITIGATION_EXPERT_WITNESS("LEGAL", "LITIGATION", "EXPERT_WITNESS", "Chuyên gia tư vấn"),
    
    // ========== FINANCIAL CATEGORIES ==========
    
    // BANKING
    FINANCIAL_BANKING_LOAN("FINANCIAL", "BANKING", "LOAN_AGREEMENT", "Hợp đồng vay"),
    FINANCIAL_BANKING_CREDIT("FINANCIAL", "BANKING", "CREDIT_FACILITY", "Hạn mức tín dụng"),
    FINANCIAL_BANKING_SERVICES("FINANCIAL", "BANKING", "BANKING_SERVICES", "Dịch vụ ngân hàng"),
    FINANCIAL_BANKING_MERCHANT("FINANCIAL", "BANKING", "MERCHANT_SERVICES", "Dịch vụ thanh toán"),
    FINANCIAL_BANKING_TREASURY("FINANCIAL", "BANKING", "TREASURY_SERVICES", "Dịch vụ kho bạc"),
    
    // INVESTMENT
    FINANCIAL_INVESTMENT_MANAGEMENT("FINANCIAL", "INVESTMENT", "INVESTMENT_MANAGEMENT", "Quản lý đầu tư"),
    FINANCIAL_INVESTMENT_CUSTODY("FINANCIAL", "INVESTMENT", "CUSTODY_AGREEMENT", "Hợp đồng lưu ký"),
    FINANCIAL_INVESTMENT_BROKERAGE("FINANCIAL", "INVESTMENT", "BROKERAGE_AGREEMENT", "Hợp đồng môi giới"),
    FINANCIAL_INVESTMENT_ADVISORY("FINANCIAL", "INVESTMENT", "ADVISORY_SERVICES", "Dịch vụ tư vấn"),
    
    // INSURANCE
    FINANCIAL_INSURANCE_GENERAL("FINANCIAL", "INSURANCE", "GENERAL_LIABILITY", "Bảo hiểm trách nhiệm"),
    FINANCIAL_INSURANCE_PROFESSIONAL("FINANCIAL", "INSURANCE", "PROFESSIONAL_LIABILITY", "Bảo hiểm trách nhiệm nghề nghiệp"),
    FINANCIAL_INSURANCE_CYBER("FINANCIAL", "INSURANCE", "CYBER_INSURANCE", "Bảo hiểm mạng"),
    FINANCIAL_INSURANCE_DO("FINANCIAL", "INSURANCE", "DIRECTORS_OFFICERS", "Bảo hiểm giám đốc"),
    
    // ========== TECHNOLOGY CATEGORIES ==========
    
    // SOFTWARE
    TECH_SOFTWARE_LICENSE("TECHNOLOGY", "SOFTWARE", "SOFTWARE_LICENSE", "Giấy phép phần mềm"),
    TECH_SOFTWARE_SAAS("TECHNOLOGY", "SOFTWARE", "SAAS_AGREEMENT", "Hợp đồng SaaS"),
    TECH_SOFTWARE_OPEN_SOURCE("TECHNOLOGY", "SOFTWARE", "OPEN_SOURCE", "Mã nguồn mở"),
    TECH_SOFTWARE_CUSTOM("TECHNOLOGY", "SOFTWARE", "CUSTOM_DEVELOPMENT", "Phát triển tùy chỉnh"),
    TECH_SOFTWARE_MAINTENANCE("TECHNOLOGY", "SOFTWARE", "SOFTWARE_MAINTENANCE", "Bảo trì phần mềm"),
    
    // HARDWARE
    TECH_HARDWARE_PURCHASE("TECHNOLOGY", "HARDWARE", "EQUIPMENT_PURCHASE", "Mua thiết bị"),
    TECH_HARDWARE_LEASE("TECHNOLOGY", "HARDWARE", "HARDWARE_LEASE", "Thuê phần cứng"),
    TECH_HARDWARE_MAINTENANCE("TECHNOLOGY", "HARDWARE", "MAINTENANCE", "Bảo trì phần cứng"),
    TECH_HARDWARE_SUPPORT("TECHNOLOGY", "HARDWARE", "SUPPORT_SERVICES", "Dịch vụ hỗ trợ"),
    TECH_HARDWARE_DISPOSAL("TECHNOLOGY", "HARDWARE", "DISPOSAL_AGREEMENT", "Hợp đồng xử lý"),
    
    // CLOUD
    TECH_CLOUD_HOSTING("TECHNOLOGY", "CLOUD", "CLOUD_HOSTING", "Lưu trữ đám mây"),
    TECH_CLOUD_STORAGE("TECHNOLOGY", "CLOUD", "CLOUD_STORAGE", "Lưu trữ đám mây"),
    TECH_CLOUD_COMPUTING("TECHNOLOGY", "CLOUD", "CLOUD_COMPUTING", "Điện toán đám mây"),
    TECH_CLOUD_CDN("TECHNOLOGY", "CLOUD", "CDN_SERVICES", "Dịch vụ CDN"),
    TECH_CLOUD_BACKUP("TECHNOLOGY", "CLOUD", "BACKUP_SERVICES", "Dịch vụ sao lưu"),
    
    // ========== HUMAN RESOURCES CATEGORIES ==========
    
    // EMPLOYMENT
    HR_EMPLOYMENT_CONTRACT("HUMAN_RESOURCES", "EMPLOYMENT", "EMPLOYMENT_CONTRACT", "Hợp đồng lao động"),
    HR_EMPLOYMENT_CONSULTANT("HUMAN_RESOURCES", "EMPLOYMENT", "CONSULTANT_AGREEMENT", "Hợp đồng tư vấn"),
    HR_EMPLOYMENT_INTERN("HUMAN_RESOURCES", "EMPLOYMENT", "INTERN_AGREEMENT", "Hợp đồng thực tập"),
    HR_EMPLOYMENT_FREELANCER("HUMAN_RESOURCES", "EMPLOYMENT", "FREELANCER_CONTRACT", "Hợp đồng freelancer"),
    
    // BENEFITS
    HR_BENEFITS_HEALTH("HUMAN_RESOURCES", "BENEFITS", "HEALTH_INSURANCE", "Bảo hiểm y tế"),
    HR_BENEFITS_RETIREMENT("HUMAN_RESOURCES", "BENEFITS", "RETIREMENT_PLAN", "Kế hoạch hưu trí"),
    HR_BENEFITS_STOCK("HUMAN_RESOURCES", "BENEFITS", "STOCK_OPTIONS", "Quyền chọn cổ phiếu"),
    HR_BENEFITS_SEVERANCE("HUMAN_RESOURCES", "BENEFITS", "SEVERANCE_AGREEMENT", "Thỏa thuận nghỉ việc"),
    
    // ========== REAL ESTATE CATEGORIES ==========
    
    // LEASING
    RE_LEASING_OFFICE("REAL_ESTATE", "LEASING", "OFFICE_LEASE", "Thuê văn phòng"),
    RE_LEASING_WAREHOUSE("REAL_ESTATE", "LEASING", "WAREHOUSE_LEASE", "Thuê kho bãi"),
    RE_LEASING_RETAIL("REAL_ESTATE", "LEASING", "RETAIL_LEASE", "Thuê cửa hàng"),
    RE_LEASING_RESIDENTIAL("REAL_ESTATE", "LEASING", "RESIDENTIAL_LEASE", "Thuê nhà ở"),
    RE_LEASING_LAND("REAL_ESTATE", "LEASING", "LAND_LEASE", "Thuê đất"),
    
    // PURCHASE
    RE_PURCHASE_PROPERTY("REAL_ESTATE", "PURCHASE", "PROPERTY_PURCHASE", "Mua bất động sản"),
    RE_PURCHASE_LAND("REAL_ESTATE", "PURCHASE", "LAND_PURCHASE", "Mua đất"),
    RE_PURCHASE_COMMERCIAL("REAL_ESTATE", "PURCHASE", "COMMERCIAL_PROPERTY", "Mua bất động sản thương mại"),
    RE_PURCHASE_RESIDENTIAL("REAL_ESTATE", "PURCHASE", "RESIDENTIAL_PROPERTY", "Mua nhà ở");
    
    private final String mainCategory;
    private final String subCategory;
    private final String specificCategory;
    private final String displayName;
    
    ContractCategory(String mainCategory, String subCategory, String specificCategory, String displayName) {
        this.mainCategory = mainCategory;
        this.subCategory = subCategory;
        this.specificCategory = specificCategory;
        this.displayName = displayName;
    }
    
    @JsonValue
    public String getValue() {
        return this.name();
    }
    
    @JsonCreator
    public static ContractCategory fromValue(String value) {
        for (ContractCategory category : ContractCategory.values()) {
            if (category.name().equals(value)) {
                return category;
            }
        }
        throw new IllegalArgumentException("Unknown ContractCategory: " + value);
    }
    
    public String getMainCategory() {
        return mainCategory;
    }
    
    public String getSubCategory() {
        return subCategory;
    }
    
    public String getSpecificCategory() {
        return specificCategory;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    /**
     * Lấy tất cả categories theo main category
     */
    public static ContractCategory[] getByMainCategory(String mainCategory) {
        return java.util.Arrays.stream(values())
                .filter(category -> category.getMainCategory().equals(mainCategory))
                .toArray(ContractCategory[]::new);
    }
    
    /**
     * Lấy tất cả categories theo sub category
     */
    public static ContractCategory[] getBySubCategory(String mainCategory, String subCategory) {
        return java.util.Arrays.stream(values())
                .filter(category -> category.getMainCategory().equals(mainCategory) 
                        && category.getSubCategory().equals(subCategory))
                .toArray(ContractCategory[]::new);
    }
    
    /**
     * Tìm kiếm categories theo từ khóa
     */
    public static ContractCategory[] search(String keyword) {
        String lowerKeyword = keyword.toLowerCase();
        return java.util.Arrays.stream(values())
                .filter(category -> 
                    category.name().toLowerCase().contains(lowerKeyword) ||
                    category.getDisplayName().toLowerCase().contains(lowerKeyword) ||
                    category.getMainCategory().toLowerCase().contains(lowerKeyword) ||
                    category.getSubCategory().toLowerCase().contains(lowerKeyword) ||
                    category.getSpecificCategory().toLowerCase().contains(lowerKeyword)
                )
                .toArray(ContractCategory[]::new);
    }
    
    /**
     * Lấy tất cả main categories
     */
    public static String[] getMainCategories() {
        return java.util.Arrays.stream(values())
                .map(ContractCategory::getMainCategory)
                .distinct()
                .sorted()
                .toArray(String[]::new);
    }
    
    /**
     * Lấy tất cả sub categories theo main category
     */
    public static String[] getSubCategories(String mainCategory) {
        return java.util.Arrays.stream(values())
                .filter(category -> category.getMainCategory().equals(mainCategory))
                .map(ContractCategory::getSubCategory)
                .distinct()
                .sorted()
                .toArray(String[]::new);
    }
}

