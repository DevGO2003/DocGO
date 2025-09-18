package com.devgo2003.docgo.contract_service.listener;

import com.devgo2003.docgo.contract_service.service.IContractService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

// @Component
public class ContractEventsKafkaListener {
    private static final Logger logger = LoggerFactory.getLogger(ContractEventsKafkaListener.class);

    private final IContractService contractService;
    private final ObjectMapper objectMapper;

    public ContractEventsKafkaListener(IContractService contractService, ObjectMapper objectMapper) {
        this.contractService = contractService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(
        topics = "${app.kafka.topic.contract-summary-updated}",
        groupId = "${spring.kafka.consumer.group-id}",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleContractSummaryUpdated(String eventJson) {
        try {
            logger.info("📨 [CONTRACT_SUMMARY_RECEIVED] Received contract.summary.updated event: {}", eventJson);

            Map<String, Object> event = objectMapper.readValue(eventJson, new TypeReference<>() {});

            if (!"contract.summary.updated".equals(event.get("eventType"))) {
                logger.warn("⏭️ [CONTRACT_SUMMARY_SKIP] Ignoring event with unexpected type: {}", event.get("eventType"));
                return;
            }

            // Kiểm tra nguồn gốc event - chỉ xử lý từ AI service
            String source = (String) event.get("source");
            if (!"ai-processing-service".equals(source)) {
                logger.warn("⚠️ [CONTRACT_SUMMARY_SOURCE_CHECK] Ignoring event from unexpected source: {} - chỉ xử lý từ ai-processing-service", source);
                return;
            }

            // Kiểm tra timestamp để đảm bảo event mới
            String timestamp = (String) event.get("timestamp");
            if (timestamp == null) {
                logger.warn("⚠️ [CONTRACT_SUMMARY_TIMESTAMP_CHECK] Event missing timestamp - bỏ qua để tránh xử lý event cũ");
                return;
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> summaryData = (Map<String, Object>) event.get("data");

            if (summaryData == null) {
                logger.error("❌ [CONTRACT_SUMMARY_DATA_NULL] Event data is null. Cannot process summary.");
                return;
            }

            // Kiểm tra xem có đủ dữ liệu AI summary không
            if (!isValidAISummary(summaryData)) {
                logger.warn("⚠️ [CONTRACT_SUMMARY_INVALID_AI] Event không chứa dữ liệu AI summary hợp lệ - bỏ qua");
                return;
            }

            logger.info("✅ [CONTRACT_SUMMARY_VALID] Event hợp lệ từ AI service - bắt đầu tạo contract");
            contractService.createOrUpdateContractFromSummary(summaryData);

            logger.info("✅ [CONTRACT_SUMMARY_SUCCESS] Successfully processed contract.summary.updated event for contract number: {}", summaryData.get("contractNumber"));

        } catch (Exception e) {
            logger.error("❌ [CONTRACT_SUMMARY_ERROR] Error processing contract.summary.updated event: {}", e.getMessage(), e);
        }
    }

    /**
     * Kiểm tra xem summary data có chứa dữ liệu AI hợp lệ không
     * Đơn giản hóa: chỉ cần có data từ AI service là đủ
     */
    private boolean isValidAISummary(Map<String, Object> summaryData) {
        // Chỉ cần kiểm tra data không null và không rỗng
        if (summaryData == null || summaryData.isEmpty()) {
            logger.warn("⚠️ [AI_SUMMARY_CHECK] Summary data is null or empty");
            return false;
        }
        
        logger.info("✅ [AI_SUMMARY_CHECK] AI summary data is valid - accepting all data from AI service");
        return true;
    }
}



