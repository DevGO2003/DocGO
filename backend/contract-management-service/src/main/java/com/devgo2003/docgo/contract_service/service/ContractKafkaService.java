package com.devgo2003.docgo.contract_service.service;

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

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "spring.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class ContractKafkaService {

    private static final Logger logger = LoggerFactory.getLogger(ContractKafkaService.class);

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.contract-events-topic:contract.events}")
    private String contractEventsTopic;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Consume SummaryCreated events từ AI Processing Service
     */
    @KafkaListener(topics = "${kafka.ai-events-topic:ai.events}", groupId = "contract-management-service-group")
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
     * Xử lý SummaryCreated event và tạo/cập nhật hợp đồng
     */
    private void processSummaryCreated(Map<String, Object> event) {
        try {
            Map<String, Object> data = (Map<String, Object>) event.get("data");
            Map<String, Object> actor = (Map<String, Object>) event.get("actor");
            
            String fileId = (String) data.get("fileId");
            String filename = (String) data.get("filename");
            String summary = (String) data.get("summary");
            
            // TODO: Tạo hoặc cập nhật hợp đồng trong database
            // Hiện tại chỉ log và publish event
            
            logger.info("Processing contract for file: {} with summary: {}", filename, summary);
            
            // Publish contract-updated event
            publishContractUpdated(event, data, actor, fileId);
            
        } catch (Exception e) {
            logger.error("Error processing contract from summary: {}", e.getMessage(), e);
        }
    }

    /**
     * Publish contract-updated event
     */
    private void publishContractUpdated(Map<String, Object> originalEvent, Map<String, Object> data, Map<String, Object> actor, String fileId) {
        try {
            Map<String, Object> contractUpdatedEvent = new HashMap<>();
            contractUpdatedEvent.put("eventVersion", "v1");
            contractUpdatedEvent.put("eventType", "ContractUpdated");
            contractUpdatedEvent.put("eventId", UUID.randomUUID().toString());
            contractUpdatedEvent.put("timestamp", ZonedDateTime.now().toString());
            contractUpdatedEvent.put("source", "contract-management-service");
            contractUpdatedEvent.put("correlationId", originalEvent.get("correlationId"));
            contractUpdatedEvent.put("actor", actor);
            
            Map<String, Object> eventData = new HashMap<>();
            eventData.put("fileId", data.get("fileId"));
            eventData.put("filename", data.get("filename"));
            eventData.put("contractId", UUID.randomUUID().toString()); // TODO: Use actual contract ID
            eventData.put("status", "PROCESSED");
            eventData.put("summary", data.get("summary"));
            eventData.put("processedAt", ZonedDateTime.now().toString());
            eventData.put("processedBy", actor.get("userId"));
            
            contractUpdatedEvent.put("data", eventData);
            
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("serviceVersion", "1.0.0");
            metadata.put("processingTime", ZonedDateTime.now().toString());
            contractUpdatedEvent.put("metadata", metadata);

            // Publish to contract events topic
            kafkaTemplate.send(contractEventsTopic, fileId, contractUpdatedEvent);
            
            logger.info("✅ Published ContractUpdated event for file: {}", data.get("filename"));
            
        } catch (Exception e) {
            logger.error("❌ Failed to publish ContractUpdated event: {}", e.getMessage(), e);
        }
    }
}
