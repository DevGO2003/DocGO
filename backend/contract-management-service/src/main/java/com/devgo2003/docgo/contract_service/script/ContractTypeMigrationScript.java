package com.devgo2003.docgo.contract_service.script;

import com.devgo2003.docgo.contract_service.enums.ContractType;
import com.devgo2003.docgo.contract_service.entity.Contract;
import com.devgo2003.docgo.contract_service.repository.ContractRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Script migration để cập nhật ContractType từ tiếng Việt sang English constants
 * Chạy một lần duy nhất khi deploy version mới
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ContractTypeMigrationScript implements CommandLineRunner {

    private final ContractRepository contractRepository;

    // Mapping từ tiếng Việt sang English constants
    private static final Map<String, String> VIETNAMESE_TO_ENGLISH_MAPPING = new HashMap<>();
    
    static {
        // SERVICE AGREEMENTS
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng dịch vụ", "SERVICE_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng tư vấn", "CONSULTING_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng bảo trì", "MAINTENANCE_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng hỗ trợ", "SUPPORT_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng đào tạo", "TRAINING_AGREEMENT");
        
        // PURCHASE AGREEMENTS
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng mua bán", "PURCHASE_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng cung ứng", "SUPPLY_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng mua sắm", "PROCUREMENT_AGREEMENT");
        
        // LEASE AGREEMENTS
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng thuê", "LEASE_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng cho thuê", "RENTAL_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng thuê thiết bị", "EQUIPMENT_LEASE");
        
        // EMPLOYMENT CONTRACTS
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng lao động", "EMPLOYMENT_CONTRACT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng tư vấn viên", "CONSULTANT_CONTRACT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng freelancer", "FREELANCER_CONTRACT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng thực tập", "INTERN_AGREEMENT");
        
        // CONFIDENTIALITY AGREEMENTS
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng bảo mật", "CONFIDENTIALITY_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Thỏa thuận bảo mật", "NON_DISCLOSURE_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Thỏa thuận không cạnh tranh", "NON_COMPETE_AGREEMENT");
        
        // PARTNERSHIP AGREEMENTS
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng đối tác", "PARTNERSHIP_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng liên doanh", "JOINT_VENTURE_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng phân phối", "DISTRIBUTION_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng nhượng quyền", "FRANCHISE_AGREEMENT");
        
        // LICENSING AGREEMENTS
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng cấp phép", "LICENSING_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Giấy phép phần mềm", "SOFTWARE_LICENSE");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Giấy phép thương hiệu", "TRADEMARK_LICENSE");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Giấy phép bằng sáng chế", "PATENT_LICENSE");
        
        // FINANCIAL AGREEMENTS
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng vay", "LOAN_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng tín dụng", "CREDIT_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng đầu tư", "INVESTMENT_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng bảo hiểm", "INSURANCE_AGREEMENT");
        
        // TECHNOLOGY AGREEMENTS
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng SaaS", "SAAS_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng đám mây", "CLOUD_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng hosting", "HOSTING_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng phát triển", "DEVELOPMENT_AGREEMENT");
        
        // MARKETING AGREEMENTS
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng quảng cáo", "ADVERTISING_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng marketing", "MARKETING_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng tài trợ", "SPONSORSHIP_AGREEMENT");
        
        // REAL ESTATE AGREEMENTS
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng thuê bất động sản", "PROPERTY_LEASE");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng mua bất động sản", "PROPERTY_PURCHASE");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Hợp đồng xây dựng", "CONSTRUCTION_AGREEMENT");
        
        // LEGAL AGREEMENTS
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Thỏa thuận dàn xếp", "SETTLEMENT_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Thỏa thuận trọng tài", "ARBITRATION_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Thỏa thuận hòa giải", "MEDIATION_AGREEMENT");
        
        // OTHER AGREEMENTS
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Phụ lục hợp đồng", "AMENDMENT_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Thỏa thuận chấm dứt", "TERMINATION_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Thỏa thuận gia hạn", "RENEWAL_AGREEMENT");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Thỏa thuận chuyển nhượng", "ASSIGNMENT_AGREEMENT");
        
        // GENERAL TYPES
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Khác", "OTHER");
        VIETNAMESE_TO_ENGLISH_MAPPING.put("Chung", "GENERAL");
    }

    @Override
    public void run(String... args) throws Exception {
        // Chỉ chạy migration khi có flag --migrate-contract-types
        if (args.length == 0 || !args[0].equals("--migrate-contract-types")) {
            log.info("ContractType migration script skipped. Use --migrate-contract-types to run migration.");
            return;
        }

        log.info("Starting ContractType migration from Vietnamese to English constants...");
        
        try {
            // Lấy tất cả contracts
            List<Contract> allContracts = contractRepository.findAll();
            log.info("Found {} contracts to migrate", allContracts.size());
            
            int migratedCount = 0;
            int skippedCount = 0;
            int errorCount = 0;
            
            for (Contract contract : allContracts) {
                try {
                    String currentType = contract.getContractType().getValue();
                    
                    // Nếu đã là English constant, bỏ qua
                    if (isEnglishConstant(currentType)) {
                        skippedCount++;
                        continue;
                    }
                    
                    // Tìm mapping từ tiếng Việt sang English
                    String englishConstant = VIETNAMESE_TO_ENGLISH_MAPPING.get(currentType);
                    
                    if (englishConstant != null) {
                        // Cập nhật contract type
                        ContractType newType = ContractType.fromValue(englishConstant);
                        contract.setContractType(newType);
                        contractRepository.save(contract);
                        
                        migratedCount++;
                        log.debug("Migrated contract {}: {} -> {}", 
                                contract.getId(), currentType, englishConstant);
                    } else {
                        log.warn("No mapping found for contract type: {} (Contract ID: {})", 
                                currentType, contract.getId());
                        errorCount++;
                    }
                    
                } catch (Exception e) {
                    log.error("Error migrating contract {}: {}", contract.getId(), e.getMessage());
                    errorCount++;
                }
            }
            
            log.info("ContractType migration completed:");
            log.info("- Migrated: {} contracts", migratedCount);
            log.info("- Skipped: {} contracts (already English)", skippedCount);
            log.info("- Errors: {} contracts", errorCount);
            
        } catch (Exception e) {
            log.error("Migration failed: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * Kiểm tra xem string có phải là English constant không
     */
    private boolean isEnglishConstant(String value) {
        try {
            ContractType.fromValue(value);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
