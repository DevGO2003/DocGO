package com.devgo2003.docgo.document_service.service.impl;

import com.devgo2003.docgo.document_service.entity.Contract;
import com.devgo2003.docgo.document_service.enums.ContractStatus;
import com.devgo2003.docgo.document_service.enums.ContractType;
import com.devgo2003.docgo.document_service.entity.ContractAttachment;
import com.devgo2003.docgo.document_service.service.IContractKafkaService;
import com.devgo2003.docgo.document_service.service.IContractService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;

@Service
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "spring.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class ContractKafkaServiceImpl implements IContractKafkaService {

    private static final Logger logger = LoggerFactory.getLogger(ContractKafkaServiceImpl.class);

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Value("${kafka.contract-events-topic:contract.events}")
    private String contractEventsTopic;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private IContractService contractService;

    @Autowired
    private com.devgo2003.docgo.document_service.repository.AuditEventRepository auditEventRepository;

    /**
     * Consume SummaryCreated events từ AI Processing Service
     */
    // @KafkaListener(topics = "${kafka.contract-summary-topic:contract.summary.updated}", groupId = "document-management-service-group")
    public void handleSummaryCreated(@Payload String message, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            String eventType = (String) event.get("eventType");
            
            if ("SummaryCreated".equals(eventType)) {
                logger.info("Received SummaryCreated event: {}", event);
                processSummaryCreated(event);
            }
        } catch (Exception e) {
            logger.error("Error processing SummaryCreated event: {}", e.getMessage(), e);
        }
    }

    /**
     * Consume ContractSummaryPublished events theo schema mới (document/architecture/contract-summary-published.*.json)
     */
    @KafkaListener(topics = "${kafka.contract-summary-topic:contract.summary.published}", groupId = "document-management-service-group")
    public void handleContractSummaryPublished(@Payload String message, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            String eventType = (String) event.get("eventType");
            if ("ContractSummaryPublished".equals(eventType)) {
                logger.info("📥 [SUMMARY_PUBLISHED_RECEIVED] Nhận event ContractSummaryPublished từ topic {}", topic);
                processContractSummaryPublished(event);
            }
        } catch (Exception e) {
            logger.error("❌ [SUMMARY_PUBLISHED_ERROR] Lỗi parse/handle ContractSummaryPublished: {}", e.getMessage(), e);
        }
    }

    /**
     * Xử lý SummaryCreated event và tạo/cập nhật hợp đồng
     */
    @Override
    @Transactional
    public void processSummaryCreated(Map<String, Object> event) {
        try {
            // Kiểm tra null cho event
            if (event == null) {
                logger.error("event is null");
                return;
            }
            
            Map<String, Object> data = (Map<String, Object>) event.get("data");
            Map<String, Object> actor = (Map<String, Object>) event.get("actor");
            
            // Kiểm tra null cho data và actor
            if (data == null) {
                logger.error("data is null in event: {}", event);
                return;
            }
            
            if (actor == null) {
                logger.error("actor is null in event: {}", event);
                return;
            }
            
            // Lấy thông tin file từ file_information
            Map<String, Object> fileInformation = (Map<String, Object>) data.get("file_information");
            
            // Kiểm tra null cho fileInformation
            if (fileInformation == null) {
                logger.error("file_information is null in event data: {}", data);
                return;
            }
            
            String fileId = (String) fileInformation.get("fileId");
            String filename = (String) fileInformation.get("filename");
            String summary = (String) fileInformation.get("summary");
            
            // Kiểm tra null cho các trường bắt buộc
            if (fileId == null || filename == null || summary == null) {
                logger.error("Required fields are null - fileId: {}, filename: {}, summary: {}", fileId, filename, summary);
                return;
            }
            
            // Lấy thông tin contract summary chi tiết
            Map<String, Object> contractSummary = (Map<String, Object>) data.get("contract_summary");
            
            // Kiểm tra null cho contractSummary
            if (contractSummary == null) {
                logger.error("contract_summary is null in event data: {}", data);
                return;
            }
            
            logger.info("Processing contract for file: {} with summary: {}", filename, summary);
            
            // Tạo hợp đồng mới trong database
            Contract contract = Contract.createNew();
            contract.setTitle((String) contractSummary.get("title"));
            contract.setStatus(ContractStatus.DRAFT);
            contract.setSummary(summary);
            contract.setContractType(ContractType.OTHER);
            contract.setAiProcessed(true);
            contract.setProcessingStatus(Contract.ProcessingStatus.COMPLETED);
            contract.setSystemId(fileId);
            
            // Tạo hợp đồng
            Contract savedContract = contractService.createContract(contract);
            
            logger.info("✅ Created contract with ID: {} for file: {}", savedContract.getId(), filename);
            
            // Lưu thông tin summary chi tiết vào bảng contract_summaries
            saveContractSummary(savedContract.getId(), fileInformation, contractSummary, event);
            
            // Publish contract-updated event
            publishContractUpdated(event, fileInformation, actor, fileId, savedContract.getId());
            
        } catch (Exception e) {
            logger.error("Error processing contract from summary: {}", e.getMessage(), e);
        }
    }

    /**
     * Xử lý event ContractSummaryPublished (schema camelCase) và lưu theo logic hiện có
     */
    @Transactional
    public void processContractSummaryPublished(Map<String, Object> event) {
        try {
            if (event == null) {
                logger.error("❌ [SUMMARY_PUBLISHED_INVALID] Event null");
                return;
            }

            Map<String, Object> data = (Map<String, Object>) event.get("data");
            if (data == null) {
                logger.error("❌ [SUMMARY_PUBLISHED_INVALID] data null trong event: {}", event);
                return;
            }

            // Tạo hợp đồng cơ bản từ data
            Contract contract = Contract.createNew();
            contract.setContractNumber((String) data.get("contractNumber"));
            contract.setTitle((String) data.get("title"));

            // Map status từ event, fallback về DRAFT nếu không có hoặc không hợp lệ
            String eventStatus = (String) data.get("status");
            ContractStatus contractStatus = ContractStatus.DRAFT; // Default
            if (eventStatus != null) {
                try {
                    contractStatus = ContractStatus.fromValue(eventStatus.toUpperCase());
                } catch (IllegalArgumentException e) {
                    logger.warn("⚠️ [SUMMARY_PUBLISHED_INVALID_STATUS] Status '{}' không hợp lệ, fallback về DRAFT.", eventStatus);
                }
            }
            contract.setStatus(contractStatus);
            contract.setSummary("SUMMARY_PUBLISHED");
            String contractTypeStr = (String) data.getOrDefault("contractType", "OTHER");
            try {
                contract.setContractType(ContractType.fromValue(contractTypeStr));
            } catch (Exception e) {
                contract.setContractType(ContractType.OTHER);
            }
            contract.setAiProcessed(true);
            contract.setProcessingStatus(Contract.ProcessingStatus.COMPLETED);

            // Map tags (List<String>) -> chuỗi comma để tương thích entity hiện tại
            Object tagsObj = data.get("tags");
            if (tagsObj instanceof List) {
                List<?> tags = (List<?>) tagsObj;
                List<String> tagStrings = new ArrayList<>();
                for (Object t : tags) {
                    if (t != null) tagStrings.add(String.valueOf(t));
                }
                if (!tagStrings.isEmpty()) {
                    contract.setTags(tagStrings);
                }
            }

            Contract saved = contractService.createContract(contract);
            logger.info("✅ [SUMMARY_PUBLISHED_CONTRACT_CREATED] contractId={}", saved.getId());

            // Chuyển schema camelCase -> schema snake_case mà saveDetailedContractSummary đang đọc
            Map<String, Object> legacySummary = convertPublishedDataToLegacyContractSummary(data);
            saveDetailedContractSummary(saved.getId(), legacySummary);

            logger.info("🎉 [SUMMARY_PUBLISHED_DONE] Đã xử lý ContractSummaryPublished thành công - contractId={}", saved.getId());
        } catch (Exception e) {
            logger.error("❌ [SUMMARY_PUBLISHED_PROCESS_ERROR] {}", e.getMessage(), e);
        }
    }

    /**
     * Lưu thông tin summary chi tiết vào database
     */
    private void saveContractSummary(String contractId, Map<String, Object> fileInformation, Map<String, Object> contractSummary, Map<String, Object> event) {
        try {
            // Kiểm tra null cho các tham số
            if (contractId == null || fileInformation == null || contractSummary == null || event == null) {
                logger.error("Invalid parameters - contractId: {}, fileInformation: {}, contractSummary: {}, event: {}", 
                           contractId, fileInformation, contractSummary, event);
                return;
            }
            
            String fileId = (String) fileInformation.get("fileId");
            String filename = (String) fileInformation.get("filename");
            String summary = (String) fileInformation.get("summary");
            Integer summaryLength = (Integer) fileInformation.get("summaryLength");
            
            // Lấy key points từ file_information
            List<String> keyPoints = new ArrayList<>();
            if (fileInformation.get("keyPoints") instanceof List) {
                keyPoints = (List<String>) fileInformation.get("keyPoints");
            }
            
            // Lấy thông tin classification từ event
            String classification = "CONTRACT"; // Default
            Double classificationConfidence = 0.92; // Default
            List<String> categories = Arrays.asList("document", "contract"); // Default
            
            // Tìm classification event trong cùng correlation
            String correlationId = (String) event.get("correlationId");
            if (correlationId != null) {
                // Có thể tìm thêm thông tin classification từ các events khác
                // Hiện tại sử dụng default values
            }
            
            // Lưu thông tin file vào bảng contract_files
            saveContractFile(contractId, fileInformation, event);
            
            // Lưu thông tin cơ bản vào contract_summaries
            contractService.createOrUpdateContractSummary(
                contractId,
                fileId,
                filename,
                summary,
                summaryLength,
                keyPoints,
                "AI/OCR", // extractionMethod
                new java.math.BigDecimal("0.95"), // confidence
                classification,
                new java.math.BigDecimal(classificationConfidence.toString()),
                categories
            );
            
            // Lưu thông tin contract summary chi tiết
            saveDetailedContractSummary(contractId, contractSummary);
            
            logger.info("✅ Saved contract summary for contract ID: {} and file: {}", contractId, filename);
            
        } catch (Exception e) {
            logger.error("Error saving contract summary: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Lưu thông tin file vào bảng contract_files
     */
    private void saveContractFile(String contractId, Map<String, Object> fileInformation, Map<String, Object> event) {
        try {
            // Kiểm tra null cho các tham số
            if (contractId == null || fileInformation == null || event == null) {
                logger.error("Invalid parameters in saveContractFile - contractId: {}, fileInformation: {}, event: {}", 
                           contractId, fileInformation, event);
                return;
            }
            
            String fileId = (String) fileInformation.get("fileId");
            String filename = (String) fileInformation.get("filename");
            String fileType = (String) fileInformation.get("fileType");
            String fileKey = (String) fileInformation.get("key");
            String bucket = (String) fileInformation.get("bucket");
            String summary = (String) fileInformation.get("summary");
            Integer summaryLength = (Integer) fileInformation.get("summaryLength");
            
            // Lấy key points
            List<String> keyPoints = new ArrayList<>();
            if (fileInformation.get("keyPoints") instanceof List) {
                keyPoints = (List<String>) fileInformation.get("keyPoints");
            }
            
            // Lấy thông tin classification từ event
            String classification = "CONTRACT"; // Default
            Double classificationConfidence = 0.92; // Default
            List<String> categories = Arrays.asList("document", "contract"); // Default
            
            // Lưu vào bảng contract_files
            contractService.createOrUpdateContractFile(
                contractId,
                fileId,
                filename,
                fileType,
                fileKey,
                bucket,
                summary,
                summaryLength,
                keyPoints,
                "AI/OCR", // extractionMethod
                new java.math.BigDecimal("0.95"), // confidence
                classification,
                new java.math.BigDecimal(classificationConfidence.toString()),
                categories
            );
            
            logger.info("✅ Saved contract file for contract ID: {} and file: {}", contractId, filename);
            
        } catch (Exception e) {
            logger.error("Error saving contract file: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Lưu thông tin contract summary chi tiết
     */
    private void saveDetailedContractSummary(String contractId, Map<String, Object> contractSummary) {
        logger.info("📋 [DETAILED_SUMMARY_SAVE_START] Bắt đầu lưu contract summary chi tiết - contractId: {}", contractId);
        
        try {
            // Kiểm tra null cho các tham số
            if (contractId == null || contractSummary == null) {
                logger.error("❌ [INVALID_PARAMS] Tham số không hợp lệ trong saveDetailedContractSummary - contractId: {}, contractSummary: {}", 
                           contractId, contractSummary);
                return;
            }
            
            // Lưu thông tin parties
            logger.info("👥 [PARTIES_SAVE] Bắt đầu lưu thông tin parties...");
            List<Map<String, Object>> parties = (List<Map<String, Object>>) contractSummary.get("parties");
            if (parties != null) {
                logger.info("👥 [PARTIES_COUNT] Tìm thấy {} parties để lưu", parties.size());
                for (int i = 0; i < parties.size(); i++) {
                    Map<String, Object> party = parties.get(i);
                    String partyName = (String) party.get("name");
                    String partyRole = (String) party.get("role");
                    logger.info("👤 [PARTY_SAVE] Lưu party {}: name={}, role={}", i + 1, partyName, partyRole);
                    
                    contractService.createOrUpdateContractParty(
                        contractId,
                        partyName,
                        partyRole,
                        (String) party.get("representative"),
                        (String) party.get("tax_code"),
                        (String) party.get("contact")
                    );
                }
                logger.info("✅ [PARTIES_SAVE_SUCCESS] Đã lưu {} parties thành công", parties.size());
            } else {
                logger.info("⏭️ [NO_PARTIES] Không có parties để lưu");
            }
            
            // Lưu thông tin key clauses
            logger.info("📝 [KEY_CLAUSES_SAVE] Bắt đầu lưu thông tin key clauses...");
            List<Map<String, Object>> keyClauses = (List<Map<String, Object>>) contractSummary.get("key_clauses");
            if (keyClauses != null) {
                logger.info("📝 [KEY_CLAUSES_COUNT] Tìm thấy {} key clauses để lưu", keyClauses.size());
                for (int i = 0; i < keyClauses.size(); i++) {
                    Map<String, Object> clause = keyClauses.get(i);
                    String clauseName = (String) clause.get("name");
                    logger.info("📋 [KEY_CLAUSE_SAVE] Lưu key clause {}: name={}", i + 1, clauseName);
                    
                    contractService.createOrUpdateContractClause(
                        contractId,
                        clauseName,
                        (String) clause.get("description"),
                        (String) clause.get("source"),
                        "KEY"
                    );
                }
                logger.info("✅ [KEY_CLAUSES_SAVE_SUCCESS] Đã lưu {} key clauses thành công", keyClauses.size());
            } else {
                logger.info("⏭️ [NO_KEY_CLAUSES] Không có key clauses để lưu");
            }
            
            // Lưu thông tin favorable clauses
            logger.info("✅ [FAVORABLE_CLAUSES_SAVE] Bắt đầu lưu thông tin favorable clauses...");
            List<Map<String, Object>> favorableClauses = (List<Map<String, Object>>) contractSummary.get("favorable_clauses");
            if (favorableClauses != null) {
                logger.info("✅ [FAVORABLE_CLAUSES_COUNT] Tìm thấy {} favorable clauses để lưu", favorableClauses.size());
                for (int i = 0; i < favorableClauses.size(); i++) {
                    Map<String, Object> clause = favorableClauses.get(i);
                    String clauseName = (String) clause.get("clause_name");
                    String benefitTo = (String) clause.get("benefit_to");
                    logger.info("✅ [FAVORABLE_CLAUSE_SAVE] Lưu favorable clause {}: name={}, benefit_to={}", i + 1, clauseName, benefitTo);
                    
                    contractService.createOrUpdateContractClause(
                        contractId,
                        clauseName,
                        (String) clause.get("description"),
                        benefitTo,
                        "FAVORABLE"
                    );
                }
                logger.info("✅ [FAVORABLE_CLAUSES_SAVE_SUCCESS] Đã lưu {} favorable clauses thành công", favorableClauses.size());
            } else {
                logger.info("⏭️ [NO_FAVORABLE_CLAUSES] Không có favorable clauses để lưu");
            }
            
            // Lưu thông tin unfavorable clauses
            logger.info("⚠️ [UNFAVORABLE_CLAUSES_SAVE] Bắt đầu lưu thông tin unfavorable clauses...");
            List<Map<String, Object>> unfavorableClauses = (List<Map<String, Object>>) contractSummary.get("unfavorable_clauses");
            if (unfavorableClauses != null) {
                logger.info("⚠️ [UNFAVORABLE_CLAUSES_COUNT] Tìm thấy {} unfavorable clauses để lưu", unfavorableClauses.size());
                for (int i = 0; i < unfavorableClauses.size(); i++) {
                    Map<String, Object> clause = unfavorableClauses.get(i);
                    String clauseName = (String) clause.get("clause_name");
                    String riskTo = (String) clause.get("risk_to");
                    logger.info("⚠️ [UNFAVORABLE_CLAUSE_SAVE] Lưu unfavorable clause {}: name={}, risk_to={}", i + 1, clauseName, riskTo);
                    
                    contractService.createOrUpdateContractClause(
                        contractId,
                        clauseName,
                        (String) clause.get("description"),
                        riskTo,
                        "UNFAVORABLE"
                    );
                }
                logger.info("✅ [UNFAVORABLE_CLAUSES_SAVE_SUCCESS] Đã lưu {} unfavorable clauses thành công", unfavorableClauses.size());
            } else {
                logger.info("⏭️ [NO_UNFAVORABLE_CLAUSES] Không có unfavorable clauses để lưu");
            }
            
            // Lưu thông tin payment details
            logger.info("💰 [PAYMENT_DETAILS_SAVE] Bắt đầu lưu thông tin payment details...");
            Map<String, Object> paymentDetails = (Map<String, Object>) contractSummary.get("payment_details");
            if (paymentDetails != null) {
                String totalValue = (String) paymentDetails.get("total_value");
                String schedule = (String) paymentDetails.get("schedule");
                String currency = (String) paymentDetails.get("currency");
                logger.info("💰 [PAYMENT_INFO] Thông tin payment - total_value: {}, schedule: {}, currency: {}", 
                           totalValue, schedule, currency);
                
                contractService.createOrUpdateContractPayment(
                    contractId,
                    totalValue,
                    schedule,
                    currency
                );
                logger.info("✅ [PAYMENT_DETAILS_SAVE_SUCCESS] Đã lưu payment details thành công");
            } else {
                logger.info("⏭️ [NO_PAYMENT_DETAILS] Không có payment details để lưu");
            }
            
            // Lưu thông tin khác
            logger.info("📋 [OTHER_DETAILS_SAVE] Bắt đầu lưu thông tin khác...");
            String object = (String) contractSummary.get("object");
            String effectiveDate = (String) contractSummary.get("effective_date");
            String term = (String) contractSummary.get("term");
            String terminationConditions = (String) contractSummary.get("termination_conditions");
            
            logger.info("📋 [OTHER_INFO] Thông tin khác - object: {}, effective_date: {}, term: {}, termination_conditions: {}", 
                       object, effectiveDate, term, terminationConditions);
            
            contractService.updateContractDetails(
                contractId,
                object,
                effectiveDate,
                term,
                terminationConditions
            );
            
            logger.info("✅ [OTHER_DETAILS_SAVE_SUCCESS] Đã lưu thông tin khác thành công");
            logger.info("🎉 [DETAILED_SUMMARY_SAVE_COMPLETE] Hoàn thành lưu contract summary chi tiết cho contract ID: {}", contractId);
            
        } catch (Exception e) {
            logger.error("❌ [DETAILED_SUMMARY_SAVE_ERROR] Lỗi lưu contract summary chi tiết: {} - contractId: {}", 
                        e.getMessage(), contractId, e);
        }
    }

    /**
     * Chuyển đổi schema mới (camelCase) sang schema cũ (snake_case) để tái sử dụng logic lưu hiện có
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> convertPublishedDataToLegacyContractSummary(Map<String, Object> data) {
        Map<String, Object> legacy = new LinkedHashMap<>();

        // parties
        Object partiesObj = data.get("parties");
        if (partiesObj instanceof List) {
            List<Map<String, Object>> partiesIn = (List<Map<String, Object>>) partiesObj;
            List<Map<String, Object>> partiesOut = new ArrayList<>();
            for (Map<String, Object> p : partiesIn) {
                if (p == null) continue;
                Map<String, Object> o = new LinkedHashMap<>();
                o.put("name", p.get("name"));
                o.put("role", p.get("role"));
                o.put("representative", p.get("representative"));
                // Map taxCode -> tax_code
                o.put("tax_code", p.get("taxCode"));
                o.put("contact", p.get("contact"));
                // address, businessLicense hiện chưa được dùng bởi service -> bỏ qua để tránh lỗi
                partiesOut.add(o);
            }
            legacy.put("parties", partiesOut);
        }

        // keyClauses -> key_clauses
        Object keyClausesObj = data.get("keyClauses");
        if (keyClausesObj instanceof List) {
            legacy.put("key_clauses", keyClausesObj);
        }

        // favorableClauses -> favorable_clauses (clauseName -> clause_name, benefitTo -> benefit_to)
        Object favorableObj = data.get("favorableClauses");
        if (favorableObj instanceof List) {
            List<Map<String, Object>> in = (List<Map<String, Object>>) favorableObj;
            List<Map<String, Object>> out = new ArrayList<>();
            for (Map<String, Object> c : in) {
                if (c == null) continue;
                Map<String, Object> o = new LinkedHashMap<>();
                o.put("clause_name", c.get("clauseName"));
                o.put("description", c.get("description"));
                o.put("benefit_to", c.get("benefitTo"));
                out.add(o);
            }
            legacy.put("favorable_clauses", out);
        }

        // unfavorableClauses -> unfavorable_clauses (clauseName -> clause_name, riskTo -> risk_to)
        Object unfavorableObj = data.get("unfavorableClauses");
        if (unfavorableObj instanceof List) {
            List<Map<String, Object>> in = (List<Map<String, Object>>) unfavorableObj;
            List<Map<String, Object>> out = new ArrayList<>();
            for (Map<String, Object> c : in) {
                if (c == null) continue;
                Map<String, Object> o = new LinkedHashMap<>();
                o.put("clause_name", c.get("clauseName"));
                o.put("description", c.get("description"));
                o.put("risk_to", c.get("riskTo"));
                out.add(o);
            }
            legacy.put("unfavorable_clauses", out);
        }

        // paymentDetails -> payment_details (totalValue number -> string)
        Object paymentObj = data.get("paymentDetails");
        if (paymentObj instanceof Map) {
            Map<String, Object> pmIn = (Map<String, Object>) paymentObj;
            Map<String, Object> pmOut = new LinkedHashMap<>();
            Object totalValue = pmIn.get("totalValue");
            pmOut.put("total_value", totalValue == null ? null : String.valueOf(totalValue));
            pmOut.put("schedule", pmIn.get("schedule"));
            pmOut.put("currency", pmIn.get("currency"));
            // paymentMethod hiện không dùng ở service -> có thể bổ sung DB sau
            legacy.put("payment_details", pmOut);
        }

        // object, effectiveDate -> effective_date, term, terminationConditions -> termination_conditions
        legacy.put("object", data.get("object"));
        legacy.put("effective_date", data.get("effectiveDate"));
        legacy.put("term", data.get("term"));
        legacy.put("termination_conditions", data.get("terminationConditions"));

        return legacy;
    }

    /**
     * Publish contract-updated event
     */
    private void publishContractUpdated(Map<String, Object> originalEvent, Map<String, Object> data, Map<String, Object> actor, String fileId, String contractId) {
        String correlationId = (String) originalEvent.get("correlationId");
        logger.info("📢 [CONTRACT_UPDATED_PUBLISH_START] Bắt đầu publish ContractUpdated event - fileId: {}, contractId: {}, correlationId: {}", 
                    fileId, contractId, correlationId);
        
        try {
            // Kiểm tra null cho các tham số
            if (originalEvent == null || data == null || actor == null || fileId == null || contractId == null) {
                logger.error("❌ [INVALID_PARAMS] Tham số không hợp lệ trong publishContractUpdated - originalEvent: {}, data: {}, actor: {}, fileId: {}, contractId: {}", 
                           originalEvent, data, actor, fileId, contractId);
                return;
            }
            
            logger.info("📋 [EVENT_PAYLOAD_PREP] Chuẩn bị payload cho ContractUpdated event...");
            
            Map<String, Object> contractUpdatedEvent = new HashMap<>();
            contractUpdatedEvent.put("eventVersion", "v1");
            contractUpdatedEvent.put("eventType", "ContractUpdated");
            contractUpdatedEvent.put("eventId", UUID.randomUUID().toString());
            contractUpdatedEvent.put("timestamp", ZonedDateTime.now().toString());
            contractUpdatedEvent.put("source", "document-management-service");
            contractUpdatedEvent.put("correlationId", correlationId);
            contractUpdatedEvent.put("actor", actor);
            
            Map<String, Object> eventData = new HashMap<>();
            eventData.put("fileId", data.get("fileId"));
            eventData.put("filename", data.get("filename"));
            eventData.put("contractId", contractId.toString());
            eventData.put("status", "PROCESSED");
            eventData.put("summary", data.get("summary"));
            eventData.put("processedAt", ZonedDateTime.now().toString());
            eventData.put("processedBy", actor.get("userId"));
            
            contractUpdatedEvent.put("data", eventData);
            
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("serviceVersion", "1.0.0");
            metadata.put("processingTime", ZonedDateTime.now().toString());
            contractUpdatedEvent.put("metadata", metadata);

            logger.info("📋 [EVENT_PAYLOAD_READY] Event payload đã sẵn sàng - eventId: {}, eventType: {}, source: {}", 
                        contractUpdatedEvent.get("eventId"), contractUpdatedEvent.get("eventType"), contractUpdatedEvent.get("source"));

            String payloadJson = objectMapper.writeValueAsString(contractUpdatedEvent);
            logger.info("📤 [KAFKA_SEND] Gửi ContractUpdated event lên Kafka topic: {} với key: {}", contractEventsTopic, fileId);
            
            kafkaTemplate.send(contractEventsTopic, fileId, payloadJson);
            
            logger.info("✅ [CONTRACT_UPDATED_PUBLISH_SUCCESS] Đã publish ContractUpdated event thành công cho file: {} với contract ID: {}", 
                        data.get("filename"), contractId);
            
        } catch (Exception e) {
            logger.error("❌ [CONTRACT_UPDATED_PUBLISH_FAILED] Không thể publish ContractUpdated event: {} - fileId: {}, contractId: {}, correlationId: {}", 
                        e.getMessage(), fileId, contractId, correlationId, e);
        }
    }

    @Override
    public void sendContractCreatedEvent(Contract contract) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "ContractCreated");
            event.put("eventId", UUID.randomUUID().toString());
            event.put("timestamp", ZonedDateTime.now().toString());
            event.put("data", contract);
            
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(contractEventsTopic, contract.getId(), payload);
            logger.info("Published ContractCreated event for contract: {}", contract.getId());
        } catch (Exception e) {
            logger.error("Failed to publish ContractCreated event: {}", e.getMessage(), e);
        }
    }

    @Override
    public void sendContractUpdatedEvent(Contract contract) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "ContractUpdated");
            event.put("eventId", UUID.randomUUID().toString());
            event.put("timestamp", ZonedDateTime.now().toString());
            event.put("data", contract);
            
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(contractEventsTopic, contract.getId(), payload);
            logger.info("Published ContractUpdated event for contract: {}", contract.getId());
        } catch (Exception e) {
            logger.error("Failed to publish ContractUpdated event: {}", e.getMessage(), e);
        }
    }

    @Override
    public void sendContractDeletedEvent(String contractId) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "ContractDeleted");
            event.put("eventId", UUID.randomUUID().toString());
            event.put("timestamp", ZonedDateTime.now().toString());
            event.put("data", Map.of("contractId", contractId));
            
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(contractEventsTopic, contractId, payload);
            logger.info("Published ContractDeleted event for contract: {}", contractId);
        } catch (Exception e) {
            logger.error("Failed to publish ContractDeleted event: {}", e.getMessage(), e);
        }
    }

    @Override
    public void sendContractRestoredEvent(String contractId) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "ContractRestored");
            event.put("eventId", UUID.randomUUID().toString());
            event.put("timestamp", ZonedDateTime.now().toString());
            event.put("data", Map.of("contractId", contractId));
            
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(contractEventsTopic, contractId, payload);
            logger.info("Published ContractRestored event for contract: {}", contractId);
        } catch (Exception e) {
            logger.error("Failed to publish ContractRestored event: {}", e.getMessage(), e);
        }
    }

    @Override
    public void sendContractStatusChangedEvent(com.devgo2003.docgo.document_service.dto.AiEventDto eventDto) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "ContractStatusChanged");
            event.put("eventId", UUID.randomUUID().toString());
            event.put("timestamp", ZonedDateTime.now().toString());
            event.put("data", eventDto);
            
            String payload = objectMapper.writeValueAsString(event);
            String fileId = eventDto.getData().getFileInformation().getFileId();
            kafkaTemplate.send(contractEventsTopic, fileId, payload);
            logger.info("Published ContractStatusChanged event for file: {}", fileId);
        } catch (Exception e) {
            logger.error("Failed to publish ContractStatusChanged event: {}", e.getMessage(), e);
        }
    }

    @Override
    public void sendAiProcessingCompletedEvent(String contractId, String processingStatus) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "AiProcessingCompleted");
            event.put("eventId", UUID.randomUUID().toString());
            event.put("timestamp", ZonedDateTime.now().toString());
            event.put("data", Map.of("contractId", contractId, "processingStatus", processingStatus));
            
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(contractEventsTopic, contractId, payload);
            logger.info("Published AiProcessingCompleted event for contract: {} with status: {}", contractId, processingStatus);
        } catch (Exception e) {
            logger.error("Failed to publish AiProcessingCompleted event: {}", e.getMessage(), e);
        }
    }
}
